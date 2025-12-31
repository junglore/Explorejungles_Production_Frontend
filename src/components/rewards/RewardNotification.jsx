/**
 * Reward Notification Component
 * Shows animated notification when user earns rewards from quiz/game completion
 * Displays tier achieved, points/credits earned, and any bonuses applied
 */

import React, { useState, useEffect } from 'react';
import { useRewards } from '../../contexts/RewardsContext.jsx';
import './RewardNotification.css';

const RewardNotification = () => {
    const { rewardNotification, dismissRewardNotification } = useRewards();
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Handle notification visibility
    useEffect(() => {
        if (rewardNotification) {
            setIsVisible(true);
            setIsClosing(false);
            
            // Auto-dismiss after 8 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 8000);

            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            setIsClosing(false);
        }
    }, [rewardNotification]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            dismissRewardNotification();
        }, 300);
    };

    if (!rewardNotification || !isVisible) {
        return null;
    }

    const {
        tier,
        points_earned = 0,
        credits_earned = 0,
        bonus_applied = false,
        activity_type = 'quiz',
        score_percentage = 0,
        streak_bonus = false,
        speed_bonus = false,
        difficulty_bonus = false
    } = rewardNotification;

    const tierInfo = getTierInfo(tier);
    const hasBonus = bonus_applied || streak_bonus || speed_bonus || difficulty_bonus;

    return (
        <div className={`reward-notification ${isClosing ? 'reward-notification--closing' : ''}`}>
            <div className="reward-notification__backdrop" onClick={handleClose}></div>
            
            <div className={`reward-notification__content reward-notification--${tier?.toLowerCase() || 'bronze'}`}>
                {/* Close button */}
                <button 
                    className="reward-notification__close"
                    onClick={handleClose}
                    aria-label="Close notification"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Header with tier */}
                <div className="reward-notification__header">
                    <div className="reward-notification__tier-badge">
                        <TierIcon tier={tier} />
                        <span className="reward-notification__tier-text">
                            {tier || 'Bronze'} Tier!
                        </span>
                    </div>
                    {score_percentage > 0 && (
                        <div className="reward-notification__score">
                            {score_percentage}% Score
                        </div>
                    )}
                </div>

                {/* Main content */}
                <div className="reward-notification__body">
                    <h3 className="reward-notification__title">
                        🎉 Congratulations!
                    </h3>
                    
                    <p className="reward-notification__message">
                        You've earned rewards for your excellent performance!
                    </p>

                    {/* Rewards earned */}
                    <div className="reward-notification__rewards">
                        {points_earned > 0 && (
                            <div className="reward-notification__reward-item reward-notification__reward-item--points">
                                <div className="reward-notification__reward-icon">
                                    <StarIcon />
                                </div>
                                <div className="reward-notification__reward-amount">
                                    +{points_earned}
                                </div>
                                <div className="reward-notification__reward-label">
                                    Points
                                </div>
                            </div>
                        )}

                        {credits_earned > 0 && (
                            <div className="reward-notification__reward-item reward-notification__reward-item--credits">
                                <div className="reward-notification__reward-icon">
                                    <CoinIcon />
                                </div>
                                <div className="reward-notification__reward-amount">
                                    +{credits_earned}
                                </div>
                                <div className="reward-notification__reward-label">
                                    Credits
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bonus indicators */}
                    {hasBonus && (
                        <div className="reward-notification__bonuses">
                            <div className="reward-notification__bonuses-title">
                                ✨ Bonuses Applied:
                            </div>
                            <div className="reward-notification__bonus-list">
                                {streak_bonus && (
                                    <span className="reward-notification__bonus">
                                        🔥 Streak Bonus
                                    </span>
                                )}
                                {speed_bonus && (
                                    <span className="reward-notification__bonus">
                                        ⚡ Speed Bonus
                                    </span>
                                )}
                                {difficulty_bonus && (
                                    <span className="reward-notification__bonus">
                                        💪 Difficulty Bonus
                                    </span>
                                )}
                                {bonus_applied && !streak_bonus && !speed_bonus && !difficulty_bonus && (
                                    <span className="reward-notification__bonus">
                                        🌟 Special Bonus
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="reward-notification__footer">
                    <div className="reward-notification__tier-info">
                        {tierInfo.description}
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="reward-notification__decoration">
                    {[...Array(8)].map((_, i) => (
                        <div 
                            key={i} 
                            className="reward-notification__particle"
                            style={{
                                left: `${20 + i * 10}%`,
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Helper function to get tier information
const getTierInfo = (tier) => {
    const tierData = {
        BRONZE: {
            color: '#CD7F32',
            description: 'Good effort! Keep practicing to reach higher tiers.',
            icon: '🥉'
        },
        SILVER: {
            color: '#C0C0C0',
            description: 'Great job! You\'re showing good knowledge.',
            icon: '🥈'
        },
        GOLD: {
            color: '#FFD700',
            description: 'Excellent work! You\'ve mastered this content.',
            icon: '🥇'
        },
        PLATINUM: {
            color: '#E5E4E2',
            description: 'Perfect! You\'re a true wildlife expert.',
            icon: '💎'
        }
    };

    return tierData[tier?.toUpperCase()] || tierData.BRONZE;
};

// Tier icon component
const TierIcon = ({ tier }) => {
    const tierInfo = getTierInfo(tier);
    
    return (
        <div className="reward-notification__tier-icon">
            <span style={{ color: tierInfo.color }}>
                {tierInfo.icon}
            </span>
        </div>
    );
};

// Star icon for points
const StarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
);

// Coin icon for credits
const CoinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v8M8 12h8"/>
    </svg>
);

export default RewardNotification;