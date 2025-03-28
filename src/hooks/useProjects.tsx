import { useState } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  
  return {
    projects,
    // Placeholder for future implementation
  };
} 