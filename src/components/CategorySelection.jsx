/**
 * Category Selection Component - Nature's Adventure Edition 🌿
 * 
 * Glassmorphic category selection interface for the Myths vs Facts game.
 * Features beautiful nature-themed design matching the leaderboard aesthetic.
 * 
 * Features:
 * - Glassmorphic cards with backdrop blur
 * - Animated featured badges
 * - Responsive grid layout (1-3 columns)
 * - Hover effects and transitions
 * - Nature theme colors
 * - Loading and error states
 * 
 * @author Junglore Development Team
 * @version 2.0.0
 */

import React, { useState, useEffect } from 'react';
import categoryService from '../services/categoryService.js';
import '../pages/resources/CategorySelection.css';

const CategorySelection = ({ onCategorySelect, onBackToMain }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Loading categories...');
            const categoriesData = await categoryService.getMVFCategories();
            console.log('Categories loaded:', categoriesData);
            
            if (Array.isArray(categoriesData)) {
                // Sort: Featured first, then alphabetical
                const sortedCategories = categoriesData.sort((a, b) => {
                    if (a.is_featured && !b.is_featured) return -1;
                    if (!a.is_featured && b.is_featured) return 1;
                    return a.name.localeCompare(b.name);
                });
                setCategories(sortedCategories);
                console.log(`Set ${sortedCategories.length} categories`);
            } else {
                console.warn('Categories data is not an array:', categoriesData);
                setCategories([]);
                setError('Invalid categories data received');
            }
        } catch (err) {
            console.error('Error loading categories:', err);
            setCategories([]);
            setError(err.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryBackground = (category) => {
        // Use category.background_image from API if available
        return category.background_image || null;
    };

    const getCategoryIcon = (category) => {
        // Use category.icon from API, or generate based on name
        if (category.icon) {
            return category.icon;
        }
        
        const name = category.name.toLowerCase();
        if (name.includes('wildlife') || name.includes('animal')) return '🦁';
        if (name.includes('marine') || name.includes('ocean') || name.includes('sea') || name.includes('aquatic')) return '🌊';
        if (name.includes('forest') || name.includes('tree') || name.includes('jungle')) return '🌲';
        if (name.includes('climate') || name.includes('weather') || name.includes('environment')) return '🌍';
        return '🌿';
    };

    const handleCategorySelect = (category) => {
        onCategorySelect(category);
    };

    if (loading) {
        return (
            <div className="category-selection">
                <div className="category-selection__loading">
                    <div className="category-skeleton"></div>
                    <div className="category-skeleton"></div>
                    <div className="category-skeleton"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="category-selection">
                <div className="category-selection__empty">
                    <div className="category-selection__empty-icon">🌐</div>
                    <h2 className="category-selection__empty-title">Connection Issue</h2>
                    <p className="category-selection__empty-text" style={{ marginBottom: '1.5rem' }}>
                        We're having trouble connecting to our servers.
                    </p>
                    <button
                        onClick={loadCategories}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #8BC34A, #689F38)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#FFFFFF',
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="category-selection">
                <div className="category-selection__empty">
                    <div className="category-selection__empty-icon">📚</div>
                    <h2 className="category-selection__empty-title">No Categories Available</h2>
                    <p className="category-selection__empty-text">
                        Categories are being prepared. Please check back soon!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="category-selection">
            {/* Header */}
            <div className="category-selection__header">
                <h1 className="category-selection__title">
                    <span className="category-selection__title-icon">🌿</span>
                    Choose Your Conservation Adventure
                </h1>
                <p className="category-selection__subtitle">
                    Select a category to explore myths and facts about wildlife conservation. 
                    Each category offers unique insights and earns you different rewards!
                </p>
            </div>

            {/* Categories Grid */}
            <div className="category-selection__grid">
                {categories.map((category) => {
                    const backgroundImage = getCategoryBackground(category);
                    
                    return (
                        <div
                            key={category.id}
                            className={`category-card ${category.is_featured ? 'category-card--featured' : ''}`}
                            onClick={() => handleCategorySelect(category)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleCategorySelect(category);
                                }
                            }}
                        >
                            {/* Background Image Layer */}
                            {backgroundImage && (
                                <div 
                                    className="category-card__background"
                                    style={{ backgroundImage: `url(${backgroundImage})` }}
                                />
                            )}

                            {/* Featured Badge */}
                            {category.is_featured && (
                                <div className="category-card__featured-badge">
                                    <span className="category-card__featured-badge-icon">⭐</span>
                                    <span className="category-card__featured-badge-text">Featured</span>
                                </div>
                            )}

                            {/* Card Content */}
                            <div className="category-card__content">
                                {/* Icon */}
                                <div className="category-card__icon">
                                    {getCategoryIcon(category)}
                                </div>

                                {/* Name */}
                                <h3 className="category-card__name">
                                    {category.name}
                                </h3>

                                {/* Description */}
                                <p className="category-card__description">
                                    {category.description || 'Explore fascinating myths and facts in this category'}
                                </p>

                                {/* Reward Section */}
                                <div className="category-card__reward">
                                    <div className="category-card__reward-label">Reward</div>
                                    <div className="category-card__reward-amount">
                                        <span className="category-card__reward-icon">💰</span>
                                        <span className="category-card__reward-text">
                                            {category.custom_credits || category.reward_credits || 3} Credits
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySelection;