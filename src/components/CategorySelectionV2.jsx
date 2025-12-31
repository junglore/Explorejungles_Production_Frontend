/**
 * Category Selection V2 - Premium Interactive Edition 🌿
 * 
 * Features advanced 3D animations, mouse-tracking tilt effects,
 * shine overlays, and sophisticated glassmorphic design.
 * 
 * Technology:
 * - Framer Motion for 3D animations and spring physics
 * - Mouse-tracking 3D tilt effect
 * - Multiple animation layers
 * - Staggered entrance animations
 * 
 * @version 2.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import categoryService from '../services/categoryService.js';
import './CategorySelectionV2.css';

const CategorySelectionV2 = ({ onCategorySelect, onBackToMain }) => {
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
            
            const categoriesData = await categoryService.getMVFCategories();
            
            if (Array.isArray(categoriesData)) {
                // Sort: Featured first, then alphabetical
                const sortedCategories = categoriesData.sort((a, b) => {
                    if (a.is_featured && !b.is_featured) return -1;
                    if (!a.is_featured && b.is_featured) return 1;
                    return a.name.localeCompare(b.name);
                });
                setCategories(sortedCategories);
            } else {
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

    const getCategoryIcon = (category) => {
        if (category.icon) return category.icon;
        
        const name = category.name.toLowerCase();
        if (name.includes('wildlife') || name.includes('animal')) return '🦁';
        if (name.includes('marine') || name.includes('ocean') || name.includes('sea') || name.includes('aquatic')) return '🐋';
        if (name.includes('forest') || name.includes('tree')) return '🌲';
        if (name.includes('climate')) return '🌍';
        return '🌿';
    };

    if (loading) {
        return (
            <div className="category-selection-v2">
                <div className="category-selection-v2__loading">
                    <motion.div 
                        className="loading-spinner"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        🌿
                    </motion.div>
                    <p>Loading your conservation adventure...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="category-selection-v2">
                <div className="category-selection-v2__error">
                    <div className="error-icon">🌐</div>
                    <h2>Connection Issue</h2>
                    <p>We're having trouble connecting to our servers.</p>
                    <button onClick={loadCategories} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="category-selection-v2">
                <div className="category-selection-v2__empty">
                    <div className="empty-icon">📚</div>
                    <h2>No Categories Available</h2>
                    <p>Categories are being prepared. Please check back soon!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="category-selection-v2">
            {/* Decorative Logo */}
            <motion.div 
                className="decorative-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                🌿
            </motion.div>

            {/* Top Pill Button */}
            <motion.div 
                className="top-pill"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <span className="top-pill__icon">🌿</span>
                <span className="top-pill__text">Myths vs Facts Challenge</span>
                <span className="top-pill__edit">✏️</span>
            </motion.div>

            {/* Header Section */}
            <motion.div 
                className="header-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h1 className="main-heading">
                    <span className="heading-part-1">Choose Your</span>
                    <span className="heading-part-2">Conservation Quest</span>
                </h1>
                <p className="subheading">
                    Embark on an educational journey through wildlife conservation. Test your knowledge, 
                    discover fascinating facts, and earn rewards.
                </p>
            </motion.div>

            {/* Category Cards Grid */}
            <motion.div 
                className="cards-grid"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.2,
                            delayChildren: 0.4
                        }
                    }
                }}
            >
                {categories.map((category, index) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        icon={getCategoryIcon(category)}
                        onSelect={() => onCategorySelect(category)}
                        index={index}
                    />
                ))}
            </motion.div>

            {/* Footer Notification Bar */}
            <motion.div 
                className="footer-pill"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
            >
                <span className="footer-pill__icon">🏆</span>
                <span className="footer-pill__text">
                    New categories added weekly • Join thousands of wildlife enthusiasts
                </span>
            </motion.div>
        </div>
    );
};

