import { NavLink } from 'react-router-dom';
import { 
  FiList, 
  FiClock, 
  FiSettings,
  FiHome,
  FiCalendar,
  FiX
} from 'react-icons/fi';

interface SidebarProps {
  closeSidebar: () => void;
}

export function Sidebar({ closeSidebar }: SidebarProps) {
  return (
    <aside className="bg-white dark:bg-gray-800 w-72 h-screen shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            TaskMaster
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Efficient Task Management
          </p>
        </div>
        <button 
          onClick={closeSidebar} 
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 lg:hidden"
        >
          <FiX size={20} />
        </button>
      </div>
      
      <nav className="p-4 flex-1 overflow-y-auto">
        <div className="mb-4">
          <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2 ml-2">
            Dashboard
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink 
                to="/overview" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <FiHome className="mr-3 h-5 w-5" /> Overview
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div className="mb-4">
          <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2 ml-2">
            Tasks
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink 
                to="/tasks" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                end
              >
                <FiList className="mr-3 h-5 w-5" /> All Tasks
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/calendar" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <FiCalendar className="mr-3 h-5 w-5" /> Calendar
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div className="mb-4">
          <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2 ml-2">
            Tools
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink 
                to="/pomodoro" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <FiClock className="mr-3 h-5 w-5" /> Pomodoro Timer
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <FiSettings className="mr-3 h-5 w-5" /> Settings
        </NavLink>
      </div>
    </aside>
  );
} 