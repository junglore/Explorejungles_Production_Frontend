import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { useRewards } from '../contexts/RewardsContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { CurrencyDisplay } from '../components/rewards';

// Main container
const LeaderboardsPageContainer = styled('div')({
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1E2D27',
    display: 'flex',
    flexDirection: 'column',
});

const ContentWrapper = styled('div')({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '120px 24px 0 24px',
    flex: 1,
    '@media (max-width: 1024px)': { padding: '100px 20px 0 20px' },
    '@media (max-width: 768px)': { padding: '80px 16px 0 16px' },
    '@media (max-width: 480px)': { padding: '70px 12px 0 12px' },
});

// Page Header
const PageHeader = styled('div')({
    textAlign: 'center',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
        marginBottom: '32px',
    },
});

const PageTitle = styled('h1')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '56px',
    letterSpacing: '-2px',
    marginBottom: '16px',
    textTransform: 'uppercase',
    '@media (max-width: 768px)': {
        fontSize: '42px',
        letterSpacing: '-1px',
        marginBottom: '12px',
    },
    '@media (max-width: 480px)': {
        fontSize: '32px',
        marginBottom: '8px',
    },
});

const PageSubtitle = styled('p')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6,
    '@media (max-width: 768px)': {
        fontSize: '16px',
    },
    '@media (max-width: 480px)': {
        fontSize: '14px',
    },
});

// User Stats Section
const UserStatsSection = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
    border: '2px solid rgba(255, 232, 161, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        padding: '20px',
        marginBottom: '24px',
        gap: '16px',
    },
});

const UserInfo = styled('div')({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        textAlign: 'center',
        gap: '12px',
    },
});

const UserAvatar = styled('div')({
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 232, 161, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    border: '2px solid rgba(255, 232, 161, 0.4)',
    flexShrink: 0,
    '@media (max-width: 768px)': {
        width: '56px',
        height: '56px',
        fontSize: '28px',
    },
});

const UserDetails = styled('div')({
    flex: 1,
});

const UserName = styled('h3')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '4px',
    '@media (max-width: 768px)': {
        fontSize: '18px',
    },
});

const UserRankInfo = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    display: 'flex',
    gap: '16px',
    '@media (max-width: 768px)': {
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
    },
});

// Tab System
const TabsContainer = styled('div')({
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '32px',
    border: '1px solid rgba(255, 232, 161, 0.2)',
    '@media (max-width: 768px)': {
        marginBottom: '24px',
        flexDirection: 'column',
        gap: '4px',
    },
});

const Tab = styled('button')(({ active }) => ({
    flex: 1,
    padding: '12px 16px',
    backgroundColor: active ? 'rgba(255, 232, 161, 0.2)' : 'transparent',
    color: active ? '#FFE8A1' : '#CDD99D',
    border: 'none',
    borderRadius: '8px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    '&:hover': {
        backgroundColor: active ? 'rgba(255, 232, 161, 0.3)' : 'rgba(255, 232, 161, 0.1)',
        color: '#FFE8A1',
    },
    '@media (max-width: 768px)': {
        padding: '10px 14px',
        fontSize: '13px',
    },
}));

// Leaderboard Content
const LeaderboardContent = styled('div')({
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '32px',
    '@media (max-width: 1024px)': {
        gridTemplateColumns: '1fr',
        gap: '24px',
    },
});

const MainLeaderboard = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    border: '2px solid rgba(255, 232, 161, 0.2)',
    overflow: 'hidden',
});

const LeaderboardHeader = styled('div')({
    padding: '20px 24px',
    borderBottom: '2px solid rgba(255, 232, 161, 0.2)',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
});

const LeaderboardTitle = styled('h3')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '18px',
    fontWeight: 700,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&::before': {
        content: '"🏆"',
        fontSize: '20px',
    },
});

const LeaderboardList = styled('div')({
    maxHeight: '600px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(0, 0, 0, 0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(255, 232, 161, 0.3)',
        borderRadius: '4px',
    },
});

const LeaderboardItem = styled('div')(({ isCurrentUser, rank }) => {
    let backgroundColor = 'transparent';
    let borderColor = 'transparent';
    
    if (isCurrentUser) {
        backgroundColor = 'rgba(255, 232, 161, 0.1)';
        borderColor = 'rgba(255, 232, 161, 0.3)';
    } else if (rank === 1) {
        backgroundColor = 'rgba(255, 215, 0, 0.1)';
        borderColor = 'rgba(255, 215, 0, 0.3)';
    } else if (rank === 2) {
        backgroundColor = 'rgba(192, 192, 192, 0.1)';
        borderColor = 'rgba(192, 192, 192, 0.3)';
    } else if (rank === 3) {
        backgroundColor = 'rgba(205, 127, 50, 0.1)';
        borderColor = 'rgba(205, 127, 50, 0.3)';
    }

    return {
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 232, 161, 0.1)',
        backgroundColor,
        border: `1px solid ${borderColor}`,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: isCurrentUser 
                ? 'rgba(255, 232, 161, 0.15)' 
                : 'rgba(255, 232, 161, 0.05)',
        },
        '@media (max-width: 768px)': {
            padding: '12px 16px',
        },
    };
});

