/**
 * Quiz Accessibility Components and Utilities
 * Provides comprehensive accessibility features for quiz interfaces
 */

import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { designTokens, VisuallyHidden } from './QuizDesignSystem';

// Accessibility context for managing focus and announcements
const AccessibilityContext = createContext();

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within AccessibilityProvider');
    }
    return context;
};

// Accessibility provider component
export const AccessibilityProvider = ({ children }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [focusTarget, setFocusTarget] = useState(null);
    const announcementRef = useRef(null);

    // Announce message to screen readers
    const announce = (message, priority = 'polite') => {
        const id = Date.now();
        const announcement = { id, message, priority };

        setAnnouncements(prev => [...prev, announcement]);

        // Remove announcement after it's been read
        setTimeout(() => {
            setAnnouncements(prev => prev.filter(a => a.id !== id));
        }, 1000);
    };

    // Set focus to specific element
    const setFocus = (element) => {
        if (element && typeof element.focus === 'function') {
            element.focus();
        } else if (typeof element === 'string') {
            const targetElement = document.getElementById(element) || document.querySelector(element);
            if (targetElement) {
                targetElement.focus();
            }
        }
    };

    // Skip to main content
    const skipToMain = () => {
        const mainContent = document.querySelector('main, [role="main"], #main-content');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const value = {
        announce,
        setFocus,
        skipToMain,
        announcements,
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}

            {/* Live region for announcements */}
            <div
                ref={announcementRef}
                aria-live="polite"
                aria-atomic="true"
                style={{
                    position: 'absolute',
                    left: '-10000px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                }}
            >
                {announcements
                    .filter(a => a.priority === 'polite')
                    .map(a => a.message)
                    .join('. ')}
            </div>

            <div
                aria-live="assertive"
                aria-atomic="true"
                style={{
                    position: 'absolute',
                    left: '-10000px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                }}
            >
                {announcements
                    .filter(a => a.priority === 'assertive')
                    .map(a => a.message)
                    .join('. ')}
            </div>
        </AccessibilityContext.Provider>
    );
};

// Skip link component
export const SkipLink = styled('a')({
    position: 'absolute',
    top: '-40px',
    left: '6px',
    background: designTokens.colors.primary,
    color: designTokens.colors.background,
    padding: '8px',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: designTokens.typography.fontWeights.semibold,
    fontSize: designTokens.typography.sizes.sm,
    zIndex: 1000,
    transition: 'top 0.3s',
    '&:focus': {
        top: '6px',
    },
});

// Breadcrumb navigation component
const BreadcrumbNav = styled('nav')({
    marginBottom: designTokens.spacing.lg,
    [`@media (max-width: ${designTokens.breakpoints.sm})`]: {
        marginBottom: designTokens.spacing.md,
    },
});

const BreadcrumbList = styled('ol')({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontSize: designTokens.typography.sizes.sm,
    color: designTokens.colors.textSecondary,
});

const BreadcrumbItem = styled('li')({
    display: 'flex',
    alignItems: 'center',
    '&:not(:last-child)::after': {
        content: '"/"',
        marginLeft: designTokens.spacing.sm,
        color: designTokens.colors.textMuted,
    },
});

const BreadcrumbLink = styled('a')({
    color: designTokens.colors.textSecondary,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    '&:hover, &:focus': {
        color: designTokens.colors.primary,
        textDecoration: 'underline',
    },
    '&:focus': {
        outline: `2px solid ${designTokens.colors.primary}`,
        outlineOffset: '2px',
        borderRadius: '2px',
    },
});

const BreadcrumbCurrent = styled('span')({
    color: designTokens.colors.text,
    fontWeight: designTokens.typography.fontWeights.medium,
});

export const Breadcrumb = ({ items = [] }) => {
    if (!items.length) return null;

    return (
        <BreadcrumbNav aria-label="Breadcrumb navigation">
            <BreadcrumbList>
                {items.map((item, index) => (
                    <BreadcrumbItem key={index}>
                        {index === items.length - 1 ? (
                            <BreadcrumbCurrent aria-current="page">
                                {item.label}
                            </BreadcrumbCurrent>
                        ) : (
                            <BreadcrumbLink href={item.href} onClick={item.onClick}>
                                {item.label}
                            </BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </BreadcrumbNav>
    );
};

// Focus trap component for modals and overlays
export const FocusTrap = ({ children, active = true, restoreFocus = true }) => {
    const containerRef = useRef(null);
    const previousActiveElement = useRef(null);

    useEffect(() => {
        if (!active) return;

        // Store the currently focused element
        previousActiveElement.current = document.activeElement;

        const container = containerRef.current;
        if (!container) return;

        // Get all focusable elements
        const getFocusableElements = () => {
            return container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
        };

        const handleKeyDown = (event) => {
            if (event.key !== 'Tab') return;

            const focusableElements = getFocusableElements();
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        // Focus the first focusable element
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);

            // Restore focus to the previously focused element
            if (restoreFocus && previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [active, restoreFocus]);

    return (
        <div ref={containerRef} tabIndex={-1}>
            {children}
        </div>
    );
};

// Keyboard navigation hook
export const useKeyboardNavigation = (options = {}) => {
    const {
        onEnter,
        onSpace,
        onEscape,
        onArrowUp,
        onArrowDown,
        onArrowLeft,
        onArrowRight,
        onHome,
        onEnd,
    } = options;

    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
                if (onEnter) {
                    event.preventDefault();
                    onEnter(event);
                }
                break;
            case ' ':
                if (onSpace) {
                    event.preventDefault();
                    onSpace(event);
                }
                break;
            case 'Escape':
                if (onEscape) {
                    event.preventDefault();
                    onEscape(event);
                }
                break;
            case 'ArrowUp':
                if (onArrowUp) {
                    event.preventDefault();
                    onArrowUp(event);
                }
                break;
            case 'ArrowDown':
                if (onArrowDown) {
                    event.preventDefault();
                    onArrowDown(event);
                }
                break;
            case 'ArrowLeft':
                if (onArrowLeft) {
                    event.preventDefault();
                    onArrowLeft(event);
                }
                break;
            case 'ArrowRight':
                if (onArrowRight) {
                    event.preventDefault();
                    onArrowRight(event);
                }
                break;
            case 'Home':
                if (onHome) {
                    event.preventDefault();
                    onHome(event);
                }
                break;
            case 'End':
                if (onEnd) {
                    event.preventDefault();
                    onEnd(event);
                }
                break;
            default:
                break;
        }
    };

    return { handleKeyDown };
};

// Screen reader only text component
export const ScreenReaderOnly = ({ children, ...props }) => (
    <VisuallyHidden {...props}>
        {children}
    </VisuallyHidden>
);

// Accessible heading component with proper hierarchy
export const AccessibleHeading = ({ level, children, id, ...props }) => {
    const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}`;

    return (
        <HeadingTag id={id} {...props}>
            {children}
        </HeadingTag>
    );
};

// Progress indicator with accessibility
export const AccessibleProgress = ({
    value,
    max = 100,
    label,
    description,
    showPercentage = true,
    ...props
}) => {
    const percentage = Math.round((value / max) * 100);

    return (
        <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label} {...props}>
            {description && <ScreenReaderOnly>{description}</ScreenReaderOnly>}
            {showPercentage && (
                <ScreenReaderOnly>
                    {percentage}% complete
                </ScreenReaderOnly>
            )}
        </div>
    );
};

// Accessible button with loading state
export const AccessibleButton = ({
    children,
    loading = false,
    loadingText = 'Loading...',
    disabled,
    ...props
}) => {
    return (
        <button
            disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        >
            {loading ? (
                <>
                    <ScreenReaderOnly>{loadingText}</ScreenReaderOnly>
                    <span aria-hidden="true">{children}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

// Accessible form field with proper labeling
export const AccessibleField = ({
    label,
    error,
    description,
    required = false,
    children,
    id,
    ...props
}) => {
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${fieldId}-error` : undefined;
    const descriptionId = description ? `${fieldId}-description` : undefined;

    return (
        <div {...props}>
            <label htmlFor={fieldId}>
                {label}
                {required && (
                    <>
                        <span aria-hidden="true"> *</span>
                        <ScreenReaderOnly> (required)</ScreenReaderOnly>
                    </>
                )}
            </label>

            {description && (
                <div id={descriptionId} style={{ fontSize: designTokens.typography.sizes.sm, color: designTokens.colors.textSecondary }}>
                    {description}
                </div>
            )}

            {React.cloneElement(children, {
                id: fieldId,
                'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
                'aria-invalid': !!error,
                required,
            })}

            {error && (
                <div id={errorId} role="alert" style={{ color: designTokens.colors.error, fontSize: designTokens.typography.sizes.sm }}>
                    {error}
                </div>
            )}
        </div>
    );
};

// High contrast mode detection
export const useHighContrast = () => {
    const [isHighContrast, setIsHighContrast] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        setIsHighContrast(mediaQuery.matches);

        const handleChange = (e) => setIsHighContrast(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isHighContrast;
};

// Reduced motion detection
export const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
};

// Accessible tooltip component
export const AccessibleTooltip = ({
    children,
    content,
    id,
    placement = 'top',
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipId = id || `tooltip-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div style={{ position: 'relative', display: 'inline-block' }} {...props}>
            {React.cloneElement(children, {
                'aria-describedby': tooltipId,
                onMouseEnter: () => setIsVisible(true),
                onMouseLeave: () => setIsVisible(false),
                onFocus: () => setIsVisible(true),
                onBlur: () => setIsVisible(false),
            })}

            {isVisible && (
                <div
                    id={tooltipId}
                    role="tooltip"
                    style={{
                        position: 'absolute',
                        background: designTokens.colors.overlayDark,
                        color: designTokens.colors.text,
                        padding: designTokens.spacing.sm,
                        borderRadius: designTokens.borderRadius.sm,
                        fontSize: designTokens.typography.sizes.sm,
                        whiteSpace: 'nowrap',
                        zIndex: 1000,
                        ...(placement === 'top' && {
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: designTokens.spacing.xs,
                        }),
                        ...(placement === 'bottom' && {
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginTop: designTokens.spacing.xs,
                        }),
                    }}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default {
    AccessibilityProvider,
    useAccessibility,
    SkipLink,
    Breadcrumb,
    FocusTrap,
    useKeyboardNavigation,
    ScreenReaderOnly,
    AccessibleHeading,
    AccessibleProgress,
    AccessibleButton,
    AccessibleField,
    useHighContrast,
    useReducedMotion,
    AccessibleTooltip,
};