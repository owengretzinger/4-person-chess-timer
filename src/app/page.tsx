"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const initialTime = 300; // 5 minutes in seconds
  const [numPlayers, setNumPlayers] = useState(4); // Configurable number of players
  const [times, setTimes] = useState(Array(numPlayers).fill(initialTime));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Base colors - will cycle or extend as needed for more players
  const baseColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-cyan-500",
  ];

  // Generate colors for all players, repeating if necessary
  const playerColors = Array(numPlayers)
    .fill(0)
    .map((_, i) => baseColors[i % baseColors.length]);

  // Text colors corresponding to background colors
  const textColors = [
    "text-blue-600",
    "text-green-600",
    "text-red-600",
    "text-amber-600",
    "text-purple-600",
    "text-pink-600",
    "text-indigo-600",
    "text-cyan-600",
  ];

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

  // Update times array when number of players changes
  useEffect(() => {
    setTimes(Array(numPlayers).fill(initialTime));
    setCurrentPlayer(0);
    setIsRunning(false);
  }, [numPlayers, initialTime]);

  const handleTap = () => {
    if (times[currentPlayer] === 0) return;

    if (!isRunning) {
      setIsRunning(true);
      return;
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
    const outerRadius = 48; // Slightly smaller to ensure it fits within the container

    // Calculate points on circle circumference
    const x1 = centerX + outerRadius * Math.cos(startRad);
    const y1 = centerY + outerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(endRad);
    const y2 = centerY + outerRadius * Math.sin(endRad);

    // Create SVG clip path for the segment
    const clipPath = `polygon(${centerX}% ${centerY}%, ${x1}% ${y1}%, ${x2}% ${y2}%)`;

    // Calculate position for text - closer to outer edge for better readability
    const textDistanceFromCenter = 36; // % from center point
    const textX =
      centerX +
      textDistanceFromCenter * Math.cos((midAngle - 90) * (Math.PI / 180));
    const textY =
      centerY +
      textDistanceFromCenter * Math.sin((midAngle - 90) * (Math.PI / 180));

    // Calculate text rotation so it's readable from outside the wheel
    // This way all text is aligned radially outward
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
      {/* Player count controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md">
        <button
          onClick={() => adjustPlayerCount(false)}
          disabled={numPlayers <= 2}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 hover:dark:bg-gray-600 disabled:opacity-50"
        >
          -
        </button>
        <span className="text-lg font-medium">{numPlayers} Players</span>
        <button
          onClick={() => adjustPlayerCount(true)}
          disabled={numPlayers >= 12}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 hover:dark:bg-gray-600 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Wheel container */}
      <div
        className="relative flex-grow flex items-center justify-center"
        onClick={handleTap}
      >
        <div className="relative w-[90vmin] h-[90vmin] rounded-full overflow-hidden border-4 border-gray-800">
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
                      top: "15%",
                      width: "100%",
                      transform: "translateX(-50%)",
                      padding: "0 10%",
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold mb-1 text-white drop-shadow-md">{`Player ${
                        index + 1
                      }`}</div>
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

          {/* Center piece */}
          <div className="absolute left-1/2 top-1/2 w-[18%] h-[18%] bg-white dark:bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center border-4 border-gray-800 dark:border-gray-700 shadow-lg">
            <div className="text-center">
              <div className="text-lg font-bold">TIMER</div>
              <div className="text-xs">TAP TO SWITCH</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="p-4 flex justify-center gap-4 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetTimers();
          }}
          className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg text-lg"
        >
          Reset
        </button>
        {!isRunning && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRunning(true);
            }}
            className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-500 transition-colors shadow-lg text-lg"
          >
            Start
          </button>
        )}
        {isRunning && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRunning(false);
            }}
            className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-500 transition-colors shadow-lg text-lg"
          >
            Pause
          </button>
        )}
      </div>
    </div>
  );
}
