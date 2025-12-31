/**
 * Myths vs Facts Interactive Game Component
 * 
 * This component provides an engaging card-based game interface where users can learn
 * about wildlife conservation by distinguishing between myths and facts. The game
 * features a 3D card stack with smooth animations and integrates with the backend
 * API for dynamic content while providing fallback data for offline functionality.
 * 
 * Key Features:
 * - Interactive 3D card stack with smooth animations
 * - Dynamic content loading from backend API with fallback support
 * - Responsive design for mobile and desktop
 * - Score tracking and game completion handling
 * - Optimized performance with React hooks and memoization
 * - Error handling and loading states
 * 
 * Game Mechanics:
 * - Users swipe left for "myth" or right for "fact"
 * - Cards animate out of view when selected
 * - Score increases for correct answers
 * - Game completes after all cards are answered
 * - Option to restart game after completion
 * 
 * Technical Implementation:
 * - Uses custom useGameState hook for state management
 * - Styled-components with MUI for responsive design
 * - Dynamic card positioning and animation system
 * - API integration with comprehensive error handling
 * 
 * @author Junglore Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { API_BASE_URL } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useRewards } from '../../contexts/RewardsContext';
import { RewardNotification } from '../../components/rewards';

// Import background images
import BackgroundImage01 from '../../assets/images/MythvsFact/01.png';
import BackgroundImage02 from '../../assets/images/MythvsFact/02.png';
import BackgroundImage03 from '../../assets/images/MythvsFact/03.png';
import BackgroundImage04 from '../../assets/images/MythvsFact/04.png';
import BackgroundImage05 from '../../assets/images/MythvsFact/05.png';
import BackgroundImage06 from '../../assets/images/MythvsFact/06.png';

// Import navigation images
import LeftArrowImage from '../../assets/images/MythvsFact/Left.png';
import RightArrowImage from '../../assets/images/MythvsFact/Right.png';

// Default background images to cycle through
const defaultBackgrounds = [
    BackgroundImage01,
    BackgroundImage02,
    BackgroundImage03,
    BackgroundImage04,
    BackgroundImage05,
    BackgroundImage06
];

// Import services and hooks
import { useGameState } from '../../hooks/useGameState.js';
import mythsFactsService from '../../services/mythsFactsService.js';
import categoryService from '../../services/categoryService.js';
import apiService from '../../services/api.js';
import CategorySelection from '../../components/CategorySelection.jsx';
import CategorySelectionV2 from '../../components/CategorySelectionV2.jsx';

// Cheesy completion messages for trending vibes
const COMPLETION_MESSAGES = [
    "🎯 Myth Status: BUSTED!",
    "🔥 Facts Don't Care About Feelings!",
    "⚡ Knowledge Level: Legendary!",
    "🧠 Big Brain Energy Activated!",
    "🎪 Welcome to the Fact Circus!",
    "🚀 Reality Check: Complete!",
    "💡 Truth Seeker Achievement Unlocked!",
    "🎭 Plot Twist: You're Actually Smart!",
    "🌟 Fact-Checking Champion Mode!",
    "🔍 Sherlock Holmes Would Be Proud!"
];

// Main container
const MythsVsFactsContainer = styled("div")({
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
});

const GameContainer = styled("div")({
    height: '1024px',
    width: '1440px',
    position: 'relative',
    margin: '80px auto 40px auto', // Reduced top and bottom margins for better centering
    transform: 'scale(0.9)',
    transformOrigin: 'center center',
    '@media (max-width: 1600px)': {
        transform: 'scale(0.85)',
    },
    '@media (max-width: 1440px)': {
        transform: 'scale(0.8)',
    },
    '@media (max-width: 1200px)': {
        transform: 'scale(0.7)',
    },
    '@media (max-width: 1024px)': {
        transform: 'scale(0.6)',
    },
    '@media (max-width: 768px)': {
        transform: 'scale(0.5)',
        height: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        margin: '40px auto 20px auto', // Reduced margins for mobile
    },
    '@media (max-width: 480px)': {
        transform: 'scale(0.4)',
        padding: '10px',
        margin: '20px auto 10px auto', // Even smaller margins for small phones
    },
});

const OverlapContainer = styled("div")({
    height: '1024px',
    position: 'relative',
    width: '100%',
    '@media (max-width: 768px)': {
        height: 'auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
    },
});

// Card stack container
const CardStackContainer = styled("div")({
    position: 'absolute',
    width: '800px',
    height: '800px',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    '@media (max-width: 1200px)': {
        width: '700px',
        height: '700px',
        transform: 'translate(-50%, -50%) scale(0.85)',
    },
    '@media (max-width: 768px)': {
        position: 'static',
        width: '600px',
        height: '700px',
        transform: 'scale(0.9)',
        margin: '0 auto',
    },
    '@media (max-width: 480px)': {
        width: '500px',
        height: '600px',
        transform: 'scale(0.8)',
        margin: '0 auto',
    },
});



/**
 * Calculate dynamic card positioning and styling for the 3D stack effect.
 * 
 * This function creates a realistic card stack appearance by positioning cards
 * at different depths with varying sizes and positions. The top card (index 5)
 * is fully interactive while background cards create depth perception.
 * 
 * @param {number} index - Card position in stack (0-5, where 5 is top card)
 * @param {boolean} isAnimating - Whether cards are currently animating
 * @returns {Object} CSS style object with positioning, sizing, and animation properties
 */
