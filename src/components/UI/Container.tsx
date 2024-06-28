import { CSSProperties, ReactNode } from "react"

export const Container = ({
    children,
    style = {},
    className = ''
}: {
    children: ReactNode,
    style?: CSSProperties,
    className?: string
}) => {
    return (
        <div style={style} className={`${className} template-x-container`}>{children}</div>
    )
}
