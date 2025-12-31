/**
 * Notification Container Component
 * Displays notifications from the notification service
 */

import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService.js';

const NotificationItem = ({ notification, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        // Animate in
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onRemove(notification.id);
        }, 300);
    };

    const getNotificationStyles = () => {
        const baseStyles = "transform transition-all duration-300 ease-in-out";
        const visibilityStyles = isVisible && !isRemoving
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0";

        const typeStyles = {
            success: "bg-green-50 border-green-200 text-green-800",
            error: "bg-red-50 border-red-200 text-red-800",
            warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
            info: "bg-blue-50 border-blue-200 text-blue-800",
            loading: "bg-gray-50 border-gray-200 text-gray-800"
        };

        return `${baseStyles} ${visibilityStyles} ${typeStyles[notification.type] || typeStyles.info}`;
    };

    const getIcon = () => {
        const iconStyles = "w-5 h-5 flex-shrink-0";

        switch (notification.type) {
            case 'success':
                return (
                    <svg className={`${iconStyles} text-green-400`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className={`${iconStyles} text-red-400`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className={`${iconStyles} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'loading':
                return (
                    <svg className={`${iconStyles} text-gray-400 animate-spin`} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                );
            default:
                return (
                    <svg className={`${iconStyles} text-blue-400`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    return (
        <div className={`${getNotificationStyles()} max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden mb-4`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        {notification.title && (
                            <p className="text-sm font-medium">
                                {notification.title}
                            </p>
                        )}
                        <p className={`text-sm ${notification.title ? 'mt-1' : ''}`}>
                            {notification.message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleRemove}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationContainer = ({ position = 'top-right' }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const unsubscribe = notificationService.addListener(setNotifications);
        return unsubscribe;
    }, []);

    const handleRemove = (id) => {
        notificationService.removeNotification(id);
    };

    const getPositionStyles = () => {
        const positions = {
            'top-right': 'top-0 right-0',
            'top-left': 'top-0 left-0',
            'bottom-right': 'bottom-0 right-0',
            'bottom-left': 'bottom-0 left-0',
            'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
            'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
        };
        return positions[position] || positions['top-right'];
    };

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className={`fixed ${getPositionStyles()} z-50 p-6 pointer-events-none`}>
            <div className="flex flex-col space-y-4">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRemove={handleRemove}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotificationContainer;