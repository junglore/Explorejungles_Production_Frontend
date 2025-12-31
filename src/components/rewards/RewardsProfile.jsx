import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRewards } from '../../contexts/RewardsContext';
import rewardsService from '../../services/rewardsService';
import CurrencyDisplay from './CurrencyDisplay';
import './RewardsProfile.css';

const RewardsProfile = ({ view = 'compact' }) => {
    const { user } = useAuth();
    const { profile, userStats, recentTransactions, refreshProfile, isLoading } = useRewards();
    const [achievements, setAchievements] = useState([]);
    const [tierProgress, setTierProgress] = useState(null);
    const [loadingAchievements, setLoadingAchievements] = useState(false);

    useEffect(() => {
        if (user && view === 'detailed') {
            loadAchievements();
        }
    }, [user, view]);

    const loadAchievements = async () => {
        try {
            setLoadingAchievements(true);
            const data = await rewardsService.getAchievements();
            setAchievements(data);
        } catch (error) {
            console.error('Failed to load achievements:', error);
        } finally {
            setLoadingAchievements(false);
        }
    };

    useEffect(() => {
        if (profile && profile.tier) {
            calculateTierProgress();
        }
    }, [profile]);

    const calculateTierProgress = () => {
        const tierThresholds = {
            'Bronze': 0,
            'Silver': 1000,
            'Gold': 5000,
            'Platinum': 15000
        };

        const currentTier = profile.tier;
        const currentPoints = profile.total_points_earned || 0;
        const tierOrder = ['Bronze', 'Silver', 'Gold', 'Platinum'];
        const currentIndex = tierOrder.indexOf(currentTier);
        
        if (currentIndex === tierOrder.length - 1) {
            // Platinum tier - no next tier
            setTierProgress({
                currentTier,
                currentPoints,
                isMaxTier: true
            });
        } else {
            const nextTier = tierOrder[currentIndex + 1];
            const nextThreshold = tierThresholds[nextTier];
            const progress = ((currentPoints / nextThreshold) * 100).toFixed(1);
            
            setTierProgress({
                currentTier,
                nextTier,
                currentPoints,
                nextThreshold,
                progress: Math.min(100, progress),
                pointsNeeded: Math.max(0, nextThreshold - currentPoints)
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Bronze': return '#cd7f32';
            case 'Silver': return '#c0c0c0';
            case 'Gold': return '#ffd700';
            case 'Platinum': return '#e5e4e2';
            default: return '#666666';
        }
    };

    const getAchievementIcon = (achievement) => {
        switch (achievement.category) {
            case 'quiz_streak': return '🔥';
            case 'quiz_completion': return '🏆';
            case 'quiz_accuracy': return '🎯';
            case 'myths_facts': return '🧠';
            case 'participation': return '⭐';
            case 'social': return '🤝';
            default: return '🏅';
        }
    };

    if (!user) {
        return (
            <div className="rewards-profile">
                <div className="rewards-profile__auth-required">
                    <span className="rewards-profile__auth-icon">🔒</span>
                    <h3>Login Required</h3>
                    <p>Please log in to view your rewards profile</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="rewards-profile">
                <div className="rewards-profile__loading">
                    {view === 'compact' ? (
                        <>
                            <div className="rewards-profile__skeleton rewards-profile__skeleton--compact">
                                <div className="rewards-profile__skeleton-avatar"></div>
                                <div className="rewards-profile__skeleton-info">
                                    <div className="rewards-profile__skeleton-name"></div>
                                    <div className="rewards-profile__skeleton-tier"></div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="rewards-profile__skeleton">
                                <div className="rewards-profile__skeleton-header"></div>
                                <div className="rewards-profile__skeleton-stats"></div>
                                <div className="rewards-profile__skeleton-progress"></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    if (view === 'compact') {
        return (
            <div className="rewards-profile rewards-profile--compact">
                <div className="rewards-profile__header">
                    <div className="rewards-profile__avatar">
                        {user.profile_image ? (
                            <img 
                                src={user.profile_image} 
                                alt={user.username}
                                className="rewards-profile__avatar-image"
                            />
                        ) : (
                            <div className="rewards-profile__avatar-placeholder">
                                {user.username?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="rewards-profile__info">
                        <h3 className="rewards-profile__username">{user.username}</h3>
                        <div className="rewards-profile__tier-badge">
                            <span 
                                className={`rewards-profile__tier-icon rewards-profile__tier-icon--${profile?.tier?.toLowerCase()}`}
                                style={{ color: getTierColor(profile?.tier) }}
                            >
                                {profile?.tier === 'Platinum' ? '💎' : 
                                 profile?.tier === 'Gold' ? '🥇' :
                                 profile?.tier === 'Silver' ? '🥈' : '🥉'}
                            </span>
                            <span className="rewards-profile__tier-name">{profile?.tier || 'Bronze'}</span>
                        </div>
                    </div>
                    <div className="rewards-profile__balance">
                        <CurrencyDisplay variant="compact" showBoth={true} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rewards-profile rewards-profile--detailed">
            {/* Header Section */}
            <div className="rewards-profile__header">
                <div className="rewards-profile__avatar">
                    {user.profile_image ? (
                        <img 
                            src={user.profile_image} 
                            alt={user.username}
                            className="rewards-profile__avatar-image"
                        />
                    ) : (
                        <div className="rewards-profile__avatar-placeholder">
                            {user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    )}
                    <div className="rewards-profile__tier-badge">
                        <span 
                            className={`rewards-profile__tier-icon rewards-profile__tier-icon--${profile?.tier?.toLowerCase()}`}
                            style={{ color: getTierColor(profile?.tier) }}
                        >
                            {profile?.tier === 'Platinum' ? '💎' : 
                             profile?.tier === 'Gold' ? '🥇' :
                             profile?.tier === 'Silver' ? '🥈' : '🥉'}
                        </span>
                        <span className="rewards-profile__tier-name">{profile?.tier || 'Bronze'}</span>
                    </div>
                </div>
                <div className="rewards-profile__info">
                    <h2 className="rewards-profile__username">{user.username}</h2>
                    <p className="rewards-profile__join-date">
                        Knowledge Explorer since {formatDate(user.created_at)}
                    </p>
                    <div className="rewards-profile__balance-section">
                        <CurrencyDisplay variant="detailed" showBoth={true} />
                    </div>
                </div>
                <button 
                    onClick={refreshProfile}
                    className="rewards-profile__refresh"
                    disabled={isLoading}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                    </svg>
                </button>
            </div>

            {/* Tier Progress */}
            {tierProgress && (
                <div className="rewards-profile__tier-progress">
                    <div className="rewards-profile__tier-progress-header">
                        <h3>Tier Progress</h3>
                        {tierProgress.isMaxTier ? (
                            <span className="rewards-profile__tier-max">Maximum Tier Achieved! 🎉</span>
                        ) : (
                            <span className="rewards-profile__tier-next">
                                Next: {tierProgress.nextTier} ({tierProgress.pointsNeeded} points needed)
                            </span>
                        )}
                    </div>
                    {!tierProgress.isMaxTier && (
                        <div className="rewards-profile__progress-bar">
                            <div 
                                className="rewards-profile__progress-fill"
                                style={{ width: `${tierProgress.progress}%` }}
                            ></div>
                            <span className="rewards-profile__progress-text">
                                {tierProgress.currentPoints} / {tierProgress.nextThreshold} points
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Statistics */}
            <div className="rewards-profile__stats">
                <h3>Statistics</h3>
                <div className="rewards-profile__stats-grid">
                    <div className="rewards-profile__stat">
                        <span className="rewards-profile__stat-icon">🏆</span>
                        <span className="rewards-profile__stat-value">{profile?.total_points_earned || 0}</span>
                        <span className="rewards-profile__stat-label">Total Points</span>
                    </div>
                    <div className="rewards-profile__stat">
                        <span className="rewards-profile__stat-icon">🎯</span>
                        <span className="rewards-profile__stat-value">{userStats?.quiz_accuracy || 0}%</span>
                        <span className="rewards-profile__stat-label">Quiz Accuracy</span>
                    </div>
                    <div className="rewards-profile__stat">
                        <span className="rewards-profile__stat-icon">🔥</span>
                        <span className="rewards-profile__stat-value">{userStats?.current_streak || 0}</span>
                        <span className="rewards-profile__stat-label">Current Streak</span>
                    </div>
                    <div className="rewards-profile__stat">
                        <span className="rewards-profile__stat-icon">📊</span>
                        <span className="rewards-profile__stat-value">{userStats?.best_streak || 0}</span>
                        <span className="rewards-profile__stat-label">Best Streak</span>
                    </div>
                    <div className="rewards-profile__stat">
                        <span className="rewards-profile__stat-icon">✅</span>
                        <span className="rewards-profile__stat-value">{userStats?.quizzes_completed || 0}</span>
                        <span className="rewards-profile__stat-label">Quizzes Completed</span>
                    </div>
                    <div className="rewards-profile__stat">
                        <span className="rewards-profile__stat-icon">🧠</span>
                        <span className="rewards-profile__stat-value">{userStats?.myths_facts_viewed || 0}</span>
                        <span className="rewards-profile__stat-label">Facts Learned</span>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="rewards-profile__achievements">
                <div className="rewards-profile__achievements-header">
                    <h3>Achievements</h3>
                    {achievements.length > 0 && (
                        <span className="rewards-profile__achievements-count">
                            {achievements.filter(a => a.is_earned).length} / {achievements.length} earned
                        </span>
                    )}
                </div>
                {loadingAchievements ? (
                    <div className="rewards-profile__achievements-loading">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rewards-profile__achievement-skeleton"></div>
                        ))}
                    </div>
                ) : achievements.length > 0 ? (
                    <div className="rewards-profile__achievements-grid">
                        {achievements.map((achievement) => (
                            <div 
                                key={achievement.id}
                                className={`rewards-profile__achievement ${
                                    achievement.is_earned ? 'rewards-profile__achievement--earned' : ''
                                }`}
                            >
                                <span className="rewards-profile__achievement-icon">
                                    {getAchievementIcon(achievement)}
                                </span>
                                <div className="rewards-profile__achievement-info">
                                    <h4 className="rewards-profile__achievement-title">
                                        {achievement.name}
                                    </h4>
                                    <p className="rewards-profile__achievement-description">
                                        {achievement.description}
                                    </p>
                                    {achievement.is_earned && achievement.earned_at && (
                                        <span className="rewards-profile__achievement-date">
                                            Earned {formatDate(achievement.earned_at)}
                                        </span>
                                    )}
                                </div>
                                {achievement.is_earned && (
                                    <span className="rewards-profile__achievement-checkmark">✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rewards-profile__achievements-empty">
                        <span className="rewards-profile__achievements-empty-icon">🏅</span>
                        <p>No achievements available yet</p>
                    </div>
                )}
            </div>

            {/* Recent Transactions */}
            {recentTransactions && recentTransactions.length > 0 && (
                <div className="rewards-profile__transactions">
                    <h3>Recent Activity</h3>
                    <div className="rewards-profile__transactions-list">
                        {recentTransactions.slice(0, 5).map((transaction, index) => (
                            <div key={index} className="rewards-profile__transaction">
                                <div className="rewards-profile__transaction-info">
                                    <span className="rewards-profile__transaction-type">
                                        {transaction.action}
                                    </span>
                                    <span className="rewards-profile__transaction-description">
                                        {transaction.description}
                                    </span>
                                </div>
                                <div className="rewards-profile__transaction-amount">
                                    <span className={`rewards-profile__transaction-points ${
                                        transaction.points_change > 0 ? 'positive' : 'negative'
                                    }`}>
                                        {transaction.points_change > 0 ? '+' : ''}{transaction.points_change} pts
                                    </span>
                                    {transaction.credits_change !== 0 && (
                                        <span className={`rewards-profile__transaction-credits ${
                                            transaction.credits_change > 0 ? 'positive' : 'negative'
                                        }`}>
                                            {transaction.credits_change > 0 ? '+' : ''}{transaction.credits_change} credits
                                        </span>
                                    )}
                                </div>
                                <span className="rewards-profile__transaction-date">
                                    {formatDate(transaction.created_at)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RewardsProfile;