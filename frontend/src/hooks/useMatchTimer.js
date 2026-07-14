/**
 * @fileoverview Shared Match Timer Hook
 * @description Provides a centralized countdown timer for match duration tracking.
 * Uses a single interval to prevent redundant timers across components,
 * reducing CPU usage and improving battery life on mobile devices.
 * @module useMatchTimer
 */
import { useState, useEffect, useMemo } from 'react';

/**
 * @hook useMatchTimer
 * @description Countdown timer hook with memoized formatted output.
 * @param {number} [initialSeconds=10088] - Starting countdown value in seconds.
 * @returns {{ timeLeft: number, timerValues: { hrs: string, mins: string, secs: string } }}
 */
export const useMatchTimer = (initialSeconds = 2 * 3600 + 48 * 60 + 8) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  const isTimeLeftPositive = timeLeft > 0;

  useEffect(() => {
    if (!isTimeLeftPositive) return; // Don't start interval if already at zero

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimeLeftPositive]); // Only re-subscribe when crossing the zero boundary

  /** @description Memoized formatted values to prevent recalculation on unrelated re-renders */
  const timerValues = useMemo(() => {
    const hrs = Math.floor(timeLeft / 3600);
    const mins = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;
    return {
      hrs: String(hrs).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0')
    };
  }, [timeLeft]);

  return { timeLeft, timerValues };
};