const getCardStyle = (index, isAnimating) => {
    // Define card positions from back to front (creates 3D depth effect)
    const positions = [
        { width: 315, height: 412, left: 0, top: 0, zIndex: 1 },      // Back card
        { width: 314, height: 430, left: 50, top: 44, zIndex: 2 },   // Layer 2
        { width: 320, height: 453, left: 100, top: 87, zIndex: 3 },  // Layer 3
        { width: 395, height: 520, left: 143, top: 116, zIndex: 4 }, // Layer 4
        { width: 415, height: 530, left: 156, top: 163, zIndex: 5 }, // Layer 5
        { width: 400, height: 600, left: 200, top: 150, zIndex: 7 }  // Top card (interactive)
    ];

    const baseStyle = positions[index] || positions[5];

    return {
        position: 'absolute',
        borderRadius: '32px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth easing
        cursor: index === 5 ? 'pointer' : 'default', // Only top card is clickable
        width: `${baseStyle.width}px`,
        height: `${baseStyle.height}px`,
        left: `${baseStyle.left}px`,
        top: `${baseStyle.top}px`,
        zIndex: baseStyle.zIndex,
        // Highlight top card with golden border
        border: index === 5 ? '3px solid rgba(255, 232, 161, 0.8)' : 'none',
        // Animation effects: lift cards slightly during interaction
        transform: isAnimating && index < 5 ?
            `translateY(-25px) scale(1.03)` :      // Background cards lift slightly
            isAnimating && index === 5 ?
                'translateY(-35px) scale(1.06)' :   // Top card lifts more
                'translateY(0) scale(1)',           // Default position
    };
};

// Dynamic card component with direct transform styling
const StackCard = styled("div")({
    position: 'absolute',
    borderRadius: '32px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    '&:hover': {
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
    },
});

const CardContent = styled("div")({
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '30px 20px 20px',
    boxSizing: 'border-box',
});

const AnimalImage = styled("img")({
    width: '300px',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '20px',
    marginBottom: '20px',
    border: '2px solid rgba(255, 232, 161, 0.3)',
    position: 'relative',
    zIndex: 10, // Ensure image is above background
});

const ImagePlaceholder = styled("div")({
    width: '300px',
    height: '250px',
    borderRadius: '20px',
    marginBottom: '20px',
    border: '2px solid rgba(255, 232, 161, 0.3)',
    backgroundColor: 'rgba(255, 232, 161, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 232, 161, 0.7)',
    fontFamily: 'DM Sans',
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center',
});

const CardLabel = styled("div")({
    textAlign: 'center',
    color: 'rgba(255, 232, 161, 1)',
    fontFamily: 'DM Sans',
    fontWeight: '900',
    fontSize: '18px',
    textTransform: 'uppercase',
    fontStyle: 'italic',
    marginBottom: '20px',
    letterSpacing: '2px',
});

const CardText = styled("div")({
    textAlign: 'center',
    color: 'rgba(255, 232, 161, 1)',
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '28px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
    padding: '0 10px',
    '@media (max-width: 768px)': {
        fontSize: '20px',
        lineHeight: '24px',
    },
    '@media (max-width: 480px)': {
        fontSize: '16px',
        lineHeight: '20px',
    },
});

// Text frame
const TextFrame = styled("div")({
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    height: '112px',
    right: '20px',
    position: 'absolute',
    top: '280px', // Increased from 200px to add more space from globe section
    width: '400px',
    '@media (max-width: 768px)': {
        position: 'static',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        height: 'auto',
        order: -1,
        marginBottom: '20px',
    },
});

const TextWrapper6 = styled("div")({
    alignSelf: 'stretch',
    color: '#ffe8a1',
    fontFamily: 'DM Sans',
    fontSize: '32px',
    fontStyle: 'italic',
    fontWeight: '900',
    height: '31px',
    letterSpacing: '0',
    lineHeight: 'normal',
    marginTop: '-1px',
    position: 'relative',
    whiteSpace: 'nowrap',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    '@media (max-width: 768px)': {
        fontSize: '28px',
        whiteSpace: 'normal',
        height: 'auto',
    },
});

