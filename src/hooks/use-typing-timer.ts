import { useState, useRef, useCallback } from 'react';

export function useTypingTimer(
  config: any,
  onTick: (elapsed: number) => void,
  onComplete: () => void
) {
  const [timeLeft, setTimeLeft] = useState<number>(config.testMode === 'time' ? config.testTimeLimit : 0);
  const timerStartedAtRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    timerStartedAtRef.current = null;
    setTimeLeft(config.testMode === 'time' ? config.testTimeLimit : 0);
  }, [config.testMode, config.testTimeLimit]);

  const startTimer = useCallback(() => {
    timerStartedAtRef.current = performance.now();
    
    if (config.testMode === 'time') {
      setTimeLeft(config.testTimeLimit);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const nextTime = prev - 1;
          const elapsed = (performance.now() - (timerStartedAtRef.current || performance.now())) / 1000;
          onTick(elapsed);
          if (nextTime <= 0) {
            onComplete();
            return 0;
          }
          return nextTime;
        });
      }, 1000);
    } else {
      setTimeLeft(0);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const nextTime = prev + 1;
          const elapsed = (performance.now() - (timerStartedAtRef.current || performance.now())) / 1000;
          onTick(elapsed);
          return nextTime;
        });
      }, 1000);
    }
  }, [config.testMode, config.testTimeLimit, onTick, onComplete]);

  const getElapsed = useCallback(() => {
    return timerStartedAtRef.current ? (performance.now() - timerStartedAtRef.current) / 1000 : 1;
  }, []);

  return { timeLeft, startTimer, resetTimer, getElapsed, timerIntervalRef };
}
