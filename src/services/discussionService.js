import axios from 'axios';
import { API_BASE_URL } from './api';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
};

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Discussion API endpoints
export const discussionService = {
    // Get all discussions with filters
    async getDiscussions(params = {}) {
        try {
            const response = await apiClient.get('/discussions', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching discussions:', error);
            throw error;
        }
    },

    // Get single discussion by ID
    async getDiscussionById(id) {
        try {
            console.log('🔍 Fetching discussion with ID/slug:', id);
            const response = await apiClient.get(`/discussions/${id}`);
            console.log('✅ Discussion fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching discussion:', {
                id,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                code: error.code
            });
            
            // If it's a 500/401 error or bad response, try without authentication
            if (error.response?.status === 500 || error.response?.status === 401 || error.code === 'ERR_BAD_RESPONSE') {
                console.log('🔄 Retrying without authentication...');
                try {
                    // Try again without authorization header
                    const retryResponse = await axios.get(`${API_BASE_URL}/discussions/${id}`);
                    console.log('✅ Discussion fetched successfully (retry):', retryResponse.data);
                    return retryResponse.data;
                } catch (retryError) {
                    console.error('❌ Retry also failed:', retryError.message);
                    throw error; // Throw original error
                }
            }
            
            throw error;
        }
    },

    // Create thread discussion
    async createThreadDiscussion(data) {
        try {
            const payload = {
                title: data.title,
                content: data.description,
                type: 'thread',
                category_id: data.category_id || null,
                tags: data.tags || [],
                media_url: data.media_url || null,
            };
            
            const response = await apiClient.post('/discussions', payload);
            return response.data;
        } catch (error) {
            console.error('Error creating thread discussion:', error);
            throw error;
        }
    },

    // Create national park discussion
    async createNationalParkDiscussion(data) {
        try {
            const payload = {
                type: 'national_park',
                park_name: data.parkName,
                location: data.location,
                banner_image: data.banner_image || '',
                content: data.description,
                tags: data.tags || [],
            };
            
            const response = await apiClient.post('/discussions', payload);
            return response.data;
        } catch (error) {
            console.error('Error creating national park discussion:', error);
            throw error;
        }
    },

    // Like/Unlike discussion
    async toggleLike(discussionId) {
        try {
            const response = await apiClient.post(`/discussions/${discussionId}/like`);
            return response.data;
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    },

    // Save/Unsave discussion
    async toggleSave(discussionId) {
        try {
            const response = await apiClient.post(`/discussions/${discussionId}/save`);
            return response.data;
        } catch (error) {
            console.error('Error toggling save:', error);
            throw error;
        }
    },

    // Get comments for a discussion
    async getComments(discussionId, params = {}) {
        try {
            const response = await apiClient.get(`/discussions/${discussionId}/comments`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    // Create comment
    async createComment(discussionId, content, parentId = null) {
        try {
            if (parentId) {
                // Creating a reply - use the reply endpoint
                const response = await apiClient.post(`/discussions/comments/${parentId}/reply`, {
                    content
                });
                return response.data;
            } else {
                // Creating a top-level comment
                const response = await apiClient.post(`/discussions/${discussionId}/comments`, {
                    content
                });
                return response.data;
            }
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    },

    // Like/Unlike comment
    async toggleCommentLike(discussionId, commentId) {
        try {
            const response = await apiClient.post(`/discussions/${discussionId}/comments/${commentId}/like`);
            return response.data;
        } catch (error) {
            console.error('Error toggling comment like:', error);
            throw error;
        }
    },

    // Vote on comment (like/dislike)
    async voteComment(commentId, voteType) {
        try {
            const response = await apiClient.post(`/discussions/comments/${commentId}/vote`, {
                vote_type: voteType
            });
            return response.data;
        } catch (error) {
            console.error('Error voting on comment:', error);
            throw error;
        }
    },

    // Delete comment
    async deleteComment(commentId) {
        try {
            const response = await apiClient.delete(`/discussions/comments/${commentId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    },

    // Delete discussion
    async deleteDiscussion(discussionId) {
        try {
            const response = await apiClient.delete(`/discussions/${discussionId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting discussion:', error);
            throw error;
        }
    },

    // Get categories
    async getCategories() {
        try {
            const response = await apiClient.get('/categories', {
                params: {
                    is_active: true, // Only get active categories
                    limit: 100 // Get all categories
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Upload discussion banner
    async uploadBanner(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.post('/discussions/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading banner:', error);
            throw error;
        }
    },
    // Upload discussion media (for thread posts)
    async uploadMedia(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.post('/discussions/upload-media', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading media:', error);
            throw error;
        }
    },
};

export default discussionService;