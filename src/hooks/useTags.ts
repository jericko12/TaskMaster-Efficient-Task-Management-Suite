import { useState, useEffect, useCallback } from 'react';
import { Tag } from '../types';
import * as localStorage from '../utils/localStorage';
import { generateId } from '../utils/helpers';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tags from localStorage on component mount
  useEffect(() => {
    try {
      const savedTags = localStorage.getTags();
      setTags(savedTags);
      setError(null);
    } catch (err) {
      console.error('Error loading tags:', err);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setTags(tags);
      } catch (err) {
        console.error('Error saving tags:', err);
        setError('Failed to save tags');
      }
    }
  }, [tags, loading]);

  // Create a new tag
  const createTag = useCallback((name: string, color?: string) => {
    const newTag: Tag = {
      id: generateId(),
      name,
      color
    };

    setTags(prevTags => [...prevTags, newTag]);
    return newTag;
  }, []);

  // Update an existing tag
  const updateTag = useCallback((tagId: string, updates: Partial<Omit<Tag, 'id'>>) => {
    setTags(prevTags => 
      prevTags.map(tag => 
        tag.id === tagId 
          ? { 
              ...tag, 
              ...updates
            } 
          : tag
      )
    );
  }, []);

  // Delete a tag
  const deleteTag = useCallback((tagId: string) => {
    setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
  }, []);

  // Get tag by id
  const getTagById = useCallback((tagId: string) => {
    return tags.find(tag => tag.id === tagId);
  }, [tags]);

  // Get tag by name
  const getTagByName = useCallback((name: string) => {
    return tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
  }, [tags]);

  return {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    getTagById,
    getTagByName
  };
} 