const RankNumber = styled('div')(({ rank }) => {
    let color = '#CDD99D';
    let fontSize = '18px';
    
    if (rank === 1) {
        color = '#FFD700';
        fontSize = '20px';
    } else if (rank === 2) {
        color = '#C0C0C0';
        fontSize = '20px';
    } else if (rank === 3) {
        color = '#CD7F32';
        fontSize = '20px';
    }

    return {
        width: '40px',
        textAlign: 'center',
        fontFamily: 'DM Sans, sans-serif',
        fontSize,
        fontWeight: 700,
        color,
        flexShrink: 0,
        '@media (max-width: 768px)': {
            width: '32px',
            fontSize: rank <= 3 ? '16px' : '14px',
        },
    };
});

const PlayerInfo = styled('div')({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginLeft: '16px',
    '@media (max-width: 768px)': {
        marginLeft: '12px',
        gap: '8px',
    },
});

const PlayerAvatar = styled('div')({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 232, 161, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
    '@media (max-width: 768px)': {
        width: '32px',
        height: '32px',
        fontSize: '14px',
    },
});

const PlayerName = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    '@media (max-width: 768px)': {
        fontSize: '14px',
    },
});

const PlayerScore = styled('div')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    '@media (max-width: 768px)': {
        fontSize: '14px',
    },
});

// Sidebar
const Sidebar = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    '@media (max-width: 1024px)': {
        gap: '20px',
    },
});

const SidebarCard = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    padding: '20px',
    border: '2px solid rgba(255, 232, 161, 0.2)',
});

const CardTitle = styled('h4')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
});

const StatRow = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    '&:last-child': {
        marginBottom: 0,
    },
});

const StatLabel = styled('span')({
    color: '#CDD99D',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
});

const StatValue = styled('span')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
});

// Loading and Error States
const LoadingContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: '#CDD99D',
});

const LoadingSpinner = styled('div')({
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 232, 161, 0.3)',
    borderTop: '3px solid #FFE8A1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
});

const BottomSpacer = styled('div')({
    minHeight: '80px',
    '@media (max-width: 768px)': { minHeight: '60px' },
    '@media (max-width: 480px)': { minHeight: '40px' },
});

