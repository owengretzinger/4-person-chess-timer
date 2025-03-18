"use client";

import React from "react";
import { formatTime } from "../utils/formatters";
import { calculateWheelSegment } from "../utils/wheelCalculator";

interface PlayerSegmentProps {
  index: number;
  numPlayers: number;
  time: number;
  currentPlayer: number;
  isRunning: boolean;
  bgColor: string;
  textColor: string;
  isMobile: boolean;
}

export default function PlayerSegment({
  index,
  numPlayers,
  time,
  currentPlayer,
  isRunning,
  bgColor,
  textColor,
}: PlayerSegmentProps) {
  const segment = calculateWheelSegment(index, numPlayers);

  return (
    <div
      className={`absolute inset-0
        ${bgColor} 
        ${currentPlayer === index ? "bg-opacity-100" : "bg-opacity-70"} 
        ${currentPlayer === index && isRunning ? "animate-pulse" : ""}
      `}
      style={{
        clipPath: segment.clipPath,
      }}
    >
      {/* Text container - positioned radially */}
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
            top: "7%",
            width: "100%",
            transform: "translateX(-50%)",
            padding: "0 10%",
          }}
        >
          <div className="text-center min-h-[120px] flex flex-col items-center justify-center">
            <div className="text-xl font-bold mb-1 text-white drop-shadow-md">
              <span className="hidden sm:inline">Player </span>
              <span className="sm:hidden">P</span>
              {index + 1}
            </div>
            <div className="text-xl sm:text-3xl font-mono text-white font-bold drop-shadow-md">
              {formatTime(time)}
            </div>
            <div className="mt-1 h-8 flex items-center justify-center">
              {currentPlayer === index && isRunning && (
                <div className="bg-white px-2 py-0.5 rounded-full font-bold text-sm whitespace-nowrap shadow-md">
                  <span className={textColor}>YOUR TURN</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
