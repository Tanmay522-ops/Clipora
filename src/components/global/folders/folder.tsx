"use client"
import React, { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import Loader from '../loader'
import FolderDuotone from '@/icons/FolderDuotone'
import { useMutationData, useMutationDataState } from '@/hooks/useMutationData'
import { renameFolders } from '@/actions/workspace'
import { Input } from '@/components/ui/input'

type Props = {
    name: string
    id: string
    optimistic?: boolean
    count?: number
}

const Folder = ({ name, id, optimistic, count }: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const folderCardRef = useRef<HTMLDivElement | null>(null)
    const pathName = usePathname()
    const router = useRouter()
    const [onRename, setOnRename] = useState(false)
    

    // ✅ these must be functions, not immediate calls
    const Rename = () => setOnRename(true)
    const Renamed = () => setOnRename(false)

    const { mutate, isPending } = useMutationData(
        ['rename-folders'],
        (data: { name: string }) => renameFolders(id, data.name), 
        'workspace-folders',
        Renamed  
    )

    const {latestVariables} = useMutationDataState(['rename-folders'])

    const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
        if (inputRef.current && folderCardRef.current) {
            if (
                !inputRef.current.contains(e.relatedTarget as Node | null) &&
                !folderCardRef.current.contains(e.relatedTarget as Node | null)
            ) {
                if (inputRef.current.value) {
                    mutate({ name: inputRef.current.value , id })
                } else Renamed()
            }
        }
    }

    const handleFolderClick = () => {
        router.push(`${pathName}/folder/${id}`)
    }

    const handleNameDoubleClick = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        e.stopPropagation()
        Rename() // ✅ trigger rename mode
    }

    return (
        <div
            ref={folderCardRef} // ✅ attach ref
            onClick={handleFolderClick}
            className={cn(optimistic && 'opacity-60',
                'flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg border-[1px]'
            )}
        >
            <Loader loading={isPending}>
                <div className="flex flex-col gap-[1px]">
                    {onRename ? (
                        <Input// ✅ show input when renaming
                          onBlur={(e:React.FocusEvent<HTMLInputElement>) => updateFolderName(e)}  // ✅ trigger update on blur
                            ref={inputRef}
                            autoFocus
                            placeholder={name}
                            className="border-none text-base w-full outline-none text-neutral-300 bg-transparent p-0"
                        />
                    ) : (
                            <p onClick={(e) => e.stopPropagation()} className="text-neutral-300" onDoubleClick={handleNameDoubleClick} >
                                {latestVariables &&
                                    latestVariables.status === 'pending' &&
                                    latestVariables.variables.id === id
                                    ? latestVariables.variables.name
                                    : name}
                        </p>
                    )}
                    <span className="text-sm text-neutral-500">{count || 0} videos</span>
                </div>
            </Loader>
            <FolderDuotone />
        </div>
    )
}

export default Folder