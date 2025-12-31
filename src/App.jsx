import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import { RewardsProvider } from './contexts/RewardsContext'
import HomePage from './pages/home/HomePage'
import CommunityPage from './pages/community/CommunityPage'
import ViewAllVideosPage from './pages/community/ViewAllVideosPage'
import ViewAllDiscussionsPage from './pages/community/ViewAllDiscussionsPage'
import DiscussionDetailPage from './pages/community/DiscussionDetailPage'
import VideoDetailPage from './pages/community/VideoDetailPage'
import CategoryProfilePage from './pages/community/CategoryProfilePage'
import NationalParkPage from './pages/community/NationalParkPage'
import MediaPage from './pages/media/MediaPage'
import MediaCollage from './pages/media/MediaCollage'
import PodcastDetail from './pages/media/PodcastDetail'
import ResourcesPage from './pages/resources/ResourcesPage'
import AboutUsPage from './pages/about/AboutUsPage'
import LivestreamPage from './pages/community/LivestreamPage'
import ChatbotPage from './pages/ChatbotPage'
import ProfilePage from './pages/profile/profilepage.jsx'
import QuizPage from './pages/quizzes'
import QuizDetail from './pages/QuizDetail'
import QuizTaking from './pages/QuizTaking'
import QuizResultsPage from './pages/QuizResultsPage'
import QuizHistoryPage from './pages/QuizHistoryPage'
import { Login } from './components/auth/Login'
import { Signup } from './components/auth/Signup'
import { ForgotPassword } from './components/auth/ForgotPassword'
import { ResetPassword } from './components/auth/ResetPassword'
import { ResetPasswordOTP } from './components/auth/ResetPasswordOTP'
import { VerifyEmail } from './components/auth/VerifyEmail'
import { VerifyEmailSent } from './components/auth/VerifyEmailSent'
import LinkedInCallbackComponent from './components/auth/LinkedInCallback'
import ScrollToTop from './components/common/ScrollToTop'
import ErrorBoundary from './components/common/ErrorBoundary'
import PodcastErrorFallback from './components/common/PodcastErrorFallback'
import './styles/App.css'
import BlogsPage from './pages/resources/blogs';
import CaseStudiesPage from './pages/resources/casestudies';
import DailyUpdatesPage from './pages/resources/dailyupdates';
import ConservationEffortsPage from './pages/resources/conservationefforts';
import BlogDetail from './pages/resources/BlogDetail';
import CaseStudyDetail from './pages/resources/CaseStudyDetail';
import DailyUpdateDetail from './pages/resources/DailyUpdateDetail';
import ConservationEffortDetail from './pages/resources/ConservationEffortDetail';
import SearchResults from './pages/resources/SearchResults';
import { HelmetProvider } from 'react-helmet-async'

// Create MUI theme
const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 480,
            md: 768,
            lg: 1200,
            xl: 1536,
        },
    },
});

function App() {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
        console.error('VITE_GOOGLE_CLIENT_ID environment variable is not set');
    }
    
    return (
        <GoogleOAuthProvider clientId={googleClientId || ''}>
            <HelmetProvider>
            <div className="App">
                <ThemeProvider theme={theme}>
                    <Router>
                        <AuthProvider>
                            <RewardsProvider>
                                <ScrollToTop />
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                <Route path="/community" element={<CommunityPage />} />
                                <Route path="/community/videos" element={<ViewAllVideosPage />} />
                                <Route path="/community/discussions" element={<ViewAllDiscussionsPage />} />
                                <Route path="/community/discussions/:discussionId" element={<DiscussionDetailPage />} />
                                <Route path="/community/video/:videoId" element={<VideoDetailPage />} />
                                <Route path="/community/park/:parkId" element={<NationalParkPage />} />
                                <Route path="/community/park/:parkId/discussion/:discussionId" element={<DiscussionDetailPage />} />
                                <Route path="/category/:category" element={<CategoryProfilePage />} />
                                <Route
                                    path="/media"
                                    element={
                                        <ErrorBoundary fallback={PodcastErrorFallback}>
                                            <MediaPage />
                                        </ErrorBoundary>
                                    }
                                />
                                <Route
                                    path="/media-collage"
                                    element={
                                        <ErrorBoundary fallback={PodcastErrorFallback}>
                                            <MediaCollage />
                                        </ErrorBoundary>
                                    }
                                />
                                <Route
                                    path="/podcast/:podcastId"
                                    element={
                                        <ErrorBoundary fallback={PodcastErrorFallback}>
                                            <PodcastDetail />
                                        </ErrorBoundary>
                                    }
                                />
                                <Route path="/resources" element={<ResourcesPage />} />
                                <Route path="/about" element={<AboutUsPage />} />
                                <Route path="/livestream/:streamId" element={<LivestreamPage />} />
                                <Route path="/chatbot" element={<ChatbotPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/quizzes" element={<QuizPage />} />
                                <Route path="/quizzes/:quizId" element={<QuizDetail />} />
                                <Route path="/quizzes/:quizId/take" element={<QuizTaking />} />
                                <Route path="/quizzes/:quizId/results" element={<QuizResultsPage />} />
                                <Route path="/quiz-history" element={<QuizHistoryPage />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password" element={<ResetPassword />} />
                                <Route path="/reset-password-otp" element={<ResetPasswordOTP />} />
                                <Route path="/verify-email" element={<VerifyEmail />} />
                                <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
                                <Route path="/linkedin" element={<LinkedInCallbackComponent />} />
                                <Route path="/resources/blogs" element={<BlogsPage />} />
                                <Route path="/resources/blog/:id" element={<BlogDetail />} />
                                <Route path="/resources/casestudies" element={<CaseStudiesPage />} />
                                <Route path="/resources/casestudy/:id" element={<CaseStudyDetail />} />
                                <Route path="/resources/dailyupdates" element={<DailyUpdatesPage />} />
                                <Route path="/resources/dailyupdate/:id" element={<DailyUpdateDetail />} />
                                <Route path="/resources/conservationefforts" element={<ConservationEffortsPage />} />
                                <Route path="/resources/conservation/:id" element={<ConservationEffortDetail />} />
                                <Route path="/search" element={<SearchResults />} />
                            </Routes>
                            </RewardsProvider>
                        </AuthProvider>
                    </Router>
                </ThemeProvider>
            </div>
            </HelmetProvider>
        </GoogleOAuthProvider>
    )
}

export default App