const TextWrapper7 = styled("p")({
    alignSelf: 'stretch',
    color: '#ffe8a1',
    flex: '1',
    fontFamily: 'DM Sans',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '0',
    lineHeight: '24px',
    position: 'relative',
    margin: '0',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
    '@media (max-width: 768px)': {
        fontSize: '20px',
        lineHeight: '22px',
    },
});

// Navigation frame
const NavigationFrame = styled("div")({
    alignItems: 'center',
    display: 'flex',
    gap: '600px',
    justifyContent: 'center',
    left: '220px',
    padding: '5px',
    position: 'absolute',
    top: '850px',
    width: '1000px',
    '@media (max-width: 768px)': {
        position: 'static',
        gap: '200px',
        width: '100%',
        marginTop: '40px',
        justifyContent: 'space-around',
    },
    '@media (max-width: 480px)': {
        gap: '100px',
    },
});

// Navigation arrow buttons
const NavArrowButton = styled("img")(({ disabled }) => ({
    width: '80px',
    height: '80px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    filter: disabled ?
        'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) grayscale(1) opacity(0.5)' :
        'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
    '&:hover': {
        transform: disabled ? 'none' : 'translateY(-8px) scale(1.08)',
        filter: disabled ?
            'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) grayscale(1) opacity(0.5)' :
            'drop-shadow(0 8px 16px rgba(255, 232, 161, 0.3))',
    },
    '&:active': {
        transform: disabled ? 'none' : 'translateY(-3px) scale(1.02)',
    },
    '@media (max-width: 768px)': {
        width: '60px',
        height: '60px',
    },
    '@media (max-width: 480px)': {
        width: '50px',
        height: '50px',
    },
}));

// Score display
const ScoreDisplay = styled("div")({
    position: 'absolute',
    top: '50px',
    right: '50px',
    color: '#ffe8a1',
    fontFamily: 'DM Sans',
    fontSize: '28px',
    fontWeight: '900',
    fontStyle: 'italic',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    letterSpacing: '1px',
    '@media (max-width: 768px)': {
        position: 'static',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        order: -2
    },
    '@media (max-width: 480px)': {
        fontSize: '20px',
    },
});

/**
 * Main Myths vs Facts Game Component
 * 
 * Renders the complete interactive game interface with card stack, navigation,
 * score display, and game completion handling. Manages API integration and
 * provides fallback content for offline functionality.
 * 
 * @returns {JSX.Element} The complete game interface
 */
