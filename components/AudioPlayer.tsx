'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  showSpeedControl?: boolean;
  showLoopControl?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  title, 
  showSpeedControl = false,
  showLoopControl = false 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopCount, setLoopCount] = useState(1);
  const [currentLoop, setCurrentLoop] = useState(0);
  const loopCountRef = useRef(0);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    loopCountRef.current = 0;
    if (audioRef.current) {
      audioRef.current.loop = loopCount === 0;
    }
  }, [loopCount]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || loopCount === 0) return;

    const handleEnded = () => {
      loopCountRef.current += 1;
      if (loopCountRef.current < loopCount) {
        setCurrentLoop(loopCountRef.current);
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        loopCountRef.current = 0;
        setCurrentLoop(0);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [loopCount]);

  return (
    <div className="my-6 space-y-4">
      {title && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
      )}
      
      <div className="flex flex-col gap-3">
        <audio 
          ref={audioRef} 
          controls 
          className="w-full"
        >
          <source src={src} type="audio/mpeg" />
          <source src={src} type="audio/mp4" />
          <source src={src} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
        
        {(showSpeedControl || showLoopControl) && (
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {showLoopControl && (
              <div className="flex items-center gap-3">
                <label htmlFor="loopCount" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Loops:
                </label>
                <input
                  id="loopCount"
                  type="number"
                  min="1"
                  value={loopCount === 0 ? '' : loopCount}
                  onChange={(e) => {
                    const loops = parseInt(e.target.value) || 1;
                    setLoopCount(loops);
                    setCurrentLoop(0);
                    loopCountRef.current = 0;
                  }}
                  placeholder="∞"
                  className="w-20 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {loopCount > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({currentLoop + 1}/{loopCount})
                  </span>
                )}
                {loopCount === 0 && (
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">∞</span>
                )}
              </div>
            )}

            {showSpeedControl && (
              <div className="flex items-center gap-3">
                <label htmlFor="playbackSpeed" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Speed:
                </label>
                <select
                  id="playbackSpeed"
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {speedOptions.map((speed) => (
                    <option key={speed} value={speed}>
                      {speed}x
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
