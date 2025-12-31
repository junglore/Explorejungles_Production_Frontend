/**
 * Collection Selection Component
 * Allows users to choose from available Myths vs Facts collections
 * Shows progress, daily limits, and collection details
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import collectionService from '../services/collectionService.js';
import { useAuth } from '../contexts/AuthContext';
import './CollectionSelection.css';

const CollectionSelection = ({ onCollectionSelect, onBackToRegular }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            loadAvailableCollections();
        }
    }, [isAuthenticated]);

    const loadAvailableCollections = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('Loading available collections...');
            const response = await collectionService.getAvailableCollections();
            console.log('Available collections response:', response);
            
            setCollections(response.collections || []);
        } catch (err) {
            console.error('Error loading collections:', err);
            setError(err.message || 'Failed to load collections');
        } finally {
            setLoading(false);
        }
    };

    const handleCollectionSelect = async (collection) => {
        if (!collection.can_play_today) {
            return; // Already at daily limit
        }

        setSelectedCollection(collection);
        
        try {
            console.log('Starting collection:', collection.id);
            const response = await collectionService.startCollection(collection.id, 7);
            console.log('Collection started:', response);
            
            // Pass collection data and content to parent
            onCollectionSelect({
                collection,
                content: response.content,
                sessionData: response
            });
        } catch (err) {
            console.error('Error starting collection:', err);
            setError(err.message || 'Failed to start collection');
            setSelectedCollection(null);
        }
    };

    const getProgressPercentage = (collection) => {
        if (!collection.total_completed || !collection.total_questions) {
            return 0;
        }
        return Math.round((collection.total_completed / collection.total_questions) * 100);
    };

    const getDailyLimitText = (collection) => {
        const remaining = collection.daily_limit - collection.today_count;
        if (remaining <= 0) {
            return "Daily limit reached";
        }
        return `${remaining} game${remaining === 1 ? '' : 's'} remaining today`;
    };

    const getCollectionStatus = (collection) => {
        if (!collection.can_play_today) {
            return 'exhausted';
        }
        if (collection.is_completed) {
            return 'completed';
        }
        if (collection.total_completed > 0) {
            return 'in-progress';
        }
        return 'new';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return '#4CAF50';
            case 'in-progress': return '#FF9800';
            case 'completed': return '#2196F3';
            case 'exhausted': return '#9E9E9E';
            default: return '#4CAF50';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'new': return 'New';
            case 'in-progress': return 'In Progress';
            case 'completed': return 'Completed';
            case 'exhausted': return 'Daily Limit Reached';
            default: return 'Available';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="collection-selection-container">
                <motion.div 
                    className="auth-required"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <h3>Authentication Required</h3>
                    <p>Please log in to access collection-based gameplay.</p>
                    <motion.button 
                        className="back-button"
                        onClick={onBackToRegular}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Play Regular Mode Instead
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="collection-selection-container">
                <motion.div 
                    className="loading-state"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="loading-spinner"></div>
                    <p>Loading collections...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="collection-selection-container">
                <motion.div 
                    className="error-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h3>Error Loading Collections</h3>
                    <p>{error}</p>
                    <div className="error-actions">
                        <motion.button 
                            className="retry-button"
                            onClick={loadAvailableCollections}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Retry
                        </motion.button>
                        <motion.button 
                            className="back-button"
                            onClick={onBackToRegular}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Play Regular Mode Instead
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (collections.length === 0) {
        return (
            <div className="collection-selection-container">
                <motion.div 
                    className="no-collections"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h3>No Collections Available</h3>
                    <p>No collections are currently available for play.</p>
                    <motion.button 
                        className="back-button"
                        onClick={onBackToRegular}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Play Regular Mode Instead
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="collection-selection-container">
            <motion.header 
                className="collection-header"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <button className="back-button" onClick={onBackToRegular}>
                    ← Back to Regular Mode
                </button>
                <h1>Choose Your Collection</h1>
                <p>Select a collection to play curated Myths vs Facts content</p>
            </motion.header>

            <motion.div 
                className="collections-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <AnimatePresence>
                    {collections.map((collection, index) => {
                        const status = getCollectionStatus(collection);
                        const progressPercentage = getProgressPercentage(collection);
                        const isSelectable = collection.can_play_today && !selectedCollection;

                        return (
                            <motion.div
                                key={collection.id}
                                layout
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                transition={{ 
                                    duration: 0.4, 
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{ 
                                    scale: isSelectable ? 1.02 : 1,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ 
                                    scale: isSelectable ? 0.98 : 1 
                                }}
                                className={`collection-card ${status} ${isSelectable ? 'selectable' : 'disabled'} ${selectedCollection?.id === collection.id ? 'loading' : ''}`}
                                onClick={() => isSelectable && handleCollectionSelect(collection)}
                            >
                                <div className="collection-card-header">
                                    <h3>{collection.name}</h3>
                                    <div 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(status) }}
                                    >
                                        {getStatusText(status)}
                                    </div>
                                </div>

                                <div className="collection-description">
                                    <p>{collection.description}</p>
                                </div>

                                <div className="collection-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Total Questions:</span>
                                        <span className="stat-value">{collection.total_questions}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Completed:</span>
                                        <span className="stat-value">{collection.total_completed}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Daily Limit:</span>
                                        <span className="stat-value">{collection.daily_limit}</span>
                                    </div>
                                </div>

                                {progressPercentage > 0 && (
                                    <div className="progress-section">
                                        <div className="progress-label">
                                            Progress: {progressPercentage}%
                                        </div>
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill"
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="daily-limit-info">
                                    <p className={`daily-limit-text ${!collection.can_play_today ? 'exhausted' : ''}`}>
                                        {getDailyLimitText(collection)}
                                    </p>
                                </div>

                                {selectedCollection?.id === collection.id && (
                                    <div className="loading-overlay">
                                        <div className="loading-spinner"></div>
                                        <p>Starting collection...</p>
                                    </div>
                                )}

                                {!isSelectable && collection.can_play_today && (
                                    <div className="disabled-overlay">
                                        <p>Starting another collection...</p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            <motion.footer 
                className="collection-footer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="info-section">
                    <h4>How Collections Work</h4>
                    <ul>
                        <li>Each collection contains curated Myths vs Facts content</li>
                        <li>Daily limits prevent overuse and encourage variety</li>
                        <li>Progress is tracked across all your collection plays</li>
                        <li>Complete collections to unlock achievements</li>
                    </ul>
                </div>
            </motion.footer>
        </div>
    );
};

export default CollectionSelection;