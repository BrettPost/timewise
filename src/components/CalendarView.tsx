"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import TimeSectionModal from "./TimeSectionModal";

interface CalendarViewProps {
  userId: string;
}

export default function CalendarView({ userId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);

  const categories = useQuery(api.categories.list, { userId });
  const timeSections = useQuery(api.timeSections.listByMonth, {
    userId,
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  });

  const deleteSection = useMutation(api.timeSections.remove);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    setEditingSection(null);
    setShowModal(true);
  };

  const handleEditSection = (section: any) => {
    setEditingSection(section);
    setShowModal(true);
  };

  const handleDeleteSection = async (sectionId: Id<"timeSections">) => {
    if (confirm("Are you sure you want to delete this time section?")) {
      await deleteSection({ id: sectionId });
    }
  };

  const getSectionsForDay = (day: number) => {
    if (!timeSections) return [];
    const dayStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;

    return timeSections.filter(
      (section) => section.startTime >= dayStart && section.startTime < dayEnd
    );
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (startTime: number, endTime: number) => {
    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const sections = getSectionsForDay(day);
    const isToday =
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear();

    days.push(
      <div
        key={day}
        className={`aspect-square border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
          isToday ? "ring-2 ring-blue-500" : ""
        }`}
        onClick={() => handleDateClick(day)}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-sm font-semibold ${
                isToday
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {day}
            </span>
            {sections.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {sections.length}
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 text-[10px]">
            {sections.slice(0, 3).map((section) => (
              <div
                key={section._id}
                className="px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: section.category?.color + "33",
                  borderLeft: `3px solid ${section.category?.color}`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditSection(section);
                }}
                title={`${section.category?.name} - ${formatTime(section.startTime)}`}
              >
                <div className="font-medium truncate">
                  {section.category?.name}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {formatTime(section.startTime)}
                </div>
              </div>
            ))}
            {sections.length > 3 && (
              <div className="text-gray-500 dark:text-gray-400 text-center">
                +{sections.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!categories) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🏷️</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Categories Yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create your first category to start tracking your time!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Click "Manage Categories" in the header to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-medium"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">{days}</div>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => {
          setSelectedDate(new Date());
          setEditingSection(null);
          setShowModal(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl hover:scale-110 transition-transform"
      >
        +
      </button>

      {/* Time Section Modal */}
      {showModal && (
        <TimeSectionModal
          userId={userId}
          categories={categories}
          initialDate={selectedDate || new Date()}
          editingSection={editingSection}
          onClose={() => {
            setShowModal(false);
            setEditingSection(null);
          }}
          onDelete={editingSection ? () => handleDeleteSection(editingSection._id) : undefined}
        />
      )}
    </div>
  );
}

