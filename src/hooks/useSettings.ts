import { useState, useEffect, useCallback } from 'react';
import { UserSettings } from '../types';
import * as localStorage from '../utils/localStorage';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(localStorage.getDefaultSettings());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getSettings();
      setSettings(savedSettings);
      setError(null);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setSettings(settings);
      } catch (err) {
        console.error('Error saving settings:', err);
        setError('Failed to save settings');
      }
    }
  }, [settings, loading]);

  // Update settings
  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...updates
    }));
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = useCallback(() => {
    setSettings(prevSettings => ({
      ...prevSettings,
      theme: prevSettings.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    setSettings(localStorage.getDefaultSettings());
  }, []);

  // Apply theme to document
  useEffect(() => {
    let currentTheme = settings.theme;
    
    // If system theme is selected, detect user's preference
    if (currentTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = prefersDark ? 'dark' : 'light';
    }

    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Apply high contrast if enabled
    if (settings.highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply large text if enabled
    if (settings.largeTextMode) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [settings.theme, settings.highContrastMode, settings.largeTextMode]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    toggleTheme,
    resetSettings
  };
} 