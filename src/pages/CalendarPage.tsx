import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useApp } from '../store/AppContext';

export function CalendarPage() {
  const { tasks } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get month name
  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Get tasks for specific date
  const getTasksForDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day).toISOString().split('T')[0];
    return tasks.tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate.split('T')[0] === date;
    });
  };

  // Build calendar grid
  const buildCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const grid = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(day);
    }

    return grid;
  };

  const calendarGrid = buildCalendarGrid();

  return (
    <div className={`transition-all duration-500 ease-in-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Visualize and manage your tasks by date
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FiChevronLeft />
          </button>
          
          <h2 className="text-lg font-semibold">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
          
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FiChevronRight />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 text-center py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {day}
            </div>
          ))}
          
          {calendarGrid.map((day, index) => (
            <div 
              key={index} 
              className={`
                bg-white dark:bg-gray-800 min-h-24 p-2 
                ${day === null ? 'bg-gray-50 dark:bg-gray-750' : ''}
                ${day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() 
                  ? 'bg-blue-50 dark:bg-blue-900/10' : ''}
              `}
            >
              {day !== null && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()
                      ? 'text-blue-600 dark:text-blue-400' : ''
                  }`}>
                    {day}
                  </div>
                  
                  <div className="space-y-1">
                    {getTasksForDate(currentYear, currentMonth, day).map(task => (
                      <div 
                        key={task.id}
                        className={`
                          text-xs rounded px-1.5 py-1 truncate
                          ${task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}
                          ${task.status === 'complete' ? 'opacity-60 line-through' : ''}
                        `}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Calendar is currently in development. More features coming soon!
      </div>
    </div>
  );
} 