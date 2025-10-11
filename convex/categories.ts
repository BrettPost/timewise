import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all categories for a user
export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return categories;
  },
});

// Create a new category
export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if category with same name already exists for this user
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_user_and_name", (q) =>
        q.eq("userId", args.userId).eq("name", args.name)
      )
      .first();

    if (existing) {
      throw new Error("A category with this name already exists");
    }

    const categoryId = await ctx.db.insert("categories", {
      userId: args.userId,
      name: args.name,
      color: args.color,
      createdAt: Date.now(),
    });

    return categoryId;
  },
});

// Update a category
export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete a category (and optionally all associated time sections)
export const remove = mutation({
  args: {
    id: v.id("categories"),
    deleteTimeSections: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.deleteTimeSections) {
      // Delete all time sections associated with this category
      const timeSections = await ctx.db
        .query("timeSections")
        .withIndex("by_category", (q) => q.eq("categoryId", args.id))
        .collect();

      for (const section of timeSections) {
        await ctx.db.delete(section._id);
      }
    }

    await ctx.db.delete(args.id);
  },
});

