import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { Task } from '../../types';
import { TaskItem } from './TaskItem';
import { useApp } from '../../store/AppContext';

interface TaskListProps {
  title: string;
  tasks: Task[];
  emptyMessage?: string;
  collapsible?: boolean;
  initiallyCollapsed?: boolean;
}

export function TaskList({ 
  title, 
  tasks, 
  emptyMessage = "No tasks found", 
  collapsible = true,
  initiallyCollapsed = false
}: TaskListProps) {
  const navigate = useNavigate();
  const { tasks: taskActions } = useApp();
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  
  const toggleCollapsed = () => {
    if (collapsible) {
      setCollapsed(!collapsed);
    }
  };

  const handleEditTask = (id: string) => {
    navigate(`/tasks/${id}/edit`);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      taskActions.deleteTask(id);
    }
  };

  return (
    <div className="mb-6">
      <div 
        className={`flex items-center ${collapsible ? 'cursor-pointer' : ''} mb-3`}
        onClick={toggleCollapsed}
      >
        {collapsible && (
          <button className="mr-2 text-gray-500 dark:text-gray-400">
            {collapsed ? (
              <FiChevronRight className="h-5 w-5" />
            ) : (
              <FiChevronDown className="h-5 w-5" />
            )}
          </button>
        )}
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          ({tasks.length})
        </span>
      </div>

      {!collapsed && (
        <div>
          {tasks.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              {emptyMessage}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onEdit={handleEditTask} 
                onDelete={handleDeleteTask} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
} 