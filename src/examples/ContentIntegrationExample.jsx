/**
 * Content Integration Example
 * Demonstrates how to use the updated content service with error handling and loading states
 */

import React, { useState, useEffect } from 'react';
import contentService from '../services/contentService.js';
import { useAsyncOperation } from '../hooks/useAsyncOperation.js';
import { useLoading } from '../contexts/LoadingContext.jsx';
import LoadingSpinner, { ContentLoader } from '../components/ui/LoadingSpinner.jsx';
import { GridSkeleton } from '../components/ui/SkeletonLoader.jsx';
import ErrorBoundary from '../components/common/ErrorBoundary.jsx';

// Example component showing content fetching with loading states
const ContentListExample = () => {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState(null);
    const { execute, isLoading } = useAsyncOperation({
        showSuccessNotification: false,
        showErrorNotification: true,
        errorContext: 'Failed to load blogs'
    });

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const result = await execute(contentService.fetchBlogs, { page: 1, limit: 6 });
                setBlogs(result.result || []);
                setError(null);
            } catch (err) {
                setError(err.message);
            }
        };

        loadBlogs();
    }, [execute]);

    if (isLoading) {
        return <GridSkeleton items={6} columns={3} />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load content</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {blog.featured_image && (
                        <img
                            src={blog.featured_image}
                            alt={blog.title}
                            className="w-full h-48 object-cover"
                        />
                    )}
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            {blog.excerpt || blog.content?.substring(0, 100) + '...'}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {new Date(blog.created_at).toLocaleDateString()}
                            </span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Read More
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Example component showing search functionality
const SearchExample = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const { execute, isLoading } = useAsyncOperation({
        showErrorNotification: true,
        errorContext: 'Search failed'
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            const result = await execute(contentService.searchContent, query, { limit: 10 });
            setResults(result.result || []);
        } catch (err) {
            setResults([]);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search content..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                        {isLoading ? (
                            <LoadingSpinner size="small" color="white" />
                        ) : (
                            'Search'
                        )}
                    </button>
                </div>
            </form>

            {isLoading && (
                <ContentLoader text="Searching..." />
            )}

            {results.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Search Results ({results.length})</h3>
                    {results.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg border">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">
                                {item.excerpt || item.content?.substring(0, 150) + '...'}
                            </p>
                            <span className="text-xs text-blue-600 mt-2 inline-block">
                                {item.type}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {query && !isLoading && results.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No results found for "{query}"
                </div>
            )}
        </div>
    );
};

// Example component using loading context
const LoadingContextExample = () => {
    const { withLoading, isAnyLoading, getLoadingStats } = useLoading();
    const [stats, setStats] = useState(null);

    const loadStats = async () => {
        const result = await withLoading(
            contentService.getContentStats,
            'content-stats',
            {
                showSuccessNotification: true,
                successMessage: 'Statistics loaded successfully',
                loadingMessage: 'Loading statistics...'
            }
        );
        setStats(result);
    };

    const loadingStats = getLoadingStats();

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Loading Context Example</h3>

            <div className="mb-4">
                <button
                    onClick={loadStats}
                    disabled={isAnyLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {isAnyLoading ? 'Loading...' : 'Load Content Statistics'}
                </button>
            </div>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.blogs}</div>
                        <div className="text-sm text-gray-600">Blogs</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.caseStudies}</div>
                        <div className="text-sm text-gray-600">Case Studies</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.conservationEfforts}</div>
                        <div className="text-sm text-gray-600">Conservation</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.dailyUpdates}</div>
                        <div className="text-sm text-gray-600">Daily Updates</div>
                    </div>
                </div>
            )}

            <div className="text-sm text-gray-600">
                <p>Global Loading: {loadingStats.isGlobalLoading ? 'Yes' : 'No'}</p>
                <p>Active Operations: {loadingStats.activeOperations}</p>
                <p>Any Loading: {loadingStats.isAnyLoading ? 'Yes' : 'No'}</p>
            </div>
        </div>
    );
};

// Main example component
const ContentIntegrationExample = () => {
    return (
        <ErrorBoundary>
            <div className="container mx-auto px-4 py-8 space-y-12">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Content Service Integration Examples
                    </h1>
                </div>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Content List with Loading States
                    </h2>
                    <ContentListExample />
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Search Functionality
                    </h2>
                    <SearchExample />
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Loading Context Usage
                    </h2>
                    <LoadingContextExample />
                </section>
            </div>
        </ErrorBoundary>
    );
};

export default ContentIntegrationExample;