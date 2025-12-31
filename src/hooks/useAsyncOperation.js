/**
 * Custom hook for handling async operations with error handling and loading states
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import notificationService from '../services/notificationService.js';

export const useAsyncOperation = (options = {}) => {
    const {
        showSuccessNotification = false,
        showErrorNotification = true,
        successMessage = 'Operation completed successfully',
        errorContext = 'Operation failed'
    } = options;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const abortControllerRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const execute = useCallback(async (asyncFunction, ...args) => {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setError(null);

        try {
            const result = await asyncFunction(...args);

            // Check if operation was aborted
            if (abortControllerRef.current.signal.aborted) {
                return;
            }

            setData(result);

            if (showSuccessNotification) {
                notificationService.handleApiSuccess(successMessage);
            }

            return result;
        } catch (err) {
            // Check if operation was aborted
            if (abortControllerRef.current.signal.aborted) {
                return;
            }

            setError(err);

            if (showErrorNotification) {
                notificationService.handleApiError(err, errorContext);
            }

            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [showSuccessNotification, showErrorNotification, successMessage, errorContext]);

    const reset = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setData(null);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsLoading(false);
    }, []);

    return {
        execute,
        isLoading,
        error,
        data,
        reset,
        cancel
    };
};

// Hook specifically for content operations
export const useContentOperation = (contentType = 'content') => {
    return useAsyncOperation({
        showSuccessNotification: true,
        showErrorNotification: true,
        successMessage: `${contentType} operation completed successfully`,
        errorContext: `${contentType} operation failed`
    });
};

// Hook for form submissions
export const useFormSubmission = (formName = 'Form') => {
    return useAsyncOperation({
        showSuccessNotification: true,
        showErrorNotification: true,
        successMessage: `${formName} submitted successfully`,
        errorContext: `${formName} submission failed`
    });
};

export default useAsyncOperation;