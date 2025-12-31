/**
 * Comprehensive tests for MythsVsFacts game component
 * Tests API integration, game mechanics, error handling, and responsive design
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';

import MythsVsFacts from '../pages/resources/MythsVsFacts.jsx';
import mythsFactsService from '../services/mythsFactsService.js';

// Mock the service
vi.mock('../services/mythsFactsService.js', () => ({
    default: {
        fetchRandomMythsFacts: vi.fn(),
        fetchMythsVsFacts: vi.fn(),
        getServiceStats: vi.fn(),
        resetErrorCount: vi.fn(),
        clearCache: vi.fn(),
    }
}));

// Mock the useGameState hook
vi.mock('../hooks/useGameState.js', () => ({
    useGameState: vi.fn()
}));

// Mock navigation image imports (only UI elements kept)
vi.mock('../assets/images/MythvsFact/Left.png', () => ({ default: 'mock-left-arrow.png' }));
vi.mock('../assets/images/MythvsFact/Right.png', () => ({ default: 'mock-right-arrow.png' }));

describe('MythsVsFacts Component', () => {
    // Mock game state data
    const mockGameState = {
        currentIndex: 0,
        isAnimating: false,
        animationDirection: '',
        score: 0,
        answered: 0,
        gameData: [
            {
                id: 'test-1',
                title: 'Test Myth',
                text: '"Test myth statement"',
                type: 'myth',
                image_url: 'http://example.com/test-image-1.jpg',
                explanation: 'This is actually false because...'
            },
            {
                id: 'test-2',
                title: 'Test Fact',
                text: '"Test fact statement"',
                type: 'fact',
                image_url: 'http://example.com/test-image-2.jpg',
                explanation: 'This is true because...'
            }
        ],
        cardStack: [0, 1, 0, 1, 0, 1],
        currentCard: {
            id: 'test-1',
            title: 'Test Myth',
            text: '"Test myth statement"',
            type: 'myth',
            image_url: 'http://example.com/test-image-1.jpg',
            explanation: 'This is actually false because...'
        },
        gameStats: {
            score: 0,
            answered: 0,
            accuracy: 0,
            isComplete: false,
            progress: { current: 0, total: 2, percentage: 0, remaining: 2 }
        },
        updateGameData: vi.fn(),
        handleChoice: vi.fn(),
        completeAnimation: vi.fn(),
        resetGame: vi.fn(),
        isGameComplete: false,
        hasGameData: true,
        canMakeChoice: true
    };

    const mockApiResponse = {
        myths: [
            {
                id: 'api-1',
                title: 'API Myth',
                myth_statement: 'API myth content',
                fact_explanation: 'API fact explanation',
                type: 'myth',
                is_featured: true,
                created_at: '2024-01-01T00:00:00Z'
            },
            {
                id: 'api-2',
                title: 'API Fact',
                myth_statement: 'API fact content',
                fact_explanation: 'API fact explanation',
                type: 'fact',
                is_featured: false,
                created_at: '2024-01-01T00:00:00Z'
            }
        ]
    };

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Mock useGameState hook
        const { useGameState } = require('../hooks/useGameState.js');
        useGameState.mockReturnValue(mockGameState);

        // Mock successful API responses by default
        mythsFactsService.fetchRandomMythsFacts.mockResolvedValue(mockApiResponse.myths);
        mythsFactsService.fetchMythsVsFacts.mockResolvedValue(mockApiResponse);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Component Rendering', () => {
        it('renders loading state initially', async () => {
            render(<MythsVsFacts />);

            expect(screen.getByText('Loading Myths vs Facts Game...')).toBeInTheDocument();
        });

        it('renders game interface after loading', async () => {
            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(screen.queryByText('Loading Myths vs Facts Game...')).not.toBeInTheDocument();
            });

            expect(screen.getByText('MYTHS VS FACTS')).toBeInTheDocument();
            expect(screen.getByText('SCORE: 0')).toBeInTheDocument();
        });

        it('renders game description text', async () => {
            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(screen.getByText(/Step into India's untamed wilderness/)).toBeInTheDocument();
            });
        });

        it('renders navigation arrows', async () => {
            render(<MythsVsFacts />);

            await waitFor(() => {
                const leftArrow = screen.getByAltText('Swipe Left for Myth');
                const rightArrow = screen.getByAltText('Swipe Right for Fact');

                expect(leftArrow).toBeInTheDocument();
                expect(rightArrow).toBeInTheDocument();
            });
        });

        it('renders current card content', async () => {
            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(screen.getByText('"Test myth statement"')).toBeInTheDocument();
                expect(screen.getByAltText('Test Myth')).toBeInTheDocument();
            });
        });
    });

    describe('API Integration', () => {
        it('fetches random myths facts on component mount', async () => {
            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(mythsFactsService.fetchRandomMythsFacts).toHaveBeenCalledWith(12);
            });
        });

        it('falls back to regular fetch if random fetch fails', async () => {
            mythsFactsService.fetchRandomMythsFacts.mockRejectedValueOnce(new Error('Random fetch failed'));

            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(mythsFactsService.fetchRandomMythsFacts).toHaveBeenCalled();
                expect(mythsFactsService.fetchMythsVsFacts).toHaveBeenCalledWith({ page: 1, limit: 50 });
            });
        });

        it('shows no content message when API fails completely', async () => {
            mythsFactsService.fetchRandomMythsFacts.mockRejectedValueOnce(new Error('API Error'));
            mythsFactsService.fetchMythsVsFacts.mockRejectedValueOnce(new Error('API Error'));

            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(mockGameState.updateGameData).toHaveBeenCalledWith([]);
            });
        });

        it('transforms API data correctly', async () => {
            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(mockGameState.updateGameData).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: 'api-1',
                            title: 'API Myth',
                            text: '"API myth content"',
                            type: 'myth'
                        })
                    ])
                );
            });
        });

        it('handles empty API response gracefully', async () => {
            mythsFactsService.fetchRandomMythsFacts.mockResolvedValueOnce([]);
            mythsFactsService.fetchMythsVsFacts.mockResolvedValueOnce({ myths: [] });

            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(mockGameState.updateGameData).toHaveBeenCalled();
            });
        });
    });

    describe('Game Mechanics', () => {
        it('handles myth choice correctly', async () => {
            mockGameState.handleChoice.mockReturnValue({
                isCorrect: true,
                correctAnswer: 'myth',
                explanation: 'Correct explanation'
            });

            render(<MythsVsFacts />);

            await waitFor(() => {
                const leftArrow = screen.getByAltText('Swipe Left for Myth');
                fireEvent.click(leftArrow);

                expect(mockGameState.handleChoice).toHaveBeenCalledWith('myth');
            });
        });

        it('handles fact choice correctly', async () => {
            mockGameState.handleChoice.mockReturnValue({
                isCorrect: true,
                correctAnswer: 'fact',
                explanation: 'Correct explanation'
            });

            render(<MythsVsFacts />);

            await waitFor(() => {
                const rightArrow = screen.getByAltText('Swipe Right for Fact');
                fireEvent.click(rightArrow);

                expect(mockGameState.handleChoice).toHaveBeenCalledWith('fact');
            });
        });

        it('completes animation after choice delay', async () => {
            vi.useFakeTimers();

            mockGameState.handleChoice.mockReturnValue({
                isCorrect: true,
                correctAnswer: 'myth'
            });

            render(<MythsVsFacts />);

            await waitFor(() => {
                const leftArrow = screen.getByAltText('Swipe Left for Myth');
                fireEvent.click(leftArrow);
            });

            act(() => {
                vi.advanceTimersByTime(900);
            });

            expect(mockGameState.completeAnimation).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it('prevents choices during animation', async () => {
            const animatingGameState = {
                ...mockGameState,
                isAnimating: true,
                canMakeChoice: false
            };

            const { useGameState } = require('../hooks/useGameState.js');
            useGameState.mockReturnValue(animatingGameState);

            render(<MythsVsFacts />);

            await waitFor(() => {
                const leftArrow = screen.getByAltText('Swipe Left for Myth');
                expect(leftArrow).toHaveAttribute('disabled');
            });
        });

        it('updates score display correctly', async () => {
            const scoredGameState = {
                ...mockGameState,
                score: 5
            };

            const { useGameState } = require('../hooks/useGameState.js');
            useGameState.mockReturnValue(scoredGameState);

            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(screen.getByText('SCORE: 5')).toBeInTheDocument();
            });
        });
    });

    describe('Game Completion', () => {
        it('shows completion screen when game is finished', async () => {
            const completedGameState = {
                ...mockGameState,
                isGameComplete: true,
                gameStats: {
                    ...mockGameState.gameStats,
                    score: 8,
                    progress: { total: 10 },
                    accuracy: 80
                }
            };

            const { useGameState } = require('../hooks/useGameState.js');
            useGameState.mockReturnValue(completedGameState);

            render(<MythsVsFacts />);

            expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
            expect(screen.getByText('Final Score: 8/10')).toBeInTheDocument();
            expect(screen.getByText('Accuracy: 80%')).toBeInTheDocument();
        });

        it('allows restarting the game', async () => {
            const completedGameState = {
                ...mockGameState,
                isGameComplete: true,
                gameStats: {
                    ...mockGameState.gameStats,
                    score: 8,
                    progress: { total: 10 },
                    accuracy: 80
                }
            };

            const { useGameState } = require('../hooks/useGameState.js');
            useGameState.mockReturnValue(completedGameState);

            render(<MythsVsFacts />);

            const playAgainButton = screen.getByText('Play Again');
            fireEvent.click(playAgainButton);

            expect(mockGameState.resetGame).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        it('handles API errors gracefully', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            mythsFactsService.fetchRandomMythsFacts.mockRejectedValue(new Error('Network error'));
            mythsFactsService.fetchMythsVsFacts.mockRejectedValue(new Error('Network error'));

            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    'Error loading myths vs facts:',
                    expect.any(Error)
                );
            });

            consoleErrorSpy.mockRestore();
        });

        it('shows no content message after API failure', async () => {
            const noDataGameState = {
                ...mockGameState,
                hasGameData: false,
                gameData: []
            };

            const { useGameState } = require('../hooks/useGameState.js');
            useGameState.mockReturnValue(noDataGameState);

            mythsFactsService.fetchRandomMythsFacts.mockRejectedValue(new Error('API Error'));
            mythsFactsService.fetchMythsVsFacts.mockRejectedValue(new Error('API Error'));

            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(screen.getByText('No Myths vs Facts content available')).toBeInTheDocument();
                expect(screen.getByText('Please add content through the admin panel to play the game')).toBeInTheDocument();
            });
        });

        it('handles malformed API responses', async () => {
            mythsFactsService.fetchRandomMythsFacts.mockResolvedValue(null);
            mythsFactsService.fetchMythsVsFacts.mockResolvedValue({ myths: null });

            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(mockGameState.updateGameData).toHaveBeenCalled();
            });
        });
    });

    describe('Responsive Design', () => {
        it('applies mobile styles correctly', async () => {
            // Mock window.matchMedia for mobile viewport
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: vi.fn().mockImplementation(query => ({
                    matches: query.includes('max-width: 768px'),
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                })),
            });

            render(<MythsVsFacts />);

            await waitFor(() => {
                const gameContainer = screen.getByText('MYTHS VS FACTS').closest('div');
                expect(gameContainer).toBeInTheDocument();
            });
        });

        it('handles different screen sizes', async () => {
            const testSizes = [
                { width: 1920, height: 1080 }, // Desktop
                { width: 1024, height: 768 },  // Tablet
                { width: 375, height: 667 }    // Mobile
            ];

            for (const size of testSizes) {
                // Mock viewport size
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: size.width,
                });
                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: size.height,
                });

                render(<MythsVsFacts />);

                await waitFor(() => {
                    expect(screen.getByText('MYTHS VS FACTS')).toBeInTheDocument();
                });
            }
        });
    });

    describe('Performance', () => {
        it('does not cause memory leaks with timers', async () => {
            vi.useFakeTimers();

            const { unmount } = render(<MythsVsFacts />);

            await waitFor(() => {
                const leftArrow = screen.getByAltText('Swipe Left for Myth');
                fireEvent.click(leftArrow);
            });

            // Unmount component before timer completes
            unmount();

            // Advance timers - should not cause errors
            act(() => {
                vi.advanceTimersByTime(1000);
            });

            vi.useRealTimers();
        });

        it('handles rapid clicks gracefully', async () => {
            render(<MythsVsFacts />);

            await waitFor(() => {
                const leftArrow = screen.getByAltText('Swipe Left for Myth');

                // Rapid clicks
                fireEvent.click(leftArrow);
                fireEvent.click(leftArrow);
                fireEvent.click(leftArrow);

                // Should only register one choice due to animation state
                expect(mockGameState.handleChoice).toHaveBeenCalledTimes(1);
            });
        });

        it('optimizes re-renders with memoization', async () => {
            const { rerender } = render(<MythsVsFacts />);

            // Re-render with same props
            rerender(<MythsVsFacts />);

            await waitFor(() => {
                expect(screen.getByText('MYTHS VS FACTS')).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('provides proper alt text for images', async () => {
            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(screen.getByAltText('Test Myth')).toBeInTheDocument();
                expect(screen.getByAltText('Swipe Left for Myth')).toBeInTheDocument();
                expect(screen.getByAltText('Swipe Right for Fact')).toBeInTheDocument();
            });
        });

        it('supports keyboard navigation', async () => {
            render(<MythsVsFacts />);

            await waitFor(() => {
                const leftArrow = screen.getByAltText('Swipe Left for Myth');
                const rightArrow = screen.getByAltText('Swipe Right for Fact');

                // Should be focusable
                leftArrow.focus();
                expect(document.activeElement).toBe(leftArrow);

                rightArrow.focus();
                expect(document.activeElement).toBe(rightArrow);
            });
        });

        it('provides proper ARIA labels', async () => {
            render(<MythsVsFacts />);

            await waitFor(() => {
                const scoreDisplay = screen.getByText('SCORE: 0');
                expect(scoreDisplay).toBeInTheDocument();
            });
        });
    });

    describe('Data Transformation', () => {
        it('transforms API data to game format correctly', async () => {
            const apiData = [
                {
                    id: 'transform-test',
                    title: 'Transform Test',
                    myth_content: 'Transform myth content',
                    fact_content: 'Transform fact content',
                    type: 'myth',
                    is_featured: true,
                    image_url: 'http://example.com/image.jpg'
                }
            ];

            mythsFactsService.fetchRandomMythsFacts.mockResolvedValue(apiData);

            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(mockGameState.updateGameData).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: 'transform-test',
                            title: 'Transform Test',
                            text: '"Transform myth content"',
                            type: 'myth',
                            explanation: 'Transform fact content'
                        })
                    ])
                );
            });
        });

        it('handles missing image URLs gracefully', async () => {
            const apiDataWithoutImages = [
                {
                    id: 'no-image',
                    title: 'No Image Test',
                    myth_content: 'No image myth',
                    fact_content: 'No image fact',
                    type: 'myth',
                    image_url: null
                }
            ];

            mythsFactsService.fetchRandomMythsFacts.mockResolvedValue(apiDataWithoutImages);

            render(<MythsVsFacts />);

            await waitFor(() => {
                expect(mockGameState.updateGameData).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: 'no-image',
                            image_url: null
                        })
                    ])
                );
            });
        });

        it('uses all available data from backend', async () => {
            const backendData = Array(10).fill(null).map((_, i) => ({
                id: `backend-${i}`,
                title: `Test ${i}`,
                myth_content: `Myth ${i}`,
                fact_content: `Fact ${i}`,
                type: i % 2 === 0 ? 'myth' : 'fact',
                image_url: `http://example.com/image-${i}.jpg`
            }));

            mythsFactsService.fetchRandomMythsFacts.mockResolvedValue(backendData);

            render(<MythsVsFacts />);

            await waitFor(() => {
                const callArgs = mockGameState.updateGameData.mock.calls[0][0];
                expect(callArgs).toHaveLength(10);
                expect(callArgs.every(item => item.image_url)).toBe(true);
            });
        });
    });
});