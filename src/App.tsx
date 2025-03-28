import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { Layout } from './components/Layout';
import { TasksPage } from './pages/TasksPage';
import { CreateTaskPage } from './pages/CreateTaskPage';
import { EditTaskPage } from './pages/EditTaskPage';
import { PomodoroPage } from './pages/PomodoroPage';
import { SettingsPage } from './pages/SettingsPage';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { useEffect } from 'react';
import './App.css';

// Function to initialize the theme
function initializeTheme() {
  try {
    // Get theme from localStorage directly
    const settingsData = localStorage.getItem('taskmaster:settings');
    let theme = 'light'; // Default theme
    
    if (settingsData) {
      const settings = JSON.parse(settingsData);
      if (settings.theme === 'dark') {
        theme = 'dark';
      } else if (settings.theme === 'system') {
        // Check system preference
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    }
    
    // Apply the theme to both Tailwind and DaisyUI
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (error) {
    console.error('Error initializing theme in App:', error);
  }
}

function App() {
  // Run theme initialization when the app loads
  useEffect(() => {
    initializeTheme();
  }, []);
  
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="overview" element={<Dashboard />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/create" element={<CreateTaskPage />} />
            <Route path="tasks/:taskId/edit" element={<EditTaskPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="pomodoro" element={<PomodoroPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
