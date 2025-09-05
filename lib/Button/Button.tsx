import type { ReactNode } from 'react'

export interface ButtonProps {
    children: ReactNode
}

export const Button = ({ children }: ButtonProps): ReactNode => {
    return <button className="bg-red-100 text-lg uppercase">{children}</button>
}
