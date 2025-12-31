/**
 * Notification Service for User Feedback
 * Handles both local UI notifications and backend persisted notifications
 */

import apiService, { API_BASE_URL } from './api';

class NotificationService {
    constructor() {
        this.notifications = [];
        this.listeners = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000; // 5 seconds
        
        // Backend notification state
        this.backendNotifications = [];
        this.unreadCount = 0;
        this.backendListeners = [];
        this.pollingInterval = null;
    }

    // Add notification listener
    addListener(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback([...this.notifications]);
            } catch (error) {
                console.error('Notification listener error:', error);
            }
        });
    }

    // Add notification
    addNotification(notification) {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            timestamp: new Date().toISOString(),
            duration: this.defaultDuration,
            ...notification
        };

        this.notifications.unshift(newNotification);

        // Limit number of notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }

        this.notifyListeners();

        // Auto-remove notification after duration
        if (newNotification.duration > 0) {
            setTimeout(() => {
                this.removeNotification(id);
            }, newNotification.duration);
        }

        return id;
    }

    // Remove notification
    removeNotification(id) {
        this.notifications = this.notifications.filter(notification => notification.id !== id);
        this.notifyListeners();
    }

    // Clear all notifications
    clearAll() {
        this.notifications = [];
        this.notifyListeners();
    }

    // Show success notification
    success(message, options = {}) {
        return this.addNotification({
            type: 'success',
            message,
            title: options.title || 'Success',
            ...options
        });
    }

    // Show error notification
    error(message, options = {}) {
        return this.addNotification({
            type: 'error',
            message,
            title: options.title || 'Error',
            duration: options.duration || 8000, // Longer duration for errors
            ...options
        });
    }

    // Show warning notification
    warning(message, options = {}) {
        return this.addNotification({
            type: 'warning',
            message,
            title: options.title || 'Warning',
            ...options
        });
    }

    // Show info notification
    info(message, options = {}) {
        return this.addNotification({
            type: 'info',
            message,
            title: options.title || 'Information',
            ...options
        });
    }

    // Show loading notification
    loading(message, options = {}) {
        return this.addNotification({
            type: 'loading',
            message,
            title: options.title || 'Loading',
            duration: 0, // Don't auto-remove loading notifications
            ...options
        });
    }

    // Update existing notification
    updateNotification(id, updates) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            Object.assign(notification, updates);
            this.notifyListeners();
        }
    }

    // Handle API errors with user-friendly messages
    handleApiError(error, context = '') {
        let message = 'An unexpected error occurred';
        let title = 'Error';

        if (error.type) {
            switch (error.type) {
                case 'NETWORK_ERROR':
                    title = 'Connection Error';
                    message = 'Please check your internet connection and try again.';
                    break;
                case 'AUTHENTICATION_ERROR':
                    title = 'Authentication Required';
                    message = 'Please log in to continue.';
                    break;
                case 'AUTHORIZATION_ERROR':
                    title = 'Access Denied';
                    message = 'You don\'t have permission to perform this action.';
                    break;
                case 'VALIDATION_ERROR':
                    title = 'Invalid Input';
                    message = error.message || 'Please check your input and try again.';
                    break;
                case 'NOT_FOUND_ERROR':
                    title = 'Not Found';
                    message = error.message || 'The requested item could not be found.';
                    break;
                case 'SERVER_ERROR':
                    title = 'Server Error';
                    message = 'Our servers are experiencing issues. Please try again later.';
                    break;
                case 'TIMEOUT_ERROR':
                    title = 'Request Timeout';
                    message = 'The request took too long. Please try again.';
                    break;
                default:
                    message = error.message || message;
            }
        } else {
            message = error.message || message;
        }

        if (context) {
            message = `${context}: ${message}`;
        }

        return this.error(message, { title });
    }

    // Show success message for API operations
    handleApiSuccess(message, context = '') {
        const fullMessage = context ? `${context}: ${message}` : message;
        return this.success(fullMessage);
    }

    // Get all notifications
    getNotifications() {
        return [...this.notifications];
    }

    // Get notification count by type
    getNotificationCount(type = null) {
        if (type) {
            return this.notifications.filter(n => n.type === type).length;
        }
        return this.notifications.length;
    }
    
    // ============================================================================
    // BACKEND NOTIFICATION METHODS
    // ============================================================================
    
    // Add backend notification listener
    addBackendListener(callback) {
        this.backendListeners.push(callback);
        return () => {
            this.backendListeners = this.backendListeners.filter(listener => listener !== callback);
        };
    }
    
    // Notify backend listeners
    notifyBackendListeners() {
        this.backendListeners.forEach(callback => {
            try {
                callback({
                    notifications: [...this.backendNotifications],
                    unreadCount: this.unreadCount
                });
            } catch (error) {
                console.error('Backend notification listener error:', error);
            }
        });
    }
    
    // Fetch notifications from backend
    async fetchBackendNotifications(unreadOnly = false) {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return null;
            }
            
            const params = new URLSearchParams();
            if (unreadOnly) params.append('unread_only', 'true');
            params.append('limit', '50');
            
            const response = await fetch(`${API_BASE_URL}/notifications?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.backendNotifications = data.notifications || [];
                this.unreadCount = data.unread_count || 0;
                this.notifyBackendListeners();
                return data;
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
        return null;
    }
    
    // Get unread count from backend
    async fetchUnreadCount() {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return 0;
            }
            
            const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.unreadCount = data.unread_count || 0;
                this.notifyBackendListeners();
                return this.unreadCount;
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
        return 0;
    }
    
    // Mark notification as read
    async markAsRead(notificationIds, markAll = false) {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return false;
            }
            
            const response = await fetch(`${API_BASE_URL}/notifications/mark-as-read`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notification_ids: markAll ? null : notificationIds,
                    mark_all: markAll
                })
            });
            
            if (response.ok) {
                // Refresh notifications
                await this.fetchBackendNotifications();
                return true;
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
        return false;
    }
    
    // Delete notification
    async deleteNotification(notificationId) {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return false;
            }
            
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Refresh notifications
                await this.fetchBackendNotifications();
                return true;
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
        return false;
    }
    
    // Start polling for notifications
    startPolling(intervalMs = 30000) { // Default: 30 seconds
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        
        // Fetch immediately
        this.fetchUnreadCount();
        
        // Then poll at intervals
        this.pollingInterval = setInterval(() => {
            this.fetchUnreadCount();
        }, intervalMs);
    }
    
    // Stop polling
    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
    
    // Get backend notifications
    getBackendNotifications() {
        return [...this.backendNotifications];
    }
    
    // Get unread count
    getUnreadCount() {
        return this.unreadCount;
    }
}

// Create singleton instance
const notificationService = new NotificationService();

// Export both the service and the class for testing
export default notificationService;
export { NotificationService };