import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get time sections for a user within a date range
export const listByDateRange = query({
  args: {
    userId: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    let timeSections;

    if (args.categoryId) {
      // Filter by category
      timeSections = await ctx.db
        .query("timeSections")
        .withIndex("by_user_category_time", (q) =>
          q.eq("userId", args.userId).eq("categoryId", args.categoryId!)
        )
        .filter((q) =>
          q.and(
            q.gte(q.field("startTime"), args.startDate),
            q.lte(q.field("startTime"), args.endDate)
          )
        )
        .collect();
    } else {
      // All categories
      timeSections = await ctx.db
        .query("timeSections")
        .withIndex("by_user_and_time", (q) => q.eq("userId", args.userId))
        .filter((q) =>
          q.and(
            q.gte(q.field("startTime"), args.startDate),
            q.lte(q.field("startTime"), args.endDate)
          )
        )
        .collect();
    }

    // Enrich with category information
    const enrichedSections = await Promise.all(
      timeSections.map(async (section) => {
        const category = await ctx.db.get(section.categoryId);
        return {
          ...section,
          category,
        };
      })
    );

    return enrichedSections;
  },
});

// Get time sections for a specific month (optimized for calendar view)
export const listByMonth = query({
  args: {
    userId: v.string(),
    year: v.number(),
    month: v.number(), // 0-11
  },
  handler: async (ctx, args) => {
    const startDate = new Date(args.year, args.month, 1).getTime();
    const endDate = new Date(args.year, args.month + 1, 0, 23, 59, 59).getTime();

    const timeSections = await ctx.db
      .query("timeSections")
      .withIndex("by_user_and_time", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.gte(q.field("startTime"), startDate),
          q.lte(q.field("startTime"), endDate)
        )
      )
      .collect();

    // Enrich with category information
    const enrichedSections = await Promise.all(
      timeSections.map(async (section) => {
        const category = await ctx.db.get(section.categoryId);
        return {
          ...section,
          category,
        };
      })
    );

    return enrichedSections;
  },
});

// Create a new time section
export const create = mutation({
  args: {
    userId: v.string(),
    categoryId: v.id("categories"),
    title: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate that end time is after start time
    if (args.endTime <= args.startTime) {
      throw new Error("End time must be after start time");
    }

    // Verify category belongs to user
    const category = await ctx.db.get(args.categoryId);
    if (!category || category.userId !== args.userId) {
      throw new Error("Invalid category");
    }

    const sectionId = await ctx.db.insert("timeSections", {
      userId: args.userId,
      categoryId: args.categoryId,
      title: args.title,
      startTime: args.startTime,
      endTime: args.endTime,
      createdAt: Date.now(),
    });

    return sectionId;
  },
});

// Update a time section
export const update = mutation({
  args: {
    id: v.id("timeSections"),
    categoryId: v.optional(v.id("categories")),
    title: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Get existing section to validate
    const section = await ctx.db.get(id);
    if (!section) {
      throw new Error("Time section not found");
    }

    // Validate times if being updated
    const newStartTime = updates.startTime ?? section.startTime;
    const newEndTime = updates.endTime ?? section.endTime;
    if (newEndTime <= newStartTime) {
      throw new Error("End time must be after start time");
    }

    await ctx.db.patch(id, updates);
  },
});

// Delete a time section
export const remove = mutation({
  args: {
    id: v.id("timeSections"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get statistics for a user's time sections
export const getStats = query({
  args: {
    userId: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    let timeSections;

    if (args.categoryId) {
      timeSections = await ctx.db
        .query("timeSections")
        .withIndex("by_user_category_time", (q) =>
          q.eq("userId", args.userId).eq("categoryId", args.categoryId!)
        )
        .filter((q) =>
          q.and(
            q.gte(q.field("startTime"), args.startDate),
            q.lte(q.field("startTime"), args.endDate)
          )
        )
        .collect();
    } else {
      timeSections = await ctx.db
        .query("timeSections")
        .withIndex("by_user_and_time", (q) => q.eq("userId", args.userId))
        .filter((q) =>
          q.and(
            q.gte(q.field("startTime"), args.startDate),
            q.lte(q.field("startTime"), args.endDate)
          )
        )
        .collect();
    }

    // Calculate total time spent
    const totalMilliseconds = timeSections.reduce(
      (sum, section) => sum + (section.endTime - section.startTime),
      0
    );

    // Group by category
    const byCategory: Record<string, { name: string; color: string; milliseconds: number; count: number }> = {};
    
    for (const section of timeSections) {
      const category = await ctx.db.get(section.categoryId);
      if (category) {
        if (!byCategory[category._id]) {
          byCategory[category._id] = {
            name: category.name,
            color: category.color,
            milliseconds: 0,
            count: 0,
          };
        }
        byCategory[category._id].milliseconds += section.endTime - section.startTime;
        byCategory[category._id].count += 1;
      }
    }

    return {
      totalMilliseconds,
      totalHours: totalMilliseconds / (1000 * 60 * 60),
      totalDays: totalMilliseconds / (1000 * 60 * 60 * 24),
      sectionCount: timeSections.length,
      byCategory: Object.entries(byCategory).map(([id, data]) => ({
        categoryId: id,
        ...data,
        hours: data.milliseconds / (1000 * 60 * 60),
        percentage: totalMilliseconds > 0 ? (data.milliseconds / totalMilliseconds) * 100 : 0,
      })),
    };
  },
});

