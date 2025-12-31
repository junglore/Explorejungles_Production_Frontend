/**
 * Progress Indicator Components
 * Various progress indicators for different use cases
 */

import React from 'react';

// Linear progress bar
export const ProgressBar = ({
    progress = 0,
    max = 100,
    color = 'bg-green-500',
    backgroundColor = 'bg-gray-200',
    height = 'h-2',
    showPercentage = false,
    className = ''
}) => {
    const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);

    return (
        <div className={`w-full ${className}`}>
            {showPercentage && (
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={`w-full ${backgroundColor} rounded-full ${height} overflow-hidden`}>
                <div
                    className={`${color} ${height} rounded-full transition-all duration-300 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// Circular progress indicator
export const CircularProgress = ({
    progress = 0,
    max = 100,
    size = 'w-16 h-16',
    strokeWidth = 4,
    color = 'text-green-500',
    backgroundColor = 'text-gray-200',
    showPercentage = true,
    className = ''
}) => {
    const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);
    const radius = 50 - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`relative ${size} ${className}`}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className={backgroundColor}
                />
                {/* Progress circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={`${color} transition-all duration-300 ease-out`}
                />
            </svg>
            {showPercentage && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}
        </div>
    );
};

// Step progress indicator
export const StepProgress = ({
    steps = [],
    currentStep = 0,
    completedColor = 'bg-green-500',
    activeColor = 'bg-blue-500',
    inactiveColor = 'bg-gray-300',
    className = ''
}) => {
    return (
        <div className={`flex items-center ${className}`}>
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        <div
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
                                ${index < currentStep ? completedColor :
                                    index === currentStep ? activeColor : inactiveColor}
                            `}
                        >
                            {index < currentStep ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                index + 1
                            )}
                        </div>
                        <span className="mt-2 text-xs text-gray-600 text-center max-w-20">
                            {step}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`
                                flex-1 h-1 mx-4 rounded
                                ${index < currentStep ? completedColor : inactiveColor}
                            `}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// Upload progress indicator
export const UploadProgress = ({
    files = [],
    className = ''
}) => {
    return (
        <div className={`space-y-3 ${className}`}>
            {files.map((file, index) => (
                <div key={index} className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 truncate">
                            {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                            {file.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : ''}
                        </span>
                    </div>
                    <ProgressBar
                        progress={file.progress || 0}
                        max={100}
                        color={file.error ? 'bg-red-500' : file.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}
                        showPercentage={true}
                    />
                    {file.error && (
                        <p className="text-xs text-red-600 mt-1">{file.error}</p>
                    )}
                    {file.progress === 100 && !file.error && (
                        <p className="text-xs text-green-600 mt-1">Upload complete</p>
                    )}
                </div>
            ))}
        </div>
    );
};

// Loading dots animation
export const LoadingDots = ({
    size = 'medium',
    color = 'bg-gray-400',
    className = ''
}) => {
    const sizeClasses = {
        small: 'w-1 h-1',
        medium: 'w-2 h-2',
        large: 'w-3 h-3'
    };

    return (
        <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2].map((index) => (
                <div
                    key={index}
                    className={`${sizeClasses[size]} ${color} rounded-full animate-pulse`}
                    style={{
                        animationDelay: `${index * 0.2}s`,
                        animationDuration: '1s'
                    }}
                />
            ))}
        </div>
    );
};

export default ProgressBar;