import { useState } from 'react';

export interface Category {
  id: string;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  
  return {
    categories,
    // Placeholder for future implementation
  };
} 