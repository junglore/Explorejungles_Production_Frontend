/**
 * API Service for Junglore Backend Integration
 * Handles all HTTP requests to the FastAPI backend with comprehensive error handling
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// Error types for better error handling
export const ErrorTypes = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Custom API Error class
export class ApiError extends Error {
    constructor(message, type, status = null, details = null) {
        super(message);
        this.name = 'ApiError';
        this.type = type;
        this.status = status;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('access_token');
        this.requestTimeout = 30000; // 30 seconds
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
        this.errorHandlers = new Map();
        this.requestInterceptors = [];
        this.responseInterceptors = [];
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
        }
    }

    // Get authentication token
    getToken() {
        return this.token || localStorage.getItem('access_token');
    }

    // Clear authentication
    clearAuth() {
        this.token = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }

    // Add request interceptor
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }

    // Add response interceptor
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }

    // Add error handler for specific error types
    addErrorHandler(errorType, handler) {
        this.errorHandlers.set(errorType, handler);
    }

    // Handle errors with custom handlers
    async handleError(error) {
        const handler = this.errorHandlers.get(error.type);
        if (handler) {
            try {
                await handler(error);
            } catch (handlerError) {
                console.error('Error handler failed:', handlerError);
            }
        }
        return error;
    }

    // Create timeout promise
    createTimeoutPromise(timeout) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new ApiError(
                    'Request timeout',
                    ErrorTypes.TIMEOUT_ERROR,
                    408
                ));
            }, timeout);
        });
    }

    // Retry logic for failed requests
    async retryRequest(requestFn, attempts = this.retryAttempts, endpoint = '') {
        for (let i = 0; i < attempts; i++) {
            try {
                return await requestFn();
            } catch (error) {
                // Don't retry on authentication or validation errors
                if (error.type === ErrorTypes.AUTHENTICATION_ERROR ||
                    error.type === ErrorTypes.AUTHORIZATION_ERROR ||
                    error.type === ErrorTypes.VALIDATION_ERROR ||
                    error.status === 400 || error.status === 401 || error.status === 403) {
                    throw error;
                }

                // Don't retry file uploads - they usually fail due to backend config issues
                if (endpoint && endpoint.includes('/upload')) {
                    throw error;
                }

                // Last attempt, throw the error
                if (i === attempts - 1) {
                    throw error;
                }

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)));
            }
        }
    }

    // Parse error response
    async parseErrorResponse(response) {
        let errorData = {};
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
            } else {
                errorData = { detail: await response.text() };
            }
        } catch (parseError) {
            errorData = { detail: 'Failed to parse error response' };
        }
        return errorData;
    }

    // Create API error from response
    async createApiError(response) {
        const errorData = await this.parseErrorResponse(response);
        const status = response.status;

        let errorType;
        let message;

        switch (status) {
            case 400:
                errorType = ErrorTypes.VALIDATION_ERROR;
                message = errorData.detail || 'Invalid request data';
                break;
            case 401:
                errorType = ErrorTypes.AUTHENTICATION_ERROR;
                message = 'Authentication required. Please log in.';
                break;
            case 403:
                errorType = ErrorTypes.AUTHORIZATION_ERROR;
                message = 'Access denied. You don\'t have permission to perform this action.';
                break;
            case 404:
                errorType = ErrorTypes.NOT_FOUND_ERROR;
                message = errorData.detail || 'The requested resource was not found';
                break;
            case 422:
                errorType = ErrorTypes.VALIDATION_ERROR;
                message = 'Validation failed. Please check your input.';
                break;
            case 429:
                errorType = ErrorTypes.SERVER_ERROR;
                message = 'Too many requests. Please try again later.';
                break;
            case 500:
            case 502:
            case 503:
            case 504:
                errorType = ErrorTypes.SERVER_ERROR;
                message = 'Server error. Please try again later.';
                break;
            default:
                errorType = ErrorTypes.UNKNOWN_ERROR;
                message = errorData.detail || `HTTP error! status: ${status}`;
        }

        return new ApiError(message, errorType, status, errorData);
    }

    // Generic request method with comprehensive error handling
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();

        // Build headers - don't set Content-Type for FormData
        const headers = {};
        
        // Only set Content-Type for non-FormData requests
        if (!options.isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        
        // Merge with custom headers
        Object.assign(headers, options.headers || {});

        let config = {
            headers,
            ...options,
        };

        // Remove isFormData flag from config as it's not a valid fetch option
        delete config.isFormData;

        // Add authorization header if token exists
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Apply request interceptors
        for (const interceptor of this.requestInterceptors) {
            config = await interceptor(config);
        }

        const requestFn = async () => {
            try {
                // Create request with timeout
                const fetchPromise = fetch(url, config);
                const timeoutPromise = this.createTimeoutPromise(this.requestTimeout);

                const response = await Promise.race([fetchPromise, timeoutPromise]);

                // Handle authentication errors
                if (response.status === 401) {
                    this.clearAuth();
                    const error = new ApiError(
                        'Authentication required. Please log in.',
                        ErrorTypes.AUTHENTICATION_ERROR,
                        401
                    );
                    await this.handleError(error);

                    // Only redirect to login if not already on auth pages
                    const authPages = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
                    const isAuthPage = authPages.some(page => window.location.pathname.includes(page));
                    
                    if (!isAuthPage) {
                        window.location.href = '/login';
                    }
                    throw error;
                }

                // Handle other HTTP errors
                if (!response.ok) {
                    const error = await this.createApiError(response);
                    await this.handleError(error);
                    throw error;
                }

                // Parse successful response
                let responseData;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    responseData = await response.json();
                } else {
                    responseData = response;
                }

                // Apply response interceptors
                for (const interceptor of this.responseInterceptors) {
                    responseData = await interceptor(responseData);
                }

                return responseData;

            } catch (error) {
                // Handle network errors
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    const networkError = new ApiError(
                        'Network error. Please check your internet connection.',
                        ErrorTypes.NETWORK_ERROR
                    );
                    await this.handleError(networkError);
                    throw networkError;
                }

                // Re-throw API errors
                if (error instanceof ApiError) {
                    throw error;
                }

                // Handle unknown errors
                const unknownError = new ApiError(
                    error.message || 'An unexpected error occurred',
                    ErrorTypes.UNKNOWN_ERROR
                );
                await this.handleError(unknownError);
                throw unknownError;
            }
        };

        // Retry the request if needed
        return this.retryRequest(requestFn, this.retryAttempts, endpoint);
    }

    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PUT request
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // PATCH request
    async patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Form data request (for file uploads)
    async postFormData(endpoint, formData) {
        return this.request(endpoint, {
            method: 'POST',
            body: formData,
            isFormData: true, // Flag to prevent Content-Type header
        });
    }

    // PUT form data request
    async putFormData(endpoint, formData) {
        return this.request(endpoint, {
            method: 'PUT',
            body: formData,
            isFormData: true, // Flag to prevent Content-Type header
        });
    }

    // PATCH form data request
    async patchFormData(endpoint, formData) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: formData,
            isFormData: true, // Flag to prevent Content-Type header
        });
    }

    // Health check endpoint
    async healthCheck() {
        try {
            const response = await this.get('/health');
            return { status: 'healthy', data: response };
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    }

    // Get error statistics
    getErrorStats() {
        return {
            handlers: this.errorHandlers.size,
            interceptors: {
                request: this.requestInterceptors.length,
                response: this.responseInterceptors.length
            }
        };
    }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;