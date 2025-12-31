import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRewards } from '../../contexts/RewardsContext';
import rewardsService from '../../services/rewardsService';
import { CurrencyDisplay, Leaderboard, RewardsProfile } from '../rewards';
import './AdminRewardsDashboard.css';

const AdminRewardsDashboard = () => {
    const { user } = useAuth();
    const { refreshBalance } = useRewards();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Overview data
    const [systemStats, setSystemStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    
    // Users management
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    
    // System settings - DATABASE VALUES AS SOURCE OF TRUTH
    const [rewardSettings, setRewardSettings] = useState({
        quiz_base_points: 10,
        quiz_difficulty_multiplier_easy: 1.0,
        quiz_difficulty_multiplier_medium: 1.2,
        quiz_difficulty_multiplier_hard: 1.5,
        myths_facts_points: 5,
        streak_bonus_threshold: 3,
        streak_bonus_multiplier: 1.1,
        daily_limit_points: 500,
        daily_limit_credits: 200,  // FIXED: Match database daily_credit_cap_quizzes
        pure_scoring_mode: false   // ADDED: Pure scoring mode setting
    });
    
    // Anti-gaming settings
    const [antiGamingSettings, setAntiGamingSettings] = useState({
        max_attempts_per_quiz_per_day: 3,
        min_time_between_attempts: 300, // 5 minutes
        suspicious_score_threshold: 0.95,
        rapid_completion_threshold: 30, // seconds
        enable_ip_tracking: true,
        enable_behavior_analysis: true
    });

    // Check admin permissions
    const isAdmin = user && (user.role === 'admin' || user.is_superuser);

    useEffect(() => {
        if (isAdmin && activeTab === 'overview') {
            loadSystemStats();
            loadRecentActivity();
        }
    }, [isAdmin, activeTab]);

    useEffect(() => {
        if (isAdmin && activeTab === 'users') {
            loadUsers();
        }
    }, [isAdmin, activeTab]);

    const loadSystemStats = async () => {
        try {
            setLoading(true);
            const stats = await rewardsService.getSystemStats();
            setSystemStats(stats);
        } catch (err) {
            setError('Failed to load system statistics');
            console.error('Error loading system stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadRecentActivity = async () => {
        try {
            const activity = await rewardsService.getRecentActivity({ limit: 20 });
            setRecentActivity(activity);
        } catch (err) {
            console.error('Error loading recent activity:', err);
        }
    };

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await rewardsService.getUsersList({ 
                search: userSearchTerm,
                limit: 50 
            });
            setUsers(usersData);
        } catch (err) {
            setError('Failed to load users');
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = async (user) => {
        try {
            setSelectedUser(user);
            // Load detailed user data if needed
        } catch (err) {
            console.error('Error selecting user:', err);
        }
    };

    const handleAdjustBalance = async (userId, adjustment) => {
        try {
            setLoading(true);
            await rewardsService.adjustUserBalance(userId, adjustment);
            await loadUsers(); // Refresh user list
            setSelectedUser(null);
            await refreshBalance(); // Refresh admin's balance display
        } catch (err) {
            setError('Failed to adjust user balance');
            console.error('Error adjusting balance:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetUserProgress = async (userId) => {
        if (!window.confirm('Are you sure you want to reset this user\'s progress? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            await rewardsService.resetUserProgress(userId);
            await loadUsers();
            setSelectedUser(null);
        } catch (err) {
            setError('Failed to reset user progress');
            console.error('Error resetting progress:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSettings = async () => {
        try {
            setLoading(true);
            await rewardsService.updateSystemSettings({
                rewards: rewardSettings,
                antiGaming: antiGamingSettings
            });
            setError(null);
            alert('Settings updated successfully!');
        } catch (err) {
            setError('Failed to update settings');
            console.error('Error updating settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat().format(value);
    };

    if (!isAdmin) {
        return (
            <div className="admin-dashboard">
                <div className="admin-dashboard__unauthorized">
                    <span className="admin-dashboard__unauthorized-icon">🔒</span>
                    <h2>Access Denied</h2>
                    <p>You don't have permission to access the admin dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard__header">
                <h1 className="admin-dashboard__title">Rewards Administration</h1>
                <div className="admin-dashboard__user-info">
                    <CurrencyDisplay variant="compact" showBoth={true} />
                    <span className="admin-dashboard__user-name">{user.username}</span>
                </div>
            </div>

            {error && (
                <div className="admin-dashboard__error">
                    <span className="admin-dashboard__error-icon">⚠️</span>
                    {error}
                    <button 
                        onClick={() => setError(null)}
                        className="admin-dashboard__error-close"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="admin-dashboard__tabs">
                <button
                    className={`admin-dashboard__tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <span className="admin-dashboard__tab-icon">📊</span>
                    Overview
                </button>
                <button
                    className={`admin-dashboard__tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <span className="admin-dashboard__tab-icon">👥</span>
                    Users
                </button>
                <button
                    className={`admin-dashboard__tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('leaderboard')}
                >
                    <span className="admin-dashboard__tab-icon">🏆</span>
                    Leaderboard
                </button>
                <button
                    className={`admin-dashboard__tab ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    <span className="admin-dashboard__tab-icon">⚙️</span>
                    Settings
                </button>
                <button
                    className="admin-dashboard__tab admin-dashboard__tab--external"
                    onClick={() => navigate('/admin/quiz-mvf-config')}
                    title="Quiz & MVF Configuration Panel"
                >
                    <span className="admin-dashboard__tab-icon">🎯</span>
                    Quiz/MVF Config
                </button>
                <button
                    className="admin-dashboard__tab admin-dashboard__tab--external"
                    onClick={() => navigate('/admin/collections')}
                    title="Collection Management Panel"
                >
                    <span className="admin-dashboard__tab-icon">📚</span>
                    Collections
                </button>
            </div>

            <div className="admin-dashboard__content">
                {activeTab === 'overview' && (
                    <div className="admin-dashboard__overview">
                        <div className="admin-dashboard__stats-grid">
                            {systemStats ? (
                                <>
                                    <div className="admin-dashboard__stat-card">
                                        <h3>Total Users</h3>
                                        <div className="admin-dashboard__stat-value">
                                            {formatCurrency(systemStats.total_users)}
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__stat-card">
                                        <h3>Active Users</h3>
                                        <div className="admin-dashboard__stat-value">
                                            {formatCurrency(systemStats.active_users)}
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__stat-card">
                                        <h3>Total Points Distributed</h3>
                                        <div className="admin-dashboard__stat-value">
                                            {formatCurrency(systemStats.total_points_distributed)}
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__stat-card">
                                        <h3>Total Credits Distributed</h3>
                                        <div className="admin-dashboard__stat-value">
                                            {formatCurrency(systemStats.total_credits_distributed)}
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__stat-card">
                                        <h3>Quizzes Completed Today</h3>
                                        <div className="admin-dashboard__stat-value">
                                            {formatCurrency(systemStats.quizzes_completed_today)}
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__stat-card">
                                        <h3>Average User Score</h3>
                                        <div className="admin-dashboard__stat-value">
                                            {systemStats.average_user_score?.toFixed(1)}%
                                        </div>
                                    </div>
                                </>
                            ) : loading ? (
                                <div className="admin-dashboard__loading">Loading statistics...</div>
                            ) : (
                                <div className="admin-dashboard__error">Failed to load statistics</div>
                            )}
                        </div>

                        <div className="admin-dashboard__recent-activity">
                            <h2>Recent Activity</h2>
                            {recentActivity.length > 0 ? (
                                <div className="admin-dashboard__activity-list">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="admin-dashboard__activity-item">
                                            <div className="admin-dashboard__activity-user">
                                                {activity.username}
                                            </div>
                                            <div className="admin-dashboard__activity-action">
                                                {activity.action}
                                            </div>
                                            <div className="admin-dashboard__activity-reward">
                                                {activity.points_change > 0 && (
                                                    <span className="positive">+{activity.points_change} pts</span>
                                                )}
                                                {activity.credits_change > 0 && (
                                                    <span className="positive">+{activity.credits_change} credits</span>
                                                )}
                                            </div>
                                            <div className="admin-dashboard__activity-time">
                                                {formatDate(activity.created_at)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="admin-dashboard__empty">No recent activity</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="admin-dashboard__users">
                        <div className="admin-dashboard__users-header">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                className="admin-dashboard__search"
                            />
                            <button
                                onClick={loadUsers}
                                className="admin-dashboard__search-button"
                                disabled={loading}
                            >
                                Search
                            </button>
                        </div>

                        <div className="admin-dashboard__users-list">
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    className={`admin-dashboard__user-card ${
                                        selectedUser?.id === user.id ? 'selected' : ''
                                    }`}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <div className="admin-dashboard__user-info">
                                        <h3>{user.username}</h3>
                                        <p>{user.email}</p>
                                        <div className="admin-dashboard__user-stats">
                                            <span>Points: {formatCurrency(user.points_balance || 0)}</span>
                                            <span>Credits: {formatCurrency(user.credits_balance || 0)}</span>
                                            <span>Tier: {user.tier || 'Bronze'}</span>
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__user-actions">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const points = prompt('Enter points to add (negative to subtract):');
                                                if (points !== null) {
                                                    handleAdjustBalance(user.id, { 
                                                        points: parseInt(points) || 0,
                                                        credits: 0,
                                                        reason: 'Admin adjustment'
                                                    });
                                                }
                                            }}
                                            className="admin-dashboard__action-button"
                                        >
                                            Adjust Points
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const credits = prompt('Enter credits to add (negative to subtract):');
                                                if (credits !== null) {
                                                    handleAdjustBalance(user.id, { 
                                                        points: 0,
                                                        credits: parseInt(credits) || 0,
                                                        reason: 'Admin adjustment'
                                                    });
                                                }
                                            }}
                                            className="admin-dashboard__action-button"
                                        >
                                            Adjust Credits
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleResetUserProgress(user.id);
                                            }}
                                            className="admin-dashboard__action-button danger"
                                        >
                                            Reset Progress
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div className="admin-dashboard__leaderboard">
                        <Leaderboard />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="admin-dashboard__settings">
                        <div className="admin-dashboard__settings-section">
                            <h2>Reward Settings</h2>
                            <div className="admin-dashboard__settings-grid">
                                <div className="admin-dashboard__setting">
                                    <label>Quiz Base Points</label>
                                    <input
                                        type="number"
                                        value={rewardSettings.quiz_base_points}
                                        onChange={(e) => setRewardSettings(prev => ({
                                            ...prev,
                                            quiz_base_points: parseInt(e.target.value) || 0
                                        }))}
                                    />
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>Easy Multiplier</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={rewardSettings.quiz_difficulty_multiplier_easy}
                                        onChange={(e) => setRewardSettings(prev => ({
                                            ...prev,
                                            quiz_difficulty_multiplier_easy: parseFloat(e.target.value) || 1.0
                                        }))}
                                    />
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>Medium Multiplier</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={rewardSettings.quiz_difficulty_multiplier_medium}
                                        onChange={(e) => setRewardSettings(prev => ({
                                            ...prev,
                                            quiz_difficulty_multiplier_medium: parseFloat(e.target.value) || 1.2
                                        }))}
                                    />
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>Hard Multiplier</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={rewardSettings.quiz_difficulty_multiplier_hard}
                                        onChange={(e) => setRewardSettings(prev => ({
                                            ...prev,
                                            quiz_difficulty_multiplier_hard: parseFloat(e.target.value) || 1.5
                                        }))}
                                    />
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>Myths vs Facts Points</label>
                                    <input
                                        type="number"
                                        value={rewardSettings.myths_facts_points}
                                        onChange={(e) => setRewardSettings(prev => ({
                                            ...prev,
                                            myths_facts_points: parseInt(e.target.value) || 0
                                        }))}
                                    />
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>Daily Points Limit</label>
                                    <input
                                        type="number"
                                        value={rewardSettings.daily_limit_points}
                                        onChange={(e) => setRewardSettings(prev => ({
                                            ...prev,
                                            daily_limit_points: parseInt(e.target.value) || 0
                                        }))}
                                    />
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>Daily Credits Limit</label>
                                    <input
                                        type="number"
                                        value={rewardSettings.daily_limit_credits}
                                        onChange={(e) => setRewardSettings(prev => ({
                                            ...prev,
                                            daily_limit_credits: parseInt(e.target.value) || 0
                                        }))}
                                    />
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={rewardSettings.pure_scoring_mode}
                                            onChange={(e) => setRewardSettings(prev => ({
                                                ...prev,
                                                pure_scoring_mode: e.target.checked
                                            }))}
                                        />
                                        Pure Scoring Mode (No Bonuses)
                                    </label>
                                    <small style={{display: 'block', marginTop: '5px', color: '#666'}}>
                                        When enabled, only base tier rewards are given - no time bonuses, streak bonuses, or multipliers
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div className="admin-dashboard__settings-section">
                            <h2>Anti-Gaming Settings</h2>
                            <div className="admin-dashboard__settings-grid">
                                <div className="admin-dashboard__setting">
                                    <label>Max Quiz Attempts Per Day</label>
                                    <input
                                        type="number"
                                        value={antiGamingSettings.max_attempts_per_quiz_per_day}
                                        onChange={(e) => setAntiGamingSettings(prev => ({
                                            ...prev,
                                            max_attempts_per_quiz_per_day: parseInt(e.target.value) || 1
                                        }))}
                                    />
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>Min Time Between Attempts (seconds)</label>
                                    <input
                                        type="number"
                                        value={antiGamingSettings.min_time_between_attempts}
                                        onChange={(e) => setAntiGamingSettings(prev => ({
                                            ...prev,
                                            min_time_between_attempts: parseInt(e.target.value) || 0
                                        }))}
                                    />
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>Suspicious Score Threshold</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="1"
                                        value={antiGamingSettings.suspicious_score_threshold}
                                        onChange={(e) => setAntiGamingSettings(prev => ({
                                            ...prev,
                                            suspicious_score_threshold: parseFloat(e.target.value) || 0.95
                                        }))}
                                    />
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={antiGamingSettings.enable_ip_tracking}
                                            onChange={(e) => setAntiGamingSettings(prev => ({
                                                ...prev,
                                                enable_ip_tracking: e.target.checked
                                            }))}
                                        />
                                        Enable IP Tracking
                                    </label>
                                </div>
                                <div className="admin-dashboard__setting">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={antiGamingSettings.enable_behavior_analysis}
                                            onChange={(e) => setAntiGamingSettings(prev => ({
                                                ...prev,
                                                enable_behavior_analysis: e.target.checked
                                            }))}
                                        />
                                        Enable Behavior Analysis
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="admin-dashboard__settings-actions">
                            <button
                                onClick={handleUpdateSettings}
                                disabled={loading}
                                className="admin-dashboard__save-button"
                            >
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {loading && (
                <div className="admin-dashboard__loading-overlay">
                    <div className="admin-dashboard__spinner"></div>
                </div>
            )}
        </div>
    );
};

export default AdminRewardsDashboard;