import { useState, useEffect } from 'react';

// Default settings values
const defaultSettings = {
  theme: 'system', // light, dark, or system
  defaultView: 'daily',
  defaultSortBy: 'dueDate',
  defaultSortOrder: 'asc',
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodorosUntilLongBreak: 4,
  notificationsEnabled: true,
  remindersEnabled: true,
  reminderTime: 30,
  highContrastMode: false,
  largeTextMode: false,
};

export function useSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('taskmaster_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading settings:', error);
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Update settings
  const updateSettings = (newSettings: typeof defaultSettings) => {
    try {
      setSettings(newSettings);
      localStorage.setItem('taskmaster_settings', JSON.stringify(newSettings));
      
      // Apply theme setting
      applyTheme(newSettings.theme);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Reset settings to default
  const resetSettings = () => {
    updateSettings(defaultSettings);
  };

  // Apply the current theme
  const applyTheme = (theme: string) => {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply theme on settings change
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  return {
    settings,
    loading,
    updateSettings,
    resetSettings,
  };
} 