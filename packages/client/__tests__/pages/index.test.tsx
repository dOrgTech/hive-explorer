import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

describe('Home', () => {
  it('matches the snapshot', () => {
    const { container } = render(<Home />)
    expect(container).toMatchSnapshot()
  })

  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading')

    expect(heading).toBeInTheDocument()
  })
})
