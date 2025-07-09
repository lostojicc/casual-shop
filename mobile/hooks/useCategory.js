import { useState, useEffect } from 'react';
import { getCategoryByName } from '../api/categories.js';

export function useCategory(categoryName) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryName) return;

    let isMounted = true;
    setLoading(true);
    
    getCategoryByName(categoryName)
      .then(data => {
        if (isMounted) setCategory(data);
      })
      .catch(err => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [categoryName]);

  return { category, loading, error };
}