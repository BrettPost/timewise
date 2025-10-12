"use client";

import { useUser } from "@stackframe/stack";
import { useState } from "react";
import CalendarView from "@/components/CalendarView";
import SummaryView from "@/components/SummaryView";
import CategoryManager from "@/components/CategoryManager";
import AiPlanner from "@/components/AiPlanner";

export default function Home() {
  const user = useUser({ or: "redirect" });
  const [activeView, setActiveView] = useState<"calendar" | "summary">("calendar");
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showAiPlanner, setShowAiPlanner] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TimeWise
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Budget your time, not just your money
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.displayName || user.primaryEmail}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.primaryEmail}
                </p>
              </div>
              <button
                onClick={() => user.signOut()}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2 mt-6">
            <button
              onClick={() => setActiveView("calendar")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeView === "calendar"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              📅 Calendar
            </button>
            <button
              onClick={() => setActiveView("summary")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeView === "summary"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              📊 Summary
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setShowAiPlanner(true)}
              className="px-6 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              AI Planner
            </button>
            <button
              onClick={() => setShowCategoryManager(true)}
              className="px-6 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              🏷️ Manage Categories
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "calendar" ? (
          <CalendarView userId={user.id} />
        ) : (
          <SummaryView userId={user.id} />
        )}
      </main>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager
          userId={user.id}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      {/* AI Planner Modal */}
      {showAiPlanner && (
        <AiPlanner
          userId={user.id}
          onClose={() => setShowAiPlanner(false)}
        />
      )}
    </div>
  );
}
