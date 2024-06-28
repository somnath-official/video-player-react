import { CSSProperties, ReactNode } from "react"

export const Card = ({
    children,
    style = {},
    className = ''
}: {
    children: ReactNode,
    style?: CSSProperties,
    className?: string
}) => {
    return (
        <div style={style} className={`${className} template-x-card`}>{children}</div>
    )
}
