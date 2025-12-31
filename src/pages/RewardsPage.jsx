import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { useRewards } from '../contexts/RewardsContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { 
    CurrencyDisplay, 
    RewardsProfile, 
    Leaderboard, 
    RewardNotification,
    AdminRewardsDashboard 
} from '../components/rewards';

// Styled Components
const RewardsPageContainer = styled('div')({
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1E2D27',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
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

const PageTitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 900,
    fontSize: '72px',
    letterSpacing: '-2px',
    marginBottom: '8px',
    textAlign: 'left',
    '@media (max-width: 768px)': { fontSize: '48px' },
    '@media (max-width: 480px)': { fontSize: '32px' },
});

const PageSubtitle = styled('div')({
    color: '#FFE8A1',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 400,
    fontSize: '18px',
    marginBottom: '48px',
    textAlign: 'left',
    maxWidth: '600px',
    '@media (max-width: 768px)': { fontSize: '16px', marginBottom: '32px' },
    '@media (max-width: 480px)': { fontSize: '14px', marginBottom: '24px' },
});

const TabsContainer = styled('div')({
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    padding: '4px',
    background: 'rgba(255, 232, 161, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 232, 161, 0.2)',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
});

const Tab = styled('button')(({ active }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: active ? '#FFE8A1' : 'transparent',
    color: active ? '#1E2D27' : '#FFE8A1',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    fontWeight: active ? 700 : 500,
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    
    '&:hover': {
        background: active ? '#FFE8A1' : 'rgba(255, 232, 161, 0.1)',
        transform: 'translateY(-1px)',
    },
    
    '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        transform: 'none',
    }
}));

const TabIcon = styled('span')({
    fontSize: '16px',
});

const ContentArea = styled('div')({
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 232, 161, 0.2)',
    padding: '24px',
    minHeight: '600px',
    
    '@media (max-width: 768px)': {
        padding: '16px',
        minHeight: '400px',
    }
});

const AuthRequired = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '60px 20px',
    minHeight: '400px',
    color: '#FFE8A1',
});

const AuthIcon = styled('span')({
    fontSize: '64px',
    marginBottom: '20px',
    opacity: 0.7,
});

const AuthTitle = styled('h2')({
    fontSize: '24px',
    fontWeight: 700,
    margin: '0 0 12px 0',
    fontFamily: 'DM Sans, sans-serif',
});

const AuthMessage = styled('p')({
    fontSize: '16px',
    opacity: 0.8,
    margin: '0 0 24px 0',
    maxWidth: '400px',
    lineHeight: 1.5,
    fontFamily: 'DM Sans, sans-serif',
});

const LoginButton = styled('button')({
    padding: '12px 24px',
    background: '#FFE8A1',
    color: '#1E2D27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    
    '&:hover': {
        background: '#FFD54F',
        transform: 'translateY(-1px)',
    }
});

const BottomSpacer = styled('div')({
    height: '60px',
});

const RewardsPage = () => {
    const { isAuthenticated, user } = useAuth();
    const { balance, userStats } = useRewards();
    const [activeTab, setActiveTab] = useState('profile');

    const isAdmin = user && (user.role === 'admin' || user.is_superuser);

    const tabs = [
        { 
            id: 'profile', 
            label: 'My Profile', 
            icon: '👤',
            requireAuth: true 
        },
        { 
            id: 'leaderboard', 
            label: 'Leaderboard', 
            icon: '🏆',
            requireAuth: false 
        },
        ...(isAdmin ? [{ 
            id: 'admin', 
            label: 'Admin', 
            icon: '⚙️',
            requireAuth: true 
        }] : [])
    ];

    const handleLogin = () => {
        window.location.href = '/login';
    };

    const renderTabContent = () => {
        if (!isAuthenticated && activeTab !== 'leaderboard') {
            return (
                <AuthRequired>
                    <AuthIcon>🔒</AuthIcon>
                    <AuthTitle>Login Required</AuthTitle>
                    <AuthMessage>
                        Please log in to view your rewards profile and track your progress through our knowledge challenges.
                    </AuthMessage>
                    <LoginButton onClick={handleLogin}>
                        Login to Continue
                    </LoginButton>
                </AuthRequired>
            );
        }

        switch (activeTab) {
            case 'profile':
                return <RewardsProfile view="detailed" />;
            
            case 'leaderboard':
                return <Leaderboard />;
            
            case 'admin':
                return isAdmin ? <AdminRewardsDashboard /> : (
                    <AuthRequired>
                        <AuthIcon>🚫</AuthIcon>
                        <AuthTitle>Access Denied</AuthTitle>
                        <AuthMessage>
                            You don't have administrative privileges to access this section.
                        </AuthMessage>
                    </AuthRequired>
                );
            
            default:
                return <RewardsProfile view="detailed" />;
        }
    };

    return (
        <RewardsPageContainer>
            <Header />
            <ContentWrapper>
                <PageTitle>KNOWLEDGE ENGINE</PageTitle>
                <PageSubtitle>
                    Track your learning journey, compete with fellow explorers, and unlock rewards as you discover the wonders of wildlife conservation.
                </PageSubtitle>

                <TabsContainer>
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.id}
                            active={activeTab === tab.id}
                            disabled={tab.requireAuth && !isAuthenticated}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <TabIcon>{tab.icon}</TabIcon>
                            {tab.label}
                        </Tab>
                    ))}
                </TabsContainer>

                <ContentArea>
                    {renderTabContent()}
                </ContentArea>

                <BottomSpacer />
            </ContentWrapper>
            
            <RewardNotification />
            <Footer />
        </RewardsPageContainer>
    );
};

export default RewardsPage;