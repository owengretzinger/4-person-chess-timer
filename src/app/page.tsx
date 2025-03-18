"use client";

import { useState } from "react";
import { useTimer } from "./hooks/useTimer";
import PlayerWheel from "./components/PlayerWheel";
import SettingsPanel from "./components/SettingsPanel";

export default function Home() {
  const [timerState, timerActions] = useTimer();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    times,
    currentPlayer,
    isRunning,
    playerColors,
    textColors,
    numPlayers,
    timeIncrement,
    wasRunningBeforeSettings,
  } = timerState;

  const {
    nextPlayer,
    incrementCurrentPlayerTime,
    setIsRunning,
    setWasRunningBeforeSettings,
  } = timerActions;

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
      incrementCurrentPlayerTime();
    }

    // Move to next player
    nextPlayer();
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

  return (
    <div className="w-full h-full fixed inset-0 bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col">
      {/* Player Wheel */}
      <PlayerWheel
        times={times}
        currentPlayer={currentPlayer}
        isRunning={isRunning}
        playerColors={playerColors}
        textColors={textColors}
        numPlayers={numPlayers}
        isMobile={false} // Pass a fixed value since we now use CSS for responsiveness
        onTap={handleTap}
        onSettingsToggle={toggleSettings}
      />

      {/* Settings Panel */}
      <SettingsPanel
        timerState={timerState}
        timerActions={timerActions}
        isSettingsOpen={isSettingsOpen}
        toggleSettings={toggleSettings}
      />
    </div>
  );
}
