/**
 * Tests for useGameState hook
 * Tests game state management, choice handling, and game progression
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameState } from '../hooks/useGameState.js';

describe('useGameState Hook', () => {
    const mockGameData = [
        {
            id: 'test-1',
            title: 'Test Myth 1',
            text: 'This is a test myth',
            type: 'myth',
            explanation: 'This is actually false because...',
            image_url: 'http://example.com/animal1.jpg'
        },
        {
            id: 'test-2',
            title: 'Test Fact 1',
            text: 'This is a test fact',
            type: 'fact',
            explanation: 'This is true because...',
            image_url: 'http://example.com/animal2.jpg'
        },
        {
            id: 'test-3',
            title: 'Test Myth 2',
            text: 'Another test myth',
            type: 'myth',
            explanation: 'This is also false because...',
            image_url: 'http://example.com/animal3.jpg'
        },
        {
            id: 'test-4',
            title: 'Test Fact 2',
            text: 'Another test fact',
            type: 'fact',
            explanation: 'This is also true because...',
            animalImage: 'animal4.jpg',
            backgroundImage: 'bg4.jpg'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('initializes with correct default values', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            expect(result.current.currentIndex).toBe(0);
            expect(result.current.isAnimating).toBe(false);
            expect(result.current.animationDirection).toBe('');
            expect(result.current.score).toBe(0);
            expect(result.current.answered).toBe(0);
            expect(result.current.gameData).toEqual(mockGameData);
            expect(result.current.gameHistory).toEqual([]);
        });

        it('initializes with empty game data', () => {
            const { result } = renderHook(() => useGameState([]));

            expect(result.current.gameData).toEqual([]);
            expect(result.current.hasGameData).toBe(false);
            expect(result.current.currentCard).toBeNull();
        });

        it('calculates card stack correctly', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            expect(result.current.cardStack).toEqual([0, 1, 2, 3, 0, 1]);
            expect(result.current.cardStack).toHaveLength(6);
        });

        it('identifies current card correctly', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            expect(result.current.currentCard).toEqual(mockGameData[1]); // Top card is at stack index 5
        });
    });

    describe('Game Statistics', () => {
        it('calculates game progress correctly', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            expect(result.current.gameProgress).toEqual({
                current: 0,
                total: 4,
                percentage: 0,
                remaining: 4
            });
        });

        it('calculates game stats correctly', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            expect(result.current.gameStats).toEqual({
                score: 0,
                answered: 0,
                accuracy: 0,
                isComplete: false,
                progress: {
                    current: 0,
                    total: 4,
                    percentage: 0,
                    remaining: 4
                }
            });
        });

        it('updates accuracy calculation correctly', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            // Make some correct and incorrect choices
            act(() => {
                result.current.handleChoice('fact'); // Correct (current card is fact)
            });

            act(() => {
                result.current.completeAnimation();
            });

            act(() => {
                result.current.handleChoice('fact'); // Incorrect (current card is myth)
            });

            act(() => {
                result.current.completeAnimation();
            });

            expect(result.current.gameStats.accuracy).toBe(50); // 1 correct out of 2
        });
    });

    describe('Choice Handling', () => {
        it('handles correct myth choice', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            // Current card should be index 1 (fact), so myth choice is incorrect
            let choiceResult;
            act(() => {
                choiceResult = result.current.handleChoice('myth');
            });

            expect(choiceResult.isCorrect).toBe(false);
            expect(choiceResult.correctAnswer).toBe('fact');
            expect(choiceResult.choice.userChoice).toBe('myth');
            expect(result.current.isAnimating).toBe(true);
            expect(result.current.animationDirection).toBe('left');
        });

        it('handles correct fact choice', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            // Current card should be index 1 (fact), so fact choice is correct
            let choiceResult;
            act(() => {
                choiceResult = result.current.handleChoice('fact');
            });

            expect(choiceResult.isCorrect).toBe(true);
            expect(choiceResult.correctAnswer).toBe('fact');
            expect(choiceResult.choice.userChoice).toBe('fact');
            expect(result.current.isAnimating).toBe(true);
            expect(result.current.animationDirection).toBe('right');
            expect(result.current.score).toBe(1);
        });

        it('prevents choices during animation', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            // Make first choice
            act(() => {
                result.current.handleChoice('fact');
            });

            // Try to make another choice while animating
            let secondChoiceResult;
            act(() => {
                secondChoiceResult = result.current.handleChoice('myth');
            });

            expect(secondChoiceResult).toBe(false);
            expect(result.current.score).toBe(1); // Should not change
        });

        it('prevents choices when game is complete', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            // Complete all questions
            for (let i = 0; i < mockGameData.length; i++) {
                act(() => {
                    result.current.handleChoice('fact');
                });
                act(() => {
                    result.current.completeAnimation();
                });
            }

            // Try to make another choice
            let choiceResult;
            act(() => {
                choiceResult = result.current.handleChoice('myth');
            });

            expect(choiceResult).toBe(false);
            expect(result.current.isGameComplete).toBe(true);
        });

        it('prevents choices when no current card', () => {
            const { result } = renderHook(() => useGameState([]));

            let choiceResult;
            act(() => {
                choiceResult = result.current.handleChoice('fact');
            });

            expect(choiceResult).toBe(false);
        });

        it('records choice in game history', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            act(() => {
                result.current.handleChoice('fact');
            });

            expect(result.current.gameHistory).toHaveLength(1);

            const historyEntry = result.current.gameHistory[0];
            expect(historyEntry).toMatchObject({
                cardId: 'test-2',
                userChoice: 'fact',
                correctAnswer: 'fact',
                isCorrect: true,
                cardIndex: 1
            });
            expect(historyEntry.timestamp).toBeDefined();
        });
    });

    describe('Animation and Progression', () => {
        it('completes animation and moves to next card', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            const initialIndex = result.current.currentIndex;
            const initialAnswered = result.current.answered;

            act(() => {
                result.current.handleChoice('fact');
            });

            act(() => {
                result.current.completeAnimation();
            });

            expect(result.current.currentIndex).toBe(initialIndex + 1);
            expect(result.current.answered).toBe(initialAnswered + 1);
            expect(result.current.isAnimating).toBe(false);
            expect(result.current.animationDirection).toBe('');
        });

        it('wraps around to beginning when reaching end of data', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            // Move to last card
            act(() => {
                for (let i = 0; i < mockGameData.length - 1; i++) {
                    result.current.completeAnimation();
                }
            });

            act(() => {
                result.current.completeAnimation();
            });

            expect(result.current.currentIndex).toBe(0); // Wrapped around
        });

        it('updates card stack when index changes', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            const initialStack = [...result.current.cardStack];

            act(() => {
                result.current.completeAnimation();
            });

            expect(result.current.cardStack).not.toEqual(initialStack);
            expect(result.current.cardStack).toEqual([1, 2, 3, 0, 1, 2]);
        });
    });

    describe('Game Reset', () => {
        it('resets all game state', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            // Make some progress
            act(() => {
                result.current.handleChoice('fact');
                result.current.completeAnimation();
                result.current.handleChoice('myth');
                result.current.completeAnimation();
            });

            // Reset game
            act(() => {
                result.current.resetGame();
            });

            expect(result.current.currentIndex).toBe(0);
            expect(result.current.score).toBe(0);
            expect(result.current.answered).toBe(0);
            expect(result.current.gameHistory).toEqual([]);
            expect(result.current.isAnimating).toBe(false);
            expect(result.current.animationDirection).toBe('');
        });
    });

    describe('Game Data Updates', () => {
        it('updates game data and resets state', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            // Make some progress
            act(() => {
                result.current.handleChoice('fact');
                result.current.completeAnimation();
            });

            const newGameData = [
                {
                    id: 'new-1',
                    title: 'New Test',
                    text: 'New test content',
                    type: 'myth'
                }
            ];

            act(() => {
                result.current.updateGameData(newGameData);
            });

            expect(result.current.gameData).toEqual(newGameData);
            expect(result.current.currentIndex).toBe(0);
            expect(result.current.score).toBe(0);
            expect(result.current.answered).toBe(0);
            expect(result.current.gameHistory).toEqual([]);
        });
    });

    describe('Utility Functions', () => {
        it('skips current card', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            const initialIndex = result.current.currentIndex;
            const initialAnswered = result.current.answered;

            act(() => {
                result.current.skipCard();
            });

            expect(result.current.currentIndex).toBe(initialIndex + 1);
            expect(result.current.answered).toBe(initialAnswered + 1);
            expect(result.current.score).toBe(0); // Score should not change
        });

        it('prevents skipping during animation', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            act(() => {
                result.current.handleChoice('fact'); // Start animation
            });

            const indexBeforeSkip = result.current.currentIndex;

            act(() => {
                result.current.skipCard();
            });

            expect(result.current.currentIndex).toBe(indexBeforeSkip); // Should not change
        });

        it('gets card by stack position', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            const topCard = result.current.getCardByStackPosition(5);
            const bottomCard = result.current.getCardByStackPosition(0);

            expect(topCard).toEqual(mockGameData[1]);
            expect(bottomCard).toEqual(mockGameData[0]);
        });

        it('returns null for invalid stack positions', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            expect(result.current.getCardByStackPosition(-1)).toBeNull();
            expect(result.current.getCardByStackPosition(10)).toBeNull();
        });
    });

    describe('Game Insights', () => {
        it('calculates game insights correctly', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            // Make some choices - let's trace through the card sequence
            // Initial: currentIndex=0, cardStack=[0,1,2,3,0,1], currentCard=gameData[1] (fact)
            act(() => {
                result.current.handleChoice('fact'); // Correct choice for fact card
                result.current.completeAnimation(); // Move to next: currentIndex=1, currentCard=gameData[2] (myth)
            });

            act(() => {
                result.current.handleChoice('fact'); // Incorrect choice for myth card
                result.current.completeAnimation(); // Move to next: currentIndex=2, currentCard=gameData[3] (fact)
            });

            act(() => {
                result.current.handleChoice('myth'); // Incorrect choice for fact card
                result.current.completeAnimation(); // Move to next
            });

            const insights = result.current.getGameInsights();

            expect(insights.totalChoices).toBe(3);
            expect(insights.factChoices).toBe(2);
            expect(insights.mythChoices).toBe(1);
            expect(insights.correctChoices).toBe(1); // Only first choice was correct
            expect(insights.factAccuracy).toBe(50); // 1 correct out of 2 fact choices (first was correct, second was incorrect)
            expect(insights.mythAccuracy).toBe(0); // 0 correct out of 1 myth choice
        });

        it('returns null when no game history', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            const insights = result.current.getGameInsights();

            expect(insights).toBeNull();
        });

        it('calculates average response time', () => {
            vi.useFakeTimers();

            const { result } = renderHook(() => useGameState(mockGameData));

            // Make choices with time delays
            act(() => {
                result.current.handleChoice('fact');
            });

            act(() => {
                vi.advanceTimersByTime(1000);
                result.current.completeAnimation();
            });

            act(() => {
                result.current.handleChoice('myth');
            });

            act(() => {
                vi.advanceTimersByTime(2000);
                result.current.completeAnimation();
            });

            const insights = result.current.getGameInsights();
            expect(insights.averageResponseTime).toBeGreaterThan(0);

            vi.useRealTimers();
        });
    });

    describe('Game Completion', () => {
        it('detects game completion correctly', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            expect(result.current.isGameComplete).toBe(false);

            // Answer all questions
            for (let i = 0; i < mockGameData.length; i++) {
                act(() => {
                    result.current.handleChoice('fact');
                    result.current.completeAnimation();
                });
            }

            expect(result.current.isGameComplete).toBe(true);
            expect(result.current.gameStats.isComplete).toBe(true);
        });

        it('calculates final statistics correctly', () => {
            const { result } = renderHook(() => useGameState(mockGameData));

            // Answer all questions with mixed results
            const choices = ['fact', 'myth', 'myth', 'fact']; // 2 correct, 2 incorrect

            for (let i = 0; i < mockGameData.length; i++) {
                act(() => {
                    result.current.handleChoice(choices[i]);
                    result.current.completeAnimation();
                });
            }

            expect(result.current.gameStats.score).toBe(2);
            expect(result.current.gameStats.answered).toBe(4);
            expect(result.current.gameStats.accuracy).toBe(50);
            expect(result.current.gameStats.progress.percentage).toBe(100);
        });
    });

    describe('Edge Cases', () => {
        it('handles single card game data', () => {
            const singleCardData = [mockGameData[0]];
            const { result } = renderHook(() => useGameState(singleCardData));

            expect(result.current.cardStack).toHaveLength(6);
            expect(result.current.currentCard).toEqual(singleCardData[0]);

            act(() => {
                result.current.handleChoice('myth');
                result.current.completeAnimation();
            });

            expect(result.current.isGameComplete).toBe(true);
        });

        it('handles empty game data gracefully', () => {
            const { result } = renderHook(() => useGameState([]));

            expect(result.current.cardStack).toEqual([]);
            expect(result.current.currentCard).toBeNull();
            expect(result.current.hasGameData).toBe(false);
            // canMakeChoice depends on the actual hook implementation
            expect(result.current.canMakeChoice).toBeFalsy();
        });

        it('maintains referential stability for memoized values', () => {
            const { result, rerender } = renderHook(() => useGameState(mockGameData));

            const initialCardStack = result.current.cardStack;
            const initialCurrentCard = result.current.currentCard;
            const initialGameStats = result.current.gameStats;

            // Re-render without changing props
            rerender();

            expect(result.current.cardStack).toBe(initialCardStack);
            expect(result.current.currentCard).toBe(initialCurrentCard);
            expect(result.current.gameStats).toBe(initialGameStats);
        });
    });
});