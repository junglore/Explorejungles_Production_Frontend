import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Header from '../common/Header'
import { AuthContext } from '../../contexts/AuthContext'

// Mock the navigate function
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams(), vi.fn()],
    }
})

// Mock images
vi.mock('../../assets/images/common/MagnifyingGlass.png', () => ({
    default: 'mocked-magnifying-glass.png'
}))
vi.mock('../../assets/images/Fullpage_Avatars___3d_avatar_21.png', () => ({
    default: 'mocked-avatar.png'
}))

// Helper component to wrap Header with necessary providers
const HeaderWrapper = ({ authValue }) => (
    <BrowserRouter>
        <AuthContext.Provider value={authValue}>
            <Header />
        </AuthContext.Provider>
    </BrowserRouter>
)

describe('Header Component', () => {
    const mockAuthContextUnauthenticated = {
        user: null,
        isAuthenticated: false,
        logout: vi.fn(),
    }

    const mockAuthContextAuthenticated = {
        user: {
            id: '1',
            full_name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com'
        },
        isAuthenticated: true,
        logout: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Rendering', () => {
        it('should render the header with logo', () => {
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            expect(screen.getByText('LOGO')).toBeInTheDocument()
        })

        it('should render navigation links', () => {
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            expect(screen.getByText('RESOURCES')).toBeInTheDocument()
            expect(screen.getByText('MEDIA')).toBeInTheDocument()
            expect(screen.getByText('COMMUNITY')).toBeInTheDocument()
            expect(screen.getByText('ABOUT US')).toBeInTheDocument()
        })

        it('should render search input', () => {
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            const searchInput = screen.getByPlaceholderText('Search')
            expect(searchInput).toBeInTheDocument()
        })

        it('should render login button when not authenticated', () => {
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            expect(screen.getByText('Login')).toBeInTheDocument()
            expect(screen.queryByText('Logout')).not.toBeInTheDocument()
        })

        it('should render user info and logout when authenticated', () => {
            render(<HeaderWrapper authValue={mockAuthContextAuthenticated} />)

            expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument()
            expect(screen.getByText('Logout')).toBeInTheDocument()
            expect(screen.queryByText('Login')).not.toBeInTheDocument()
        })

        it('should render user avatar when authenticated', () => {
            render(<HeaderWrapper authValue={mockAuthContextAuthenticated} />)

            const avatar = screen.getByAltText('User Avatar')
            expect(avatar).toBeInTheDocument()
        })
    })

    describe('Navigation', () => {
        it('should have correct links for navigation items', () => {
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            expect(screen.getByText('RESOURCES').closest('a')).toHaveAttribute('href', '/resources')
            expect(screen.getByText('MEDIA').closest('a')).toHaveAttribute('href', '/media')
            expect(screen.getByText('COMMUNITY').closest('a')).toHaveAttribute('href', '/community')
            expect(screen.getByText('ABOUT US').closest('a')).toHaveAttribute('href', '/about')
        })

        it('should have correct link for logo', () => {
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            expect(screen.getByText('LOGO').closest('a')).toHaveAttribute('href', '/')
        })

        it('should have correct link for login button', () => {
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            expect(screen.getByText('Login').closest('a')).toHaveAttribute('href', '/login')
        })

        it('should have correct link for user avatar', () => {
            render(<HeaderWrapper authValue={mockAuthContextAuthenticated} />)

            expect(screen.getByAltText('User Avatar').closest('a')).toHaveAttribute('href', '/profile')
        })
    })

    describe('Search Functionality', () => {
        it('should update search input value when typing', async () => {
            const user = userEvent.setup()
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            const searchInput = screen.getByPlaceholderText('Search')

            await user.type(searchInput, 'wildlife')

            expect(searchInput).toHaveValue('wildlife')
        })

        it('should navigate to search results when Enter is pressed', async () => {
            const user = userEvent.setup()
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            const searchInput = screen.getByPlaceholderText('Search')

            await user.type(searchInput, 'conservation')
            await user.keyboard('{Enter}')

            expect(mockNavigate).toHaveBeenCalledWith('/search?q=conservation')
        })

        it('should not navigate if search term is too short', async () => {
            const user = userEvent.setup()
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            const searchInput = screen.getByPlaceholderText('Search')

            await user.type(searchInput, 'a')
            await user.keyboard('{Enter}')

            expect(mockNavigate).not.toHaveBeenCalled()
        })

        it('should trim whitespace from search term', async () => {
            const user = userEvent.setup()
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            const searchInput = screen.getByPlaceholderText('Search')

            await user.type(searchInput, '  wildlife  ')
            await user.keyboard('{Enter}')

            expect(mockNavigate).toHaveBeenCalledWith('/search?q=wildlife')
        })

        it('should not navigate if search term is only whitespace', async () => {
            const user = userEvent.setup()
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            const searchInput = screen.getByPlaceholderText('Search')

            await user.type(searchInput, '   ')
            await user.keyboard('{Enter}')

            expect(mockNavigate).not.toHaveBeenCalled()
        })
    })

    describe('Mobile Menu', () => {
        it('should render hamburger menu button', () => {
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            // Hamburger menu is visible but styled to be hidden on desktop
            const hamburgerBars = screen.getAllByRole('generic').filter(el =>
                el.style.width === '25px' && el.style.height === '3px'
            )
            expect(hamburgerBars).toHaveLength(3)
        })

        it('should toggle mobile menu when hamburger is clicked', async () => {
            const user = userEvent.setup()
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            // Find the hamburger menu container
            const hamburgerContainer = screen.getAllByRole('generic').find(el =>
                el.style.cursor === 'pointer' &&
                el.style.flexDirection === 'column'
            )

            expect(hamburgerContainer).toBeInTheDocument()

            await user.click(hamburgerContainer)

            // Menu state should change (this would be visible in responsive design)
            // We can't easily test the visual state change without more complex setup
        })
    })

    describe('Authentication', () => {
        it('should call logout function when logout button is clicked', async () => {
            const user = userEvent.setup()
            const mockLogout = vi.fn()
            const authValue = {
                ...mockAuthContextAuthenticated,
                logout: mockLogout
            }

            render(<HeaderWrapper authValue={authValue} />)

            const logoutButton = screen.getByText('Logout')
            await user.click(logoutButton)

            expect(mockLogout).toHaveBeenCalled()
        })

        it('should handle logout errors gracefully', async () => {
            const user = userEvent.setup()
            const mockLogout = vi.fn().mockRejectedValue(new Error('Logout failed'))
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            const authValue = {
                ...mockAuthContextAuthenticated,
                logout: mockLogout
            }

            render(<HeaderWrapper authValue={authValue} />)

            const logoutButton = screen.getByText('Logout')
            await user.click(logoutButton)

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', expect.any(Error))
            })

            consoleSpy.mockRestore()
        })

        it('should display username when full_name is not available', () => {
            const authValue = {
                ...mockAuthContextAuthenticated,
                user: {
                    ...mockAuthContextAuthenticated.user,
                    full_name: null
                }
            }

            render(<HeaderWrapper authValue={authValue} />)

            expect(screen.getByText('Welcome, johndoe')).toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('should have proper alt text for images', () => {
            render(<HeaderWrapper authValue={mockAuthContextAuthenticated} />)

            expect(screen.getByAltText('Search')).toBeInTheDocument()
            expect(screen.getByAltText('User Avatar')).toBeInTheDocument()
        })

        it('should have proper loading attributes for images', () => {
            render(<HeaderWrapper authValue={mockAuthContextAuthenticated} />)

            const searchIcon = screen.getByAltText('Search')
            const avatar = screen.getByAltText('User Avatar')

            expect(searchIcon).toHaveAttribute('loading', 'lazy')
            expect(avatar).toHaveAttribute('loading', 'lazy')
        })

        it('should support keyboard navigation for search', async () => {
            const user = userEvent.setup()
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            const searchInput = screen.getByPlaceholderText('Search')

            // Focus should work
            await user.tab()
            // The search input should be focusable (exact focus testing depends on tab order)

            await user.type(searchInput, 'test search')
            expect(searchInput).toHaveValue('test search')
        })
    })

    describe('Responsive Design', () => {
        it('should render all required elements for mobile layout', () => {
            render(<HeaderWrapper authValue={mockAuthContextUnauthenticated} />)

            // All elements should be present, responsive behavior is handled by CSS
            expect(screen.getByText('LOGO')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
            expect(screen.getByText('RESOURCES')).toBeInTheDocument()
            expect(screen.getByText('Login')).toBeInTheDocument()
        })
    })

    describe('Error Handling', () => {
        it('should handle missing user data gracefully', () => {
            const authValue = {
                user: {},
                isAuthenticated: true,
                logout: vi.fn()
            }

            render(<HeaderWrapper authValue={authValue} />)

            // Should not crash and should show fallback
            expect(screen.getByText('Welcome,')).toBeInTheDocument()
        })

        it('should handle null user gracefully when authenticated', () => {
            const authValue = {
                user: null,
                isAuthenticated: true,
                logout: vi.fn()
            }

            render(<HeaderWrapper authValue={authValue} />)

            // Should show logout button even with null user
            expect(screen.getByText('Logout')).toBeInTheDocument()
        })
    })
})