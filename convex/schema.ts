import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    userId: v.string(),
    name: v.string(),
    color: v.string(), // Hex color for visual distinction
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_name", ["userId", "name"]),

  timeSections: defineTable({
    userId: v.string(),
    categoryId: v.id("categories"),
    title: v.optional(v.string()), // Optional title/description for the time section
    startTime: v.number(), // Unix timestamp in milliseconds
    endTime: v.number(), // Unix timestamp in milliseconds
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_category", ["categoryId"])
    .index("by_user_and_time", ["userId", "startTime"])
    .index("by_user_category_time", ["userId", "categoryId", "startTime"]),

  // Future feature: budgets/goals
  // budgets: defineTable({
  //   userId: v.string(),
  //   categoryId: v.id("categories"),
  //   targetHours: v.number(),
  //   period: v.string(), // "daily", "weekly", "monthly"
  // }),
});

