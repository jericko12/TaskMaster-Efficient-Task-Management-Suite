import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

interface CreateTaskButtonProps {
  variant?: 'fixed' | 'inline';
  label?: string;
}

export function CreateTaskButton({ 
  variant = 'fixed', 
  label = 'New Task'
}: CreateTaskButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (variant === 'inline') {
    return (
      <Link
        to="/tasks/create"
        className="btn-primary inline-flex items-center"
      >
        <FiPlus className="mr-2" /> {label}
      </Link>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Link
        to="/tasks/create"
        className="flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Create new task"
      >
        <FiPlus className="w-6 h-6" />
      </Link>
      
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-4 rounded-lg shadow-md whitespace-nowrap text-sm font-medium animate-fade-in">
          Create Task
        </div>
      )}
    </div>
  );
} 