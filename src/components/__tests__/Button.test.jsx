import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../ui/Button/Button'

describe('Button Component', () => {
    describe('Rendering', () => {
        it('should render button with children', () => {
            render(<Button>Click me</Button>)

            expect(screen.getByRole('button')).toBeInTheDocument()
            expect(screen.getByText('Click me')).toBeInTheDocument()
        })

        it('should render with default props', () => {
            render(<Button>Default Button</Button>)

            const button = screen.getByRole('button')
            expect(button).toHaveAttribute('type', 'button')
            expect(button).not.toBeDisabled()
        })

        it('should apply custom className', () => {
            render(<Button className="custom-class">Button</Button>)

            const button = screen.getByRole('button')
            expect(button).toHaveClass('custom-class')
        })
    })

    describe('Variants', () => {
        it('should render primary variant by default', () => {
            render(<Button>Primary</Button>)

            const button = screen.getByRole('button')
            // We can't easily test computed styles, but we can test that it renders
            expect(button).toBeInTheDocument()
        })

        it('should render secondary variant', () => {
            render(<Button variant="secondary">Secondary</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })

        it('should render outline variant', () => {
            render(<Button variant="outline">Outline</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })

        it('should render ghost variant', () => {
            render(<Button variant="ghost">Ghost</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })

        it('should render danger variant', () => {
            render(<Button variant="danger">Danger</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })
    })

    describe('Sizes', () => {
        it('should render medium size by default', () => {
            render(<Button>Medium</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })

        it('should render small size', () => {
            render(<Button size="small">Small</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })

        it('should render large size', () => {
            render(<Button size="large">Large</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })
    })

    describe('States', () => {
        it('should be disabled when disabled prop is true', () => {
            render(<Button disabled>Disabled</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeDisabled()
        })

        it('should show loading state', () => {
            render(<Button loading>Loading</Button>)

            expect(screen.getByText('Loading...')).toBeInTheDocument()
        })

        it('should be disabled when loading', () => {
            const handleClick = vi.fn()
            render(<Button loading onClick={handleClick}>Loading</Button>)

            const button = screen.getByRole('button')
            fireEvent.click(button)

            expect(handleClick).not.toHaveBeenCalled()
        })

        it('should render full width', () => {
            render(<Button fullWidth>Full Width</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })
    })

    describe('Icons', () => {
        it('should render start icon', () => {
            const StartIcon = () => <span data-testid="start-icon">→</span>
            render(
                <Button startIcon={<StartIcon />}>
                    With Start Icon
                </Button>
            )

            expect(screen.getByTestId('start-icon')).toBeInTheDocument()
            expect(screen.getByText('With Start Icon')).toBeInTheDocument()
        })

        it('should render end icon', () => {
            const EndIcon = () => <span data-testid="end-icon">←</span>
            render(
                <Button endIcon={<EndIcon />}>
                    With End Icon
                </Button>
            )

            expect(screen.getByTestId('end-icon')).toBeInTheDocument()
            expect(screen.getByText('With End Icon')).toBeInTheDocument()
        })

        it('should not render icons when loading', () => {
            const StartIcon = () => <span data-testid="start-icon">→</span>
            const EndIcon = () => <span data-testid="end-icon">←</span>

            render(
                <Button
                    loading
                    startIcon={<StartIcon />}
                    endIcon={<EndIcon />}
                >
                    Loading Button
                </Button>
            )

            expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument()
            expect(screen.queryByTestId('end-icon')).not.toBeInTheDocument()
            expect(screen.getByText('Loading...')).toBeInTheDocument()
        })
    })

    describe('Event Handling', () => {
        it('should call onClick when clicked', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Button onClick={handleClick}>Click me</Button>)

            const button = screen.getByRole('button')
            await user.click(button)

            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('should not call onClick when disabled', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Button disabled onClick={handleClick}>Disabled</Button>)

            const button = screen.getByRole('button')
            await user.click(button)

            expect(handleClick).not.toHaveBeenCalled()
        })

        it('should not call onClick when loading', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Button loading onClick={handleClick}>Loading</Button>)

            const button = screen.getByRole('button')
            await user.click(button)

            expect(handleClick).not.toHaveBeenCalled()
        })

        it('should pass event to onClick handler', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Button onClick={handleClick}>Click me</Button>)

            const button = screen.getByRole('button')
            await user.click(button)

            expect(handleClick).toHaveBeenCalledWith(expect.any(Object))
        })
    })

    describe('Button Types', () => {
        it('should render as submit button', () => {
            render(<Button type="submit">Submit</Button>)

            const button = screen.getByRole('button')
            expect(button).toHaveAttribute('type', 'submit')
        })

        it('should render as reset button', () => {
            render(<Button type="reset">Reset</Button>)

            const button = screen.getByRole('button')
            expect(button).toHaveAttribute('type', 'reset')
        })
    })

    describe('Accessibility', () => {
        it('should have proper role', () => {
            render(<Button>Accessible Button</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })

        it('should be focusable when not disabled', async () => {
            const user = userEvent.setup()
            render(<Button>Focusable</Button>)

            const button = screen.getByRole('button')
            await user.tab()

            expect(button).toHaveFocus()
        })

        it('should not be focusable when disabled', () => {
            render(<Button disabled>Not Focusable</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeDisabled()
        })

        it('should support keyboard activation', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Button onClick={handleClick}>Keyboard Button</Button>)

            const button = screen.getByRole('button')
            button.focus()
            await user.keyboard('{Enter}')

            expect(handleClick).toHaveBeenCalled()
        })

        it('should support space key activation', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Button onClick={handleClick}>Space Button</Button>)

            const button = screen.getByRole('button')
            button.focus()
            await user.keyboard(' ')

            expect(handleClick).toHaveBeenCalled()
        })
    })

    describe('Forward Ref', () => {
        it('should forward ref to button element', () => {
            const ref = { current: null }

            render(<Button ref={ref}>Ref Button</Button>)

            expect(ref.current).toBeInstanceOf(HTMLButtonElement)
            expect(ref.current).toHaveTextContent('Ref Button')
        })
    })

    describe('Props Spreading', () => {
        it('should spread additional props to button element', () => {
            render(
                <Button
                    data-testid="custom-button"
                    aria-label="Custom button"
                    title="Button title"
                >
                    Custom Props
                </Button>
            )

            const button = screen.getByTestId('custom-button')
            expect(button).toHaveAttribute('aria-label', 'Custom button')
            expect(button).toHaveAttribute('title', 'Button title')
        })
    })

    describe('PropTypes Validation', () => {
        it('should accept valid variant values', () => {
            const validVariants = ['primary', 'secondary', 'outline', 'ghost', 'danger']

            validVariants.forEach(variant => {
                const { unmount } = render(<Button variant={variant}>Test</Button>)
                expect(screen.getByRole('button')).toBeInTheDocument()
                unmount()
            })
        })

        it('should accept valid size values', () => {
            const validSizes = ['small', 'medium', 'large']

            validSizes.forEach(size => {
                const { unmount } = render(<Button size={size}>Test</Button>)
                expect(screen.getByRole('button')).toBeInTheDocument()
                unmount()
            })
        })

        it('should accept valid type values', () => {
            const validTypes = ['button', 'submit', 'reset']

            validTypes.forEach(type => {
                const { unmount } = render(<Button type={type}>Test</Button>)
                const button = screen.getByRole('button')
                expect(button).toHaveAttribute('type', type)
                unmount()
            })
        })
    })

    describe('Edge Cases', () => {
        it('should handle undefined onClick gracefully', async () => {
            const user = userEvent.setup()

            render(<Button>No onClick</Button>)

            const button = screen.getByRole('button')

            // Should not throw error
            await user.click(button)
            expect(button).toBeInTheDocument()
        })

        it('should handle empty children', () => {
            render(<Button></Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
            expect(button).toHaveTextContent('')
        })

        it('should handle complex children', () => {
            render(
                <Button>
                    <span>Complex</span>
                    <strong>Children</strong>
                </Button>
            )

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
            expect(screen.getByText('Complex')).toBeInTheDocument()
            expect(screen.getByText('Children')).toBeInTheDocument()
        })
    })
})