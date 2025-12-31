/**
 * Loading Context
 * Provides global loading state management and user feedback
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import notificationService from '../services/notificationService.js';

// Loading action types
const LOADING_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_OPERATION_LOADING: 'SET_OPERATION_LOADING',
    CLEAR_OPERATION_LOADING: 'CLEAR_OPERATION_LOADING',
    CLEAR_ALL_LOADING: 'CLEAR_ALL_LOADING',
    SET_PROGRESS: 'SET_PROGRESS',
    CLEAR_PROGRESS: 'CLEAR_PROGRESS'
};

// Initial state
const initialState = {
    isGlobalLoading: false,
    operations: new Map(),
    progress: new Map()
};

// Reducer
const loadingReducer = (state, action) => {
    switch (action.type) {
        case LOADING_ACTIONS.SET_LOADING:
            return {
                ...state,
                isGlobalLoading: action.payload
            };

        case LOADING_ACTIONS.SET_OPERATION_LOADING:
            const newOperations = new Map(state.operations);
            newOperations.set(action.payload.operation, {
                isLoading: true,
                message: action.payload.message,
                startTime: Date.now()
            });
            return {
                ...state,
                operations: newOperations
            };

        case LOADING_ACTIONS.CLEAR_OPERATION_LOADING:
            const clearedOperations = new Map(state.operations);
            clearedOperations.delete(action.payload);
            return {
                ...state,
                operations: clearedOperations
            };

        case LOADING_ACTIONS.CLEAR_ALL_LOADING:
            return {
                ...state,
                isGlobalLoading: false,
                operations: new Map(),
                progress: new Map()
            };

        case LOADING_ACTIONS.SET_PROGRESS:
            const newProgress = new Map(state.progress);
            newProgress.set(action.payload.operation, action.payload.progress);
            return {
                ...state,
                progress: newProgress
            };

        case LOADING_ACTIONS.CLEAR_PROGRESS:
            const clearedProgress = new Map(state.progress);
            clearedProgress.delete(action.payload);
            return {
                ...state,
                progress: clearedProgress
            };

        default:
            return state;
    }
};

// Create context
const LoadingContext = createContext();

// Provider component
export const LoadingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(loadingReducer, initialState);

    // Set global loading state
    const setGlobalLoading = useCallback((isLoading) => {
        dispatch({
            type: LOADING_ACTIONS.SET_LOADING,
            payload: isLoading
        });
    }, []);

    // Set operation-specific loading state
    const setOperationLoading = useCallback((operation, isLoading, message = null) => {
        if (isLoading) {
            dispatch({
                type: LOADING_ACTIONS.SET_OPERATION_LOADING,
                payload: { operation, message }
            });
        } else {
            dispatch({
                type: LOADING_ACTIONS.CLEAR_OPERATION_LOADING,
                payload: operation
            });
        }
    }, []);

    // Set progress for operation
    const setProgress = useCallback((operation, progress) => {
        dispatch({
            type: LOADING_ACTIONS.SET_PROGRESS,
            payload: { operation, progress }
        });
    }, []);

    // Clear progress for operation
    const clearProgress = useCallback((operation) => {
        dispatch({
            type: LOADING_ACTIONS.CLEAR_PROGRESS,
            payload: operation
        });
    }, []);

    // Clear all loading states
    const clearAllLoading = useCallback(() => {
        dispatch({ type: LOADING_ACTIONS.CLEAR_ALL_LOADING });
    }, []);

    // Check if any operation is loading
    const isAnyLoading = useCallback(() => {
        return state.isGlobalLoading || state.operations.size > 0;
    }, [state.isGlobalLoading, state.operations]);

    // Check if specific operation is loading
    const isOperationLoading = useCallback((operation) => {
        return state.operations.has(operation);
    }, [state.operations]);

    // Get operation loading info
    const getOperationInfo = useCallback((operation) => {
        return state.operations.get(operation);
    }, [state.operations]);

    // Get operation progress
    const getProgress = useCallback((operation) => {
        return state.progress.get(operation);
    }, [state.progress]);

    // Wrap async function with loading state and error handling
    const withLoading = useCallback(async (
        asyncFn,
        operation = null,
        options = {}
    ) => {
        const {
            showSuccessNotification = false,
            showErrorNotification = true,
            successMessage = 'Operation completed successfully',
            errorMessage = 'Operation failed',
            loadingMessage = null
        } = options;

        try {
            if (operation) {
                setOperationLoading(operation, true, loadingMessage);
            } else {
                setGlobalLoading(true);
            }

            const result = await asyncFn();

            if (showSuccessNotification) {
                notificationService.success(successMessage);
            }

            return result;
        } catch (error) {
            console.error('Operation failed:', error);

            if (showErrorNotification) {
                notificationService.handleApiError(error, errorMessage);
            }

            throw error;
        } finally {
            if (operation) {
                setOperationLoading(operation, false);
                clearProgress(operation);
            } else {
                setGlobalLoading(false);
            }
        }
    }, [setGlobalLoading, setOperationLoading, clearProgress]);

    // Wrap async function with progress tracking
    const withProgress = useCallback(async (
        asyncFn,
        operation,
        options = {}
    ) => {
        const {
            showSuccessNotification = true,
            showErrorNotification = true,
            successMessage = 'Upload completed successfully',
            errorMessage = 'Upload failed'
        } = options;

        try {
            setOperationLoading(operation, true, 'Processing...');

            const result = await asyncFn((progress) => {
                setProgress(operation, progress);
            });

            if (showSuccessNotification) {
                notificationService.success(successMessage);
            }

            return result;
        } catch (error) {
            console.error('Operation with progress failed:', error);

            if (showErrorNotification) {
                notificationService.handleApiError(error, errorMessage);
            }

            throw error;
        } finally {
            setOperationLoading(operation, false);
            clearProgress(operation);
        }
    }, [setOperationLoading, setProgress, clearProgress]);

    // Get loading statistics
    const getLoadingStats = useCallback(() => {
        return {
            isGlobalLoading: state.isGlobalLoading,
            activeOperations: state.operations.size,
            operationsWithProgress: state.progress.size,
            operations: Array.from(state.operations.keys()),
            isAnyLoading: isAnyLoading()
        };
    }, [state, isAnyLoading]);

    const value = {
        // State
        isGlobalLoading: state.isGlobalLoading,
        operations: state.operations,
        progress: state.progress,

        // Actions
        setGlobalLoading,
        setOperationLoading,
        setProgress,
        clearProgress,
        clearAllLoading,

        // Utilities
        isAnyLoading,
        isOperationLoading,
        getOperationInfo,
        getProgress,
        withLoading,
        withProgress,
        getLoadingStats
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};

// Hook to use loading context
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

// Hook for specific operation loading
export const useOperationLoading = (operation) => {
    const { isOperationLoading, setOperationLoading, getOperationInfo, getProgress } = useLoading();

    return {
        isLoading: isOperationLoading(operation),
        setLoading: (loading, message) => setOperationLoading(operation, loading, message),
        info: getOperationInfo(operation),
        progress: getProgress(operation)
    };
};

export default LoadingContext;