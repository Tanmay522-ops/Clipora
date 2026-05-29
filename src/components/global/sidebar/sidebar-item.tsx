import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type Props = {
    icon: React.ReactNode
    title: string
    href: string
    selected: boolean
    notifications?: number
}

const SidebarItem = ({ href, icon, selected, title, notifications }: Props) => {
    return (
        <li className="cursor-pointer my-[5px]">
            <Link
                href={href}
                className={cn(
                    'flex items-center justify-between group rounded-lg hover:bg-[#1D1D1D]',
                    selected ? 'bg-[#1D1D1D]' : ''
                )}
            >
                <div className="flex items-center gap-2 transition-all p-[5px] cursor-pointer">
                    {icon}
                    <span
                        className={cn(
                            'font-medium group-hover:text-[#9D9D9D] transition-all truncate w-32',
                            selected ? 'text-[#9D9D9D]' : 'text-[#545454]'
                        )}
                    >
                        {title}
                    </span>
                </div>

                {notifications && notifications > 0 && (
                    <span className="mr-2 text-xs font-medium bg-[#1D1D1D] text-[#9D9D9D] rounded-full px-2 py-0.5">
                        {notifications}
                    </span>
                )}
            </Link>
        </li>
    )
}

export default SidebarItem