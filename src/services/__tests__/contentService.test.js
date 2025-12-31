import { describe, it, expect, beforeEach, vi } from 'vitest'
import contentService from '../contentService'
import apiService from '../api'

// Mock the api service
vi.mock('../api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}))

describe('ContentService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        contentService.loadingStates.clear()
    })

    describe('Loading State Management', () => {
        it('should manage loading states correctly', () => {
            expect(contentService.isLoading).toBe(false)

            contentService.setLoading('test-operation', true)
            expect(contentService.getLoadingState('test-operation')).toBe(true)
            expect(contentService.isLoading).toBe(true)

            contentService.setLoading('test-operation', false)
            expect(contentService.getLoadingState('test-operation')).toBe(false)
            expect(contentService.isLoading).toBe(false)
        })

        it('should handle multiple loading operations', () => {
            contentService.setLoading('operation1', true)
            contentService.setLoading('operation2', true)
            expect(contentService.isLoading).toBe(true)

            contentService.setLoading('operation1', false)
            expect(contentService.isLoading).toBe(true) // operation2 still loading

            contentService.setLoading('operation2', false)
            expect(contentService.isLoading).toBe(false)
        })
    })

    describe('Blog Operations', () => {
        it('should fetch blogs successfully', async () => {
            const mockResponse = {
                status: true,
                data: {
                    result: [
                        { id: '1', title: 'Test Blog', content: 'Test content' }
                    ],
                    totalPages: 1,
                    currentPage: 1
                }
            }

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.fetchBlogs({ page: 1, limit: 10 })

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/blogs/', { page: 1, limit: 10 })
            expect(result).toEqual(mockResponse.data)
        })

        it('should fetch blog by ID successfully', async () => {
            const mockBlog = {
                status: true,
                data: { id: '1', title: 'Test Blog', content: 'Test content' }
            }

            apiService.get.mockResolvedValue(mockBlog)

            const result = await contentService.fetchBlogById('1')

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/blogs/1')
            expect(result).toEqual(mockBlog.data)
        })

        it('should handle blog fetch errors', async () => {
            const mockError = new Error('Network error')
            apiService.get.mockRejectedValue(mockError)

            await expect(contentService.fetchBlogs()).rejects.toThrow()
            expect(contentService.getLoadingState('fetch-blogs')).toBe(false)
        })

        it('should handle fallback response format', async () => {
            const mockResponse = [
                { id: '1', title: 'Test Blog', content: 'Test content' }
            ]

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.fetchBlogs()

            expect(result).toEqual(mockResponse)
        })
    })

    describe('Case Studies Operations', () => {
        it('should fetch case studies successfully', async () => {
            const mockResponse = {
                status: true,
                data: {
                    result: [
                        { id: '1', title: 'Test Case Study', content: 'Test content' }
                    ]
                }
            }

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.fetchCaseStudies()

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/casestudies/', {})
            expect(result).toEqual(mockResponse.data)
        })

        it('should fetch case study by ID successfully', async () => {
            const mockCaseStudy = {
                status: true,
                data: { id: '1', title: 'Test Case Study', content: 'Test content' }
            }

            apiService.get.mockResolvedValue(mockCaseStudy)

            const result = await contentService.fetchCaseStudyById('1')

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/casestudies/1')
            expect(result).toEqual(mockCaseStudy.data)
        })
    })

    describe('Conservation Efforts Operations', () => {
        it('should fetch conservation efforts successfully', async () => {
            const mockResponse = {
                status: true,
                data: {
                    result: [
                        { id: '1', title: 'Test Conservation', content: 'Test content' }
                    ]
                }
            }

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.fetchConservationEfforts()

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/conservation-efforts/', {})
            expect(result).toEqual(mockResponse.data)
        })

        it('should fetch conservation effort by ID successfully', async () => {
            const mockEffort = {
                status: true,
                data: { id: '1', title: 'Test Conservation', content: 'Test content' }
            }

            apiService.get.mockResolvedValue(mockEffort)

            const result = await contentService.fetchConservationEffortById('1')

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/conservation-efforts/1')
            expect(result).toEqual(mockEffort.data)
        })
    })

    describe('Daily Updates Operations', () => {
        it('should fetch daily updates successfully', async () => {
            const mockResponse = {
                status: true,
                data: {
                    result: [
                        { id: '1', title: 'Test Daily Update', content: 'Test content' }
                    ]
                }
            }

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.fetchDailyUpdates()

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/dailynews/', {})
            expect(result).toEqual(mockResponse.data)
        })

        it('should fetch daily update by ID successfully', async () => {
            const mockUpdate = {
                status: true,
                data: { id: '1', title: 'Test Daily Update', content: 'Test content' }
            }

            apiService.get.mockResolvedValue(mockUpdate)

            const result = await contentService.fetchDailyUpdateById('1')

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/dailynews/1')
            expect(result).toEqual(mockUpdate.data)
        })
    })

    describe('Search Operations', () => {
        it('should search content successfully', async () => {
            const mockResponse = {
                status: true,
                data: {
                    result: [
                        { id: '1', title: 'Search Result', content: 'Test content' }
                    ]
                }
            }

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.searchContent('test query', { limit: 5 })

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/search/', {
                q: 'test query',
                limit: 5
            })
            expect(result).toEqual(mockResponse.data)
        })

        it('should handle search errors', async () => {
            const mockError = new Error('Search failed')
            apiService.get.mockRejectedValue(mockError)

            await expect(contentService.searchContent('test')).rejects.toThrow()
            expect(contentService.getLoadingState('search-content')).toBe(false)
        })
    })

    describe('Featured Content Operations', () => {
        it('should fetch featured blogs by default', async () => {
            const mockResponse = {
                status: true,
                data: {
                    result: [
                        { id: '1', title: 'Featured Blog', featured: true }
                    ]
                }
            }

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.getFeaturedContent()

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/blogs/', {
                featured: true,
                limit: 3
            })
            expect(result).toEqual(mockResponse.data)
        })

        it('should fetch featured content by type', async () => {
            const mockResponse = {
                status: true,
                data: { result: [] }
            }

            apiService.get.mockResolvedValue(mockResponse)

            await contentService.getFeaturedContent('casestudies')

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/casestudies/', {
                featured: true,
                limit: 3
            })
        })

        it('should handle content type mapping', async () => {
            const mockResponse = {
                status: true,
                data: { result: [] }
            }

            apiService.get.mockResolvedValue(mockResponse)

            // Test various type mappings
            await contentService.getFeaturedContent('case_studies')
            expect(apiService.get).toHaveBeenCalledWith('/api/v1/casestudies/', expect.any(Object))

            await contentService.getFeaturedContent('conservation')
            expect(apiService.get).toHaveBeenCalledWith('/api/v1/conservation-efforts/', expect.any(Object))

            await contentService.getFeaturedContent('daily_updates')
            expect(apiService.get).toHaveBeenCalledWith('/api/v1/dailynews/', expect.any(Object))
        })
    })

    describe('Content by Category Operations', () => {
        it('should fetch content by category', async () => {
            const mockResponse = {
                status: true,
                data: { result: [] }
            }

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.getContentByCategory('category-1', 'blogs', { limit: 5 })

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/blogs/', {
                category_id: 'category-1',
                limit: 5
            })
            expect(result).toEqual(mockResponse.data)
        })

        it('should use generic content endpoint when no type specified', async () => {
            const mockResponse = {
                status: true,
                data: { result: [] }
            }

            apiService.get.mockResolvedValue(mockResponse)

            await contentService.getContentByCategory('category-1')

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/content/', {
                category_id: 'category-1'
            })
        })
    })

    describe('Recent Content Operations', () => {
        it('should fetch recent content by type', async () => {
            const mockResponse = {
                status: true,
                data: { result: [] }
            }

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.getRecentContent('blogs', 10)

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/blogs/', {
                limit: 10,
                page: 1
            })
            expect(result).toEqual(mockResponse.data)
        })

        it('should fallback to generic content endpoint', async () => {
            const mockResponse = {
                status: true,
                data: { result: [] }
            }

            apiService.get.mockResolvedValue(mockResponse)

            await contentService.getRecentContent('invalid_type', 5)

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/content/', {
                limit: 5,
                page: 1
            })
        })

        it('should fetch all recent content when no type specified', async () => {
            const mockResponse = {
                status: true,
                data: { result: [] }
            }

            apiService.get.mockResolvedValue(mockResponse)

            await contentService.getRecentContent()

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/content/', {
                limit: 5,
                page: 1
            })
        })
    })

    describe('Content Statistics Operations', () => {
        it('should fetch content statistics successfully', async () => {
            const mockResponses = [
                { result: [], totalItems: 10 },
                { result: [], totalItems: 5 },
                { result: [], totalItems: 8 },
                { result: [], totalItems: 3 }
            ]

            apiService.get
                .mockResolvedValueOnce(mockResponses[0])
                .mockResolvedValueOnce(mockResponses[1])
                .mockResolvedValueOnce(mockResponses[2])
                .mockResolvedValueOnce(mockResponses[3])

            const result = await contentService.getContentStats()

            expect(result).toEqual({
                blogs: 10,
                caseStudies: 5,
                conservationEfforts: 8,
                dailyUpdates: 3
            })
        })

        it('should handle errors in statistics fetching', async () => {
            apiService.get.mockRejectedValue(new Error('API Error'))

            const result = await contentService.getContentStats()

            expect(result).toEqual({
                blogs: 0,
                caseStudies: 0,
                conservationEfforts: 0,
                dailyUpdates: 0
            })
        })

        it('should handle different response formats', async () => {
            const mockResponses = [
                { result: [1, 2, 3], total: 15 },
                { result: [1, 2] },
                { result: [], totalItems: 7 },
                { result: [1] }
            ]

            apiService.get
                .mockResolvedValueOnce(mockResponses[0])
                .mockResolvedValueOnce(mockResponses[1])
                .mockResolvedValueOnce(mockResponses[2])
                .mockResolvedValueOnce(mockResponses[3])

            const result = await contentService.getContentStats()

            expect(result).toEqual({
                blogs: 15, // Uses total
                caseStudies: 2, // Uses result.length
                conservationEfforts: 7, // Uses totalItems
                dailyUpdates: 1 // Uses result.length
            })
        })
    })

    describe('All Content Types Operations', () => {
        it('should fetch all content types successfully', async () => {
            const mockResponses = [
                { result: [{ id: '1', type: 'blog' }] },
                { result: [{ id: '2', type: 'case_study' }] },
                { result: [{ id: '3', type: 'conservation' }] },
                { result: [{ id: '4', type: 'daily_update' }] }
            ]

            apiService.get
                .mockResolvedValueOnce(mockResponses[0])
                .mockResolvedValueOnce(mockResponses[1])
                .mockResolvedValueOnce(mockResponses[2])
                .mockResolvedValueOnce(mockResponses[3])

            const result = await contentService.getAllContentTypes({ limit: 5 })

            expect(result).toEqual({
                blogs: mockResponses[0].result,
                caseStudies: mockResponses[1].result,
                conservationEfforts: mockResponses[2].result,
                dailyUpdates: mockResponses[3].result
            })
        })

        it('should handle partial failures gracefully', async () => {
            apiService.get
                .mockResolvedValueOnce({ result: [{ id: '1' }] })
                .mockRejectedValueOnce(new Error('API Error'))
                .mockResolvedValueOnce({ result: [{ id: '3' }] })
                .mockRejectedValueOnce(new Error('API Error'))

            const result = await contentService.getAllContentTypes()

            expect(result).toEqual({
                blogs: [{ id: '1' }],
                caseStudies: [],
                conservationEfforts: [{ id: '3' }],
                dailyUpdates: []
            })
        })
    })

    describe('Error Handling', () => {
        it('should handle API errors with response', () => {
            const mockError = {
                response: {
                    status: 404,
                    data: { detail: 'Not found' }
                }
            }

            const result = contentService.handleApiError(mockError, 'Default message')

            expect(result.message).toBe('Not found')
        })

        it('should handle different HTTP status codes', () => {
            const testCases = [
                { status: 400, expected: 'Invalid request' },
                { status: 401, expected: 'Authentication required' },
                { status: 403, expected: 'Access denied' },
                { status: 404, expected: 'Content not found' },
                { status: 500, expected: 'Server error. Please try again later.' }
            ]

            testCases.forEach(({ status, expected }) => {
                const mockError = {
                    response: { status, data: {} }
                }

                const result = contentService.handleApiError(mockError)
                expect(result.message).toBe(expected)
            })
        })

        it('should handle network errors', () => {
            const mockError = { request: {} }

            const result = contentService.handleApiError(mockError)

            expect(result.message).toBe('Network error. Please check your connection.')
        })

        it('should handle unknown errors', () => {
            const mockError = { message: 'Unknown error' }

            const result = contentService.handleApiError(mockError, 'Default message')

            expect(result.message).toBe('Unknown error')
        })

        it('should use default message for unknown errors without message', () => {
            const mockError = {}

            const result = contentService.handleApiError(mockError, 'Default message')

            expect(result.message).toBe('Default message')
        })
    })

    describe('Generic Content Fetch', () => {
        it('should fetch content with standardized response handling', async () => {
            const mockResponse = {
                status: true,
                data: { result: [{ id: '1' }] }
            }

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.fetchContent('test-endpoint', { param: 'value' })

            expect(apiService.get).toHaveBeenCalledWith('/api/v1/test-endpoint/', { param: 'value' })
            expect(result).toEqual(mockResponse.data)
        })

        it('should handle direct response format', async () => {
            const mockResponse = [{ id: '1' }]

            apiService.get.mockResolvedValue(mockResponse)

            const result = await contentService.fetchContent('test-endpoint')

            expect(result).toEqual(mockResponse)
        })

        it('should set loading states during fetch', async () => {
            const mockResponse = { status: true, data: {} }

            apiService.get.mockImplementation(() => {
                expect(contentService.getLoadingState('fetch-test-endpoint')).toBe(true)
                return Promise.resolve(mockResponse)
            })

            await contentService.fetchContent('test-endpoint')

            expect(contentService.getLoadingState('fetch-test-endpoint')).toBe(false)
        })
    })
})