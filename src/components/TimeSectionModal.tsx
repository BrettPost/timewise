"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface TimeSectionModalProps {
  userId: string;
  categories: Array<{
    _id: Id<"categories">;
    name: string;
    color: string;
  }>;
  initialDate: Date;
  editingSection?: any;
  onClose: () => void;
  onDelete?: () => void;
}

export default function TimeSectionModal({
  userId,
  categories,
  initialDate,
  editingSection,
  onClose,
  onDelete,
}: TimeSectionModalProps) {
  const [categoryId, setCategoryId] = useState<Id<"categories"> | "">(
    editingSection?.categoryId || ""
  );
  const [title, setTitle] = useState(editingSection?.title || "");
  const [date, setDate] = useState(
    editingSection
      ? new Date(editingSection.startTime).toISOString().split("T")[0]
      : initialDate.toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState(
    editingSection
      ? new Date(editingSection.startTime).toTimeString().slice(0, 5)
      : "09:00"
  );
  const [endTime, setEndTime] = useState(
    editingSection
      ? new Date(editingSection.endTime).toTimeString().slice(0, 5)
      : "10:00"
  );
  const [error, setError] = useState("");

  const createSection = useMutation(api.timeSections.create);
  const updateSection = useMutation(api.timeSections.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    // Combine date and time
    const startDateTime = new Date(`${date}T${startTime}`).getTime();
    const endDateTime = new Date(`${date}T${endTime}`).getTime();

    if (endDateTime <= startDateTime) {
      setError("End time must be after start time");
      return;
    }

    try {
      if (editingSection) {
        await updateSection({
          id: editingSection._id,
          categoryId: categoryId as Id<"categories">,
          title: title || undefined,
          startTime: startDateTime,
          endTime: endDateTime,
        });
      } else {
        await createSection({
          userId,
          categoryId: categoryId as Id<"categories">,
          title: title || undefined,
          startTime: startDateTime,
          endTime: endDateTime,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  const calculateDuration = () => {
    const start = new Date(`${date}T${startTime}`).getTime();
    const end = new Date(`${date}T${endTime}`).getTime();
    if (end <= start) return "";

    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editingSection ? "Edit Time Section" : "New Time Section"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as Id<"categories">)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoryId && (
              <div
                className="mt-2 p-2 rounded-lg"
                style={{
                  backgroundColor:
                    categories.find((c) => c._id === categoryId)?.color + "33",
                  borderLeft: `4px solid ${
                    categories.find((c) => c._id === categoryId)?.color
                  }`,
                }}
              >
                <span className="text-sm font-medium">
                  {categories.find((c) => c._id === categoryId)?.name}
                </span>
              </div>
            )}
          </div>

          {/* Title (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Client meeting, Morning workout"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Duration Display */}
          {calculateDuration() && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Duration: {calculateDuration()}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4">
            {editingSection && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-3 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
              >
                Delete
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              {editingSection ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

