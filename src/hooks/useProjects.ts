import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import * as localStorage from '../utils/localStorage';
import { generateId } from '../utils/helpers';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects from localStorage on component mount
  useEffect(() => {
    try {
      const savedProjects = localStorage.getProjects();
      setProjects(savedProjects);
      setError(null);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setProjects(projects);
      } catch (err) {
        console.error('Error saving projects:', err);
        setError('Failed to save projects');
      }
    }
  }, [projects, loading]);

  // Create a new project
  const createProject = useCallback((projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects(prevProjects => [...prevProjects, newProject]);
    return newProject;
  }, []);

  // Update an existing project
  const updateProject = useCallback((projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : project
      )
    );
  }, []);

  // Delete a project
  const deleteProject = useCallback((projectId: string) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
} 