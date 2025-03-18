"use client";

import { useState, useEffect } from "react";
import { COLOR_SETS } from "../constants/colors";

export interface TimerState {
  initialTime: number;
  numPlayers: number;
  times: number[];
  currentPlayer: number;
  isRunning: boolean;
  playerColors: string[];
  textColors: string[];
  timeIncrement: number;
  wasRunningBeforeSettings: boolean;
}

export interface TimerActions {
  setInitialTime: (time: number) => void;
  setNumPlayers: (num: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  setCurrentPlayer: (player: number) => void;
  resetTimers: () => void;
  nextPlayer: () => void;
  incrementCurrentPlayerTime: () => void;
  setWasRunningBeforeSettings: (wasRunning: boolean) => void;
  setTimeIncrement: (increment: number) => void;
}

export function useTimer(): [TimerState, TimerActions] {
  const [initialTime, setInitialTime] = useState(300); // 5 minutes in seconds
  const [numPlayers, setNumPlayers] = useState(4);
  const [times, setTimes] = useState(Array(numPlayers).fill(initialTime));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeIncrement, setTimeIncrement] = useState(0);
  const [wasRunningBeforeSettings, setWasRunningBeforeSettings] =
    useState(false);

  // Use colors directly from our expanded sets
  const playerColors = Array(numPlayers)
    .fill(0)
    .map((_, i) => COLOR_SETS[0][i]);

  // Text colors corresponding to background colors
  const textColors = Array(numPlayers)
    .fill(0)
    .map((_, i) => COLOR_SETS[1][i]);

  // Timer logic
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

  const resetTimers = () => {
    setTimes(Array(numPlayers).fill(initialTime));
    setCurrentPlayer(0);
    setIsRunning(false);
  };

  const nextPlayer = () => {
    setCurrentPlayer((prevPlayer) => (prevPlayer + 1) % numPlayers);
  };

  const incrementCurrentPlayerTime = () => {
    if (timeIncrement > 0) {
      setTimes((prevTimes) => {
        const newTimes = [...prevTimes];
        newTimes[currentPlayer] += timeIncrement;
        return newTimes;
      });
    }
  };

  const state: TimerState = {
    initialTime,
    numPlayers,
    times,
    currentPlayer,
    isRunning,
    playerColors,
    textColors,
    timeIncrement,
    wasRunningBeforeSettings,
  };

  const actions: TimerActions = {
    setInitialTime,
    setNumPlayers,
    setIsRunning,
    setCurrentPlayer,
    resetTimers,
    nextPlayer,
    incrementCurrentPlayerTime,
    setWasRunningBeforeSettings,
    setTimeIncrement,
  };

  return [state, actions];
}
