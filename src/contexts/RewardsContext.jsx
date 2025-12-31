/**
 * Rewards Context
 * Provides rewards state and methods throughout the React app
 * Manages currency balances, achievements, leaderboards, and reward notifications
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import rewardsService from '../services/rewardsService.js';
import { useAuth } from './AuthContext.jsx';

const RewardsContext = createContext();

export const useRewards = () => {
    const context = useContext(RewardsContext);
    if (!context) {
        throw new Error('useRewards must be used within a RewardsProvider');
    }
    return context;
};

export { RewardsContext };

export const RewardsProvider = ({ children }) => {
    // Core state
    const [balance, setBalance] = useState({ points: 0, credits: 0 });
    const [stats, setStats] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [rankings, setRankings] = useState({});
    const [recentTransactions, setRecentTransactions] = useState([]);
    
    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rewardNotification, setRewardNotification] = useState(null);
    const [leaderboards, setLeaderboards] = useState({});
    
    // Loading states for specific operations
    const [loadingStates, setLoadingStates] = useState({
        balance: false,
        stats: false,
        achievements: false,
        leaderboards: false,
        transactions: false
    });

    const { user, isAuthenticated } = useAuth();

    // Set specific loading state
    const setSpecificLoading = useCallback((key, isLoading) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: isLoading
        }));
    }, []);

    // Error handling
    const handleError = useCallback((error, operation = 'operation') => {
        console.error(`Rewards ${operation} error:`, error);
        setError(error.message || `Failed to ${operation}`);
        
        // Auto-clear error after 5 seconds
        setTimeout(() => {
            setError(null);
        }, 5000);
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Initialize rewards data when user is authenticated
    const initializeRewards = useCallback(async () => {
        if (!isAuthenticated || !user) {
            // Reset state for unauthenticated users
            setBalance({ points: 0, credits: 0 });
            setStats(null);
            setAchievements([]);
            setRankings({});
            setRecentTransactions([]);
            setLeaderboards({});
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Load initial data in parallel
            const [balanceData, statsData, achievementsData, rankingsData] = await Promise.all([
                rewardsService.getBalance().catch(err => ({ points: 0, credits: 0 })),
                rewardsService.getStats().catch(err => null),
                rewardsService.getAchievements().catch(err => []),
                rewardsService.getUserRankings().catch(err => ({}))
            ]);

            setBalance(balanceData || { points: 0, credits: 0 });
            setStats(statsData);
            setAchievements(achievementsData);
            setRankings(rankingsData);

            // Load recent transactions
            try {
                const transactionsData = await rewardsService.getTransactionHistory({ limit: 20 });
                setRecentTransactions(transactionsData.transactions || []);
            } catch (error) {
                console.warn('Failed to load recent transactions:', error);
            }

            // Load global leaderboard
            try {
                const globalLeaderboard = await rewardsService.getLeaderboard('global', { limit: 10 });
                setLeaderboards(prev => ({
                    ...prev,
                    global: globalLeaderboard
                }));
            } catch (error) {
                console.warn('Failed to load global leaderboard:', error);
            }

        } catch (error) {
            handleError(error, 'initialize rewards');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user, handleError]);

    // Refresh balance
    const refreshBalance = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setSpecificLoading('balance', true);
            const balanceData = await rewardsService.getBalance();
            setBalance(balanceData || { points: 0, credits: 0 });
        } catch (error) {
            handleError(error, 'refresh balance');
            // Set fallback balance on error
            setBalance({ points: 0, credits: 0 });
        } finally {
            setSpecificLoading('balance', false);
        }
    }, [isAuthenticated, handleError, setSpecificLoading]);

    // Refresh stats
    const refreshStats = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setSpecificLoading('stats', true);
            const statsData = await rewardsService.getStats();
            setStats(statsData);
        } catch (error) {
            handleError(error, 'refresh stats');
        } finally {
            setSpecificLoading('stats', false);
        }
    }, [isAuthenticated, handleError, setSpecificLoading]);

    // Refresh achievements
    const refreshAchievements = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setSpecificLoading('achievements', true);
            const achievementsData = await rewardsService.getAchievements();
            setAchievements(achievementsData);
        } catch (error) {
            handleError(error, 'refresh achievements');
        } finally {
            setSpecificLoading('achievements', false);
        }
    }, [isAuthenticated, handleError, setSpecificLoading]);

    // Load leaderboard
    const loadLeaderboard = useCallback(async (type, params = {}) => {
        try {
            setSpecificLoading('leaderboards', true);
            const leaderboardData = await rewardsService.getLeaderboard(type, params);
            
            setLeaderboards(prev => ({
                ...prev,
                [type]: leaderboardData
            }));

            return leaderboardData;
        } catch (error) {
            handleError(error, `load ${type} leaderboard`);
            return null;
        } finally {
            setSpecificLoading('leaderboards', false);
        }
    }, [isAuthenticated, handleError, setSpecificLoading]);

    // Clear leaderboard cache
    const clearLeaderboardCache = useCallback(() => {
        setLeaderboards({});
    }, []);

    // Load transaction history
    const loadTransactions = useCallback(async (params = {}) => {
        if (!isAuthenticated) return;

        try {
            setSpecificLoading('transactions', true);
            const transactionData = await rewardsService.getTransactionHistory(params);
            
            if (params.offset === 0 || !params.offset) {
                // New fetch, replace transactions
                setRecentTransactions(transactionData.transactions || []);
            } else {
                // Pagination, append transactions
                setRecentTransactions(prev => [
                    ...prev,
                    ...(transactionData.transactions || [])
                ]);
            }

            return transactionData;
        } catch (error) {
            handleError(error, 'load transactions');
            return null;
        } finally {
            setSpecificLoading('transactions', false);
        }
    }, [isAuthenticated, handleError, setSpecificLoading]);

    // Process reward notification (called after quiz/game completion)
    const processReward = useCallback(async (rewardData) => {
        if (!rewardData || !rewardsService.validateRewardData(rewardData)) {
            console.warn('Invalid reward data:', rewardData);
            return;
        }

        try {
            // Show notification
            setRewardNotification({
                ...rewardData,
                timestamp: Date.now(),
                id: `reward-${Date.now()}-${Math.random()}`
            });

            // Update balance optimistically
            setBalance(prev => ({
                points: prev.points + (rewardData.points_earned || 0),
                credits: prev.credits + (rewardData.credits_earned || 0)
            }));

            // Process through service for cache management
            await rewardsService.processRewardNotification(rewardData);

            // Refresh data in background
            setTimeout(() => {
                refreshBalance();
                refreshStats();
            }, 1000);

        } catch (error) {
            console.error('Error processing reward:', error);
            // Refresh balance to ensure accuracy
            refreshBalance();
        }
    }, [refreshBalance, refreshStats]);

    // Dismiss reward notification
    const dismissRewardNotification = useCallback(() => {
        setRewardNotification(null);
    }, []);

    // Refresh all rewards data
    const refreshAllData = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            await rewardsService.refreshAllData();
            await initializeRewards();
        } catch (error) {
            handleError(error, 'refresh all data');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, initializeRewards, handleError]);

    // Get user's position in leaderboard
    const getUserPosition = useCallback(async (leaderboardType) => {
        if (!isAuthenticated || !user?.id) return null;

        try {
            return await rewardsService.getUserLeaderboardPosition(leaderboardType, user.id);
        } catch (error) {
            console.error(`Error getting user position in ${leaderboardType}:`, error);
            return null;
        }
    }, [isAuthenticated, user?.id]);

    // Format currency for display
    const formatCurrency = useCallback((amount, type) => {
        return rewardsService.formatCurrency(amount, type);
    }, []);

    // Get tier information for a score
    const getTierInfo = useCallback((score, activityType = 'QUIZ_COMPLETION') => {
        return rewardsService.calculateTier(score, activityType);
    }, []);

    // Set up real-time updates
    useEffect(() => {
        if (!isAuthenticated) return;

        const unsubscribe = rewardsService.onUpdate(({ type, data }) => {
            switch (type) {
                case 'balance-updated':
                    setBalance(data);
                    break;
                case 'reward-earned':
                    processReward(data);
                    break;
                case 'cache-cleared':
                case 'user-cache-cleared':
                    // Optionally refresh data when cache is cleared
                    break;
                case 'data-refreshed':
                    initializeRewards();
                    break;
            }
        });

        return unsubscribe;
    }, [isAuthenticated, processReward, initializeRewards]);

    // Initialize when authentication state changes
    useEffect(() => {
        initializeRewards();

        // Clear user cache when logging out
        if (!isAuthenticated) {
            rewardsService.clearUserCache();
        }
    }, [initializeRewards, isAuthenticated]);

    // Auto-dismiss reward notifications after 10 seconds
    useEffect(() => {
        if (rewardNotification) {
            const timer = setTimeout(() => {
                dismissRewardNotification();
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [rewardNotification, dismissRewardNotification]);

    const value = {
        // Core state
        balance,
        stats,
        achievements,
        rankings,
        recentTransactions,
        leaderboards,

        // UI state
        loading,
        loadingStates,
        error,
        rewardNotification,

        // Computed values
        totalPointsEarned: stats?.total_points_earned || 0,
        totalCreditsEarned: stats?.total_credits_earned || 0,
        globalRank: rankings?.global_points_rank || null,
        weeklyRank: rankings?.weekly_rank || null,
        hasAchievements: achievements.length > 0,
        hasRecentActivity: recentTransactions.length > 0,

        // Actions
        refreshBalance,
        refreshStats,
        refreshAchievements,
        loadLeaderboard,
        clearLeaderboardCache,
        loadTransactions,
        processReward,
        dismissRewardNotification,
        refreshAllData,
        getUserPosition,
        clearError,

        // Utility functions
        formatCurrency,
        getTierInfo,

        // Service access (for advanced usage)
        rewardsService
    };

    return (
        <RewardsContext.Provider value={value}>
            {children}
        </RewardsContext.Provider>
    );
};