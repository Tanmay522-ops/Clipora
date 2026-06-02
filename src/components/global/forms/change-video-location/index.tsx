"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useMoveVideos } from '@/hooks/useFolders'
import React from 'react'
import Loader from '../../loader'

type Props = {
    videoId: string
    currentFolder?: string
    currentWorkSpace?: string
    currentFolderName?: string
}

const ChangeVideoLocation = ({
    videoId,
    currentFolder,
    currentFolderName,
    currentWorkSpace,
}: Props) => {
    const {
        register,
        isPending,
        onFormSubmit,
        folders,
        workspaces,
        isFetching,
        isFolders,
    } = useMoveVideos(videoId, currentWorkSpace!)

    const folder = folders?.find((f) => f.id === currentFolder)
    const workspace = workspaces?.find((f) => f.id === currentWorkSpace)

    return (
        <form className="flex flex-col gap-y-5" onSubmit={onFormSubmit}>
            <div className="boder-[1px] rounded-xl p-5">
                <h2 className="text-xs text-[#a4a4a4]">Current Workspace</h2>
                {workspace && <p>{workspace.name}</p>}
                <h2 className="text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
                {currentFolderName ? (
                    <p>{currentFolderName}</p>
                ) : folder ? (
                    <p>{folder.name}</p>
                ) : (
                    <p className="text-[#a4a4a4] text-sm">This video has no folder</p>
                )}
            </div>

            <Separator orientation="horizontal" />

            <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
                <h2 className="text-xs text-[#a4a4a4]">To</h2>
                <Label className="flex-col gap-y-2 flex">
                    <p className="text-xs">Workspace</p>
                    <select
                        className="w-full rounded-xl text-base bg-[#1c1c1c] text-white"
                        {...register('workspace_id')}
                    >
                        <option value="" className="bg-[#1c1c1c] text-white">
                            Select a workspace
                        </option>
                        {workspaces?.map((space) => (
                            <option
                                key={space.id}
                                className="text-[#a4a4a4]"
                                value={space.id}
                            >
                                {space.name}
                            </option>
                        ))}
                    </select>
                </Label>

                {isFetching ? (
                    <Skeleton className="w-full h-[40px] rounded-xl" />
                ) : (
                    <Label className="flex flex-col gap-y-2">
                        <p className="text-xs">Folders in this workspace</p>
                        {isFolders && isFolders.length > 0 ? (
                                <select
                                    {...register('folder_id')}
                                    className="w-full rounded-xl bg-[#1c1c1c] text-white text-base"
                                    defaultValue={currentFolder ?? ''}
                                >
                                    <option value="" className="bg-[#1c1c1c] text-white">
                                        {currentFolderName ?? folder?.name ?? 'Select a folder'}
                                    </option>
                                    {isFolders.map((f) => (
                                        <option
                                            className="text-[#a4a4a4]"
                                            key={f.id}
                                            value={f.id}
                                        >
                                            {f.name}
                                            {f.id === currentFolder ? ' (current)' : ''}
                                        </option>
                                    ))}
                                </select>
                        ) : (
                            <p className="text-[#a4a4a4] text-sm">
                                This workspace has no folders
                            </p>
                        )}
                    </Label>
                )}
            </div>

           <Button>
            <Loader
            loading={isPending}
            color="#000"
            >
                Transfer

            </Loader>
           </Button>

        </form>
    )
}

export default ChangeVideoLocation