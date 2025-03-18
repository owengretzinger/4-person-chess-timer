"use client";

import React from "react";
import PlayerSegment from "./PlayerSegment";
import CenterButton from "./CenterButton";

interface PlayerWheelProps {
  times: number[];
  currentPlayer: number;
  isRunning: boolean;
  playerColors: string[];
  textColors: string[];
  numPlayers: number;
  isMobile: boolean;
  onTap: (e: React.MouseEvent) => void;
  onSettingsToggle: (e: React.MouseEvent) => void;
}

export default function PlayerWheel({
  times,
  currentPlayer,
  isRunning,
  playerColors,
  textColors,
  numPlayers,
  onTap,
  onSettingsToggle,
}: PlayerWheelProps) {
  return (
    <div
      className="relative flex-grow flex items-center justify-center overflow-hidden"
      onClick={onTap}
    >
      <div className="absolute w-[150vmax] h-[150vmax] rounded-full overflow-hidden border-4 border-gray-800 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Player segments */}
        {Array.from({ length: numPlayers }).map((_, index) => (
          <PlayerSegment
            key={index}
            index={index}
            numPlayers={numPlayers}
            time={times[index]}
            currentPlayer={currentPlayer}
            isRunning={isRunning}
            bgColor={playerColors[index % playerColors.length]}
            textColor={textColors[index % textColors.length]}
            isMobile={false}
          />
        ))}

        {/* Center Button */}
        <CenterButton onClick={onSettingsToggle} />
      </div>
    </div>
  );
}
