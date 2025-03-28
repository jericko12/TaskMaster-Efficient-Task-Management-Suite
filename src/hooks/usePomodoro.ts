import { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { PomodoroSession } from '../types';
import { generateId } from '../utils/helpers';

type TimerState = 'idle' | 'running' | 'paused' | 'completed';
type TimerType = 'pomodoro' | 'shortBreak' | 'longBreak';

export function usePomodoro() {
  const { settings } = useApp();
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timerType, setTimerType] = useState<TimerType>('pomodoro');
  const [timeRemaining, setTimeRemaining] = useState(settings.settings.pomodoroDuration * 60);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Reset timer when timer type changes
  useEffect(() => {
    let duration = 0;
    switch (timerType) {
      case 'pomodoro':
        duration = settings.settings.pomodoroDuration * 60;
        break;
      case 'shortBreak':
        duration = settings.settings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        duration = settings.settings.longBreakDuration * 60;
        break;
    }
    setTimeRemaining(duration);
    setTimerState('idle');
  }, [timerType, settings.settings]);

  // Timer tick function
  const tick = useCallback(() => {
    setTimeRemaining(prev => {
      if (prev <= 1) {
        // Timer completed
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setTimerState('completed');
        
        // Record session if it was a pomodoro
        if (timerType === 'pomodoro' && currentTaskId) {
          const endTime = new Date().toISOString();
          
          const session: PomodoroSession = {
            id: generateId(),
            taskId: currentTaskId,
            startTime: startTimeRef.current ? new Date(startTimeRef.current).toISOString() : new Date().toISOString(),
            endTime,
            duration: settings.settings.pomodoroDuration,
            completed: true
          };
          
          setSessions(prev => [...prev, session]);
        }
        
        // Update pomodoro count if needed
        if (timerType === 'pomodoro') {
          const newCount = pomodoroCount + 1;
          setPomodoroCount(newCount);
          
          // Auto switch to break
          if (newCount % settings.settings.pomodorosUntilLongBreak === 0) {
            setTimerType('longBreak');
          } else {
            setTimerType('shortBreak');
          }
        } else {
          // Auto switch back to pomodoro after break
          setTimerType('pomodoro');
        }
        
        return 0;
      }
      return prev - 1;
    });
  }, [timerType, currentTaskId, pomodoroCount, settings.settings]);

  // Start timer
  const startTimer = useCallback((taskId?: string) => {
    if (taskId) {
      setCurrentTaskId(taskId);
    }
    
    // If starting from idle, record start time
    if (timerState === 'idle') {
      startTimeRef.current = Date.now();
    }
    
    setTimerState('running');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(tick, 1000);
  }, [timerState, tick]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerState('paused');
  }, []);

  // Reset timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerState('idle');
    
    // Reset to appropriate duration
    let duration = 0;
    switch (timerType) {
      case 'pomodoro':
        duration = settings.settings.pomodoroDuration * 60;
        break;
      case 'shortBreak':
        duration = settings.settings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        duration = settings.settings.longBreakDuration * 60;
        break;
    }
    setTimeRemaining(duration);
    
    startTimeRef.current = null;
  }, [timerType, settings.settings]);

  // Skip current timer
  const skipTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Switch to next timer type
    if (timerType === 'pomodoro') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      if (newCount % settings.settings.pomodorosUntilLongBreak === 0) {
        setTimerType('longBreak');
      } else {
        setTimerType('shortBreak');
      }
    } else {
      setTimerType('pomodoro');
    }
    
    setTimerState('idle');
    startTimeRef.current = null;
  }, [timerType, pomodoroCount, settings.settings]);

  // Format time for display
  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    timerState,
    timerType,
    timeRemaining,
    formattedTime: formatTime(),
    pomodoroCount,
    currentTaskId,
    sessions,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setTimerType,
  };
} 