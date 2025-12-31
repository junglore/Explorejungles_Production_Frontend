import { http, HttpResponse } from 'msw'

const API_BASE_URL = 'http://localhost:8000'

// Mock data
const mockBlogs = [
    {
        id: '1',
        title: 'Test Blog Post 1',
        content: 'This is test content for blog post 1',
        excerpt: 'Test excerpt 1',
        image: '/test-image-1.jpg',
        banner: '/test-banner-1.jpg',
        featured: true,
        feature_place: 1,
        status: true,
        type: 'blog',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        title: 'Test Blog Post 2',
        content: 'This is test content for blog post 2',
        excerpt: 'Test excerpt 2',
        image: '/test-image-2.jpg',
        banner: '/test-banner-2.jpg',
        featured: false,
        feature_place: 0,
        status: true,
        type: 'blog',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
    }
]

const mockCaseStudies = [
    {
        id: '1',
        title: 'Test Case Study 1',
        content: 'This is test content for case study 1',
        excerpt: 'Test case study excerpt 1',
        image: '/test-case-study-1.jpg',
        status: true,
        type: 'case_study',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
]

const mockConservationEfforts = [
    {
        id: '1',
        title: 'Test Conservation Effort 1',
        content: 'This is test content for conservation effort 1',
        excerpt: 'Test conservation excerpt 1',
        image: '/test-conservation-1.jpg',
        status: true,
        type: 'conservation_effort',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
]

const mockDailyUpdates = [
    {
        id: '1',
        title: 'Test Daily Update 1',
        content: 'This is test content for daily update 1',
        excerpt: 'Test daily update excerpt 1',
        image: '/test-daily-1.jpg',
        status: true,
        type: 'daily_update',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
]

// Helper function to create standardized API response
const createApiResponse = (data, message = 'Success') => ({
    status: true,
    message,
    data
})

// Helper function to create paginated response
const createPaginatedResponse = (items, page = 1, limit = 10) => ({
    result: items,
    totalPages: Math.ceil(items.length / limit),
    currentPage: page,
    limit: items.length
})

export const handlers = [
    // Health check
    http.get(`${API_BASE_URL}/health`, () => {
        return HttpResponse.json({ status: 'healthy' })
    }),

    // Blogs endpoints
    http.get(`${API_BASE_URL}/api/v1/blogs/`, ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '10')
        const search = url.searchParams.get('search')
        const featured = url.searchParams.get('featured')

        let filteredBlogs = [...mockBlogs]

        if (search) {
            filteredBlogs = filteredBlogs.filter(blog =>
                blog.title.toLowerCase().includes(search.toLowerCase()) ||
                blog.content.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (featured === 'true') {
            filteredBlogs = filteredBlogs.filter(blog => blog.featured)
        }

        const paginatedData = createPaginatedResponse(filteredBlogs, page, limit)
        return HttpResponse.json(createApiResponse(paginatedData))
    }),

    http.get(`${API_BASE_URL}/api/v1/blogs/:id`, ({ params }) => {
        const blog = mockBlogs.find(b => b.id === params.id)
        if (!blog) {
            return new HttpResponse(null, { status: 404 })
        }
        return HttpResponse.json(createApiResponse(blog))
    }),

    // Case Studies endpoints
    http.get(`${API_BASE_URL}/api/v1/casestudies/`, ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '10')

        const paginatedData = createPaginatedResponse(mockCaseStudies, page, limit)
        return HttpResponse.json(createApiResponse(paginatedData))
    }),

    http.get(`${API_BASE_URL}/api/v1/casestudies/:id`, ({ params }) => {
        const caseStudy = mockCaseStudies.find(cs => cs.id === params.id)
        if (!caseStudy) {
            return new HttpResponse(null, { status: 404 })
        }
        return HttpResponse.json(createApiResponse(caseStudy))
    }),

    // Conservation Efforts endpoints
    http.get(`${API_BASE_URL}/api/v1/conservation-efforts/`, ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '10')

        const paginatedData = createPaginatedResponse(mockConservationEfforts, page, limit)
        return HttpResponse.json(createApiResponse(paginatedData))
    }),

    http.get(`${API_BASE_URL}/api/v1/conservation-efforts/:id`, ({ params }) => {
        const effort = mockConservationEfforts.find(e => e.id === params.id)
        if (!effort) {
            return new HttpResponse(null, { status: 404 })
        }
        return HttpResponse.json(createApiResponse(effort))
    }),

    // Daily Updates endpoints
    http.get(`${API_BASE_URL}/api/v1/dailynews/`, ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '10')

        const paginatedData = createPaginatedResponse(mockDailyUpdates, page, limit)
        return HttpResponse.json(createApiResponse(paginatedData))
    }),

    http.get(`${API_BASE_URL}/api/v1/dailynews/:id`, ({ params }) => {
        const update = mockDailyUpdates.find(u => u.id === params.id)
        if (!update) {
            return new HttpResponse(null, { status: 404 })
        }
        return HttpResponse.json(createApiResponse(update))
    }),

    // Generic content endpoint
    http.get(`${API_BASE_URL}/api/v1/content/`, ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '10')
        const type = url.searchParams.get('type')

        let allContent = [
            ...mockBlogs,
            ...mockCaseStudies,
            ...mockConservationEfforts,
            ...mockDailyUpdates
        ]

        if (type) {
            allContent = allContent.filter(item => item.type === type)
        }

        const paginatedData = createPaginatedResponse(allContent, page, limit)
        return HttpResponse.json(createApiResponse(paginatedData))
    }),

    // Search endpoint
    http.get(`${API_BASE_URL}/api/v1/search/`, ({ request }) => {
        const url = new URL(request.url)
        const query = url.searchParams.get('q')
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '10')

        let allContent = [
            ...mockBlogs,
            ...mockCaseStudies,
            ...mockConservationEfforts,
            ...mockDailyUpdates
        ]

        if (query) {
            allContent = allContent.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.content.toLowerCase().includes(query.toLowerCase())
            )
        }

        const paginatedData = createPaginatedResponse(allContent, page, limit)
        return HttpResponse.json(createApiResponse(paginatedData))
    }),

    // Error scenarios for testing
    http.get(`${API_BASE_URL}/api/v1/blogs/error`, () => {
        return new HttpResponse(null, { status: 500 })
    }),

    http.get(`${API_BASE_URL}/api/v1/blogs/not-found`, () => {
        return new HttpResponse(null, { status: 404 })
    }),

    http.get(`${API_BASE_URL}/api/v1/blogs/unauthorized`, () => {
        return new HttpResponse(null, { status: 401 })
    }),

    // Network error simulation
    http.get(`${API_BASE_URL}/api/v1/blogs/network-error`, () => {
        return HttpResponse.error()
    }),
]