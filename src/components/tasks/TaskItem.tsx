import { useState } from 'react';
import { 
  FiEdit2, 
  FiTrash2, 
  FiCheckSquare, 
  FiSquare, 
  FiClock, 
  FiCalendar, 
  FiChevronDown, 
  FiChevronRight, 
  FiMoreVertical 
} from 'react-icons/fi';
import { Task } from '../../types';
import { formatDate, isTaskOverdue, isTaskDueToday } from '../../utils/helpers';
import { useApp } from '../../store/AppContext';

interface TaskItemProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const { tasks } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isOverdue = isTaskOverdue(task);
  const isDueToday = isTaskDueToday(task);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    tasks.toggleTaskCompletion(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(task.id);
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-3 transition-all ${
        task.completed ? 'opacity-70' : ''
      } ${
        `task-priority-${task.priority}`
      } ${
        `task-status-${task.status}`
      }`}
    >
      <div 
        className="px-4 py-3 flex items-center cursor-pointer"
        onClick={toggleExpanded}
      >
        <button 
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mr-3"
          onClick={handleToggleComplete}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <FiCheckSquare className="h-5 w-5 text-green-500" />
          ) : (
            <FiSquare className="h-5 w-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-md font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {task.title}
            </h3>
            
            {task.dueDate && (
              <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                isOverdue 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                  : isDueToday 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
                <FiCalendar className="mr-1 h-3 w-3" />
                {formatDate(task.dueDate, 'MMM dd')}
              </span>
            )}
            
            {task.estimatedTime && (
              <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                <FiClock className="mr-1 h-3 w-3" />
                {task.estimatedTime}m
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {task.tags.length > 0 && task.tags.map(tag => (
              <span key={tag} className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center ml-2">
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Task options"
            >
              <FiMoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FiEdit2 className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                  >
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleExpanded}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-1"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <FiChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <FiChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
            {task.description || "No description provided."}
          </p>
          
          {task.notes && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Notes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {task.notes}
              </p>
            </div>
          )}
          
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div>
              Created: {formatDate(task.createdAt)}
            </div>
            <div>
              Updated: {formatDate(task.updatedAt)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 