/**
 * Quiz Service for Junglore Frontend
 * Handles all quiz-related API calls including fetching quizzes, submissions, and results
 */

import apiService from './api.js';

class QuizService {
    constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
        this.isLoading = false;
        this.loadingStates = new Map();
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Set loading state for specific operations
    setLoading(operation, isLoading) {
        this.loadingStates.set(operation, isLoading);
        this.isLoading = Array.from(this.loadingStates.values()).some(loading => loading);
    }

    // Get loading state for specific operation
    getLoadingState(operation) {
        return this.loadingStates.get(operation) || false;
    }

    // Cache management
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }

    // Handle API errors with user-friendly messages
    handleApiError(error, defaultMessage = 'An error occurred') {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            // Use detail from response data if available
            if (data && data.detail) {
                return { message: data.detail, status };
            }

            const messages = {
                400: 'Invalid request data',
                401: 'Authentication required. Please log in.',
                403: 'Access denied. You don\'t have permission to perform this action.',
                404: 'Quiz not found',
                422: 'Validation failed. Please check your input.',
                429: 'Too many requests. Please try again later.',
                500: 'Server error. Please try again later.'
            };

            return {
                message: messages[status] || defaultMessage,
                status
            };
        }

        if (error.request) {
            return {
                message: 'Network error. Please check your connection.',
                status: 0
            };
        }

        return {
            message: error.message || defaultMessage,
            status: null
        };
    }

    /**
     * Fetch available quizzes with filtering and pagination
     * @param {Object} params - Query parameters
     * @param {number} params.skip - Number of quizzes to skip (pagination)
     * @param {number} params.limit - Number of quizzes to return
     * @param {string} params.category_id - Filter by category UUID
     * @param {number} params.difficulty - Filter by difficulty level (1-3)
     * @param {boolean} params.active_only - Show only active quizzes
     * @returns {Promise<Array>} Array of quiz objects
     */
    async getQuizzes(params = {}) {
        const operation = 'fetch-quizzes';
        this.setLoading(operation, true);

        try {
            // Create cache key from params
            const cacheKey = `quizzes-${JSON.stringify(params)}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            const defaultParams = {
                skip: 0,
                limit: 10,
                active_only: true,
                ...params
            };

            const response = await apiService.get('/quizzes/', defaultParams);

            // Cache the response
            this.setCachedData(cacheKey, response);

            return response;
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            throw this.handleApiError(error, 'Failed to fetch quizzes');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Fetch a specific quiz by ID with full details including questions
     * @param {string} quizId - UUID of the quiz
     * @returns {Promise<Object>} Quiz object with questions
     */
    async getQuiz(quizId) {
        const operation = `fetch-quiz-${quizId}`;
        this.setLoading(operation, true);

        try {
            if (!quizId) {
                throw new Error('Quiz ID is required');
            }

            // Check cache first
            const cacheKey = `quiz-${quizId}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            const response = await apiService.get(`/quizzes/${quizId}`);

            // Cache the response
            this.setCachedData(cacheKey, response);

            return response;
        } catch (error) {
            console.error('Error fetching quiz:', error);
            throw this.handleApiError(error, 'Failed to fetch quiz details');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Submit quiz answers and get results
     * @param {string} quizId - UUID of the quiz
     * @param {Object} submission - Quiz submission data
     * @param {Array} submission.answers - Array of user answers
     * @param {number} submission.total_time_taken - Total time taken in seconds
     * @returns {Promise<Object>} Quiz result object
     */
    async submitQuiz(quizId, submission) {
        const operation = `submit-quiz-${quizId}`;
        this.setLoading(operation, true);

        try {
            if (!quizId) {
                throw new Error('Quiz ID is required');
            }

            if (!submission || !submission.answers || !Array.isArray(submission.answers)) {
                throw new Error('Valid submission with answers is required');
            }

            // Validate submission format
            const validatedSubmission = {
                answers: submission.answers.map(answer => ({
                    question_index: parseInt(answer.question_index),
                    selected_answer: parseInt(answer.selected_answer),
                    time_taken: answer.time_taken ? parseInt(answer.time_taken) : null
                })),
                total_time_taken: submission.total_time_taken ? parseInt(submission.total_time_taken) : null
            };

            const response = await apiService.post(`/quizzes/${quizId}/submit`, validatedSubmission);

            // Clear quiz cache after submission to ensure fresh data
            this.cache.delete(`quiz-${quizId}`);
            this.clearUserResultsCache();

            return response;
        } catch (error) {
            console.error('Error submitting quiz:', error);
            throw this.handleApiError(error, 'Failed to submit quiz');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get quiz results for a specific quiz
     * @param {string} quizId - UUID of the quiz
     * @param {Object} params - Query parameters
     * @param {number} params.skip - Number of results to skip
     * @param {number} params.limit - Number of results to return
     * @returns {Promise<Array>} Array of quiz result objects
     */
    async getQuizResults(quizId, params = {}) {
        const operation = `fetch-quiz-results-${quizId}`;
        this.setLoading(operation, true);

        try {
            if (!quizId) {
                throw new Error('Quiz ID is required');
            }

            const defaultParams = {
                skip: 0,
                limit: 10,
                ...params
            };

            const response = await apiService.get(`/quizzes/${quizId}/results`, defaultParams);
            return response;
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            throw this.handleApiError(error, 'Failed to fetch quiz results');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get quiz statistics (admin only)
     * @param {string} quizId - UUID of the quiz
     * @returns {Promise<Object>} Quiz statistics object
     */
    async getQuizStats(quizId) {
        const operation = `fetch-quiz-stats-${quizId}`;
        this.setLoading(operation, true);

        try {
            if (!quizId) {
                throw new Error('Quiz ID is required');
            }

            const response = await apiService.get(`/quizzes/${quizId}/stats`);
            return response;
        } catch (error) {
            console.error('Error fetching quiz stats:', error);
            throw this.handleApiError(error, 'Failed to fetch quiz statistics');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get current user's quiz history and statistics
     * @returns {Promise<Object>} User quiz history object
     */
    async getUserQuizHistory() {
        const operation = 'fetch-user-history';
        this.setLoading(operation, true);

        try {
            // Check cache first
            const cacheKey = 'user-quiz-history';
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            const response = await apiService.get('/quizzes/user/history');

            // Cache the response with shorter timeout for user data
            this.cache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
            });

            return response;
        } catch (error) {
            console.error('Error fetching user quiz history:', error);
            throw this.handleApiError(error, 'Failed to fetch quiz history');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Get quiz leaderboard
     * @param {Object} params - Query parameters
     * @param {string} params.quiz_id - Optional quiz ID for specific quiz leaderboard
     * @param {number} params.limit - Number of results to return
     * @returns {Promise<Array>} Array of top quiz results
     */
    async getLeaderboard(params = {}) {
        const operation = 'fetch-leaderboard';
        this.setLoading(operation, true);

        try {
            const defaultParams = {
                limit: 10,
                ...params
            };

            const response = await apiService.get('/quizzes/leaderboard', defaultParams);
            return response;
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            throw this.handleApiError(error, 'Failed to fetch leaderboard');
        } finally {
            this.setLoading(operation, false);
        }
    }

    /**
     * Check if user has completed a specific quiz
     * @param {string} quizId - UUID of the quiz
     * @returns {Promise<boolean>} True if user has completed the quiz
     */
    async hasUserCompletedQuiz(quizId) {
        try {
            if (!quizId) {
                return false;
            }

            const history = await this.getUserQuizHistory();

            if (history && history.results) {
                return history.results.some(result => result.quiz_id === quizId);
            }

            return false;
        } catch (error) {
            console.error('Error checking quiz completion:', error);
            // Return false on error to allow quiz attempt
            return false;
        }
    }

    /**
     * Get user's result for a specific quiz
     * @param {string} quizId - UUID of the quiz
     * @returns {Promise<Object|null>} User's quiz result or null if not completed
     */
    async getUserQuizResult(quizId) {
        try {
            if (!quizId) {
                return null;
            }

            const history = await this.getUserQuizHistory();

            if (history && history.results) {
                return history.results.find(result => result.quiz_id === quizId) || null;
            }

            return null;
        } catch (error) {
            console.error('Error fetching user quiz result:', error);
            return null;
        }
    }

    /**
     * Get quizzes by category
     * @param {string} categoryId - UUID of the category
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Array>} Array of quiz objects
     */
    async getQuizzesByCategory(categoryId, params = {}) {
        return this.getQuizzes({
            category_id: categoryId,
            ...params
        });
    }

    /**
     * Get quizzes by difficulty level
     * @param {number} difficulty - Difficulty level (1-3)
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Array>} Array of quiz objects
     */
    async getQuizzesByDifficulty(difficulty, params = {}) {
        return this.getQuizzes({
            difficulty,
            ...params
        });
    }

    /**
     * Search quizzes by title or description
     * Note: This is a client-side search since the API doesn't have a search endpoint
     * @param {string} query - Search query
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Array>} Array of matching quiz objects
     */
    async searchQuizzes(query, params = {}) {
        try {
            const quizzes = await this.getQuizzes(params);

            if (!query || !query.trim()) {
                return quizzes;
            }

            const searchTerm = query.toLowerCase().trim();

            return quizzes.filter(quiz =>
                quiz.title.toLowerCase().includes(searchTerm) ||
                (quiz.description && quiz.description.toLowerCase().includes(searchTerm))
            );
        } catch (error) {
            console.error('Error searching quizzes:', error);
            throw this.handleApiError(error, 'Failed to search quizzes');
        }
    }

    /**
     * Clear user-specific cache (call after login/logout)
     */
    clearUserResultsCache() {
        this.cache.delete('user-quiz-history');
        // Clear any other user-specific cached data
        for (const [key] of this.cache) {
            if (key.includes('user-') || key.includes('results-')) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Get service statistics
     * @returns {Object} Service statistics
     */
    getServiceStats() {
        return {
            cacheSize: this.cache.size,
            loadingOperations: this.loadingStates.size,
            isLoading: this.isLoading
        };
    }

    /**
     * Validate quiz submission before sending to API
     * @param {Object} submission - Quiz submission data
     * @param {Array} questions - Quiz questions for validation
     * @returns {Object} Validation result
     */
    validateSubmission(submission, questions) {
        const errors = [];

        if (!submission || typeof submission !== 'object') {
            errors.push('Submission must be an object');
            return { isValid: false, errors };
        }

        if (!submission.answers || !Array.isArray(submission.answers)) {
            errors.push('Answers must be an array');
            return { isValid: false, errors };
        }

        if (submission.answers.length === 0) {
            errors.push('At least one answer is required');
            return { isValid: false, errors };
        }

        // Validate each answer
        submission.answers.forEach((answer, index) => {
            if (typeof answer.question_index !== 'number' || answer.question_index < 0) {
                errors.push(`Answer ${index + 1}: Invalid question index`);
            }

            if (typeof answer.selected_answer !== 'number' || answer.selected_answer < 0) {
                errors.push(`Answer ${index + 1}: Invalid selected answer`);
            }

            // Validate against questions if provided
            if (questions && questions.length > 0) {
                const question = questions[answer.question_index];
                if (!question) {
                    errors.push(`Answer ${index + 1}: Question not found`);
                } else if (answer.selected_answer >= question.options.length) {
                    errors.push(`Answer ${index + 1}: Selected answer out of range`);
                }
            }
        });

        // Check for duplicate question indices
        const questionIndices = submission.answers.map(a => a.question_index);
        const uniqueIndices = new Set(questionIndices);
        if (questionIndices.length !== uniqueIndices.size) {
            errors.push('Duplicate answers for the same question are not allowed');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// Create singleton instance
const quizService = new QuizService();
export default quizService;