import React from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card'

type Props = {
    title: string
    description: string
    children?: React.ReactNode
    footer?: React.ReactNode
}

const GlobalCard = ({ title, children, description, footer }: Props) => {
    return (
        <Card className="global-card">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold text-white">
                    {title}
                </CardTitle>
                <CardDescription className="text-xs text-[#707070]">
                    {description}
                </CardDescription>
            </CardHeader>
            {children && <div className="px-4 pb-2">{children}</div>}
            {footer && (
                <CardFooter className="global-card-footer">
                    {footer}
                </CardFooter>
            )}
        </Card>
    )
}

export default GlobalCard