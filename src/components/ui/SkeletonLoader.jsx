/**
 * Skeleton Loader Components
 * Provides skeleton loading states for different content types
 */

import React from 'react';

// Base skeleton component
const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => (
    <div className={`animate-pulse bg-gray-300 rounded ${width} ${height} ${className}`} />
);

// Card skeleton for content items
export const CardSkeleton = ({ showImage = true, lines = 3 }) => (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        {showImage && (
            <Skeleton className="rounded-lg" width="w-full" height="h-48" />
        )}
        <div className="space-y-2">
            <Skeleton width="w-3/4" height="h-6" />
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    width={index === lines - 1 ? 'w-1/2' : 'w-full'}
                    height="h-4"
                />
            ))}
        </div>
        <div className="flex items-center space-x-2">
            <Skeleton width="w-8" height="h-8" className="rounded-full" />
            <Skeleton width="w-24" height="h-4" />
        </div>
    </div>
);

// List skeleton for content lists
export const ListSkeleton = ({ items = 6, showImage = true }) => (
    <div className="space-y-4">
        {Array.from({ length: items }).map((_, index) => (
            <CardSkeleton key={index} showImage={showImage} />
        ))}
    </div>
);

// Grid skeleton for content grids
export const GridSkeleton = ({ items = 9, columns = 3, showImage = true }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {Array.from({ length: items }).map((_, index) => (
            <CardSkeleton key={index} showImage={showImage} />
        ))}
    </div>
);

// Article skeleton for detailed content
export const ArticleSkeleton = () => (
    <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
            <Skeleton width="w-3/4" height="h-8" />
            <div className="flex items-center space-x-4">
                <Skeleton width="w-10" height="h-10" className="rounded-full" />
                <div className="space-y-2">
                    <Skeleton width="w-32" height="h-4" />
                    <Skeleton width="w-24" height="h-3" />
                </div>
            </div>
        </div>

        {/* Featured image */}
        <Skeleton width="w-full" height="h-64" className="rounded-lg" />

        {/* Content */}
        <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                    key={index}
                    width={index % 4 === 3 ? 'w-2/3' : 'w-full'}
                    height="h-4"
                />
            ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                    key={index}
                    width="w-16"
                    height="h-6"
                    className="rounded-full"
                />
            ))}
        </div>
    </div>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
    <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            {Array.from({ length: columns }).map((_, index) => (
                <Skeleton key={index} width="w-full" height="h-4" />
            ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4 border-b">
                {Array.from({ length: columns }).map((_, colIndex) => (
                    <Skeleton key={colIndex} width="w-full" height="h-4" />
                ))}
            </div>
        ))}
    </div>
);

// Dashboard stats skeleton
export const StatsSkeleton = ({ items = 4 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton width="w-12" height="h-12" className="rounded-lg" />
                    <Skeleton width="w-8" height="h-8" className="rounded" />
                </div>
                <div className="space-y-2">
                    <Skeleton width="w-16" height="h-8" />
                    <Skeleton width="w-24" height="h-4" />
                </div>
            </div>
        ))}
    </div>
);

// Form skeleton
export const FormSkeleton = ({ fields = 5 }) => (
    <div className="space-y-6">
        {Array.from({ length: fields }).map((_, index) => (
            <div key={index} className="space-y-2">
                <Skeleton width="w-32" height="h-4" />
                <Skeleton width="w-full" height="h-10" className="rounded-md" />
            </div>
        ))}
        <div className="flex space-x-4">
            <Skeleton width="w-24" height="h-10" className="rounded-md" />
            <Skeleton width="w-20" height="h-10" className="rounded-md" />
        </div>
    </div>
);

export default Skeleton;