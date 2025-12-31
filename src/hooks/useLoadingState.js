/**
 * Custom hook for managing loading states
 */

import { useState, useCallback, useRef } from 'react';

export const useLoadingState = (initialState = false) => {
    const [isLoading, setIsLoading] = useState(initialState);
    const [loadingStates, setLoadingStates] = useState(new Map());
    const timeoutRef = useRef(null);

    // Set global loading state
    const setLoading = useCallback((loading) => {
        setIsLoading(loading);
    }, []);

    // Set loading state for specific operation
    const setOperationLoading = useCallback((operation, loading) => {
        setLoadingStates(prev => {
            const newStates = new Map(prev);
            if (loading) {
                newStates.set(operation, true);
            } else {
                newStates.delete(operation);
            }
            return newStates;
        });
    }, []);

    // Check if any operation is loading
    const isAnyLoading = useCallback(() => {
        return isLoading || loadingStates.size > 0;
    }, [isLoading, loadingStates]);

    // Check if specific operation is loading
    const isOperationLoading = useCallback((operation) => {
        return loadingStates.has(operation);
    }, [loadingStates]);

    // Set loading with minimum duration to prevent flashing
    const setLoadingWithMinDuration = useCallback((loading, minDuration = 500) => {
        if (loading) {
            setIsLoading(true);
        } else {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setIsLoading(false);
            }, minDuration);
        }
    }, []);

    // Wrap async function with loading state
    const withLoading = useCallback(async (asyncFn, operation = null) => {
        try {
            if (operation) {
                setOperationLoading(operation, true);
            } else {
                setLoading(true);
            }

            const result = await asyncFn();
            return result;
        } finally {
            if (operation) {
                setOperationLoading(operation, false);
            } else {
                setLoading(false);
            }
        }
    }, [setLoading, setOperationLoading]);

    // Clear all loading states
    const clearAllLoading = useCallback(() => {
        setIsLoading(false);
        setLoadingStates(new Map());
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return {
        isLoading,
        isAnyLoading: isAnyLoading(),
        setLoading,
        setLoadingWithMinDuration,
        setOperationLoading,
        isOperationLoading,
        withLoading,
        clearAllLoading,
        loadingOperations: Array.from(loadingStates.keys())
    };
};

// Hook for managing multiple loading states with categories
export const useCategorizedLoading = () => {
    const [loadingCategories, setLoadingCategories] = useState(new Map());

    const setLoading = useCallback((category, operation, loading) => {
        setLoadingCategories(prev => {
            const newCategories = new Map(prev);

            if (!newCategories.has(category)) {
                newCategories.set(category, new Set());
            }

            const operations = newCategories.get(category);

            if (loading) {
                operations.add(operation);
            } else {
                operations.delete(operation);

                // Remove category if no operations are loading
                if (operations.size === 0) {
                    newCategories.delete(category);
                }
            }

            return newCategories;
        });
    }, []);

    const isLoading = useCallback((category = null, operation = null) => {
        if (category && operation) {
            return loadingCategories.get(category)?.has(operation) || false;
        }

        if (category) {
            return loadingCategories.has(category) && loadingCategories.get(category).size > 0;
        }

        return loadingCategories.size > 0;
    }, [loadingCategories]);

    const getLoadingOperations = useCallback((category) => {
        return Array.from(loadingCategories.get(category) || []);
    }, [loadingCategories]);

    const clearCategory = useCallback((category) => {
        setLoadingCategories(prev => {
            const newCategories = new Map(prev);
            newCategories.delete(category);
            return newCategories;
        });
    }, []);

    const clearAll = useCallback(() => {
        setLoadingCategories(new Map());
    }, []);

    return {
        setLoading,
        isLoading,
        getLoadingOperations,
        clearCategory,
        clearAll,
        categories: Array.from(loadingCategories.keys())
    };
};

export default useLoadingState;