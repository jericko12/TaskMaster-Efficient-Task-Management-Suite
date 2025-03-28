import { useState } from 'react';
import { 
  FiSave, 
  FiMoon, 
  FiSun, 
  FiDownload, 
  FiUpload, 
  FiRefreshCw, 
  FiClock, 
  FiEye, 
  FiList, 
  FiAlertTriangle
} from 'react-icons/fi';
import { useApp } from '../store/AppContext';
import * as localStorage from '../utils/localStorage';

export function SettingsPage() {
  const { settings } = useApp();
  
  const [theme, setTheme] = useState(settings.settings.theme);
  const [defaultView, setDefaultView] = useState(settings.settings.defaultView);
  const [defaultSortBy, setDefaultSortBy] = useState(settings.settings.defaultSortBy);
  const [defaultSortOrder, setDefaultSortOrder] = useState(settings.settings.defaultSortOrder);
  const [pomodoroDuration, setPomodoroDuration] = useState(settings.settings.pomodoroDuration);
  const [shortBreakDuration, setShortBreakDuration] = useState(settings.settings.shortBreakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(settings.settings.longBreakDuration);
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(settings.settings.pomodorosUntilLongBreak);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.settings.notificationsEnabled);
  const [remindersEnabled, setRemindersEnabled] = useState(settings.settings.remindersEnabled);
  const [reminderTime, setReminderTime] = useState(settings.settings.reminderTime);
  const [highContrastMode, setHighContrastMode] = useState(settings.settings.highContrastMode);
  const [largeTextMode, setLargeTextMode] = useState(settings.settings.largeTextMode);
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const saveSettings = () => {
    const updatedSettings = {
      theme,
      defaultView,
      defaultSortBy,
      defaultSortOrder,
      pomodoroDuration,
      shortBreakDuration,
      longBreakDuration,
      pomodorosUntilLongBreak,
      notificationsEnabled,
      remindersEnabled,
      reminderTime,
      highContrastMode,
      largeTextMode,
    };
    
    try {
      settings.updateSettings(updatedSettings);
      showMessage('Settings saved successfully!', 'success');
    } catch (error) {
      showMessage('Failed to save settings. Please try again.', 'error');
    }
  };
  
  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      settings.resetSettings();
      
      // Update local state
      const defaultSettings = localStorage.getDefaultSettings();
      setTheme(defaultSettings.theme);
      setDefaultView(defaultSettings.defaultView);
      setDefaultSortBy(defaultSettings.defaultSortBy);
      setDefaultSortOrder(defaultSettings.defaultSortOrder);
      setPomodoroDuration(defaultSettings.pomodoroDuration);
      setShortBreakDuration(defaultSettings.shortBreakDuration);
      setLongBreakDuration(defaultSettings.longBreakDuration);
      setPomodorosUntilLongBreak(defaultSettings.pomodorosUntilLongBreak);
      setNotificationsEnabled(defaultSettings.notificationsEnabled);
      setRemindersEnabled(defaultSettings.remindersEnabled);
      setReminderTime(defaultSettings.reminderTime);
      setHighContrastMode(defaultSettings.highContrastMode);
      setLargeTextMode(defaultSettings.largeTextMode);
      
      showMessage('Settings reset to default', 'success');
    }
  };
  
  const exportData = () => {
    try {
      const data = localStorage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `taskmaster-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showMessage('Data exported successfully!', 'success');
    } catch (error) {
      showMessage('Failed to export data. Please try again.', 'error');
    }
  };
  
  const handleImportClick = () => {
    document.getElementById('file-import')?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };
  
  const importData = () => {
    if (!importFile) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        try {
          const json = event.target.result.toString();
          const success = localStorage.importData(json);
          
          if (success) {
            showMessage('Data imported successfully! Refreshing the page...', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            showMessage('Failed to import data. Invalid file format.', 'error');
          }
        } catch (error) {
          showMessage('Failed to import data. Please try again.', 'error');
        }
      }
    };
    reader.readAsText(importFile);
  };
  
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone!')) {
      try {
        localStorage.clearAllData();
        showMessage('All data cleared successfully! Refreshing the page...', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        showMessage('Failed to clear data. Please try again.', 'error');
      }
    }
  };
  
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Customize TaskMaster to suit your workflow and preferences.
        </p>
      </div>
      
      {message && (
        <div className={`mb-6 p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Appearance Settings */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiEye className="mr-2" /> Appearance
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Theme
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                    theme === 'light'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FiSun className="mr-2" /> Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FiMoon className="mr-2" /> Dark
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                    theme === 'system'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  System
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="high-contrast"
                  checked={highContrastMode}
                  onChange={(e) => setHighContrastMode(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="high-contrast" className="ml-2 block text-sm">
                  High Contrast Mode
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="large-text"
                  checked={largeTextMode}
                  onChange={(e) => setLargeTextMode(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="large-text" className="ml-2 block text-sm">
                  Large Text Mode
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Default View Settings */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiList className="mr-2" /> Default View Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="default-view" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default View
              </label>
              <select
                id="default-view"
                value={defaultView}
                onChange={(e) => setDefaultView(e.target.value as any)}
                className="input-field"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="project">Project</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="default-sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Sort
              </label>
              <select
                id="default-sort"
                value={defaultSortBy}
                onChange={(e) => setDefaultSortBy(e.target.value as any)}
                className="input-field"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="created">Created Date</option>
                <option value="updated">Updated Date</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort Order
              </label>
              <select
                id="sort-order"
                value={defaultSortOrder}
                onChange={(e) => setDefaultSortOrder(e.target.value as any)}
                className="input-field"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Pomodoro Settings */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiClock className="mr-2" /> Pomodoro Timer Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pomodoro-duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pomodoro Duration (minutes)
              </label>
              <input
                type="number"
                id="pomodoro-duration"
                value={pomodoroDuration}
                onChange={(e) => setPomodoroDuration(parseInt(e.target.value))}
                min="1"
                max="120"
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="short-break" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Short Break Duration (minutes)
              </label>
              <input
                type="number"
                id="short-break"
                value={shortBreakDuration}
                onChange={(e) => setShortBreakDuration(parseInt(e.target.value))}
                min="1"
                max="30"
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="long-break" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Long Break Duration (minutes)
              </label>
              <input
                type="number"
                id="long-break"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(parseInt(e.target.value))}
                min="1"
                max="60"
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="pomodoros-until-break" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pomodoros Until Long Break
              </label>
              <input
                type="number"
                id="pomodoros-until-break"
                value={pomodorosUntilLongBreak}
                onChange={(e) => setPomodorosUntilLongBreak(parseInt(e.target.value))}
                min="1"
                max="10"
                className="input-field"
              />
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm">
                Enable Notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="reminders"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label htmlFor="reminders" className="ml-2 block text-sm">
                Enable Task Reminders
              </label>
            </div>
            
            {remindersEnabled && (
              <div>
                <label htmlFor="reminder-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reminder Time (minutes before due)
                </label>
                <input
                  type="number"
                  id="reminder-time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(parseInt(e.target.value))}
                  min="1"
                  max="1440"
                  className="input-field"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Data Management */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
              <button
                onClick={exportData}
                className="btn-secondary flex items-center justify-center"
              >
                <FiDownload className="mr-2" /> Export Data
              </button>
              
              <button
                onClick={handleImportClick}
                className="btn-secondary flex items-center justify-center"
              >
                <FiUpload className="mr-2" /> Import Data
              </button>
              <input 
                type="file" 
                id="file-import" 
                accept=".json" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
            
            {importFile && (
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                <span className="text-sm truncate">Selected: {importFile.name}</span>
                <button
                  onClick={importData}
                  className="btn-primary btn-sm"
                >
                  Upload
                </button>
              </div>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                <button
                  onClick={resetSettings}
                  className="btn-secondary flex items-center justify-center"
                >
                  <FiRefreshCw className="mr-2" /> Reset Settings
                </button>
                
                <button
                  onClick={clearAllData}
                  className="btn-secondary text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                >
                  <FiAlertTriangle className="mr-2" /> Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            className="btn-primary flex items-center"
          >
            <FiSave className="mr-2" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
} 