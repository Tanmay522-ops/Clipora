import { useEffect, useState } from 'react'
import { useAppSelector } from '@/redux/store'
import { useMutationData } from './useMutationData'
import { getWorkspaceFolders, moveVideoLocation } from '@/actions/workspace'
import { moveVideoSchema } from '@/components/global/forms/change-video-location/schema'
import useZodForm from './useZodForm'

export const useMoveVideos = (videoId: string, currentWorkspace: string) => {
    //get state redux
    const { folders } = useAppSelector((state) => state.FolderReducer)
    const { workspaces } = useAppSelector((state) => state.WorkspaceReducer)
    console.log('workspaces from redux:', workspaces)

    // fetching states
    const [isFetching, setIsFetching] = useState(false)
    //stat folders
    const [isFolders, setIsFolders] = useState<
        | ({
            _count: { videos: number }
        } & {
            id: string
        name: string
        createdAt: Date
        workspaceId: string | null
        })[]
        | undefined
        > (undefined)

    //use mutation data optimisc
    const { mutate, isPending } = useMutationData(
        ['change-video-location'],
        (data: { folder_id: string; workspaceId: string }) => 
         moveVideoLocation(videoId, data.workspaceId, data.folder_id)
        
    )


    //usezodform
    const { errors, onFormSubmit, watch, register } = useZodForm(
        moveVideoSchema,
        mutate,
        { folder_id: null, workspace_id: currentWorkspace }
    )
    
    //fetchfolders with a use effect

  const fetchFolders = async (workspace: string) => {
    setIsFetching(true)
    const folders = await getWorkspaceFolders(workspace)
    setIsFetching(false)
    setIsFolders(folders.data)
  }

  useEffect(() => {
    fetchFolders(currentWorkspace)
  }, [])

  useEffect(() => {
    const workspace = watch(async (value) => {
      if (value.workspace_id) fetchFolders(value.workspace_id)
    })

    return () => workspace.unsubscribe()
  }, [watch])

  return {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
  }
}