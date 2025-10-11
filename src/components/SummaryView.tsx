"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface SummaryViewProps {
  userId: string;
}

export default function SummaryView({ userId }: SummaryViewProps) {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    Id<"categories"> | ""
  >("");

  const categories = useQuery(api.categories.list, { userId });

  const stats = useQuery(
    api.timeSections.getStats,
    {
      userId,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate + "T23:59:59").getTime(),
      categoryId: selectedCategoryId || undefined,
    }
  );

  const timeSections = useQuery(
    api.timeSections.listByDateRange,
    {
      userId,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate + "T23:59:59").getTime(),
      categoryId: selectedCategoryId || undefined,
    }
  );

  const formatHours = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!categories || !stats || !timeSections) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Data Available
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create categories and time sections to see your statistics!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Filter Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) =>
                setSelectedCategoryId(e.target.value as Id<"categories"> | "")
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => {
              const today = new Date();
              setStartDate(today.toISOString().split("T")[0]);
              setEndDate(today.toISOString().split("T")[0]);
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const weekAgo = new Date(today);
              weekAgo.setDate(weekAgo.getDate() - 7);
              setStartDate(weekAgo.toISOString().split("T")[0]);
              setEndDate(today.toISOString().split("T")[0]);
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const monthAgo = new Date(today);
              monthAgo.setDate(monthAgo.getDate() - 30);
              setStartDate(monthAgo.toISOString().split("T")[0]);
              setEndDate(today.toISOString().split("T")[0]);
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            Last 30 Days
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const firstDayOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
              );
              setStartDate(firstDayOfMonth.toISOString().split("T")[0]);
              setEndDate(today.toISOString().split("T")[0]);
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            This Month
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl mb-2">⏱️</div>
          <div className="text-2xl font-bold mb-1">
            {formatHours(stats.totalHours)}
          </div>
          <div className="text-blue-100 text-sm">Total Time</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold mb-1">{stats.sectionCount}</div>
          <div className="text-purple-100 text-sm">Time Sections</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-2xl font-bold mb-1">
            {stats.totalDays.toFixed(1)}
          </div>
          <div className="text-pink-100 text-sm">Days of Time</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl mb-2">🏷️</div>
          <div className="text-2xl font-bold mb-1">
            {selectedCategoryId ? 1 : stats.byCategory.length}
          </div>
          <div className="text-indigo-100 text-sm">
            Active {selectedCategoryId ? "Category" : "Categories"}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {stats.byCategory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Time by Category
          </h2>
          <div className="space-y-4">
            {stats.byCategory
              .sort((a, b) => b.hours - a.hours)
              .map((categoryData) => (
                <div key={categoryData.categoryId}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: categoryData.color }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {categoryData.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {categoryData.count} sections
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatHours(categoryData.hours)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({categoryData.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${categoryData.percentage}%`,
                        backgroundColor: categoryData.color,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Time Sections */}
      {timeSections.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Time Sections
          </h2>
          <div className="space-y-3">
            {timeSections
              .sort((a, b) => b.startTime - a.startTime)
              .slice(0, 20)
              .map((section) => (
                <div
                  key={section._id}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div
                    className="w-1 h-16 rounded-full"
                    style={{ backgroundColor: section.category?.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {section.category?.name}
                      </span>
                      {section.title && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {section.title}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(section.startTime)} •{" "}
                      {formatTime(section.startTime)} -{" "}
                      {formatTime(section.endTime)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatHours(
                        (section.endTime - section.startTime) / (1000 * 60 * 60)
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {timeSections.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Time Sections Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or create some time sections!
          </p>
        </div>
      )}
    </div>
  );
}

