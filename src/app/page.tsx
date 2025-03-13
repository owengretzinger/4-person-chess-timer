"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const initialTime = 300; // 5 minutes in seconds
  const [times, setTimes] = useState([initialTime, initialTime, initialTime, initialTime]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // Adjust colors to match the image (blue, green, red, gold)
  const playerColors = ["bg-blue-500", "bg-green-500", "bg-red-500", "bg-amber-500"];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && times[currentPlayer] > 0) {
      interval = setInterval(() => {
        setTimes(prevTimes => {
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

  const handleTap = () => {
    if (times[currentPlayer] === 0) return;
    
    if (!isRunning) {
      setIsRunning(true);
      return;
    }
    
    // Move to next player
    setCurrentPlayer((prevPlayer) => (prevPlayer + 1) % 4);
  };

  const resetTimers = () => {
    setTimes([initialTime, initialTime, initialTime, initialTime]);
    setCurrentPlayer(0);
    setIsRunning(false);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden" onClick={handleTap}>
      {/* Container that fills the entire screen */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Player 1 - Bottom (Blue) */}
        <div 
          className={`absolute bottom-0 inset-x-0 h-1/2 flex items-end justify-center p-8 
            ${currentPlayer === 0 ? 'bg-opacity-100' : 'bg-opacity-80'} 
            ${playerColors[0]} text-white
            ${currentPlayer === 0 && isRunning ? 'animate-pulse' : ''}
          `}
          style={{ clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)' }}
        >
          <div className="flex flex-col items-center mb-12">
            <div>
              <div className="text-xl md:text-2xl font-bold mb-2">Player 1</div>
              <div className="text-4xl md:text-5xl font-mono mb-2">{formatTime(times[0])}</div>
              <div className="relative h-8">
                {currentPlayer === 0 && isRunning && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 bg-white text-blue-600 px-4 py-1 rounded-full font-bold shadow-lg whitespace-nowrap">
                    YOUR TURN
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Player 2 - Left (Green) */}
        <div 
          className={`absolute left-0 inset-y-0 w-1/2 flex items-center justify-start p-4 sm:p-6 
            ${currentPlayer === 1 ? 'bg-opacity-100' : 'bg-opacity-80'} 
            ${playerColors[1]} text-white
            ${currentPlayer === 1 && isRunning ? 'animate-pulse' : ''}
          `}
          style={{ clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)' }}
        >
          <div className="flex flex-col items-center ml-4 sm:ml-6">
            <div className="rotate-90">
              <div className="text-xl md:text-2xl font-bold mb-1">Player 2</div>
              <div className="text-4xl md:text-5xl font-mono mb-1">{formatTime(times[1])}</div>
              <div className="relative h-8">
                {currentPlayer === 1 && isRunning && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 bg-white text-green-600 px-4 py-1 rounded-full font-bold shadow-lg whitespace-nowrap">
                    YOUR TURN
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Player 3 - Top (Red) */}
        <div 
          className={`absolute top-0 inset-x-0 h-1/2 flex items-start justify-center p-8 
            ${currentPlayer === 2 ? 'bg-opacity-100' : 'bg-opacity-80'} 
            ${playerColors[2]} text-white
            ${currentPlayer === 2 && isRunning ? 'animate-pulse' : ''}
          `}
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}
        >
          <div className="flex flex-col items-center mb-12">
            <div className="rotate-180">
              <div className="text-xl md:text-2xl font-bold mb-2">Player 3</div>
              <div className="text-4xl md:text-5xl font-mono mb-2">{formatTime(times[2])}</div>
              <div className="relative h-8">
                {currentPlayer === 2 && isRunning && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 bg-white text-red-600 px-4 py-1 rounded-full font-bold shadow-lg whitespace-nowrap">
                    YOUR TURN
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Player 4 - Right (Amber/Gold) */}
        <div 
          className={`absolute right-0 inset-y-0 w-1/2 flex items-center justify-end p-4 sm:p-6 
            ${currentPlayer === 3 ? 'bg-opacity-100' : 'bg-opacity-80'} 
            ${playerColors[3]} text-white
            ${currentPlayer === 3 && isRunning ? 'animate-pulse' : ''}
          `}
          style={{ clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)' }}
        >
          <div className="flex flex-col items-center mr-4 sm:mr-6">
            <div className="-rotate-90">
              <div className="text-xl md:text-2xl font-bold mb-1">Player 4</div>
              <div className="text-4xl md:text-5xl font-mono mb-1">{formatTime(times[3])}</div>
              <div className="relative h-8">
                {currentPlayer === 3 && isRunning && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 bg-white text-amber-600 px-4 py-1 rounded-full font-bold shadow-lg whitespace-nowrap">
                    YOUR TURN
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Control buttons at the bottom of the screen */}
      <div className="fixed bottom-2 right-8 flex gap-4">
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
