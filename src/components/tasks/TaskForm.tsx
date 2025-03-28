import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiTag, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { Task } from '../../hooks/useTasks';
import { useApp } from '../../store/AppContext';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isSubmitting?: boolean;
}

export function TaskForm({ task, onSubmit, isSubmitting = false }: TaskFormProps) {
  const { tags } = useApp();
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<Task['status']>(task?.status || 'pending');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags || []);
  const [timeEstimate, setTimeEstimate] = useState<number | null>(task?.timeEstimate || null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [animateIn, setAnimateIn] = useState(false);
  
  // Animation effect
  useEffect(() => {
    setAnimateIn(true);
  }, []);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (dueDate && new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }
    
    if (timeEstimate !== null && timeEstimate <= 0) {
      newErrors.timeEstimate = 'Time estimate must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const taskData = {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null,
        tags: selectedTags,
        timeEstimate: timeEstimate,
        timeSpent: task?.timeSpent || null,
        subtasks: task?.subtasks || [],
      };
      
      onSubmit(taskData);
    }
  };
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  return (
    <form onSubmit={handleSubmit} className={`transition-all duration-500 ease-in-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Color bar based on priority */}
        <div className={`h-1.5 ${
          priority === 'high' ? 'bg-red-500' : 
          priority === 'medium' ? 'bg-yellow-500' : 
          'bg-green-500'
        } transition-colors duration-300`}></div>
        
        <div className="p-6">
          {/* Title field */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`input-field text-lg font-medium ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="What needs to be done?"
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <FiAlertCircle className="mr-1" /> {errors.title}
              </p>
            )}
          </div>
          
          {/* Description field */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field h-32"
              placeholder="Add details about this task..."
            />
          </div>
          
          {/* Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="status" className="form-label">Status</label>
              <div className="flex space-x-2">
                {(['pending', 'in-progress', 'completed'] as Task['status'][]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center transition-colors ${
                      status === s
                        ? s === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : s === 'in-progress' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {status === s && <FiCheck className="mr-1" />}
                    {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="priority" className="form-label">Priority</label>
              <div className="flex space-x-2">
                {(['low', 'medium', 'high'] as Task['priority'][]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center transition-colors ${
                      priority === p
                        ? p === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                          : p === 'medium' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {priority === p && <FiCheck className="mr-1" />}
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Due date & Time estimate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="due-date" className="form-label flex items-center">
                <FiCalendar className="mr-2 text-gray-500" /> Due Date
              </label>
              <input
                type="date"
                id="due-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`input-field ${errors.dueDate ? 'border-red-500 dark:border-red-500' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.dueDate}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="time-estimate" className="form-label flex items-center">
                <FiClock className="mr-2 text-gray-500" /> Time Estimate (minutes)
              </label>
              <input
                type="number"
                id="time-estimate"
                value={timeEstimate === null ? '' : timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value ? parseInt(e.target.value) : null)}
                className={`input-field ${errors.timeEstimate ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Optional"
                min="1"
              />
              {errors.timeEstimate && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.timeEstimate}
                </p>
              )}
            </div>
          </div>
          
          {/* Tags */}
          {tags.tags.length > 0 && (
            <div className="mb-6">
              <label className="form-label flex items-center mb-2">
                <FiTag className="mr-2 text-gray-500" /> Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {selectedTags.includes(tag.id) && <FiCheck className="inline mr-1" />}
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Submit button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="btn-primary px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span>Save Task</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}