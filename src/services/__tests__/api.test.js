import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest'
import apiService, { ApiError, ErrorTypes } from '../api'
import { server } from '../../test/mocks/server'

// Create a proper mock for fetch
const mockFetch = vi.fn()

// Mock fetch
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
})

describe('ApiService', () => {
    // Disable MSW for these tests since we're testing the low-level fetch functionality
    beforeAll(() => {
        server.close()
    })

    afterAll(() => {
        server.listen()
    })

    beforeEach(() => {
        vi.clearAllMocks()
        apiService.token = null
        apiService.errorHandlers.clear()
        apiService.requestInterceptors = []
        apiService.responseInterceptors = []
        mockLocalStorage.getItem.mockReturnValue(null)
    })

    describe('Token Management', () => {
        it('should set and get token correctly', () => {
            const token = 'test-token'

            apiService.setToken(token)

            expect(apiService.getToken()).toBe(token)
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('access_token', token)
        })

        it('should clear token correctly', () => {
            apiService.setToken('test-token')

            apiService.setToken(null)

            expect(apiService.getToken()).toBeNull()
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token')
        })

        it('should clear all auth data', () => {
            apiService.token = 'test-token'

            apiService.clearAuth()

            expect(apiService.token).toBeNull()
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token')
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh_token')
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user')
        })

        it('should get token from localStorage if not in memory', () => {
            mockLocalStorage.getItem.mockReturnValue('stored-token')

            const token = apiService.getToken()

            expect(token).toBe('stored-token')
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('access_token')
        })
    })

    describe('Interceptors', () => {
        it('should add request interceptors', () => {
            const interceptor = vi.fn()

            apiService.addRequestInterceptor(interceptor)

            expect(apiService.requestInterceptors).toContain(interceptor)
        })

        it('should add response interceptors', () => {
            const interceptor = vi.fn()

            apiService.addResponseInterceptor(interceptor)

            expect(apiService.responseInterceptors).toContain(interceptor)
        })

        it('should add error handlers', () => {
            const handler = vi.fn()

            apiService.addErrorHandler(ErrorTypes.NETWORK_ERROR, handler)

            expect(apiService.errorHandlers.get(ErrorTypes.NETWORK_ERROR)).toBe(handler)
        })
    })

    describe('Error Handling', () => {
        it('should create API error correctly', async () => {
            const mockResponse = {
                status: 404,
                headers: {
                    get: vi.fn().mockReturnValue('application/json')
                },
                json: vi.fn().mockResolvedValue({ detail: 'Not found' })
            }

            const error = await apiService.createApiError(mockResponse)

            expect(error).toBeInstanceOf(ApiError)
            expect(error.type).toBe(ErrorTypes.NOT_FOUND_ERROR)
            expect(error.status).toBe(404)
            expect(error.message).toBe('Not found')
        })

        it('should handle different error status codes', async () => {
            const testCases = [
                { status: 400, expectedType: ErrorTypes.VALIDATION_ERROR },
                { status: 401, expectedType: ErrorTypes.AUTHENTICATION_ERROR },
                { status: 403, expectedType: ErrorTypes.AUTHORIZATION_ERROR },
                { status: 404, expectedType: ErrorTypes.NOT_FOUND_ERROR },
                { status: 422, expectedType: ErrorTypes.VALIDATION_ERROR },
                { status: 500, expectedType: ErrorTypes.SERVER_ERROR },
            ]

            for (const { status, expectedType } of testCases) {
                const mockResponse = {
                    status,
                    headers: {
                        get: vi.fn().mockReturnValue('application/json')
                    },
                    json: vi.fn().mockResolvedValue({})
                }

                const error = await apiService.createApiError(mockResponse)
                expect(error.type).toBe(expectedType)
            }
        })

        it('should handle non-JSON error responses', async () => {
            const mockResponse = {
                status: 500,
                headers: {
                    get: vi.fn().mockReturnValue('text/plain')
                },
                text: vi.fn().mockResolvedValue('Internal Server Error')
            }

            const error = await apiService.createApiError(mockResponse)

            expect(error.details.detail).toBe('Internal Server Error')
        })

        it('should call error handlers', async () => {
            const handler = vi.fn()
            const error = new ApiError('Test error', ErrorTypes.NETWORK_ERROR)

            apiService.addErrorHandler(ErrorTypes.NETWORK_ERROR, handler)

            await apiService.handleError(error)

            expect(handler).toHaveBeenCalledWith(error)
        })
    })

    describe('Request Methods', () => {
        beforeEach(() => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 200,
                headers: {
                    get: vi.fn().mockReturnValue('application/json')
                },
                json: vi.fn().mockResolvedValue({ data: 'test' })
            })
        })

        it('should make GET request correctly', async () => {
            const result = await apiService.get('/test', { param: 'value' })

            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/test?param=value',
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json'
                    })
                })
            )
            expect(result).toEqual({ data: 'test' })
        })

        it('should make POST request correctly', async () => {
            const data = { key: 'value' }

            await apiService.post('/test', data)

            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/test',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json'
                    })
                })
            )
        })

        it('should make PUT request correctly', async () => {
            const data = { key: 'value' }

            await apiService.put('/test', data)

            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/test',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(data)
                })
            )
        })

        it('should make PATCH request correctly', async () => {
            const data = { key: 'value' }

            await apiService.patch('/test', data)

            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/test',
                expect.objectContaining({
                    method: 'PATCH',
                    body: JSON.stringify(data)
                })
            )
        })

        it('should make DELETE request correctly', async () => {
            await apiService.delete('/test')

            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/test',
                expect.objectContaining({
                    method: 'DELETE'
                })
            )
        })

        it('should include authorization header when token exists', async () => {
            apiService.setToken('test-token')

            await apiService.get('/test')

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer test-token'
                    })
                })
            )
        })
    })

    describe('Form Data Requests', () => {
        beforeEach(() => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 200,
                headers: {
                    get: vi.fn().mockReturnValue('application/json')
                },
                json: vi.fn().mockResolvedValue({ success: true })
            })
        })

        it('should make POST form data request correctly', async () => {
            const formData = new FormData()
            formData.append('file', 'test-file')

            apiService.setToken('test-token')

            await apiService.postFormData('/upload', formData)

            expect(fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/upload',
                expect.objectContaining({
                    method: 'POST',
                    body: formData,
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer test-token'
                    })
                })
            )
        })

        it('should make PUT form data request correctly', async () => {
            const formData = new FormData()

            await apiService.putFormData('/upload', formData)

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'PUT',
                    body: formData
                })
            )
        })

        it('should make PATCH form data request correctly', async () => {
            const formData = new FormData()

            await apiService.patchFormData('/upload', formData)

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'PATCH',
                    body: formData
                })
            )
        })
    })

    describe('Error Scenarios', () => {
        it('should handle 401 authentication errors', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 401,
                headers: {
                    get: vi.fn().mockReturnValue('application/json')
                },
                json: vi.fn().mockResolvedValue({ detail: 'Unauthorized' })
            })

            // Mock window.location
            delete window.location
            window.location = { href: '', pathname: '/dashboard' }

            await expect(apiService.get('/test')).rejects.toThrow(ApiError)
            expect(apiService.token).toBeNull()
        })

        it('should handle network errors', async () => {
            mockFetch.mockRejectedValue(new TypeError('Failed to fetch'))

            await expect(apiService.get('/test')).rejects.toThrow(ApiError)
        })

        it('should handle timeout errors', async () => {
            // Mock a slow response
            mockFetch.mockImplementation(() =>
                new Promise(resolve => setTimeout(resolve, 35000))
            )

            // Set a short timeout for testing
            apiService.requestTimeout = 100

            await expect(apiService.get('/test')).rejects.toThrow(ApiError)
        })

        it('should retry failed requests', async () => {
            let callCount = 0
            mockFetch.mockImplementation(() => {
                callCount++
                if (callCount < 3) {
                    return Promise.reject(new Error('Network error'))
                }
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    headers: {
                        get: vi.fn().mockReturnValue('application/json')
                    },
                    json: vi.fn().mockResolvedValue({ success: true })
                })
            })

            const result = await apiService.get('/test')

            expect(callCount).toBe(3)
            expect(result).toEqual({ success: true })
        })

        it('should not retry authentication errors', async () => {
            let callCount = 0
            mockFetch.mockImplementation(() => {
                callCount++
                return Promise.resolve({
                    ok: false,
                    status: 401,
                    headers: {
                        get: vi.fn().mockReturnValue('application/json')
                    },
                    json: vi.fn().mockResolvedValue({ detail: 'Unauthorized' })
                })
            })

            // Mock window.location
            delete window.location
            window.location = { href: '', pathname: '/dashboard' }

            await expect(apiService.get('/test')).rejects.toThrow(ApiError)
            expect(callCount).toBe(1) // Should not retry
        })
    })

    describe('Interceptors Integration', () => {
        it('should apply request interceptors', async () => {
            const interceptor = vi.fn().mockImplementation(config => ({
                ...config,
                headers: { ...config.headers, 'X-Custom': 'test' }
            }))

            apiService.addRequestInterceptor(interceptor)

            mockFetch.mockResolvedValue({
                ok: true,
                status: 200,
                headers: {
                    get: vi.fn().mockReturnValue('application/json')
                },
                json: vi.fn().mockResolvedValue({})
            })

            await apiService.get('/test')

            expect(interceptor).toHaveBeenCalled()
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'X-Custom': 'test'
                    })
                })
            )
        })

        it('should apply response interceptors', async () => {
            const interceptor = vi.fn().mockImplementation(data => ({
                ...data,
                intercepted: true
            }))

            apiService.addResponseInterceptor(interceptor)

            mockFetch.mockResolvedValue({
                ok: true,
                status: 200,
                headers: {
                    get: vi.fn().mockReturnValue('application/json')
                },
                json: vi.fn().mockResolvedValue({ original: true })
            })

            const result = await apiService.get('/test')

            expect(interceptor).toHaveBeenCalledWith({ original: true })
            expect(result).toEqual({ original: true, intercepted: true })
        })
    })

    describe('Health Check', () => {
        it('should perform health check successfully', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 200,
                headers: {
                    get: vi.fn().mockReturnValue('application/json')
                },
                json: vi.fn().mockResolvedValue({ status: 'healthy' })
            })

            const result = await apiService.healthCheck()

            expect(result.status).toBe('healthy')
            expect(result.data).toEqual({ status: 'healthy' })
        })

        it('should handle health check failure', async () => {
            mockFetch.mockRejectedValue(new Error('Connection failed'))

            const result = await apiService.healthCheck()

            expect(result.status).toBe('unhealthy')
            expect(result.error).toBeDefined()
        })
    })

    describe('Utility Methods', () => {
        it('should return error statistics', () => {
            apiService.addErrorHandler(ErrorTypes.NETWORK_ERROR, vi.fn())
            apiService.addRequestInterceptor(vi.fn())
            apiService.addResponseInterceptor(vi.fn())

            const stats = apiService.getErrorStats()

            expect(stats).toEqual({
                handlers: 1,
                interceptors: {
                    request: 1,
                    response: 1
                }
            })
        })

        it('should create timeout promise', async () => {
            const timeoutPromise = apiService.createTimeoutPromise(100)

            await expect(timeoutPromise).rejects.toThrow(ApiError)
        })
    })

    describe('ApiError Class', () => {
        it('should create ApiError with all properties', () => {
            const error = new ApiError(
                'Test error',
                ErrorTypes.NETWORK_ERROR,
                500,
                { additional: 'data' }
            )

            expect(error.message).toBe('Test error')
            expect(error.type).toBe(ErrorTypes.NETWORK_ERROR)
            expect(error.status).toBe(500)
            expect(error.details).toEqual({ additional: 'data' })
            expect(error.timestamp).toBeDefined()
            expect(error.name).toBe('ApiError')
        })

        it('should create ApiError with minimal properties', () => {
            const error = new ApiError('Simple error', ErrorTypes.UNKNOWN_ERROR)

            expect(error.message).toBe('Simple error')
            expect(error.type).toBe(ErrorTypes.UNKNOWN_ERROR)
            expect(error.status).toBeNull()
            expect(error.details).toBeNull()
        })
    })
})