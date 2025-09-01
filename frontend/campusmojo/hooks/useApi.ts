import { useState, useCallback } from 'react';
import { LoadingState } from '../types';

interface UseApiState<T> extends LoadingState {
  data: T | null;
}

export const useApi = <T>(initialData: T | null = null) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await apiCall();
      
      setState({
        data: result,
        loading: false,
        error: null,
      });

      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'API call failed';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
};
