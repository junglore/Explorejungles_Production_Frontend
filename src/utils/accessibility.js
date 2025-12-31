/**
 * Accessibility Utilities for Podcast Components
 * Provides WCAG-compliant accessibility features
 */

/**
 * Generate ARIA labels for podcast carousel items
 */
export const generatePodcastAriaLabel = (podcast, index, total, isActive = false) => {
    const position = `${index + 1} of ${total}`;
    const status = isActive ? 'currently selected' : '';
    const host = podcast.host_name || podcast.photographer || 'Unknown host';
    const duration = podcast.display_duration || podcast.formatted_duration || '';

    return `Podcast ${position}: ${podcast.title} by ${host}${duration ? `, duration ${duration}` : ''}${status ? `, ${status}` : ''}. Press Enter or Space to play.`;
};

/**
 * Generate ARIA description for podcast carousel
 */
export const generateCarouselAriaDescription = (totalPodcasts) => {
    return `Interactive podcast carousel with ${totalPodcasts} episodes. Use arrow keys to navigate, Enter or Space to select a podcast, Home to go to first, End to go to last.`;
};

/**
 * Generate ARIA live region announcements
 */
export const generateLiveAnnouncement = (type, data) => {
    switch (type) {
        case 'podcast_changed':
            return `Now viewing ${data.title} by ${data.host}`;
        case 'loading':
            return 'Loading podcasts, please wait';
        case 'error':
            return `Error: ${data.message}. Please try again.`;
        case 'loaded':
            return `${data.count} podcasts loaded successfully`;
        case 'navigation':
            return `Navigated to ${data.title}`;
        case 'audio_loading':
            return 'Audio loading, please wait';
        case 'audio_ready':
            return 'Audio ready to play';
        case 'audio_error':
            return `Audio error: ${data.message}`;
        default:
            return '';
    }
};

/**
 * Focus management utilities
 */
export class FocusManager {
    constructor() {
        this.focusHistory = [];
        this.trapStack = [];
    }

    // Save current focus for restoration
    saveFocus() {
        const activeElement = document.activeElement;
        if (activeElement && activeElement !== document.body) {
            this.focusHistory.push(activeElement);
        }
    }

    // Restore previously saved focus
    restoreFocus() {
        const lastFocused = this.focusHistory.pop();
        if (lastFocused && typeof lastFocused.focus === 'function') {
            try {
                lastFocused.focus();
            } catch (error) {
                console.warn('Failed to restore focus:', error);
            }
        }
    }

    // Focus trap for modal dialogs
    trapFocus(container) {
        if (!container) return;

        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);
        this.trapStack.push({ container, handler: handleTabKey });

        // Focus first element
        if (firstElement) {
            firstElement.focus();
        }

        return () => {
            container.removeEventListener('keydown', handleTabKey);
            this.trapStack.pop();
        };
    }

    // Release all focus traps
    releaseAllTraps() {
        this.trapStack.forEach(({ container, handler }) => {
            container.removeEventListener('keydown', handler);
        });
        this.trapStack = [];
    }
}

/**
 * Keyboard navigation utilities
 */
export const KeyboardNavigation = {
    // Standard key codes
    KEYS: {
        ENTER: 'Enter',
        SPACE: ' ',
        ARROW_LEFT: 'ArrowLeft',
        ARROW_RIGHT: 'ArrowRight',
        ARROW_UP: 'ArrowUp',
        ARROW_DOWN: 'ArrowDown',
        HOME: 'Home',
        END: 'End',
        ESCAPE: 'Escape',
        TAB: 'Tab'
    },

    // Handle carousel navigation
    handleCarouselNavigation: (event, currentIndex, totalItems, callbacks) => {
        const { onPrevious, onNext, onFirst, onLast, onSelect, onEscape } = callbacks;

        switch (event.key) {
            case KeyboardNavigation.KEYS.ARROW_LEFT:
                event.preventDefault();
                if (onPrevious) onPrevious();
                break;
            case KeyboardNavigation.KEYS.ARROW_RIGHT:
                event.preventDefault();
                if (onNext) onNext();
                break;
            case KeyboardNavigation.KEYS.HOME:
                event.preventDefault();
                if (onFirst) onFirst();
                break;
            case KeyboardNavigation.KEYS.END:
                event.preventDefault();
                if (onLast) onLast();
                break;
            case KeyboardNavigation.KEYS.ENTER:
            case KeyboardNavigation.KEYS.SPACE:
                event.preventDefault();
                if (onSelect) onSelect(currentIndex);
                break;
            case KeyboardNavigation.KEYS.ESCAPE:
                event.preventDefault();
                if (onEscape) onEscape();
                break;
            default:
                break;
        }
    },

    // Handle audio player navigation
    handleAudioPlayerNavigation: (event, callbacks) => {
        const { onPlayPause, onSeekBackward, onSeekForward, onVolumeUp, onVolumeDown } = callbacks;

        switch (event.key) {
            case KeyboardNavigation.KEYS.SPACE:
                event.preventDefault();
                if (onPlayPause) onPlayPause();
                break;
            case KeyboardNavigation.KEYS.ARROW_LEFT:
                event.preventDefault();
                if (onSeekBackward) onSeekBackward();
                break;
            case KeyboardNavigation.KEYS.ARROW_RIGHT:
                event.preventDefault();
                if (onSeekForward) onSeekForward();
                break;
            case KeyboardNavigation.KEYS.ARROW_UP:
                event.preventDefault();
                if (onVolumeUp) onVolumeUp();
                break;
            case KeyboardNavigation.KEYS.ARROW_DOWN:
                event.preventDefault();
                if (onVolumeDown) onVolumeDown();
                break;
            default:
                break;
        }
    }
};

