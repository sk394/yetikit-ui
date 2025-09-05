import { render } from '@testing-library/react'
import { Button } from './Button'

describe(`Component : ${Button.name}`, () => {
    it('should render correctly', () => {
        const { container } = render(<Button>Click me</Button>)
        expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          class="bg-red-100 text-lg uppercase"
        >
          Click me
        </button>
      </div>
    `)
    })
})