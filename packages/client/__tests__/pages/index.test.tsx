import { render } from '@testing-library/react'
import Home from '@/pages/index'

describe('Home', () => {
  it('matches the snapshot', () => {
    const { container } = render(<Home />)
    expect(container).toMatchSnapshot()
  })
})
