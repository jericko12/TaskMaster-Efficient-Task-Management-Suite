import { useState, useEffect, useCallback } from 'react';
import { Category } from '../types';
import * as localStorage from '../utils/localStorage';
import { generateId } from '../utils/helpers';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories from localStorage on component mount
  useEffect(() => {
    try {
      const savedCategories = localStorage.getCategories();
      setCategories(savedCategories);
      setError(null);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setCategories(categories);
      } catch (err) {
        console.error('Error saving categories:', err);
        setError('Failed to save categories');
      }
    }
  }, [categories, loading]);

  // Create a new category
  const createCategory = useCallback((name: string, color?: string) => {
    const newCategory: Category = {
      id: generateId(),
      name,
      color
    };

    setCategories(prevCategories => [...prevCategories, newCategory]);
    return newCategory;
  }, []);

  // Update an existing category
  const updateCategory = useCallback((categoryId: string, updates: Partial<Omit<Category, 'id'>>) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === categoryId 
          ? { 
              ...category, 
              ...updates
            } 
          : category
      )
    );
  }, []);

  // Delete a category
  const deleteCategory = useCallback((categoryId: string) => {
    setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  };
} 