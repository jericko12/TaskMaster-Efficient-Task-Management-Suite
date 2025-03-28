import { createContext, ReactNode, useContext } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';
import { useSettings } from '../hooks/useSettings';

// Create a context with default empty values
const AppContext = createContext<ReturnType<typeof useAppState>>({} as ReturnType<typeof useAppState>);

// Custom hook that combines all our state management hooks
function useAppState() {
  const tasks = useTasks();
  const projects = useProjects();
  const categories = useCategories();
  const tags = useTags();
  const settings = useSettings();

  return {
    tasks,
    projects,
    categories,
    tags,
    settings,
  };
}

// Provider component that wraps the app and provides state
export function AppProvider({ children }: { children: ReactNode }) {
  const state = useAppState();

  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 