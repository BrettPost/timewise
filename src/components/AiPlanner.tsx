"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AiPlannerProps {
  userId: string;
  onClose: () => void;
}

type TabType = "voice" | "text";

export default function AiPlanner({ userId, onClose }: AiPlannerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [textPrompt, setTextPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = useQuery(api.categories.list, { userId });

  // TODO: Implement voice recording functionality
  // - Use Web Speech API or MediaRecorder API
  // - Convert speech to text
  // - Send to AI endpoint for schedule generation

  const handleStartRecording = () => {
    setIsRecording(true);
    // TODO: Start recording audio
    // TODO: Use speech recognition API (Web Speech API)
    // TODO: Display real-time transcription
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // TODO: Stop recording
    // TODO: Process the recorded audio
    // TODO: Send to AI for schedule generation
  };

  // TODO: Implement AI schedule generation
  // - Send prompt to AI endpoint (OpenAI, Anthropic, etc.)
  // - Parse AI response for schedule suggestions
  // - Create time sections based on AI recommendations
  // - Consider user's existing schedule to avoid conflicts
  // - Use categories for intelligent categorization

  const handleTextSchedule = async () => {
    if (!textPrompt.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Call AI endpoint with textPrompt
      // Example prompt: "Schedule 2 hours of work, 1 hour lunch, 30 min exercise today"
      // TODO: Parse response and create time sections
      // TODO: Show confirmation dialog with suggested schedule
      // TODO: Allow user to approve/modify before creating
      
      console.log("Processing prompt:", textPrompt);
      console.log("Available categories:", categories);
      
      // Placeholder for AI integration
      alert("AI Planner feature coming soon! This will analyze your prompt and create a smart schedule.");
      
      setTextPrompt("");
    } catch (error) {
      console.error("Error processing schedule:", error);
      alert("Failed to process schedule. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      handleTextSchedule();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🤖 AI Planner
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Let AI help you schedule your time
            </p>
          </div>
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 px-6 py-4 font-medium transition-all ${
              activeTab === "text"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            💬 Text
          </button>
          <button
            onClick={() => setActiveTab("voice")}
            className={`flex-1 px-6 py-4 font-medium transition-all ${
              activeTab === "voice"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            🎤 Voice
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "text" ? (
            /* Text Tab */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe your schedule
                </label>
                <textarea
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="E.g., 'Schedule 2 hours of focused work from 9am, 1 hour lunch break at noon, 30 minutes of exercise at 5pm, and 1 hour of reading before bed'"
                  className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Tip: Press ⌘ + Enter to schedule
                </p>
              </div>

              {/* Examples */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  💡 Example prompts:
                </h3>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <li>• "Schedule my typical workday with meetings at 10am and 2pm"</li>
                  <li>• "Plan a balanced day with 4 hours work, 1 hour exercise, and relaxation time"</li>
                  <li>• "Create a morning routine starting at 6am with meditation and breakfast"</li>
                  <li>• "Block out time for a project: 3 hours of coding today"</li>
                </ul>
              </div>

              {/* Category Info */}
              {categories && categories.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Available Categories:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className="inline-flex items-center space-x-1 px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: category.color + "33",
                          borderLeft: `3px solid ${category.color}`,
                        }}
                      >
                        <span className="font-medium">{category.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    AI will automatically categorize your schedule items
                  </p>
                </div>
              )}

              {/* Schedule Button */}
              <button
                onClick={handleTextSchedule}
                disabled={isProcessing || !textPrompt.trim()}
                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-purple-600"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "🗓️ Schedule with AI"
                )}
              </button>
            </div>
          ) : (
            /* Voice Tab */
            <div className="flex flex-col items-center justify-center space-y-8 py-12">
              {/* Microphone Icon */}
              <div
                className={`relative transition-all duration-300 ${
                  isRecording ? "scale-110" : "scale-100"
                }`}
              >
                <div
                  className={`w-40 h-40 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-gradient-to-br from-red-500 to-pink-600 shadow-2xl shadow-red-500/50 animate-pulse"
                      : "bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/30"
                  }`}
                >
                  <svg
                    className="w-20 h-20 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                {isRecording && (
                  <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping" />
                )}
              </div>

              {/* Status Text */}
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isRecording ? "Listening..." : "Ready to listen"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isRecording
                    ? "Speak naturally about your schedule"
                    : "Click the button below to start"}
                </p>
              </div>

              {/* Record Button */}
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`px-8 py-4 rounded-lg font-medium transition-all shadow-lg ${
                  isRecording
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-red-500/30"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-blue-500/30"
                }`}
              >
                {isRecording ? "⏹️ Stop Recording" : "🎙️ Start Speaking"}
              </button>

              {/* Voice Instructions */}
              <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  💡 How to use voice planning:
                </h3>
                <ol className="space-y-1 text-xs text-gray-600 dark:text-gray-400 list-decimal list-inside">
                  <li>Click "Start Speaking" to begin</li>
                  <li>Describe your schedule naturally (e.g., "I need to work for 3 hours starting at 9am")</li>
                  <li>Click "Stop Recording" when done</li>
                  <li>AI will process and create your schedule</li>
                </ol>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 font-medium">
                  🚧 Voice feature coming soon! Currently in development.
                </p>
              </div>

              {/* TODO List for Voice Feature */}
              <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-xs">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Developer TODOs for Voice Feature:
                </p>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400 font-mono">
                  <li>• Implement Web Speech API / MediaRecorder</li>
                  <li>• Add real-time speech-to-text transcription</li>
                  <li>• Integrate with AI endpoint for processing</li>
                  <li>• Add audio visualization during recording</li>
                  <li>• Handle browser permissions gracefully</li>
                  <li>• Add error handling for unsupported browsers</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

