import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import notificationService from '../../services/notificationService';

// Notification Bell Icon Button
const NotificationButton = styled("button")({
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
        opacity: 0.8,
    },
});

// Bell Icon SVG
const BellIcon = styled("div")({
    width: '24px',
    height: '24px',
    position: 'relative',
});

// Unread Badge
const UnreadBadge = styled("div")({
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    minWidth: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '700',
    padding: '0 4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
});

// Dropdown Container
const DropdownContainer = styled("div")(({ isOpen, position }) => ({
    position: 'fixed',
    top: `${position.top}px`,
    right: `${position.right}px`,
    width: '380px',
    maxHeight: '500px',
    background: 'rgba(30, 45, 39, 0.98)',
    border: '1px solid rgba(255, 232, 161, 0.3)',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    display: isOpen ? 'flex' : 'none',
    flexDirection: 'column',
    zIndex: 9999,
    backdropFilter: 'blur(10px)',
    '@media (max-width: 768px)': {
        width: '340px',
    },
    '@media (max-width: 480px)': {
        width: '90vw',
        maxWidth: '320px',
        maxHeight: '400px',
        right: '5vw',
    },
}));

// Dropdown Header
const DropdownHeader = styled("div")({
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255, 232, 161, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

const HeaderTitle = styled("h3")({
    margin: 0,
    color: 'rgba(255, 232, 161, 1)',
    fontSize: '16px',
    fontWeight: '700',
    fontFamily: 'DM Sans',
});

const MarkAllButton = styled("button")({
    background: 'none',
    border: 'none',
    color: 'rgba(255, 232, 161, 0.8)',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s',
    '&:hover': {
        background: 'rgba(255, 232, 161, 0.1)',
        color: 'rgba(255, 232, 161, 1)',
    },
});

// Notifications List
const NotificationsList = styled("div")({
    overflowY: 'auto',
    maxHeight: '400px',
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(255, 232, 161, 0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(255, 232, 161, 0.3)',
        borderRadius: '3px',
    },
});

// Single Notification Item
const NotificationItem = styled("div")(({ isRead }) => ({
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255, 232, 161, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: isRead ? 'transparent' : 'rgba(255, 232, 161, 0.05)',
    '&:hover': {
        background: 'rgba(255, 232, 161, 0.1)',
    },
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const NotificationTitle = styled("div")(({ isRead }) => ({
    color: 'rgba(255, 232, 161, 1)',
    fontSize: '14px',
    fontWeight: isRead ? '500' : '700',
    marginBottom: '4px',
    fontFamily: 'DM Sans',
}));

const NotificationMessage = styled("div")({
    color: 'rgba(255, 232, 161, 0.8)',
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '8px',
    fontFamily: 'DM Sans',
});

const NotificationTime = styled("div")({
    color: 'rgba(255, 232, 161, 0.5)',
    fontSize: '11px',
    fontFamily: 'DM Sans',
});

const EmptyState = styled("div")({
    padding: '40px 20px',
    textAlign: 'center',
    color: 'rgba(255, 232, 161, 0.6)',
    fontSize: '14px',
    fontFamily: 'DM Sans',
});

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Update dropdown position when button ref changes or window resizes
    useEffect(() => {
        const updatePosition = () => {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + 8,
                    right: window.innerWidth - rect.right
                });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [isOpen]);

    // Load notifications when component mounts
    useEffect(() => {
        if (user) {
            loadNotifications();
            notificationService.startPolling(30000); // Poll every 30 seconds

            // Listen for notification updates
            const unsubscribe = notificationService.addBackendListener((data) => {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            });

            return () => {
                unsubscribe();
                notificationService.stopPolling();
            };
        }
    }, [user]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const loadNotifications = async () => {
        await notificationService.fetchBackendNotifications();
    };

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
        }
        if (!isOpen) {
            loadNotifications();
        }
        setIsOpen(!isOpen);
    };

    const handleMarkAllAsRead = async () => {
        await notificationService.markAsRead(null, true);
    };

    const handleClearAll = async () => {
        // Delete all notifications
        const deletePromises = notifications.map(n => notificationService.deleteNotification(n.id));
        await Promise.all(deletePromises);
        await loadNotifications();
    };

    const handleNotificationClick = async (notification) => {
        // Mark as read
        if (!notification.is_read) {
            await notificationService.markAsRead([notification.id]);
        }

        // Navigate to resource if URL exists
        if (notification.resource_url) {
            navigate(notification.resource_url);
            setIsOpen(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    if (!user) {
        return null; // Don't show notification bell if user is not logged in
    }

    return (
        <>
            <div style={{ position: 'relative' }}>
                <NotificationButton ref={buttonRef} onClick={handleToggle}>
                    <BellIcon>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="rgba(255, 232, 161, 1)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        {unreadCount > 0 && (
                            <UnreadBadge>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </UnreadBadge>
                        )}
                    </BellIcon>
                </NotificationButton>
            </div>

            {createPortal(
                <DropdownContainer ref={dropdownRef} isOpen={isOpen} position={dropdownPosition}>
                <DropdownHeader>
                    <HeaderTitle>Notifications</HeaderTitle>
                    {unreadCount > 0 ? (
                        <MarkAllButton onClick={handleMarkAllAsRead}>
                            Mark all as read
                        </MarkAllButton>
                    ) : notifications.length > 0 && (
                        <MarkAllButton onClick={handleClearAll}>
                            Clear all
                        </MarkAllButton>
                    )}
                </DropdownHeader>

                <NotificationsList>
                    {notifications.length === 0 ? (
                        <EmptyState>
                            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
                            <div>No notifications yet</div>
                        </EmptyState>
                    ) : (
                        notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                isRead={notification.is_read}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <NotificationTitle isRead={notification.is_read}>
                                    {notification.title}
                                </NotificationTitle>
                                <NotificationMessage>
                                    {notification.message}
                                </NotificationMessage>
                                <NotificationTime>
                                    {formatTime(notification.created_at)}
                                </NotificationTime>
                            </NotificationItem>
                        ))
                    )}
                </NotificationsList>
            </DropdownContainer>,
            document.body
            )}
        </>
    );
};

export default NotificationBell;