import { useState } from 'react';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  
  return {
    tags,
    // Placeholder for future implementation
  };
} 