const LeaderboardsPage = () => {
    const { user, isAuthenticated } = useAuth();
    const { stats, rankings, loadLeaderboard } = useRewards();
    
    const [activeTab, setActiveTab] = useState('weekly');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock leaderboard data
    const generateMockLeaderboard = (type) => {
        const mockUsers = [
            { user_id: 1, username: 'EcoWarrior', full_name: 'EcoWarrior', avatar_url: '🌿', name: 'EcoWarrior', avatar: '🌿', score: type === 'weekly' ? 1250 : 8940, is_current_user: false },
            { user_id: 2, username: 'WildlifeExpert', full_name: 'WildlifeExpert', avatar_url: '🦎', name: 'WildlifeExpert', avatar: '🦎', score: type === 'weekly' ? 1180 : 8520, is_current_user: false },
            { user_id: 3, username: 'ConservationHero', full_name: 'ConservationHero', avatar_url: '🌍', name: 'ConservationHero', avatar: '🌍', score: type === 'weekly' ? 1120 : 8100, is_current_user: false },
            { user_id: 4, username: 'NatureGuardian', full_name: 'NatureGuardian', avatar_url: '🐅', name: 'NatureGuardian', avatar: '🐅', score: type === 'weekly' ? 980 : 7650, is_current_user: false },
            { user_id: 5, username: 'JungleExplorer', full_name: 'JungleExplorer', avatar_url: '🐸', name: 'JungleExplorer', avatar: '🐸', score: type === 'weekly' ? 920 : 7200, is_current_user: false },
            { user_id: 6, username: 'BioDiverser', full_name: 'BioDiverser', avatar_url: '🦋', name: 'BioDiverser', avatar: '🦋', score: type === 'weekly' ? 860 : 6850, is_current_user: false },
            { user_id: 7, username: 'AnimalAdvocate', full_name: 'AnimalAdvocate', avatar_url: '🐘', name: 'AnimalAdvocate', avatar: '🐘', score: type === 'weekly' ? 840 : 6420, is_current_user: false },
            { user_id: 8, username: 'RainforestRanger', full_name: 'RainforestRanger', avatar_url: '🦜', name: 'RainforestRanger', avatar: '🦜', score: type === 'weekly' ? 780 : 6100, is_current_user: false },
            { user_id: 9, username: 'SpeciesProtector', full_name: 'SpeciesProtector', avatar_url: '🐯', name: 'SpeciesProtector', avatar: '🐯', score: type === 'weekly' ? 720 : 5800, is_current_user: false },
            { user_id: 10, username: 'HabitatHelper', full_name: 'HabitatHelper', avatar_url: '🌳', name: 'HabitatHelper', avatar: '🌳', score: type === 'weekly' ? 680 : 5450, is_current_user: false },
        ];

        // Add current user to the list if authenticated
        if (user) {
            const currentUserScore = type === 'weekly' ? 
                Math.floor(Math.random() * 500) + 400 : 
                Math.floor(Math.random() * 3000) + 2000;
            
            mockUsers.push({
                user_id: 'current',
                username: user.username || user.full_name || 'You',
                full_name: user.full_name,
                avatar_url: '👤',
                name: user.username || user.full_name || 'You', // Keep for backward compatibility
                avatar: '👤', // Keep for backward compatibility
                score: currentUserScore,
                is_current_user: true,
                isCurrentUser: true // Keep for backward compatibility
            });
        }

        // Sort by score and add ranks
        return mockUsers.sort((a, b) => b.score - a.score).map((user, index) => ({
            ...user,
            rank: index + 1
        }));
    };

    // Load leaderboard data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Load real leaderboard data
                const data = await loadLeaderboard(activeTab, 50, 0);
                if (data && data.participants) {
                    // Transform the data to match frontend expectations
                    const transformedParticipants = data.participants.map(participant => ({
                        ...participant,
                        isCurrentUser: participant.is_current_user, // Add backward compatibility
                        name: participant.username, // Add name field for backward compatibility
                        avatar: participant.avatar_url // Add avatar field for backward compatibility
                    }));

                    setLeaderboardData(transformedParticipants);
                    setError(null);
                } else {
                    // Fallback to mock data if API fails
                    const mockData = generateMockLeaderboard(activeTab);
                    setLeaderboardData(mockData);
                    setError('API returned no data, using mock data');
                }
            } catch (err) {
                console.error('Failed to load leaderboard:', err);
                // Use mock data as fallback
                const mockData = generateMockLeaderboard(activeTab);
                setLeaderboardData(mockData);
                setError(`API Error: ${err.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [activeTab, user, loadLeaderboard]);

    const tabs = [
        { id: 'weekly', label: 'Weekly', icon: '📅' },
        { id: 'monthly', label: 'Monthly', icon: '🗓️' },
        { id: 'alltime', label: 'All Time', icon: '🏆' },
    ];

    const getCurrentUserRank = () => {
        const currentUserEntry = leaderboardData.find(entry => entry.is_current_user || entry.isCurrentUser);
        return currentUserEntry ? currentUserEntry.rank : null;
    };

    const getCurrentUserStats = () => {
        return {
            weeklyRank: getCurrentUserRank(),
            totalQuizzes: stats?.quizzes_completed || 0,
            averageScore: stats?.average_score || 0,
            totalCredits: stats?.total_credits_earned || 0,
        };
    };

    const currentUserStats = getCurrentUserStats();

    return (
        <LeaderboardsPageContainer>
            <Header />
            <ContentWrapper>
                <PageHeader>
                    <PageTitle>Leaderboards</PageTitle>
                    <PageSubtitle>
                        See how you rank against fellow wildlife conservation enthusiasts. 
                        Compete in weekly challenges and climb the global rankings!
                    </PageSubtitle>
                </PageHeader>

                {/* User Stats Section */}
                {isAuthenticated && (
                    <UserStatsSection>
                        <UserInfo>
                            <UserAvatar>
                                {user?.full_name?.[0] || user?.username?.[0] || '👤'}
                            </UserAvatar>
                            <UserDetails>
                                <UserName>{user?.full_name || user?.username || 'Anonymous User'}</UserName>
                                <UserRankInfo>
                                    <span>Weekly Rank: #{currentUserStats.weeklyRank || 'Unranked'}</span>
                                    <span>•</span>
                                    <span>Quizzes: {currentUserStats.totalQuizzes}</span>
                                    <span>•</span>
                                    <span>Avg: {currentUserStats.averageScore}%</span>
                                </UserRankInfo>
                            </UserDetails>
                        </UserInfo>
                        <CurrencyDisplay variant="compact" />
                    </UserStatsSection>
                )}

                {/* Tab Navigation */}
                <TabsContainer>
                    {tabs.map(tab => (
                        <Tab
                            key={tab.id}
                            active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </Tab>
                    ))}
                </TabsContainer>

                {/* Leaderboard Content */}
                {loading ? (
                    <LoadingContainer>
                        <LoadingSpinner />
                        <div>Loading leaderboard...</div>
                    </LoadingContainer>
                ) : error ? (
                    <LoadingContainer>
                        <div style={{ color: '#F44336' }}>❌ {error}</div>
                    </LoadingContainer>
                ) : (
                    <LeaderboardContent>
                        <MainLeaderboard>
                            <LeaderboardHeader>
                                <LeaderboardTitle>
                                    {activeTab === 'weekly' ? 'Weekly Champions' : 
                                     activeTab === 'monthly' ? 'Monthly Leaders' : 
                                     'All-Time Legends'}
                                </LeaderboardTitle>
                            </LeaderboardHeader>
                            
                            <LeaderboardList>
                                {leaderboardData.map((player) => (
                                    <LeaderboardItem 
                                        key={player.user_id} 
                                        isCurrentUser={player.is_current_user || player.isCurrentUser}
                                        rank={player.rank}
                                    >
                                        <RankNumber rank={player.rank}>
                                            {player.rank <= 3 ? 
                                                (player.rank === 1 ? '🥇' : 
                                                 player.rank === 2 ? '🥈' : '🥉') 
                                                : `#${player.rank}`}
                                        </RankNumber>
                                        
                                        <PlayerInfo>
                                            <PlayerAvatar>
                                                {player.avatar_url || player.avatar || '👤'}
                                            </PlayerAvatar>
                                            <PlayerName>
                                                {player.full_name || player.username || player.name}
                                                {player.is_current_user && ' (You)'}
                                            </PlayerName>
                                        </PlayerInfo>
                                        
                                        <PlayerScore>
                                            <span>🪙</span>
                                            {player.score.toLocaleString()}
                                        </PlayerScore>
                                    </LeaderboardItem>
                                ))}
                            </LeaderboardList>
                        </MainLeaderboard>

                        <Sidebar>
                            {/* Quick Stats */}
                            <SidebarCard>
                                <CardTitle>
                                    <span>📊</span>
                                    Quick Stats
                                </CardTitle>
                                <StatRow>
                                    <StatLabel>Your Position:</StatLabel>
                                    <StatValue>#{currentUserStats.weeklyRank || 'Unranked'}</StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Total Credits:</StatLabel>
                                    <StatValue>{currentUserStats.totalCredits.toLocaleString()}</StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Quizzes Completed:</StatLabel>
                                    <StatValue>{currentUserStats.totalQuizzes}</StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Average Score:</StatLabel>
                                    <StatValue>{currentUserStats.averageScore}%</StatValue>
                                </StatRow>
                            </SidebarCard>

                            {/* Competition Info */}
                            <SidebarCard>
                                <CardTitle>
                                    <span>🏆</span>
                                    Competition Info
                                </CardTitle>
                                <StatRow>
                                    <StatLabel>Time Left:</StatLabel>
                                    <StatValue>5d 12h</StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Total Participants:</StatLabel>
                                    <StatValue>{leaderboardData.length}</StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Prize Pool:</StatLabel>
                                    <StatValue>🪙 50,000</StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Next Reset:</StatLabel>
                                    <StatValue>Monday</StatValue>
                                </StatRow>
                            </SidebarCard>

                            {/* Achievement Hints */}
                            <SidebarCard>
                                <CardTitle>
                                    <span>💡</span>
                                    Tips to Climb
                                </CardTitle>
                                <div style={{ color: '#CDD99D', fontSize: '14px', lineHeight: 1.6 }}>
                                    <div style={{ marginBottom: '8px' }}>
                                        🎯 <strong>Complete daily quizzes</strong> for bonus credits
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        ⚡ <strong>Speed bonuses</strong> for quick completion
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        🏅 <strong>Perfect scores</strong> earn maximum rewards
                                    </div>
                                    <div>
                                        🔥 <strong>Streak bonuses</strong> for consistent play
                                    </div>
                                </div>
                            </SidebarCard>
                        </Sidebar>
                    </LeaderboardContent>
                )}

                <BottomSpacer />
            </ContentWrapper>
            <Footer />
        </LeaderboardsPageContainer>
    );
};

export default LeaderboardsPage;