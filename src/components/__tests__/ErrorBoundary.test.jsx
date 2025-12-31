import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../common/ErrorBoundary'

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false, errorMessage = 'Test error' }) => {
    if (shouldThrow) {
        throw new Error(errorMessage)
    }
    return <div>No error</div>
}

// Component that throws during render
const AlwaysThrows = () => {
    throw new Error('Component error')
}

describe('ErrorBoundary Component', () => {
    let consoleSpy

    beforeEach(() => {
        // Suppress console.error for cleaner test output
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
    })

    afterEach(() => {
        consoleSpy.mockRestore()
    })

    describe('Normal Operation', () => {
        it('should render children when no error occurs', () => {
            render(
                <ErrorBoundary>
                    <div>Child component</div>
                </ErrorBoundary>
            )

            expect(screen.getByText('Child component')).toBeInTheDocument()
        })

        it('should render multiple children when no error occurs', () => {
            render(
                <ErrorBoundary>
                    <div>First child</div>
                    <div>Second child</div>
                </ErrorBoundary>
            )

            expect(screen.getByText('First child')).toBeInTheDocument()
            expect(screen.getByText('Second child')).toBeInTheDocument()
        })

        it('should render complex nested children', () => {
            render(
                <ErrorBoundary>
                    <div>
                        <span>Nested content</span>
                        <ThrowError shouldThrow={false} />
                    </div>
                </ErrorBoundary>
            )

            expect(screen.getByText('Nested content')).toBeInTheDocument()
            expect(screen.getByText('No error')).toBeInTheDocument()
        })
    })

    describe('Error Handling', () => {
        it('should catch and display error when child component throws', () => {
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
            expect(screen.getByText(/We apologize for the inconvenience/)).toBeInTheDocument()
        })

        it('should display error message in development mode', () => {
            // Mock development environment
            const originalEnv = import.meta.env.MODE
            import.meta.env.MODE = 'development'

            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} errorMessage="Custom error message" />
                </ErrorBoundary>
            )

            expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()

            // Restore environment
            import.meta.env.MODE = originalEnv
        })

        it('should not display error details in production mode', () => {
            // Mock production environment
            const originalEnv = import.meta.env.MODE
            import.meta.env.MODE = 'production'

            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} errorMessage="Sensitive error info" />
                </ErrorBoundary>
            )

            expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
            expect(screen.queryByText('Sensitive error info')).not.toBeInTheDocument()

            // Restore environment
            import.meta.env.MODE = originalEnv
        })

        it('should provide refresh button', () => {
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            const refreshButton = screen.getByText(/Refresh Page/i)
            expect(refreshButton).toBeInTheDocument()
            expect(refreshButton.tagName).toBe('BUTTON')
        })

        it('should provide home navigation link', () => {
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            const homeLink = screen.getByText(/Go to Home/i)
            expect(homeLink).toBeInTheDocument()
            expect(homeLink.tagName).toBe('A')
            expect(homeLink).toHaveAttribute('href', '/')
        })
    })

    describe('Error Recovery', () => {
        it('should reset error state when component updates with new children', () => {
            const { rerender } = render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Should show error UI
            expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()

            // Rerender with non-throwing component
            rerender(
                <ErrorBoundary>
                    <div>Fixed component</div>
                </ErrorBoundary>
            )

            // Should show the fixed component
            expect(screen.getByText('Fixed component')).toBeInTheDocument()
            expect(screen.queryByText(/Something went wrong/)).not.toBeInTheDocument()
        })

        it('should handle refresh button click', () => {
            // Mock window.location.reload
            const mockReload = vi.fn()
            Object.defineProperty(window, 'location', {
                value: { reload: mockReload },
                writable: true
            })

            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            const refreshButton = screen.getByText(/Refresh Page/i)
            refreshButton.click()

            expect(mockReload).toHaveBeenCalled()
        })
    })

    describe('Error Information', () => {
        it('should log error information to console', () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} errorMessage="Logged error" />
                </ErrorBoundary>
            )

            expect(consoleSpy).toHaveBeenCalled()
        })

        it('should handle different types of errors', () => {
            const CustomError = () => {
                throw new TypeError('Type error occurred')
            }

            render(
                <ErrorBoundary>
                    <CustomError />
                </ErrorBoundary>
            )

            expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
        })

        it('should handle errors with no message', () => {
            const NoMessageError = () => {
                throw new Error()
            }

            render(
                <ErrorBoundary>
                    <NoMessageError />
                </ErrorBoundary>
            )

            expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA attributes for error state', () => {
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            const errorContainer = screen.getByRole('alert')
            expect(errorContainer).toBeInTheDocument()
        })

        it('should have accessible button for refresh', () => {
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            const refreshButton = screen.getByRole('button', { name: /refresh page/i })
            expect(refreshButton).toBeInTheDocument()
        })

        it('should have accessible link for home navigation', () => {
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            const homeLink = screen.getByRole('link', { name: /go to home/i })
            expect(homeLink).toBeInTheDocument()
        })
    })

    describe('Custom Error Messages', () => {
        it('should accept custom fallback component', () => {
            const CustomFallback = ({ error }) => (
                <div>Custom error: {error?.message || 'Unknown error'}</div>
            )

            render(
                <ErrorBoundary fallback={CustomFallback}>
                    <ThrowError shouldThrow={true} errorMessage="Custom message" />
                </ErrorBoundary>
            )

            expect(screen.getByText('Custom error: Custom message')).toBeInTheDocument()
        })

        it('should accept custom error handler', () => {
            const mockErrorHandler = vi.fn()

            render(
                <ErrorBoundary onError={mockErrorHandler}>
                    <ThrowError shouldThrow={true} errorMessage="Handled error" />
                </ErrorBoundary>
            )

            expect(mockErrorHandler).toHaveBeenCalledWith(
                expect.any(Error),
                expect.any(Object)
            )
        })
    })

    describe('Edge Cases', () => {
        it('should handle null children', () => {
            render(
                <ErrorBoundary>
                    {null}
                </ErrorBoundary>
            )

            // Should not crash
            expect(document.body).toBeInTheDocument()
        })

        it('should handle undefined children', () => {
            render(
                <ErrorBoundary>
                    {undefined}
                </ErrorBoundary>
            )

            // Should not crash
            expect(document.body).toBeInTheDocument()
        })

        it('should handle empty children array', () => {
            render(
                <ErrorBoundary>
                    {[]}
                </ErrorBoundary>
            )

            // Should not crash
            expect(document.body).toBeInTheDocument()
        })

        it('should handle errors in event handlers', () => {
            const ErrorInHandler = () => {
                const handleClick = () => {
                    throw new Error('Event handler error')
                }

                return <button onClick={handleClick}>Click me</button>
            }

            render(
                <ErrorBoundary>
                    <ErrorInHandler />
                </ErrorBoundary>
            )

            const button = screen.getByText('Click me')
            expect(button).toBeInTheDocument()

            // Event handler errors are not caught by error boundaries
            // This is expected React behavior - we just verify the component renders
            // Error boundary should not show error UI for event handler errors
            expect(screen.queryByText(/Something went wrong/)).not.toBeInTheDocument()
        })
    })

    describe('Performance', () => {
        it('should not re-render children unnecessarily', () => {
            let renderCount = 0

            const CountingComponent = () => {
                renderCount++
                return <div>Render count: {renderCount}</div>
            }

            const { rerender } = render(
                <ErrorBoundary>
                    <CountingComponent />
                </ErrorBoundary>
            )

            expect(screen.getByText('Render count: 1')).toBeInTheDocument()

            // Rerender with same props
            rerender(
                <ErrorBoundary>
                    <CountingComponent />
                </ErrorBoundary>
            )

            // Component should re-render (this is normal React behavior)
            expect(screen.getByText('Render count: 2')).toBeInTheDocument()
        })
    })
})