function MythsVsFacts() {
    // Authentication and rewards context
    const { isAuthenticated } = useAuth();
    const { refreshBalance, showNotification, processReward } = useRewards();

    // Game state management with optimized custom hook
    const gameState = useGameState([]);

    // Component-specific state for API data and loading
    const [mythsData, setMythsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showResultsLoading, setShowResultsLoading] = useState(false);
    const [rewardsData, setRewardsData] = useState(null);
    const [gameStartTime, setGameStartTime] = useState(null);
    const [completionProcessed, setCompletionProcessed] = useState(false);

    // Updated state management for category-based system
    const [currentGameState, setCurrentGameState] = useState('categorySelection'); // 'categorySelection', 'playing', 'completed'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryContent, setCategoryContent] = useState([]);

    // Extract game state for easier access
    const {
        currentIndex,
        isAnimating,
        animationDirection,
        score,
        answered,
        gameData: currentGameData,
        cardStack,
        currentCard,
        gameStats,
        updateGameData,
        handleChoice,
        completeAnimation,
        resetGame,
        isGameComplete,
        hasGameData
    } = gameState;

    useEffect(() => {
        // Load category content when category is selected
        if (currentGameState === 'playing' && selectedCategory) {
            loadCategoryContent();
        }
    }, [currentGameState, selectedCategory]);

    /**
     * Handle category selection
     */
    const handleCategorySelect = (category) => {
        console.log('Category selected:', category);
        setSelectedCategory(category);
        setCurrentGameState('playing');
        
        // Reset game state for new category
        resetGame();
        setCompletionProcessed(false);
        setRewardsData(null);
        setGameStartTime(Date.now());
    };

    /**
     * Load content for selected category
     */
    const loadCategoryContent = async () => {
        if (!selectedCategory) {
            console.log('No category selected, skipping content load');
            return;
        }
        
        console.log('Loading content for category:', selectedCategory);
        setLoading(true);
        try {
            console.log(`Loading content for category: ${selectedCategory.name}`);
            
            // Fetch myths/facts for this category
            const categoryData = await mythsFactsService.fetchRandomMythsFactsByCategory(
                selectedCategory.id, 
                10 // Get 10 random items for the game
            );

            console.log('Category data received:', categoryData);

            if (categoryData && categoryData.length > 0) {
                // Transform category content to game format
                const transformedData = categoryData.map((item, index) => {
                    // Construct the full image URL for animal images
                    const fullImageUrl = item.image_url
                        ? `${import.meta.env.VITE_UPLOAD_BASE_URL || 'http://localhost:8000'}/uploads/${item.image_url}`
                        : null;
                    
                    // ✅ UPDATED: Show correct content based on card type
                    // If type is 'fact', show the fact explanation as the main text
                    // If type is 'myth', show the myth statement as the main text
                    const displayText = item.type === 'fact' 
                        ? (item.fact_content || item.fact_explanation || item.text)
                        : (item.myth_content || item.myth_statement || item.text);
                    
                    // The opposite text is shown after user answers
                    const explanationText = item.type === 'fact'
                        ? (item.myth_content || item.myth_statement || '')
                        : (item.fact_content || item.fact_explanation || '');
                    
                    return {
                        id: item.id,
                        animalImage: fullImageUrl, // Use backend image URL for animal image
                        backgroundImage: defaultBackgrounds[index % defaultBackgrounds.length], // Use static background images
                        text: `"${displayText}"`, // ✅ Display based on admin's selected type
                        type: item.type, // "myth" or "fact"
                        explanation: explanationText, // ✅ Show opposite after answer
                        title: item.title
                    };
                });

                console.log('Transformed data:', transformedData);

                // Update game state with category content
                updateGameData(transformedData);
                setCategoryContent(categoryData);
                
                // Ensure game state is playing with loaded content
                setCurrentGameState('playing');
                
                console.log(`Category content loaded: ${transformedData.length} items`);
                console.log('Game state after loading:', {
                    hasGameData: transformedData.length > 0,
                    currentGameState: 'playing',
                    categorySelected: selectedCategory?.name
                });
            } else {
                // Fallback: use general myths/facts if category is empty
                console.log('Category has no content, falling back to general content');
                await loadMythsVsFacts();
            }
        } catch (error) {
            console.error('Error loading category content:', error);
            // Show error message instead of falling back to general content
            alert(`Failed to load content for ${selectedCategory?.name}. Please try again.`);
            setCurrentGameState('categorySelection');
            return;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle going back to category selection
     */
    const handleBackToCategorySelection = () => {
        setCurrentGameState('categorySelection');
        setSelectedCategory(null);
        setCategoryContent([]);
        
        // Reset game state
        resetGame();
        setCompletionProcessed(false);
        setRewardsData(null);
        setGameStartTime(null);
        
        console.log('Back to category selection');
    };

    // Initialize game start time when loading completes and reset completion flag
    useEffect(() => {
        if (!loading && hasGameData && !gameStartTime) {
            setGameStartTime(Date.now());
            setCompletionProcessed(false); // Reset completion flag for new game
        }
    }, [loading, hasGameData, gameStartTime]);

    // Enhanced game completion handler with backend rewards integration
    useEffect(() => {
        // Prevent multiple executions with multiple guards
        if (completionProcessed || showResultsLoading) {
            console.log('Completion already processed or in progress, skipping...');
            return;
        }

        const handleGameCompletion = async () => {
            console.log('Game completion check:', {
                isGameComplete,
                isAuthenticated,
                totalQuestions: gameStats.progress.total,
                completionProcessed,
                showResultsLoading
            });

            // Only run if all conditions are met AND not already processed
            if (isGameComplete && isAuthenticated && gameStats.progress.total > 0 && !completionProcessed && !showResultsLoading) {
                console.log('Starting game completion process...');
                setCompletionProcessed(true);
                setShowResultsLoading(true);
                
                try {
                    // Calculate game performance
                    const accuracy = ((gameStats.score / gameStats.progress.total) * 100);
                    const timeTaken = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : null;
                    
                    // Generate a proper UUID-like session ID for backend compatibility
                    const generateUUID = () => {
                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            const r = Math.random() * 16 | 0;
                            const v = c === 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                    };

                    // Prepare game completion data
                    const gameCompletionData = {
                        score_percentage: Math.round(accuracy),
                        time_taken: timeTaken,
                        answers_correct: gameStats.score,
                        total_questions: gameStats.progress.total,
                        game_session_id: generateUUID()
                    };

                    // Add category and card IDs for category-based games
                    if (selectedCategory && categoryContent.length > 0) {
                        gameCompletionData.category_id = selectedCategory.id;
                        gameCompletionData.card_ids = categoryContent.map(card => card.id);
                    }

                    console.log('Sending game completion data to backend:', gameCompletionData);

                    // Handle completion
                    try {
                        console.log('Completing game session...');
                        const response = await apiService.post('/myths-facts/game/complete', gameCompletionData);
                        console.log('Game completion response:', response);
                        
                        // Extract rewards data
                        const rewards = response.data?.rewards || {};
                        const pointsEarned = rewards.points_earned || 0;
                        const creditsEarned = rewards.credits_earned || 0;
                        const tier = rewards.tier || 'BRONZE';
                        const bonusApplied = rewards.bonus_applied || false;
                        const breakdown = rewards.breakdown || {};

                        // Store rewards data for results screen
                        setRewardsData({
                            pointsEarned,
                            creditsEarned,
                            tier,
                            bonusApplied,
                            breakdown,
                            accuracy,
                            gameStats
                        });

                        // Refresh balance to get updated totals (same as quiz pattern)
                        if (refreshBalance) {
                            await refreshBalance();
                        }

                        // Show enhanced reward notification with cheesy message (same as quiz pattern)
                        if (pointsEarned > 0 || creditsEarned > 0) {
                            const randomMessage = COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];
                            console.log('Rewards earned:', { pointsEarned, creditsEarned, tier: tier, message: randomMessage });
                            
                            // Use showNotification directly like quizzes (NOT processReward)
                            if (showNotification) {
                                showNotification({
                                    type: 'myths_facts_completion',
                                    tier: tier,
                                    title: randomMessage,
                                    message: `Great job! You scored ${gameStats.score}/${gameStats.progress.total}`,
                                    points: pointsEarned,
                                    credits: creditsEarned,
                                    bonuses: bonusApplied ? ['Perfect accuracy bonus!'] : [],
                                    autoHide: false
                                });
                            }
                        }
                    } catch (apiError) {
                        console.error('Backend API failed, using fallback rewards:', apiError);
                        // Fallback to local calculation if backend fails
                        await handleFallbackRewards(accuracy, gameStats);
                    }
                } catch (error) {
                    console.error('Error handling game completion:', error);
                    console.log('Backend API failed, using fallback rewards calculation');
                    
                    // Fallback to local calculation if request fails
                    try {
                        const accuracy = ((gameStats.score / gameStats.progress.total) * 100);
                        await handleFallbackRewards(accuracy, gameStats);
                    } catch (fallbackError) {
                        console.error('Error in fallback rewards:', fallbackError);
                        // Set basic rewards data to prevent infinite loop
                        setRewardsData({
                            pointsEarned: gameStats.score * 5,
                            creditsEarned: Math.round(gameStats.score * 0.5),
                            tier: 'BRONZE',
                            bonusApplied: false,
                            accuracy: Math.round((gameStats.score / gameStats.progress.total) * 100),
                            gameStats
                        });
                    }
                } finally {
                    setShowResultsLoading(false);
                }
            }
        };

        // Add timeout to prevent effect from running too frequently
        if (!isGameComplete) {
            return;
        }

        const timeout = setTimeout(handleGameCompletion, 500); // Delay execution
        return () => clearTimeout(timeout);
    }, [isGameComplete, isAuthenticated, completionProcessed, showResultsLoading]); // Removed problematic dependencies

    // Fallback rewards calculation for offline/error scenarios
    const handleFallbackRewards = async (accuracy, gameStats) => {
        try {
            const basePoints = gameStats.score * 5;
            const bonusMultiplier = accuracy >= 80 ? 1.5 : accuracy >= 60 ? 1.2 : 1.0;
            const totalPoints = Math.round(basePoints * bonusMultiplier);
            const credits = Math.round(totalPoints * 0.1);
            const tier = accuracy >= 95 ? 'PLATINUM' : accuracy >= 85 ? 'GOLD' : accuracy >= 70 ? 'SILVER' : 'BRONZE';

            setRewardsData({
                pointsEarned: totalPoints,
                creditsEarned: credits,
                tier,
                bonusApplied: bonusMultiplier > 1,
                breakdown: {
                    base_points: basePoints,
                    base_credits: Math.round(basePoints * 0.1),
                    time_bonus_points: bonusMultiplier > 1 ? Math.round(basePoints * (bonusMultiplier - 1)) : 0,
                    time_bonus_credits: bonusMultiplier > 1 ? Math.round(basePoints * 0.1 * (bonusMultiplier - 1)) : 0,
                    perfect_bonus_points: 0,
                    perfect_bonus_credits: 0
                },
                accuracy,
                gameStats
            });

            const randomMessage = COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];
            
            // Show fallback notification using same pattern as quiz
            if (showNotification && totalPoints > 0) {
                showNotification({
                    type: 'myths_facts_completion',
                    tier: tier,
                    title: randomMessage,
                    message: `Great job! You scored ${gameStats.score}/${gameStats.progress.total}`,
                    points: totalPoints,
                    credits: credits,
                    bonuses: bonusMultiplier > 1 ? ['Speed bonus applied!'] : [],
                    autoHide: false
                });
            }
            
            // Show fallback notification
            console.log('Using fallback rewards:', { totalPoints, credits, tier, message: randomMessage });
        } catch (error) {
            console.error('Error in fallback rewards:', error);
        }
    };

    // Enhanced choice handler with micro-feedback and rewards tracking
    const handleGameChoice = useCallback((choice) => {
        const result = handleChoice(choice);

        if (result) {
            // Show immediate micro-feedback with points animation
            if (result.isCorrect) {
                // Create floating +points animation
                createPointsAnimation('+5 Points!');
            }
            
            // Provide immediate feedback
            console.log(`Choice: ${choice}, Correct: ${result.isCorrect}`);

            // Complete animation after delay
            setTimeout(() => {
                completeAnimation();
            }, 900);
        }
    }, [handleChoice, completeAnimation]);

    // Create floating points animation for micro-feedback
    const createPointsAnimation = useCallback((text) => {
        const pointsElement = document.createElement('div');
        pointsElement.textContent = text;
        pointsElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #FFD700;
            font-size: 24px;
            font-weight: bold;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            animation: pointsFloat 2s ease-out forwards;
        `;
        
        // Add CSS animation keyframes if not already present
        if (!document.querySelector('#points-animation-style')) {
            const style = document.createElement('style');
            style.id = 'points-animation-style';
            style.textContent = `
                @keyframes pointsFloat {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 1; transform: translate(-50%, -80px) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -120px) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(pointsElement);
        
        // Remove element after animation
        setTimeout(() => {
            if (pointsElement.parentNode) {
                pointsElement.parentNode.removeChild(pointsElement);
            }
        }, 2000);
    }, []);



    // Category Selection UI
    if (currentGameState === 'categorySelection') {
        return (
            <CategorySelectionV2 
                onCategorySelect={handleCategorySelect}
                onBackToMain={null} // No back option from main category selection
            />
        );
    }

    if (isGameComplete) {
        return (
            <MythsVsFactsContainer>
                <div style={{
                    textAlign: 'center',
                    color: 'rgba(255, 232, 161, 1)',
                    fontSize: '48px',
                    fontFamily: 'DM Sans',
                    fontWeight: '700',
                    padding: '40px 20px'
                }}>
                    {showResultsLoading ? (
                        // Loading screen with animation
                        <div>
                            <div style={{ marginBottom: '30px', fontSize: '36px' }}>
                                🎯 Calculating Your Rewards...
                            </div>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                border: '4px solid rgba(255, 232, 161, 0.3)',
                                borderTop: '4px solid rgba(255, 232, 161, 1)',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto',
                                marginBottom: '20px'
                            }}></div>
                            <div style={{ fontSize: '18px', opacity: 0.8 }}>
                                Processing your performance...
                            </div>
                            {/* Add CSS for loading animation */}
                            <style>{`
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}</style>
                        </div>
                    ) : (
                        // Enhanced results screen with rewards
                        <div>
                            <div style={{ marginBottom: '30px' }}>
                                {rewardsData ? 
                                    COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)] : 
                                    'Quiz Complete!'
                                }
                            </div>
                            
                            <div style={{ 
                                fontSize: '32px', 
                                marginBottom: '20px',
                                color: '#FFD700'
                            }}>
                                Final Score: {gameStats.score}/{gameStats.progress.total}
                            </div>
                            
                            <div style={{ 
                                fontSize: '24px', 
                                marginBottom: '30px',
                                opacity: 0.9
                            }}>
                                Accuracy: {gameStats.accuracy}%
                            </div>

                            {/* Rewards Display */}
                            {rewardsData && (
                                <div style={{
                                    background: 'rgba(255, 232, 161, 0.1)',
                                    border: '2px solid rgba(255, 232, 161, 0.3)',
                                    borderRadius: '15px',
                                    padding: '25px',
                                    marginBottom: '30px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <div style={{ 
                                        fontSize: '28px', 
                                        marginBottom: '20px',
                                        color: '#FFD700'
                                    }}>
                                        🎉 Rewards Earned!
                                    </div>
                                    
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '30px',
                                        marginBottom: '15px',
                                        flexWrap: 'wrap'
                                    }}>
                                        {rewardsData.pointsEarned > 0 && (
                                            <div style={{
                                                background: 'linear-gradient(145deg, #FFD700, #FFA500)',
                                                padding: '15px 20px',
                                                borderRadius: '10px',
                                                color: '#1e2d27',
                                                fontWeight: 'bold',
                                                fontSize: '20px',
                                                minWidth: '120px'
                                            }}>
                                                ⭐ +{rewardsData.pointsEarned} Points
                                            </div>
                                        )}
                                        
                                        {rewardsData.creditsEarned > 0 && (
                                            <div style={{
                                                background: 'linear-gradient(145deg, #4CAF50, #45a049)',
                                                padding: '15px 20px',
                                                borderRadius: '10px',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '20px',
                                                minWidth: '120px'
                                            }}>
                                                💰 +{rewardsData.creditsEarned} Credits
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div style={{
                                        fontSize: '16px',
                                        opacity: 0.8,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        color: rewardsData.tier === 'PLATINUM' ? '#E5E4E2' :
                                              rewardsData.tier === 'GOLD' ? '#FFD700' : 
                                              rewardsData.tier === 'SILVER' ? '#C0C0C0' : '#CD7F32'
                                    }}>
                                        {rewardsData.tier} Tier Achievement
                                        {rewardsData.bonusApplied && ' • Bonus Applied!'}
                                        {rewardsData.breakdown?.pure_scoring_mode && ' • Pure Scoring Mode'}
                                    </div>

                                    {/* Pure Scoring Mode Notice */}
                                    {rewardsData.breakdown?.pure_scoring_mode && (
                                        <div style={{
                                            marginTop: '10px',
                                            padding: '10px',
                                            backgroundColor: 'rgba(255, 165, 0, 0.2)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255, 165, 0, 0.4)',
                                            fontSize: '13px',
                                            color: '#ffa500',
                                            textAlign: 'center'
                                        }}>
                                            📊 Pure Scoring Mode Active - Base rewards only, no bonuses applied
                                        </div>
                                    )}

                                    {/* Detailed Reward Breakdown */}
                                    {rewardsData.breakdown && !rewardsData.breakdown.pure_scoring_mode && (rewardsData.breakdown.time_bonus_points > 0 || rewardsData.breakdown.perfect_bonus_points > 0) && (
                                        <div style={{
                                            marginTop: '15px',
                                            padding: '15px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(255, 255, 255, 0.2)'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#ffd700',
                                                marginBottom: '10px',
                                                textAlign: 'center'
                                            }}>
                                                🏆 Reward Breakdown
                                            </div>
                                            
                                            <div style={{ fontSize: '13px', color: '#e0e0e0' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span>Base {rewardsData.tier} Reward:</span>
                                                    <span>+{rewardsData.breakdown.base_points}⭐ +{rewardsData.breakdown.base_credits}🔸</span>
                                                </div>
                                                
                                                {rewardsData.breakdown.time_bonus_points > 0 && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                        <span>⚡ Speed Bonus (40%/30%):</span>
                                                        <span>+{rewardsData.breakdown.time_bonus_points}⭐ +{rewardsData.breakdown.time_bonus_credits}🔸</span>
                                                    </div>
                                                )}
                                                
                                                {rewardsData.breakdown.perfect_bonus_points > 0 && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                        <span>🎯 Perfect Score (25%):</span>
                                                        <span>+{rewardsData.breakdown.perfect_bonus_points}⭐ +{rewardsData.breakdown.perfect_bonus_credits}🔸</span>
                                                    </div>
                                                )}
                                                
                                                <div style={{ 
                                                    borderTop: '1px solid rgba(255,255,255,0.3)', 
                                                    paddingTop: '8px', 
                                                    marginTop: '8px',
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    fontWeight: '600',
                                                    color: '#ffd700'
                                                }}>
                                                    <span>Total Earned:</span>
                                                    <span>{rewardsData.pointsEarned}⭐ {rewardsData.creditsEarned}🔸</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                gap: '15px',
                                marginTop: '20px',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <button
                                    onClick={() => {
                                        resetGame();
                                        setRewardsData(null);
                                        setShowResultsLoading(false);
                                        setGameStartTime(null);
                                        setCompletionProcessed(false);
                                        handleBackToCategorySelection();
                                    }}
                                    style={{
                                        padding: '15px 25px',
                                        fontSize: '18px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontFamily: 'DM Sans',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    🏠 Choose Category
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </MythsVsFactsContainer>
        );
    }

    if (loading) {
        return (
            <MythsVsFactsContainer>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    color: '#FFE8A1',
                    fontSize: '24px'
                }}>
                    Loading Myths vs Facts Game...
                </div>
            </MythsVsFactsContainer>
        );
    }

    if (!hasGameData || currentGameData.length === 0) {
        return (
            <MythsVsFactsContainer>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    color: '#FFE8A1',
                    fontSize: '24px',
                    backgroundColor: '#1E2D27',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    <div style={{ marginBottom: '20px' }}>No Myths vs Facts content available</div>
                    <div style={{ fontSize: '18px', opacity: 0.8 }}>
                        Please add content through the admin panel to play the game
                    </div>
                    <button
                        onClick={loadMythsVsFacts}
                        style={{
                            marginTop: '30px',
                            padding: '15px 30px',
                            fontSize: '18px',
                            backgroundColor: '#ffe8a1',
                            color: '#1e2d27',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontFamily: 'DM Sans',
                            fontWeight: '700',
                        }}
                    >
                        Retry Loading
                    </button>
                </div>
            </MythsVsFactsContainer>
        );
    }

    return (
        <MythsVsFactsContainer>
            <GameContainer>
                <OverlapContainer>
                    {/* Vector Decoration */}

                    {/* Card Stack */}
                    <CardStackContainer>
                        {/* Dynamically render all cards in the stack */}
                        {cardStack.map((cardIndex, stackIndex) => {
                            const card = currentGameData[cardIndex];
                            const isTopCard = stackIndex === 5;

                            // Calculate transform for top card based on animation direction
                            const getTopCardTransform = () => {
                                if (!isTopCard) return '';
                                if (animationDirection === 'left') {
                                    return 'translateX(-1500px) translateY(-150px) rotate(-35deg) scale(0.5)';
                                } else if (animationDirection === 'right') {
                                    return 'translateX(1500px) translateY(-150px) rotate(35deg) scale(0.5)';
                                }
                                return 'translateX(0) translateY(0) rotate(0deg) scale(1)';
                            };

                            return (
                                <StackCard
                                    key={`${cardIndex}-${stackIndex}`}
                                    style={{
                                        ...getCardStyle(stackIndex, isAnimating),
                                        backgroundImage: `url(${card.backgroundImage})`, // Use the background image from data
                                        ...(isTopCard && {
                                            transform: getTopCardTransform(),
                                            opacity: animationDirection ? 0.2 : 1,
                                            zIndex: animationDirection ? 20 : 7,
                                        })
                                    }}
                                    onClick={isTopCard ? () => handleGameChoice('fact') : undefined}
                                >
                                    {isTopCard && card && (
                                        <CardContent>
                                            {card.animalImage ? (
                                                <AnimalImage
                                                    src={card.animalImage}
                                                    alt={card.title || "Wildlife"}
                                                    onError={(e) => {
                                                        console.error('Failed to load animal image:', card.animalImage);
                                                        // Replace with placeholder
                                                        e.target.style.display = 'none';
                                                        const placeholder = e.target.nextElementSibling;
                                                        if (placeholder && placeholder.classList.contains('image-placeholder')) {
                                                            placeholder.style.display = 'flex';
                                                        }
                                                    }}
                                                    onLoad={() => {
                                                        console.log('Successfully loaded animal image:', card.animalImage);
                                                    }}
                                                />
                                            ) : (
                                                <ImagePlaceholder className="image-placeholder">
                                                    Wildlife Image
                                                </ImagePlaceholder>
                                            )}
                                            <CardLabel>MYTHS VS FACTS</CardLabel>
                                            <CardText>{card.text}</CardText>
                                        </CardContent>
                                    )}
                                </StackCard>
                            );
                        })}
                    </CardStackContainer>

                    {/* Text Frame */}
                    <TextFrame>
                        <TextWrapper6>MYTHS VS FACTS</TextWrapper6>
                        <TextWrapper7>
                            Step into India's untamed wilderness, where myths roam free and facts hunt them down!
                        </TextWrapper7>
                    </TextFrame>

                    {/* Score Display */}
                    <ScoreDisplay>
                        SCORE: {score}
                    </ScoreDisplay>

                    {/* Mode Indicator */}
                    <div style={{
                        position: 'absolute',
                        top: '100px',
                        left: '50px',
                        background: 'rgba(76, 175, 80, 0.9)',
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        fontFamily: 'DM Sans',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        zIndex: 1000,
                        '@media (max-width: 768px)': {
                            position: 'static',
                            marginBottom: '10px',
                            textAlign: 'center'
                        }
                    }}>
                        {selectedCategory ? (
                            <>🌿 {selectedCategory.name}</>
                        ) : (
                            <>🎲 Category Mode</>
                        )}
                    </div>

                    {/* Navigation Frame */}
                    <NavigationFrame>
                        <NavArrowButton
                            src={LeftArrowImage}
                            alt="Swipe Left for Myth"
                            onClick={() => handleGameChoice('myth')}
                            disabled={isAnimating}
                        />
                        <NavArrowButton
                            src={RightArrowImage}
                            alt="Swipe Right for Fact"
                            onClick={() => handleGameChoice('fact')}
                            disabled={isAnimating}
                        />
                    </NavigationFrame>
                </OverlapContainer>
            </GameContainer>

            {/* Reward Notification */}
            <RewardNotification />

        </MythsVsFactsContainer>
    );
}

export default MythsVsFacts; 