import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useApp } from '../../store/AppContext';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
  const { settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Track scrolling for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update theme state whenever settings change
  useEffect(() => {
    let currentTheme = settings.settings.theme;
    
    // If system theme is selected, detect user's preference
    if (currentTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = prefersDark ? 'dark' : 'light';
    }
    
    setIsDarkMode(currentTheme === 'dark');
  }, [settings.settings.theme]);
  
  // Also check for theme changes made from other components
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDarkMode(isDark);
    };
    
    // Check initially
    checkTheme();
    
    // Listen for theme changes
    window.addEventListener('storage', checkTheme);
    return () => window.removeEventListener('storage', checkTheme);
  }, []);
  
  const toggleDarkMode = () => {
    // Use the settings context to update the theme
    settings.toggleTheme();
  };

  return (
    <header className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 
      ${scrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <div className="lg:hidden font-bold text-xl">TaskMaster</div>
        </div>
        
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-100 dark:bg-gray-700 w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent focus:border-blue-500"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-700 dark:text-gray-300" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="p-2 md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-100 dark:bg-gray-700 w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent focus:border-blue-500"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
} 