// Individual Category Card Component with 3D Tilt Effect
const CategoryCard = ({ category, icon, onSelect, index }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isIconHovered, setIsIconHovered] = useState(false);

    // Motion values for 3D tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring physics for smooth animation
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7.5, -7.5]), {
        stiffness: 300,
        damping: 30
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7.5, 7.5]), {
        stiffness: 300,
        damping: 30
    });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseXPos = (e.clientX - centerX) / (rect.width / 2);
        const mouseYPos = (e.clientY - centerY) / (rect.height / 2);

        mouseX.set(mouseXPos);
        mouseY.set(mouseYPos);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    const isFeatured = category.is_featured;
    const colorScheme = isFeatured ? 'amber' : 'emerald';
    const credits = category.custom_credits || category.reward_credits || 3;

    return (
        <motion.div
            ref={cardRef}
            className={`category-card-v2 ${isFeatured ? 'category-card-v2--featured' : ''}`}
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onSelect}
            style={{
                transformStyle: "preserve-3d",
                rotateX,
                rotateY
            }}
            whileHover={{ scale: 1.03 }}
        >
            {/* Safari Pattern Background */}
            <div className={`safari-pattern safari-pattern--${colorScheme}`}></div>

            {/* Animated Gradient Orb */}
            <motion.div 
                className={`gradient-orb gradient-orb--${colorScheme}`}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Bottom Gradient Accent */}
            <div className={`bottom-gradient bottom-gradient--${colorScheme}`}></div>

            {/* Shine Effect Overlay */}
            {isHovered && (
                <motion.div 
                    className="shine-overlay"
                    initial={{ x: "-200%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            )}

            {/* Featured Badge */}
            {isFeatured && (
                <motion.div 
                    className="featured-badge"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="featured-badge__icon">⭐</span>
                    <span className="featured-badge__text">FEATURED</span>
                    <span className="featured-badge__icon">✨</span>
                </motion.div>
            )}

            {/* Card Content */}
            <div className="card-content" style={{ transform: "translateZ(20px)" }}>
                {/* Icon Container */}
                <motion.div 
                    className={`icon-container icon-container--${colorScheme}`}
                    onMouseEnter={() => setIsIconHovered(true)}
                    onMouseLeave={() => setIsIconHovered(false)}
                    animate={isIconHovered ? {
                        rotate: [-8, 8, -8, 0],
                        scale: [1, 1.1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ transform: "translateZ(60px)", cursor: 'pointer' }}
                >
                    <span className="icon-emoji">{icon}</span>
                </motion.div>

                {/* Title */}
                <h3 className={`card-title card-title--${colorScheme}`}>
                    {category.name}
                </h3>

                {/* Description */}
                <p className="card-description">
                    {category.description || 'Explore fascinating myths and facts in this category'}
                </p>

                {/* Reward Section */}
                <motion.div 
                    className={`reward-section reward-section--${colorScheme}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                >
                    <div className="reward-label">EARN REWARD</div>
                    <div className="reward-content">
                        <div className={`trophy-container trophy-container--${colorScheme}`}>
                            <span className="trophy-icon">🏆</span>
                        </div>
                        <div className="reward-amount">
                            <span className={`credits-number credits-number--${colorScheme}`}>{credits}</span>
                            <span className="credits-text">Credits</span>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.button 
                    className={`cta-button cta-button--${colorScheme}`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ transform: "translateZ(40px)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                >
                    <span className="cta-text">Start Adventure</span>
                    <motion.span 
                        className="cta-arrow"
                        animate={isHovered ? { x: 8 } : { x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        →
                    </motion.span>
                    {/* Button Shine Effect */}
                    <motion.div 
                        className="button-shine"
                        animate={{ x: ["-200%", "200%"] }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            repeatDelay: 2,
                            ease: "linear" 
                        }}
                    />
                </motion.button>
            </div>

            {/* Hover Glow Effect */}
            {isHovered && (
                <motion.div 
                    className={`outer-glow outer-glow--${colorScheme}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                />
            )}

            {/* Inner Border Highlight on Hover */}
            {isHovered && (
                <motion.div 
                    className="inner-highlight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
            )}
        </motion.div>
    );
};

export default CategorySelectionV2;
