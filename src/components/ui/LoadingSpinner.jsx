/**
 * Loading Spinner Component
 * Reusable loading indicator with different sizes and styles
 */

import React from 'react';

const LoadingSpinner = ({
    size = 'medium',
    color = 'primary',
    text = null,
    overlay = false,
    className = ''
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
        xlarge: 'w-16 h-16'
    };

    const colorClasses = {
        primary: 'text-green-600',
        secondary: 'text-gray-600',
        white: 'text-white',
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500'
    };

    const spinnerContent = (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <svg
                className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            {text && (
                <p className={`mt-2 text-sm ${colorClasses[color]}`}>
                    {text}
                </p>
            )}
        </div>
    );

    if (overlay) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    {spinnerContent}
                </div>
            </div>
        );
    }

    return spinnerContent;
};

// Inline loading spinner for buttons
export const ButtonSpinner = ({ size = 'small', className = '' }) => (
    <LoadingSpinner
        size={size}
        color="white"
        className={`inline-block ${className}`}
    />
);

// Page loading overlay
export const PageLoader = ({ text = 'Loading...' }) => (
    <LoadingSpinner
        size="large"
        color="primary"
        text={text}
        overlay={true}
    />
);

// Content loading placeholder
export const ContentLoader = ({ text = 'Loading content...' }) => (
    <div className="flex items-center justify-center py-12">
        <LoadingSpinner
            size="medium"
            color="primary"
            text={text}
        />
    </div>
);

export default LoadingSpinner;