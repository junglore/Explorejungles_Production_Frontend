/**
 * Custom React Hook for Myths vs Facts Game State Management
 * 
 * This hook provides comprehensive state management for the interactive myths vs facts game,
 * including card stack management, animation states, scoring, and game progression tracking.
 * It's optimized for performance using React's useMemo and useCallback hooks to prevent
 * unnecessary re-renders and computations.
 * 
 * Key Features:
 * - Optimized state management with memoization
 * - Card stack calculation for 3D effect
 * - Animation state handling
 * - Score and progress tracking
 * - Game history and analytics
 * - Performance insights and statistics
 * 
 * Game Mechanics:
 * - Manages a circular card stack (6 visible cards)
 * - Tracks user choices and correctness
 * - Provides immediate feedback and scoring
 * - Handles game completion and reset functionality
 * 
 * Performance Optimizations:
 * - Memoized calculations for card stack and statistics
 * - Callback optimization to prevent unnecessary re-renders
 * - Efficient state updates with minimal re-computations
 * 
 * @author Junglore Development Team
 * @version 1.0.0
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing the complete state of the Myths vs Facts game.
 * 
 * @param {Array} initialGameData - Initial array of game content objects
 * @returns {Object} Game state object with state, computed values, and actions
 */
export const useGameState = (initialGameData = []) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationDirection, setAnimationDirection] = useState('');
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(0);
    const [gameData, setGameData] = useState(initialGameData);
    const [gameHistory, setGameHistory] = useState([]);

    // Memoized card stack calculation
    const cardStack = useMemo(() => {
        if (gameData.length === 0) return [];
        return Array.from({ length: 6 }, (_, i) => (currentIndex + i) % gameData.length);
    }, [currentIndex, gameData.length]);

    // Current card (top card in stack)
    const currentCard = useMemo(() => {
        if (gameData.length === 0 || cardStack.length === 0) return null;
        return gameData[cardStack[5]]; // Top card is at index 5
    }, [gameData, cardStack]);

    // Game progress
    const gameProgress = useMemo(() => ({
        current: answered,
        total: gameData.length,
        percentage: gameData.length > 0 ? Math.round((answered / gameData.length) * 100) : 0,
        remaining: Math.max(0, gameData.length - answered)
    }), [answered, gameData.length]);

    // Game statistics
    const gameStats = useMemo(() => ({
        score,
        answered,
        accuracy: answered > 0 ? Math.round((score / answered) * 100) : 0,
        isComplete: gameData.length > 0 && answered >= gameData.length, // Only complete if we have data AND answered all
        progress: gameProgress
    }), [score, answered, gameData.length, gameProgress]);

    // Update game data
    const updateGameData = useCallback((newData) => {
        setGameData(newData);
        // Reset game state when data changes
        setCurrentIndex(0);
        setScore(0);
        setAnswered(0);
        setGameHistory([]);
        setIsAnimating(false);
        setAnimationDirection('');
    }, []);

    // Handle user choice with optimized state updates
    const handleChoice = useCallback((choice) => {
        if (isAnimating || !currentCard || answered >= gameData.length) {
            return false;
        }

        setIsAnimating(true);

        const isCorrect = (choice === 'myth' && currentCard.type === 'myth') ||
            (choice === 'fact' && currentCard.type === 'fact');

        // Update score immediately
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // Record the choice in history
        const choiceRecord = {
            cardId: currentCard.id,
            userChoice: choice,
            correctAnswer: currentCard.type,
            isCorrect,
            timestamp: Date.now(),
            cardIndex: cardStack[5]
        };

        setGameHistory(prev => [...prev, choiceRecord]);

        // Set animation direction
        setAnimationDirection(choice === 'myth' ? 'left' : 'right');

        // Return choice result for immediate feedback
        return {
            isCorrect,
            correctAnswer: currentCard.type,
            explanation: currentCard.explanation || currentCard.fact_explanation,
            choice: choiceRecord
        };
    }, [isAnimating, currentCard, answered, gameData.length, cardStack]);

    // Complete animation and move to next card
    const completeAnimation = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % gameData.length);
        setAnswered(prev => prev + 1);
        setAnimationDirection('');
        setIsAnimating(false);
    }, [gameData.length]);

    // Reset game
    const resetGame = useCallback(() => {
        setCurrentIndex(0);
        setScore(0);
        setAnswered(0);
        setGameHistory([]);
        setIsAnimating(false);
        setAnimationDirection('');
    }, []);

    // Skip current card (for debugging or special cases)
    const skipCard = useCallback(() => {
        if (isAnimating) return;

        setCurrentIndex(prev => (prev + 1) % gameData.length);
        setAnswered(prev => prev + 1);
    }, [isAnimating, gameData.length]);

    // Get card by stack position
    const getCardByStackPosition = useCallback((stackPosition) => {
        if (stackPosition < 0 || stackPosition >= cardStack.length) return null;
        return gameData[cardStack[stackPosition]];
    }, [cardStack, gameData]);

    // Get game insights
    const getGameInsights = useCallback(() => {
        if (gameHistory.length === 0) return null;

        const mythChoices = gameHistory.filter(h => h.userChoice === 'myth');
        const factChoices = gameHistory.filter(h => h.userChoice === 'fact');
        const correctChoices = gameHistory.filter(h => h.isCorrect);

        return {
            totalChoices: gameHistory.length,
            mythChoices: mythChoices.length,
            factChoices: factChoices.length,
            correctChoices: correctChoices.length,
            mythAccuracy: mythChoices.length > 0 ?
                Math.round((mythChoices.filter(h => h.isCorrect).length / mythChoices.length) * 100) : 0,
            factAccuracy: factChoices.length > 0 ?
                Math.round((factChoices.filter(h => h.isCorrect).length / factChoices.length) * 100) : 0,
            averageResponseTime: gameHistory.length > 1 ?
                gameHistory.slice(1).reduce((acc, curr, idx) =>
                    acc + (curr.timestamp - gameHistory[idx].timestamp), 0) / (gameHistory.length - 1) : 0
        };
    }, [gameHistory]);

    return {
        // State
        currentIndex,
        isAnimating,
        animationDirection,
        score,
        answered,
        gameData,
        cardStack,
        currentCard,
        gameHistory,

        // Computed values
        gameStats,
        gameProgress,

        // Actions
        updateGameData,
        handleChoice,
        completeAnimation,
        resetGame,
        skipCard,
        getCardByStackPosition,
        getGameInsights,

        // Utilities
        isGameComplete: gameData.length > 0 && answered >= gameData.length,
        hasGameData: gameData.length > 0,
        canMakeChoice: !isAnimating && currentCard && answered < gameData.length
    };
};