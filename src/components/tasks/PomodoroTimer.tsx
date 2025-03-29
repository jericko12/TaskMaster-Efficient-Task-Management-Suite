import { useState } from 'react';
import { 
  FiPlay, 
  FiPause, 
  FiSkipForward, 
  FiRefreshCw, 
  FiSettings 
} from 'react-icons/fi';
import { usePomodoro } from '../../hooks/usePomodoro';
import { useApp } from '../../store/AppContext';

export function PomodoroTimer() {
  const { tasks } = useApp();
  const pomodoro = usePomodoro();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const handleStartTimer = () => {
    pomodoro.startTimer(selectedTaskId || undefined);
  };

  const getTimerTitle = () => {
    switch (pomodoro.timerType) {
      case 'pomodoro':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Timer';
    }
  };

  const getTimerColor = () => {
    switch (pomodoro.timerType) {
      case 'pomodoro':
        return 'text-red-500';
      case 'shortBreak':
        return 'text-green-500';
      case 'longBreak':
        return 'text-blue-500';
      default:
        return '';
    }
  };

  const handleTaskSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTaskId(e.target.value || null);
  };

  return (
    <div className="card p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">{getTimerTitle()}</h3>
        
        <div className={`text-6xl font-bold mb-4 ${getTimerColor()}`}>
          {pomodoro.formattedTime}
        </div>
        
        <div className="flex justify-center space-x-3 mb-6">
          <button
            type="button"
            onClick={() => pomodoro.setTimerType('pomodoro')}
            className={`px-3 py-1 rounded-full text-sm ${
              pomodoro.timerType === 'pomodoro'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Pomodoro
          </button>
          
          <button
            type="button"
            onClick={() => pomodoro.setTimerType('shortBreak')}
            className={`px-3 py-1 rounded-full text-sm ${
              pomodoro.timerType === 'shortBreak'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Short Break
          </button>
          
          <button
            type="button"
            onClick={() => pomodoro.setTimerType('longBreak')}
            className={`px-3 py-1 rounded-full text-sm ${
              pomodoro.timerType === 'longBreak'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Long Break
          </button>
        </div>
        
        {pomodoro.timerType === 'pomodoro' && (
          <div className="mb-6">
            <label htmlFor="taskSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Working on:
            </label>
            <select
              id="taskSelect"
              value={selectedTaskId || ''}
              onChange={handleTaskSelect}
              className="input-field"
              disabled={pomodoro.timerState === 'running'}
            >
              <option value="">-- Select a task --</option>
              {tasks.tasks
                .filter(task => !task.completed)
                .map(task => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
            </select>
          </div>
        )}
        
        <div className="flex justify-center space-x-3">
          {pomodoro.timerState === 'running' ? (
            <button
              type="button"
              onClick={pomodoro.pauseTimer}
              className="btn-secondary flex items-center"
            >
              <FiPause className="mr-1" /> Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartTimer}
              className="btn-primary flex items-center"
              disabled={pomodoro.timerType === 'pomodoro' && !selectedTaskId && pomodoro.timerState !== 'paused'}
            >
              <FiPlay className="mr-1" /> 
              {pomodoro.timerState === 'paused' ? 'Resume' : 'Start'}
            </button>
          )}
          
          <button
            type="button"
            onClick={pomodoro.resetTimer}
            className="btn-secondary flex items-center"
          >
            <FiRefreshCw className="mr-1" /> Reset
          </button>
          
          <button
            type="button"
            onClick={pomodoro.skipTimer}
            className="btn-secondary flex items-center"
          >
            <FiSkipForward className="mr-1" /> Skip
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Pomodoros completed today: <span className="font-semibold">{pomodoro.pomodoroCount}</span>
          </div>
          <div>
            <button className="flex items-center hover:text-gray-900 dark:hover:text-white">
              <FiSettings className="mr-1" /> Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 