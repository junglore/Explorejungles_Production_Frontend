/**
 * Game Performance Monitor Component
 * Tracks and displays performance metrics for the Myths vs Facts game
 */

import React, { useState, useEffect, useCallback } from 'react';

const GamePerformanceMonitor = ({
    gameState,
    imagePreloader,
    mythsFactsService,
    showDetails = false
}) => {
    const [performanceMetrics, setPerformanceMetrics] = useState({
        renderTime: 0,
        memoryUsage: 0,
        apiResponseTime: 0,
        imageLoadTime: 0,
        frameRate: 0
    });

    const [isMonitoring, setIsMonitoring] = useState(false);

    // Monitor render performance
    useEffect(() => {
        if (!isMonitoring) return;

        const startTime = performance.now();

        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.entryType === 'measure') {
                    setPerformanceMetrics(prev => ({
                        ...prev,
                        renderTime: entry.duration
                    }));
                }
            });
        });

        observer.observe({ entryTypes: ['measure'] });

        return () => {
            observer.disconnect();
            const endTime = performance.now();
            performance.mark('component-render-end');
            performance.measure('component-render', 'component-render-start', 'component-render-end');
        };
    }, [isMonitoring]);

    // Monitor memory usage (if available)
    useEffect(() => {
        if (!isMonitoring || !performance.memory) return;

        const interval = setInterval(() => {
            setPerformanceMetrics(prev => ({
                ...prev,
                memoryUsage: performance.memory.usedJSHeapSize / 1024 / 1024 // MB
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [isMonitoring]);

    // Monitor image loading performance
    useEffect(() => {
        if (imagePreloader.isLoading) {
            const startTime = Date.now();

            const checkComplete = () => {
                if (!imagePreloader.isLoading) {
                    const loadTime = Date.now() - startTime;
                    setPerformanceMetrics(prev => ({
                        ...prev,
                        imageLoadTime: loadTime
                    }));
                } else {
                    setTimeout(checkComplete, 100);
                }
            };

            checkComplete();
        }
    }, [imagePreloader.isLoading]);

    // Get service statistics
    const getServiceStats = useCallback(() => {
        if (mythsFactsService && typeof mythsFactsService.getServiceStats === 'function') {
            return mythsFactsService.getServiceStats();
        }
        return null;
    }, [mythsFactsService]);

    // Toggle monitoring
    const toggleMonitoring = useCallback(() => {
        setIsMonitoring(prev => !prev);
        if (!isMonitoring) {
            performance.mark('component-render-start');
        }
    }, [isMonitoring]);

    // Get performance summary
    const getPerformanceSummary = useCallback(() => {
        const serviceStats = getServiceStats();

        return {
            gamePerformance: {
                cardsRendered: gameState?.cardStack?.length || 0,
                animationsActive: gameState?.isAnimating || false,
                gameProgress: gameState?.gameStats?.progress?.percentage || 0
            },
            imagePerformance: {
                totalImages: imagePreloader.totalImages,
                loadedImages: imagePreloader.loadedCount,
                failedImages: imagePreloader.failedCount,
                successRate: imagePreloader.successRate,
                loadProgress: imagePreloader.loadProgress
            },
            apiPerformance: serviceStats ? {
                cacheSize: serviceStats.cacheSize,
                errorCount: serviceStats.errorCount,
                isLoading: serviceStats.isLoading
            } : null,
            systemPerformance: {
                renderTime: performanceMetrics.renderTime,
                memoryUsage: performanceMetrics.memoryUsage,
                imageLoadTime: performanceMetrics.imageLoadTime
            }
        };
    }, [gameState, imagePreloader, performanceMetrics, getServiceStats]);

    if (!showDetails && !isMonitoring) {
        return (
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                <button
                    onClick={toggleMonitoring}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 232, 161, 0.2)',
                        border: '1px solid rgba(255, 232, 161, 0.5)',
                        borderRadius: '6px',
                        color: '#FFE8A1',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                >
                    📊 Monitor Performance
                </button>
            </div>
        );
    }

    const summary = getPerformanceSummary();

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            backgroundColor: 'rgba(30, 45, 39, 0.95)',
            border: '1px solid rgba(255, 232, 161, 0.3)',
            borderRadius: '8px',
            padding: '15px',
            color: '#FFE8A1',
            fontSize: '12px',
            fontFamily: 'DM Sans',
            zIndex: 1000
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                borderBottom: '1px solid rgba(255, 232, 161, 0.2)',
                paddingBottom: '8px'
            }}>
                <h4 style={{ margin: 0, fontSize: '14px' }}>Performance Monitor</h4>
                <button
                    onClick={toggleMonitoring}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#FFE8A1',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    ✕
                </button>
            </div>

            {/* Game Performance */}
            <div style={{ marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: 0.8 }}>Game</h5>
                <div>Cards: {summary.gamePerformance.cardsRendered}</div>
                <div>Progress: {summary.gamePerformance.gameProgress}%</div>
                <div>Animating: {summary.gamePerformance.animationsActive ? 'Yes' : 'No'}</div>
            </div>

            {/* Image Performance */}
            <div style={{ marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: 0.8 }}>Images</h5>
                <div>Loaded: {summary.imagePerformance.loadedImages}/{summary.imagePerformance.totalImages}</div>
                <div>Success Rate: {summary.imagePerformance.successRate}%</div>
                <div>Load Time: {performanceMetrics.imageLoadTime}ms</div>
            </div>

            {/* API Performance */}
            {summary.apiPerformance && (
                <div style={{ marginBottom: '12px' }}>
                    <h5 style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: 0.8 }}>API</h5>
                    <div>Cache Size: {summary.apiPerformance.cacheSize}</div>
                    <div>Errors: {summary.apiPerformance.errorCount}</div>
                    <div>Loading: {summary.apiPerformance.isLoading ? 'Yes' : 'No'}</div>
                </div>
            )}

            {/* System Performance */}
            <div style={{ marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: 0.8 }}>System</h5>
                <div>Render Time: {performanceMetrics.renderTime.toFixed(2)}ms</div>
                {performanceMetrics.memoryUsage > 0 && (
                    <div>Memory: {performanceMetrics.memoryUsage.toFixed(1)}MB</div>
                )}
            </div>

            {/* Performance Status */}
            <div style={{
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: summary.imagePerformance.successRate > 80 ?
                    'rgba(40, 167, 69, 0.2)' :
                    summary.imagePerformance.successRate > 60 ?
                        'rgba(255, 193, 7, 0.2)' :
                        'rgba(220, 53, 69, 0.2)',
                border: `1px solid ${summary.imagePerformance.successRate > 80 ?
                    'rgba(40, 167, 69, 0.5)' :
                    summary.imagePerformance.successRate > 60 ?
                        'rgba(255, 193, 7, 0.5)' :
                        'rgba(220, 53, 69, 0.5)'}`
            }}>
                Status: {summary.imagePerformance.successRate > 80 ?
                    '🟢 Excellent' :
                    summary.imagePerformance.successRate > 60 ?
                        '🟡 Good' :
                        '🔴 Poor'}
            </div>
        </div>
    );
};

export default GamePerformanceMonitor;