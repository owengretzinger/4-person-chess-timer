"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [initialTime, setInitialTime] = useState(300); // 5 minutes in seconds
  const [numPlayers, setNumPlayers] = useState(4); // Configurable number of players
  const [times, setTimes] = useState(Array(numPlayers).fill(initialTime));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timeIncrement, setTimeIncrement] = useState(0); // Time added when player finishes turn (in seconds)
  const [customMinutes, setCustomMinutes] = useState("");
  const [customIncrement, setCustomIncrement] = useState("");
  const [wasRunningBeforeSettings, setWasRunningBeforeSettings] =
    useState(false);

  // Effect to handle responsive design
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Check on initial load
    checkIsMobile();

    // Add listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Base colors - expanded to ensure uniqueness for up to 12 players
  const colorSets = [
    // Primary set uses 500 shade
    [
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-amber-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
      "bg-orange-500",
      "bg-lime-500",
      "bg-emerald-500",
      "bg-violet-500",
    ],

    // Text colors (600 shade for better contrast on white)
    [
      "text-blue-600",
      "text-green-600",
      "text-red-600",
      "text-amber-600",
      "text-purple-600",
      "text-pink-600",
      "text-indigo-600",
      "text-cyan-600",
      "text-orange-600",
      "text-lime-600",
      "text-emerald-600",
      "text-violet-600",
    ],
  ];

  // Use colors directly from our expanded sets
  const playerColors = Array(numPlayers)
    .fill(0)
    .map((_, i) => colorSets[0][i]);

  // Text colors corresponding to background colors
  const textColors = Array(numPlayers)
    .fill(0)
    .map((_, i) => colorSets[1][i]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && times[currentPlayer] > 0) {
      interval = setInterval(() => {
        setTimes((prevTimes) => {
          const newTimes = [...prevTimes];
          newTimes[currentPlayer] = Math.max(0, newTimes[currentPlayer] - 1);

          if (newTimes[currentPlayer] === 0) {
            setIsRunning(false);
          }

          return newTimes;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentPlayer, times]);

  // Update times array when number of players or initial time changes
  useEffect(() => {
    setTimes(Array(numPlayers).fill(initialTime));
    setCurrentPlayer(0);
    setIsRunning(false);
  }, [numPlayers, initialTime]);

  const handleTap = (e: React.MouseEvent) => {
    // Prevent tap handling if clicking on the center button or settings panel
    if (e.target instanceof Element) {
      const targetElement = e.target as Element;
      if (
        targetElement.closest(".center-button") ||
        targetElement.closest(".settings-panel")
      ) {
        return;
      }
    }

    // If settings are open, close them and resume if needed
    if (isSettingsOpen) {
      setIsSettingsOpen(false);

      // Resume the game if it was running before opening settings
      if (wasRunningBeforeSettings) {
        setIsRunning(true);
        setWasRunningBeforeSettings(false);
      }
      return;
    }

    if (times[currentPlayer] === 0) return;

    if (!isRunning) {
      setIsRunning(true);
      return;
    }

    // Add increment time to current player if enabled
    if (timeIncrement > 0) {
      setTimes((prevTimes) => {
        const newTimes = [...prevTimes];
        newTimes[currentPlayer] += timeIncrement;
        return newTimes;
      });
    }

    // Move to next player
    setCurrentPlayer((prevPlayer) => (prevPlayer + 1) % numPlayers);
  };

  const resetTimers = () => {
    setTimes(Array(numPlayers).fill(initialTime));
    setCurrentPlayer(0);
    setIsRunning(false);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Function to adjust player count
  const adjustPlayerCount = (increment: boolean) => {
    setNumPlayers((prev) => {
      const newCount = increment
        ? Math.min(prev + 1, 12)
        : Math.max(prev - 1, 2);
      return newCount;
    });
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

  // Toggle settings panel
  const toggleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isSettingsOpen) {
      // Store current running state before opening settings
      setWasRunningBeforeSettings(isRunning);
      // Pause the game when opening settings
      if (isRunning) {
        setIsRunning(false);
      }
      setIsSettingsOpen(true);
    } else {
      setIsSettingsOpen(false);
    }
  };

  // Resume game after closing settings
  const resumeGame = () => {
    setIsRunning(true);
    setIsSettingsOpen(false);
  };

  // Calculate the position and style for each player segment in a wheel layout
  const calculateWheelSegment = (playerIndex: number) => {
    const segmentAngle = 360 / numPlayers;
    const startAngle = segmentAngle * playerIndex;
    const endAngle = startAngle + segmentAngle;
    const midAngle = (startAngle + endAngle) / 2;

    // For SVG path creation - convert to radians
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    // Center point
    const centerX = 50;
    const centerY = 50;

    // Create a different clip path for 2 players to ensure they're visible
    let clipPath;

    if (numPlayers === 2) {
      // For 2 players, use a left/right division
      if (playerIndex === 0) {
        clipPath = `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`; // Right half
      } else {
        clipPath = `polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)`; // Left half
      }
    } else {
      // For 3+ players, use the normal radial segments
      const containerRadius = 1000; // Much larger than needed to ensure it extends beyond the visible area
      const ex1 = centerX + containerRadius * Math.cos(startRad);
      const ey1 = centerY + containerRadius * Math.sin(startRad);
      const ex2 = centerX + containerRadius * Math.cos(endRad);
      const ey2 = centerY + containerRadius * Math.sin(endRad);

      // Combine the points to create the clip path
      clipPath = `polygon(${centerX}% ${centerY}%, ${ex1}% ${ey1}%, ${ex2}% ${ey2}%)`;
    }

    const textDistanceFromCenter = 36; // % from center point

    const textX =
      centerX +
      textDistanceFromCenter * Math.cos((midAngle - 90) * (Math.PI / 180));
    const textY =
      centerY +
      textDistanceFromCenter * Math.sin((midAngle - 90) * (Math.PI / 180));

    // Calculate text rotation so it's readable from outside the wheel
    const textRotation = midAngle;

    return {
      clipPath,
      midAngle,
      textRotation,
      textPosition: { x: textX, y: textY },
    };
  };

  return (
    <div className="w-screen h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col">
      {/* Wheel container */}
      <div
        className="relative flex-grow flex items-center justify-center overflow-hidden"
        onClick={handleTap}
      >
        <div className="absolute w-[150vmax] h-[150vmax] rounded-full overflow-hidden border-4 border-gray-800 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Player segments */}
          {Array.from({ length: numPlayers }).map((_, index) => {
            const segment = calculateWheelSegment(index);

            return (
              <div
                key={index}
                className={`absolute inset-0
                  ${playerColors[index % playerColors.length]} 
                  ${
                    currentPlayer === index ? "bg-opacity-100" : "bg-opacity-70"
                  } 
                  ${currentPlayer === index && isRunning ? "animate-pulse" : ""}
                `}
                style={{
                  clipPath: segment.clipPath,
                }}
              >
                {/* Text container - now positioned radially */}
                <div
                  className="absolute w-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    height: "100%",
                    transformOrigin: "0 0",
                    transform: `rotate(${segment.midAngle + 180}deg)`,
                  }}
                >
                  {/* Content container - aligned to read from outside */}
                  <div
                    className="absolute flex flex-col items-center z-50"
                    style={{
                      top: isMobile ? "8%" : "12%",
                      width: "100%",
                      transform: "translateX(-50%)",
                      padding: "0 10%",
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold mb-1 text-white drop-shadow-md">
                        <span className="hidden sm:inline">Player </span>
                        <span className="sm:hidden">P</span>
                        {index + 1}
                      </div>
                      <div className="text-3xl font-mono text-white font-bold drop-shadow-md">
                        {formatTime(times[index])}
                      </div>
                      {currentPlayer === index && isRunning && (
                        <div className="mt-1 bg-white px-2 py-0.5 rounded-full font-bold text-sm whitespace-nowrap shadow-md">
                          <span
                            className={textColors[index % textColors.length]}
                          >
                            YOUR TURN
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Center piece with settings icon */}
          <div
            className="center-button absolute left-1/2 top-1/2 w-[60px] h-[60px] bg-white dark:bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center border-4 border-gray-800 dark:border-gray-700 shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={toggleSettings}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Background overlay when settings are open */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 transition-opacity duration-300"
          onClick={handleTap}
        />
      )}

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div
          className="settings-panel absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-[90%] max-w-md"
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
            <div className="mb-4 bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg text-yellow-800 dark:text-yellow-200">
              <p className="font-medium">
                Game paused while settings are open.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Player Count Setting */}
            <div>
              <label className="block text-lg font-medium mb-2">
                Number of Players
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustPlayerCount(false)}
                  disabled={numPlayers <= 2}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 hover:dark:bg-gray-600 disabled:opacity-50 text-lg font-bold"
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center">
                  {numPlayers}
                </span>
                <button
                  onClick={() => adjustPlayerCount(true)}
                  disabled={numPlayers >= 12}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 hover:dark:bg-gray-600 disabled:opacity-50 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Time Setting */}
            <div>
              <label className="block text-lg font-medium mb-2">
                Time Per Player (minutes)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {[1, 3, 5, 10, 15, 30].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => handleTimeChange(minutes)}
                    className={`px-3 py-2 rounded text-md ${
                      initialTime === minutes * 60
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 hover:dark:bg-gray-600"
                    }`}
                  >
                    {minutes}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  value={customMinutes}
                  onChange={handleCustomTimeChange}
                  placeholder="Custom minutes"
                  min="1"
                  className="flex-grow px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={applyCustomTime}
                  disabled={!customMinutes || parseInt(customMinutes) <= 0}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Time Increment Setting */}
            <div>
              <label className="block text-lg font-medium mb-2">
                Time Increment (seconds)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {[0, 5, 10, 15, 30, 60].map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => handleIncrementChange(seconds)}
                    className={`px-3 py-2 rounded text-md ${
                      timeIncrement === seconds
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 hover:dark:bg-gray-600"
                    }`}
                  >
                    {seconds}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  value={customIncrement}
                  onChange={handleCustomIncrementChange}
                  placeholder="Custom seconds"
                  min="0"
                  className="flex-grow px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={applyCustomIncrement}
                  disabled={!customIncrement || parseInt(customIncrement) < 0}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={resetTimers}
                className="bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-red-900 transition-colors shadow w-full"
              >
                Reset
              </button>

              {wasRunningBeforeSettings ? (
                <button
                  onClick={resumeGame}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-500 transition-colors shadow w-full"
                >
                  Resume
                </button>
              ) : !isRunning ? (
                <button
                  onClick={() => {
                    setIsRunning(true);
                    setIsSettingsOpen(false);
                  }}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-500 transition-colors shadow w-full"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={() => setIsRunning(false)}
                  className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-500 transition-colors shadow w-full"
                >
                  Pause
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
