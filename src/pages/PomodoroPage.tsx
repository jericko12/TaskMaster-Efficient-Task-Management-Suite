import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { PomodoroTimer } from '../components/tasks/PomodoroTimer';
import { useApp } from '../store/AppContext';

export function PomodoroPage() {
  const { settings } = useApp();
  const [showInfo, setShowInfo] = useState(false);
  
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
        <button
          onClick={toggleInfo}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="Information about the Pomodoro technique"
        >
          <FiInfo size={20} />
        </button>
      </div>
      
      {showInfo && (
        <div className="card p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
          <h2 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">About the Pomodoro Technique</h2>
          <p className="text-blue-600 dark:text-blue-200 mb-2">
            The Pomodoro Technique is a time management method that uses a timer to break work into intervals, 
            traditionally 25 minutes in length, separated by short breaks.
          </p>
          <ol className="list-decimal ml-5 text-blue-600 dark:text-blue-200 space-y-1">
            <li>Choose a task to work on</li>
            <li>Start the Pomodoro timer (25 minutes by default)</li>
            <li>Work on the task until the timer rings</li>
            <li>Take a short break (5 minutes by default)</li>
            <li>After 4 Pomodoros, take a longer break (15 minutes by default)</li>
          </ol>
        </div>
      )}
      
      <div className="mb-8">
        <PomodoroTimer />
      </div>
      
      <div className="card p-4">
        <h2 className="font-semibold mb-3">Your Pomodoro Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pomodoro Duration</p>
            <p className="font-medium">{settings.settings.pomodoroDuration} minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Short Break Duration</p>
            <p className="font-medium">{settings.settings.shortBreakDuration} minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Long Break Duration</p>
            <p className="font-medium">{settings.settings.longBreakDuration} minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pomodoros Until Long Break</p>
            <p className="font-medium">{settings.settings.pomodorosUntilLongBreak}</p>
          </div>
        </div>
        <div className="mt-4 text-right">
          <button 
            onClick={() => window.location.href = '/settings'}
            className="text-blue-500 text-sm hover:text-blue-600"
          >
            Customize Settings
          </button>
        </div>
      </div>
    </div>
  );
} 