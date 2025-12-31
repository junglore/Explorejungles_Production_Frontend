import Button from '../../src/components/ui/Button/Button'

describe('Button Component Tests', () => {
    it('should render button with text', () => {
        cy.mount(<Button>Click me</Button>)
        cy.get('button').should('contain', 'Click me')
    })

    it('should handle click events', () => {
        const onClick = cy.stub()
        cy.mount(<Button onClick={onClick}>Click me</Button>)
        cy.get('button').click()
        cy.then(() => {
            expect(onClick).to.have.been.called
        })
    })

    it('should render different variants', () => {
        cy.mount(<Button variant="secondary">Secondary</Button>)
        cy.get('button').should('be.visible')
    })

    it('should be disabled when disabled prop is true', () => {
        cy.mount(<Button disabled>Disabled</Button>)
        cy.get('button').should('be.disabled')
    })

    it('should show loading state', () => {
        cy.mount(<Button loading>Loading</Button>)
        cy.get('button').should('contain', 'Loading...')
    })

    it('should render with icons', () => {
        const StartIcon = () => <span data-testid="start-icon">→</span>
        cy.mount(
            <Button startIcon={<StartIcon />}>
                With Icon
            </Button>
        )
        cy.get('[data-testid="start-icon"]').should('be.visible')
    })
})