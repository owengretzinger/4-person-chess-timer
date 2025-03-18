"use client";

import React, { useState } from "react";
import { TimerState, TimerActions } from "../hooks/useTimer";

interface SettingsPanelProps {
  timerState: TimerState;
  timerActions: TimerActions;
  isSettingsOpen: boolean;
  toggleSettings: (e: React.MouseEvent) => void;
}

export default function SettingsPanel({
  timerState,
  timerActions,
  isSettingsOpen,
  toggleSettings,
}: SettingsPanelProps) {
  const [customMinutes, setCustomMinutes] = useState("");
  const [customIncrement, setCustomIncrement] = useState("");

  const {
    initialTime,
    isRunning,
    wasRunningBeforeSettings,
    timeIncrement,
    numPlayers,
  } = timerState;

  const {
    resetTimers,
    setInitialTime,
    setIsRunning,
    setTimeIncrement,
    setNumPlayers,
  } = timerActions;

  // Function to adjust player count
  const adjustPlayerCount = (increment: boolean) => {
    setNumPlayers(
      increment ? Math.min(numPlayers + 1, 12) : Math.max(numPlayers - 1, 2)
    );
  };

  // Function to adjust time settings
  const handleTimeChange = (minutes: number) => {
    const newTimeInSeconds = minutes * 60;
    setInitialTime(newTimeInSeconds);
    setCustomMinutes("");
  };

  // Function to handle custom time input
  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomMinutes(value);
  };

  // Function to apply custom time
  const applyCustomTime = () => {
    const minutes = parseInt(customMinutes);
    if (!isNaN(minutes) && minutes > 0) {
      handleTimeChange(minutes);
    }
  };

  // Function to adjust time increment
  const handleIncrementChange = (seconds: number) => {
    setTimeIncrement(seconds);
    setCustomIncrement("");
  };

  // Function to handle custom increment input
  const handleCustomIncrementChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCustomIncrement(value);
  };

  // Function to apply custom increment
  const applyCustomIncrement = () => {
    const seconds = parseInt(customIncrement);
    if (!isNaN(seconds) && seconds >= 0) {
      setTimeIncrement(seconds);
    }
  };

  // Resume game after closing settings
  const resumeGame = () => {
    setIsRunning(true);
    toggleSettings({ stopPropagation: () => {} } as React.MouseEvent);
  };

  if (!isSettingsOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-10 transition-opacity duration-300"
        onClick={(e) => toggleSettings(e)}
      />
      <div
        className="settings-panel absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-[90%] max-w-md max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            onClick={toggleSettings}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {wasRunningBeforeSettings && (
          <div className="mb-4 bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">Game paused</p>
          </div>
        )}

        <div className="space-y-5">
          {/* Game Controls Section */}
          <div className="flex justify-between gap-3 mb-1">
            <button
              onClick={resetTimers}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors shadow flex items-center justify-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>

            {wasRunningBeforeSettings ? (
              <button
                onClick={resumeGame}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg transition-colors shadow flex items-center justify-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Resume
              </button>
            ) : !isRunning ? (
              <button
                onClick={() => {
                  setIsRunning(true);
                  toggleSettings({
                    stopPropagation: () => {},
                  } as React.MouseEvent);
                }}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg transition-colors shadow flex items-center justify-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Start
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg transition-colors shadow flex items-center justify-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pause
              </button>
            )}
          </div>

          {/* Horizontal divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

          {/* Player Count Setting - more compact */}
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <label className="text-md font-medium mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Number of Players
              </div>
            </label>
            <div className="flex items-center justify-center">
              <button
                onClick={() => adjustPlayerCount(false)}
                disabled={numPlayers <= 2}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-l hover:bg-gray-300 hover:dark:bg-gray-600 disabled:opacity-50 text-lg font-bold flex-0"
              >
                -
              </button>
              <div className="px-6 py-1 w-10 bg-white dark:bg-gray-800 text-center font-medium border-t border-b border-gray-300 dark:border-gray-600 min-w-[60px]">
                {numPlayers}
              </div>
              <button
                onClick={() => adjustPlayerCount(true)}
                disabled={numPlayers >= 12}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-r hover:bg-gray-300 hover:dark:bg-gray-600 disabled:opacity-50 text-lg font-bold flex-0"
              >
                +
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Supported range: 2-12 players
            </div>
          </div>

          {/* Time Setting - with improved layout */}
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <label className="text-md font-medium mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Time Per Player
              </div>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Current: {Math.floor(initialTime / 60)} min
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[1, 3, 5, 10, 15, 30].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => handleTimeChange(minutes)}
                  className={`px-2 py-1.5 rounded text-sm font-medium ${
                    initialTime === minutes * 60
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 hover:dark:bg-gray-600"
                  }`}
                >
                  {minutes}
                </button>
              ))}
            </div>
            <div className="flex gap-1 mt-2">
              <div className="relative flex-grow">
                <input
                  type="number"
                  value={customMinutes}
                  onChange={handleCustomTimeChange}
                  placeholder="Custom"
                  min="1"
                  className="w-full px-3 py-1.5 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <button
                onClick={applyCustomTime}
                disabled={!customMinutes || parseInt(customMinutes) <= 0}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Time Increment Setting - with better layout */}
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <label className="text-md font-medium mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Time Increment
              </div>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Current: {timeIncrement} sec
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[0, 5, 10, 15, 30, 60].map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => handleIncrementChange(seconds)}
                  className={`px-2 py-1.5 rounded text-sm font-medium ${
                    timeIncrement === seconds
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 hover:dark:bg-gray-600"
                  }`}
                >
                  {seconds}
                </button>
              ))}
            </div>
            <div className="flex gap-1 mt-2">
              <div className="relative flex-grow">
                <input
                  type="number"
                  value={customIncrement}
                  onChange={handleCustomIncrementChange}
                  placeholder="Custom"
                  min="0"
                  className="w-full px-3 py-1.5 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <button
                onClick={applyCustomIncrement}
                disabled={!customIncrement || parseInt(customIncrement) < 0}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
