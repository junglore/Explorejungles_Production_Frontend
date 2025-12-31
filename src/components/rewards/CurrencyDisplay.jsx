/**
 * Currency Display Component
 * Shows user's current Points and Credits balance
 * Can be used in header, sidebar, or as standalone component
 */

import React, { useState, useEffect } from 'react';
import { useRewards } from '../../contexts/RewardsContext.jsx';
import './CurrencyDisplay.css';

const CurrencyDisplay = ({ 
    variant = 'default', // 'default', 'compact', 'detailed'
    showRefresh = false,
    onClick = null,
    className = ''
}) => {
    const { 
        balance, 
        loading, 
        loadingStates,
        refreshBalance, 
        formatCurrency 
    } = useRewards();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [animateUpdate, setAnimateUpdate] = useState({ points: false, credits: false });

    // Animate balance updates
    useEffect(() => {
        setAnimateUpdate({ points: true, credits: true });
        const timer = setTimeout(() => {
            setAnimateUpdate({ points: false, credits: false });
        }, 600);

        return () => clearTimeout(timer);
    }, [balance?.points ?? 0, balance?.credits ?? 0]);

    const handleRefresh = async () => {
        if (isRefreshing || loadingStates.balance) return;
        
        setIsRefreshing(true);
        try {
            await refreshBalance();
        } finally {
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    if (loading) {
        return (
            <div className={`currency-display currency-display--loading ${className}`}>
                <div className="currency-display__skeleton">
                    <div className="currency-display__item-skeleton">
                        <div className="skeleton-icon"></div>
                        <div className="skeleton-text"></div>
                    </div>
                    <div className="currency-display__item-skeleton">
                        <div className="skeleton-icon"></div>
                        <div className="skeleton-text"></div>
                    </div>
                </div>
            </div>
        );
    }

    const renderCurrencyItem = (type, amount, icon, color) => {
        const isAnimating = animateUpdate[type];
        // Ensure amount is always a valid number
        const safeAmount = typeof amount === 'number' ? amount : 0;
        const isPoints = type === 'points';
        
        return (
            <div 
                className={`currency-display__item currency-display__item--${type} ${isAnimating ? 'currency-display__item--animate' : ''}`}
                style={{ 
                    '--currency-color': color,
                    background: isPoints 
                        ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(59, 130, 246, 0.1))'
                        : 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1))',
                    border: `1px solid ${isPoints ? 'rgba(96, 165, 250, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`,
                    borderRadius: '8px',
                    padding: '8px 12px'
                }}
            >
                <div className="currency-display__icon" style={{
                    fontSize: '16px',
                    marginRight: '6px'
                }}>
                    {icon}
                </div>
                <div className="currency-display__amount">
                    {variant === 'detailed' ? (
                        <>
                            <span className="currency-display__number" style={{
                                fontWeight: '600',
                                fontSize: '15px',
                                color: '#FFFFFF',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                            }}>
                                {safeAmount.toLocaleString()}
                            </span>
                            <span className="currency-display__label">
                                {type === 'points' ? 'Points' : 'Credits'}
                            </span>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <span className="currency-display__compact" style={{
                                color: '#FFFFFF',
                                fontWeight: '600',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                            }}>
                                {variant === 'compact' ? 
                                    formatCompactNumber(safeAmount) : 
                                    safeAmount.toLocaleString()
                                }
                            </span>
                            <span style={{
                                fontSize: '10px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {type === 'points' ? 'Points' : 'Credits'}
                            </span>
                        </div>
                    )}
                </div>
                {isAnimating && (
                    <div className="currency-display__plus-animation">
                        <span>+</span>
                    </div>
                )}
            </div>
        );
    };

    const formatCompactNumber = (num) => {
        // Ensure num is always a valid number
        const safeNum = typeof num === 'number' ? num : 0;
        
        if (safeNum >= 1000000) {
            return (safeNum / 1000000).toFixed(1) + 'M';
        }
        if (safeNum >= 1000) {
            return (safeNum / 1000).toFixed(1) + 'K';
        }
        return safeNum.toString();
    };

    return (
        <div 
            className={`currency-display currency-display--${variant} ${onClick ? 'currency-display--clickable' : ''} ${className}`}
            onClick={handleClick}
        >
            {variant === 'detailed' && (
                <div className="currency-display__header">
                    <h3 className="currency-display__title">Your Balance</h3>
                    {showRefresh && (
                        <button
                            className={`currency-display__refresh ${isRefreshing ? 'currency-display__refresh--spinning' : ''}`}
                            onClick={handleRefresh}
                            disabled={isRefreshing || loadingStates.balance}
                            title="Refresh balance"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M23 4v6h-6M1 20v-6h6m16-4c0 3.66-1.34 7-4 9.5L19 23l-2 2-2-2 4-4m-6-4c0-3.66 1.34-7 4-9.5L5 1l2-2 2 2L5 5"/>
                            </svg>
                        </button>
                    )}
                </div>
            )}

            <div className="currency-display__content">
                {renderCurrencyItem(
                    'points', 
                    balance?.points ?? 0, 
                    '⭐', 
                    '#60A5FA'
                )}
                
                {renderCurrencyItem(
                    'credits', 
                    balance?.credits ?? 0, 
                    '🪙', 
                    '#FBBF24'
                )}
            </div>

            {(loadingStates.balance || isRefreshing) && (
                <div className="currency-display__loading-overlay">
                    <div className="currency-display__spinner"></div>
                </div>
            )}
        </div>
    );
};

// Icon components
const StarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
);

const CoinIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v12M8 10l4-4 4 4"/>
    </svg>
);

export default CurrencyDisplay;