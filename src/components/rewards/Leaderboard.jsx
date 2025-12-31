/**
 * Enhanced Leaderboard Component - Nature's Elite Edition 🌿
 * Beautiful wildlife-themed leaderboard with 3-tier podium design
 * Displays multiple types of leaderboards with rankings and user positions
 * Supports global, weekly, monthly, quiz performance, and category leaderboards
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useRewards } from '../../contexts/RewardsContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Leaderboard.css';

// Import icons
import refreshIcon from '../../assets/icons/icons8-refresh-100.png';
import monthlyIcon from '../../assets/icons/icons8-stopwatch-40.png';

// Animal rank system - Wildlife themed titles (top 10 only, 11+ generic)
const ANIMAL_RANKS = {
    1: { animal: '🦁', title: 'King of the Jungle', color: '#FFD700' },
    2: { animal: '🦅', title: 'Eagle of the Sky', color: '#C0C0C0' },
    3: { animal: '🐆', title: 'Stealth Leopard', color: '#CD7F32' },
    4: { animal: '🐅', title: 'Fierce Tiger', color: '#FF8C00' },
    5: { animal: '🦏', title: 'Mighty Rhino', color: '#8B4513' },
    6: { animal: '🐘', title: 'Wise Elephant', color: '#696969' },
    7: { animal: '🦒', title: 'Tall Watcher', color: '#DAA520' },
    8: { animal: '🦓', title: 'Swift Runner', color: '#000000' },
    9: { animal: '🦘', title: 'Agile Jumper', color: '#BC8F8F' },
    10: { animal: '🐊', title: 'River Guardian', color: '#2E8B57' }
};

// Get animal rank info based on position (generic for 11+)
const getAnimalRank = (rank) => {
    return ANIMAL_RANKS[rank] || { animal: '🐾', title: 'Wildlife Protector', color: '#8BC34A' };
};

const Leaderboard = ({ 
    defaultType = 'global',
    showTabs = true,
    limit = 50,
    categoryId = null,
    className = ''
}) => {
    const [activeType, setActiveType] = useState(defaultType);
    const [currentData, setCurrentData] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { loadLeaderboard, getUserPosition, loadingStates, leaderboards } = useRewards();
    const { user, isAuthenticated } = useAuth();

    // Available leaderboard types - Updated icons
    const leaderboardTypes = [
        { id: 'weekly', label: 'Weekly', icon: '📅' },
        { id: 'monthly', label: 'Monthly', icon: monthlyIcon },
        { id: 'alltime', label: 'All Time', icon: '🏆' },
    ];

    // Add category leaderboard if categoryId is provided
    const availableTypes = categoryId ? 
        [...leaderboardTypes, { id: 'category', label: 'Category', icon: '📂' }] :
        leaderboardTypes;

    // Mock data generator for testing - Creates 15 mock entries
    const generateMockData = () => {
        const mockNames = [
            'Sarah Wildlife', 'John Conservator', 'Emma Nature', 'Mike Ranger',
            'Lisa Explorer', 'David Tracker', 'Anna Guardian', 'Tom Naturalist',
            'Maria Protector', 'Chris Keeper', 'Alex Watcher', 'Sophie Guardian',
            'Ryan Defender', 'Olivia Ranger', 'James Protector'
        ];
        
        const mockParticipants = mockNames.map((name, index) => ({
            user_id: `mock-${index + 1}`,
            username: name,
            score: 850 - (index * 50), // Decreasing scores
            streak: Math.floor(Math.random() * 10) + 1,
            avatar_url: null,
            rank: index + 1
        }));
        
        return {
            type: 'weekly',
            participants: mockParticipants,
            stats: {
                total_participants: 15,
                average_score: 425,
                top_score: 850
            },
            last_updated: new Date().toISOString()
        };
    };

    // Load leaderboard data
    const loadData = useCallback(async (type) => {
        try {
            setError(null);
            
            const params = { limit };
            if (type === 'category' && categoryId) {
                params.category_id = categoryId;
            }

            const data = await loadLeaderboard(type, params);
            
            // Add mock data for weekly leaderboard if there's less than 3 entries
            if (type === 'weekly' && (!data.participants || data.participants.length < 3)) {
                console.log('🎭 Using mock data for weekly leaderboard to showcase design');
                const mockData = generateMockData();
                setCurrentData(mockData);
            } else {
                setCurrentData(data);
            }

            // Get user position if authenticated
            if (isAuthenticated && user?.id) {
                const position = await getUserPosition(type);
                setUserPosition(position);
            }
        } catch (err) {
            console.error(`Error loading ${type} leaderboard:`, err);
            setError(err.message || 'Failed to load leaderboard');
        }
    }, [loadLeaderboard, getUserPosition, isAuthenticated, user?.id, limit, categoryId]);

    // Load data when active type changes
    useEffect(() => {
        loadData(activeType);
    }, [activeType, loadData]);

    // Refresh data when leaderboard cache is cleared (e.g., after quiz completion)
    useEffect(() => {
        if (!leaderboards || Object.keys(leaderboards).length === 0) {
            // Cache was cleared, refresh current data
            loadData(activeType);
        }
    }, [leaderboards, activeType, loadData]);

    // Handle tab change
    const handleTabChange = (type) => {
        if (type !== activeType && !loadingStates.leaderboards) {
            setActiveType(type);
        }
    };

    // Refresh data
    const handleRefresh = async () => {
        if (loadingStates.leaderboards) return;
        
        setIsRefreshing(true);
        
        try {
            await loadData(activeType);
        } finally {
            // Reset the refreshing state after a delay to allow GIF to complete animation
            setTimeout(() => {
                setIsRefreshing(false);
            }, 1500); // Slightly longer to ensure GIF completes
        }
    };

    // Format rank with medal icons for top 3
    const formatRank = (rank) => {
        const medals = {
            1: '🥇',
            2: '🥈', 
            3: '🥉'
        };
        
        return medals[rank] || `#${rank}`;
    };

    // Format score based on leaderboard type
    const formatScore = (entry, type) => {
        switch (type) {
            case 'weekly':
            case 'monthly':
            case 'alltime':
                return `${entry.score.toLocaleString()} pts`;
            case 'quiz':
                return `${entry.score}% avg`;
            case 'category':
                return `${entry.score.toLocaleString()} pts`;
            default:
                return entry.score.toLocaleString();
        }
    };



    // Auto-refresh leaderboard when user returns to the page/tab
    useEffect(() => {
        const handleFocus = () => {
            // Only refresh if not currently loading and component is mounted
            if (!loadingStates.leaderboards && !isRefreshing) {
                loadData(activeType);
            }
        };

        window.addEventListener('focus', handleFocus);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [activeType, loadData, loadingStates.leaderboards, isRefreshing]);

    // Separate top 3 for podium and rest for list
    const topThree = currentData?.participants?.slice(0, 3) || [];
    const restOfPack = currentData?.participants?.slice(3) || [];

    return (
        <div className={`leaderboard leaderboard--nature ${className}`}>
            {/* Show authentication prompt only if user tries to access personal position */}
            {!isAuthenticated && (
                <div className="leaderboard__auth-prompt">
                    🏆 <strong>Sign in</strong> to see your ranking and compete with other wildlife enthusiasts!
                </div>
            )}

            {/* Header with tabs - Nature themed */}
            {showTabs && (
                <div className="leaderboard__header">
                    <div className="leaderboard__title">
                        <span className="leaderboard__title-icon">🦁</span>
                        <h2 className="leaderboard__title-text">JUNGLE RANKINGS</h2>
                    </div>
                    <div className="leaderboard__tabs">
                        {availableTypes.map(type => (
                            <button
                                key={type.id}
                                className={`leaderboard__tab ${activeType === type.id ? 'leaderboard__tab--active' : ''}`}
                                onClick={() => handleTabChange(type.id)}
                                disabled={loadingStates.leaderboards}
                            >
                                {typeof type.icon === 'string' && type.icon.startsWith('data:') || type.icon.includes('.png') ? (
                                    <img src={type.icon} alt={type.label} className="leaderboard__tab-icon-img" />
                                ) : (
                                    <span className="leaderboard__tab-icon">{type.icon}</span>
                                )}
                                <span className="leaderboard__tab-label">{type.label}</span>
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        className={`leaderboard__refresh ${loadingStates.leaderboards ? 'leaderboard__refresh--loading' : ''}`}
                        onClick={handleRefresh}
                        disabled={loadingStates.leaderboards || isRefreshing}
                        title="Refresh leaderboard"
                    >
                        <img 
                            src={refreshIcon}
                            alt="Refresh"
                            className={`leaderboard__refresh-icon ${isRefreshing ? 'leaderboard__refresh-icon--animating' : ''}`}
                        />
                    </button>
                </div>
            )}

            {/* User position indicator - Enhanced */}
            {userPosition && !loadingStates.leaderboards && (
                <div className="leaderboard__user-position">
                    <div className="leaderboard__user-position-content">
                        <span className="leaderboard__user-position-icon">🏆</span>
                        {user?.username && (
                            <span className="leaderboard__user-position-name">👤 {user.username}</span>
                        )}
                        <div className="leaderboard__user-position-details">
                            <span className="leaderboard__user-position-label">Your Position:</span>
                            <span className="leaderboard__user-position-rank">
                                {formatRank(userPosition.rank || userPosition)} / {currentData?.stats?.total_participants || 0}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="leaderboard__content">
                {loadingStates.leaderboards ? (
                    <div className="leaderboard__loading">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="leaderboard__skeleton">
                                <div className="leaderboard__skeleton-rank"></div>
                                <div className="leaderboard__skeleton-avatar"></div>
                                <div className="leaderboard__skeleton-info">
                                    <div className="leaderboard__skeleton-name"></div>
                                    <div className="leaderboard__skeleton-score"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="leaderboard__error">
                        <div className="leaderboard__error-icon">⚠️</div>
                        <h3>Unable to load leaderboard</h3>
                        <p>{error}</p>
                        <button 
                            className="leaderboard__error-retry"
                            onClick={handleRefresh}
                        >
                            Try Again
                        </button>
                    </div>
                ) : !currentData || !currentData.participants || currentData.participants.length === 0 ? (
                    <div className="leaderboard__empty">
                        <div className="leaderboard__empty-icon">🏆</div>
                        <h3>No rankings yet</h3>
                        <p>Be the first to earn points and claim the top spot!</p>
                    </div>
                ) : (
                    <>
                        {/* Wildlife Champions Podium - Top 3 */}
                        {topThree.length > 0 && (
                            <div className="leaderboard__podium-section">
                                <div className="leaderboard__podium-header">
                                    <span className="leaderboard__podium-icon">🎖️</span>
                                    <h3 className="leaderboard__podium-title">WILDLIFE CHAMPIONS PODIUM</h3>
                                    <span className="leaderboard__podium-icon">🎖️</span>
                                </div>
                                
                                <div className="leaderboard__podium">
                                    {/* Second Place - Left */}
                                    {topThree[1] && (
                                        <div className={`leaderboard__podium-card leaderboard__podium-card--silver ${topThree[1].user_id === user?.id ? 'leaderboard__podium-card--current-user' : ''}`}>
                                            <div className="leaderboard__podium-medal">🥈</div>
                                            <div className="leaderboard__podium-animal">{getAnimalRank(2).animal}</div>
                                            <div className="leaderboard__podium-rank">2</div>
                                            <div className="leaderboard__podium-avatar">
                                                {topThree[1].avatar_url ? (
                                                    <img src={topThree[1].avatar_url} alt={topThree[1].username} />
                                                ) : (
                                                    <div className="leaderboard__podium-avatar-placeholder">
                                                        {(topThree[1].username || 'U')[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="leaderboard__podium-username">{topThree[1].username || 'Anonymous'}</div>
                                            <div className="leaderboard__podium-score">⭐ {formatScore(topThree[1], activeType)}</div>
                                            <div className="leaderboard__podium-title-text">{getAnimalRank(2).title}</div>
                                            {topThree[1].user_id === user?.id && (
                                                <div className="leaderboard__podium-you-badge">YOU</div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* First Place - Center */}
                                    {topThree[0] && (
                                        <div className={`leaderboard__podium-card leaderboard__podium-card--gold leaderboard__podium-card--champion ${topThree[0].user_id === user?.id ? 'leaderboard__podium-card--current-user' : ''}`}>
                                            <div className="leaderboard__podium-medal">🥇</div>
                                            <div className="leaderboard__podium-animal leaderboard__podium-animal--big">{getAnimalRank(1).animal}</div>
                                            <div className="leaderboard__podium-rank">1</div>
                                            <div className="leaderboard__podium-crown">👑</div>
                                            <div className="leaderboard__podium-avatar leaderboard__podium-avatar--large">
                                                {topThree[0].avatar_url ? (
                                                    <img src={topThree[0].avatar_url} alt={topThree[0].username} />
                                                ) : (
                                                    <div className="leaderboard__podium-avatar-placeholder">
                                                        {(topThree[0].username || 'U')[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="leaderboard__podium-username">{topThree[0].username || 'Anonymous'}</div>
                                            <div className="leaderboard__podium-score">⭐ {formatScore(topThree[0], activeType)}</div>
                                            <div className="leaderboard__podium-title-text leaderboard__podium-title-text--champion">{getAnimalRank(1).title}</div>
                                            {topThree[0].user_id === user?.id && (
                                                <div className="leaderboard__podium-you-badge">YOU</div>
                                            )}
                                            <div className="leaderboard__podium-particles"></div>
                                        </div>
                                    )}
                                    
                                    {/* Third Place - Right */}
                                    {topThree[2] && (
                                        <div className={`leaderboard__podium-card leaderboard__podium-card--bronze ${topThree[2].user_id === user?.id ? 'leaderboard__podium-card--current-user' : ''}`}>
                                            <div className="leaderboard__podium-medal">🥉</div>
                                            <div className="leaderboard__podium-animal">{getAnimalRank(3).animal}</div>
                                            <div className="leaderboard__podium-rank">3</div>
                                            <div className="leaderboard__podium-avatar">
                                                {topThree[2].avatar_url ? (
                                                    <img src={topThree[2].avatar_url} alt={topThree[2].username} />
                                                ) : (
                                                    <div className="leaderboard__podium-avatar-placeholder">
                                                        {(topThree[2].username || 'U')[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="leaderboard__podium-username">{topThree[2].username || 'Anonymous'}</div>
                                            <div className="leaderboard__podium-score">⭐ {formatScore(topThree[2], activeType)}</div>
                                            <div className="leaderboard__podium-title-text">{getAnimalRank(3).title}</div>
                                            {topThree[2].user_id === user?.id && (
                                                <div className="leaderboard__podium-you-badge">YOU</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Rest of the Pack - Ranks 4+ */}
                        {restOfPack.length > 0 && (
                            <div className="leaderboard__list-section">
                                <div className="leaderboard__list-header">
                                    <span className="leaderboard__list-icon">🐾</span>
                                    <h3 className="leaderboard__list-title">REST OF THE PACK</h3>
                                    <span className="leaderboard__list-icon">🐾</span>
                                </div>
                                
                                <div className="leaderboard__list-container">
                                    <div className="leaderboard__list">
                                        {restOfPack.map((entry, index) => {
                                        const rank = index + 4; // Starting from 4th position
                                        const isCurrentUser = entry.user_id === user?.id;
                                        const animalRank = getAnimalRank(rank);
                                        
                                        return (
                                            <div 
                                                key={entry.user_id || index}
                                                className={`leaderboard__item ${isCurrentUser ? 'leaderboard__item--current-user' : ''}`}
                                            >
                                                <div className="leaderboard__rank">
                                                    <span className="leaderboard__rank-number">{rank}</span>
                                                    <span className="leaderboard__rank-emoji">{animalRank.animal}</span>
                                                </div>
                                                
                                                <div className="leaderboard__avatar">
                                                    {entry.avatar_url ? (
                                                        <img 
                                                            src={entry.avatar_url} 
                                                            alt={`${entry.username || 'User'} avatar`}
                                                            className="leaderboard__avatar-image"
                                                            onError={(e) => {
                                                                e.target.classList.add('leaderboard__avatar-image--hidden');
                                                                const placeholder = e.target.nextSibling;
                                                                if (placeholder) placeholder.classList.remove('leaderboard__avatar-placeholder--hidden');
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div 
                                                        className={`leaderboard__avatar-placeholder ${entry.avatar_url ? 'leaderboard__avatar-placeholder--hidden' : ''}`}
                                                    >
                                                        {(entry.username || 'U')[0].toUpperCase()}
                                                    </div>
                                                </div>
                                                
                                                <div className="leaderboard__info">
                                                    <div className="leaderboard__username">
                                                        {entry.username || 'Anonymous User'}
                                                        {isCurrentUser && (
                                                            <span className="leaderboard__you-badge">You</span>
                                                        )}
                                                    </div>
                                                    <div className="leaderboard__animal-title">
                                                        {animalRank.title}
                                                    </div>
                                                </div>
                                                
                                                <div className="leaderboard__score-badge">
                                                    {entry.score.toLocaleString()} pts
                                                </div>
                                            </div>
                                        );
                                    })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer with update info */}
            {currentData && (
                <div className="leaderboard__footer">
                    <div className="leaderboard__footer-text">
                        Rankings update every hour • Keep playing to climb higher
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;