/**
 * Screen reader utilities
 */
export const ScreenReader = {
    // Announce message to screen readers
    announce: (message, priority = 'polite') => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    },

    // Create visually hidden text for screen readers
    createSROnlyText: (text) => {
        const span = document.createElement('span');
        span.className = 'sr-only';
        span.textContent = text;
        return span;
    }
};

/**
 * High contrast mode detection and support
 */
export const HighContrast = {
    // Detect if high contrast mode is enabled
    isHighContrastMode: () => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || !window.matchMedia) {
            return false;
        }

        try {
            // Check for Windows high contrast mode
            return window.matchMedia('(prefers-contrast: high)').matches ||
                window.matchMedia('(-ms-high-contrast: active)').matches ||
                window.matchMedia('(-ms-high-contrast: white-on-black)').matches ||
                window.matchMedia('(-ms-high-contrast: black-on-white)').matches;
        } catch (error) {
            console.warn('Error checking high contrast mode:', error);
            return false;
        }
    },

    // Apply high contrast styles
    applyHighContrastStyles: (element) => {
        if (!element) return;

        element.style.setProperty('--high-contrast-bg', '#000000');
        element.style.setProperty('--high-contrast-text', '#ffffff');
        element.style.setProperty('--high-contrast-border', '#ffffff');
        element.style.setProperty('--high-contrast-focus', '#ffff00');

        element.classList.add('high-contrast-mode');
    },

    // Remove high contrast styles
    removeHighContrastStyles: (element) => {
        if (!element) return;

        element.style.removeProperty('--high-contrast-bg');
        element.style.removeProperty('--high-contrast-text');
        element.style.removeProperty('--high-contrast-border');
        element.style.removeProperty('--high-contrast-focus');

        element.classList.remove('high-contrast-mode');
    },

    // Listen for high contrast mode changes
    onHighContrastChange: (callback) => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || !window.matchMedia) {
            return () => { };
        }

        try {
            const mediaQueries = [
                '(prefers-contrast: high)',
                '(-ms-high-contrast: active)',
                '(-ms-high-contrast: white-on-black)',
                '(-ms-high-contrast: black-on-white)'
            ];

            mediaQueries.forEach(query => {
                const mq = window.matchMedia(query);
                mq.addListener(callback);
            });

            return () => {
                mediaQueries.forEach(query => {
                    const mq = window.matchMedia(query);
                    mq.removeListener(callback);
                });
            };
        } catch (error) {
            console.warn('Error setting up high contrast listener:', error);
            return () => { };
        }
    }
};

/**
 * Reduced motion detection and support
 */
export const ReducedMotion = {
    // Check if user prefers reduced motion
    prefersReducedMotion: () => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || !window.matchMedia) {
            return false;
        }

        try {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (error) {
            console.warn('Error checking reduced motion preference:', error);
            return false;
        }
    },

    // Apply reduced motion styles
    applyReducedMotionStyles: (element) => {
        if (!element) return;

        element.style.setProperty('--animation-duration', '0.01ms');
        element.style.setProperty('--transition-duration', '0.01ms');
        element.classList.add('reduced-motion');
    },

    // Listen for reduced motion preference changes
    onReducedMotionChange: (callback) => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || !window.matchMedia) {
            return () => { };
        }

        try {
            const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
            mq.addListener(callback);
            return () => mq.removeListener(callback);
        } catch (error) {
            console.warn('Error setting up reduced motion listener:', error);
            return () => { };
        }
    }
};

/**
 * Color contrast utilities
 */
export const ColorContrast = {
    // Calculate relative luminance
    getRelativeLuminance: (r, g, b) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    },

    // Calculate contrast ratio between two colors
    getContrastRatio: (color1, color2) => {
        const l1 = ColorContrast.getRelativeLuminance(...color1);
        const l2 = ColorContrast.getRelativeLuminance(...color2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    },

    // Check if contrast ratio meets WCAG standards
    meetsWCAGStandards: (contrastRatio, level = 'AA', size = 'normal') => {
        const standards = {
            'AA': { normal: 4.5, large: 3 },
            'AAA': { normal: 7, large: 4.5 }
        };
        return contrastRatio >= standards[level][size];
    }
};

// Export singleton focus manager instance
export const focusManager = new FocusManager();