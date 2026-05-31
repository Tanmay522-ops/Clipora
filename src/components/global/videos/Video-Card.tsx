import React from 'react'
import CardMenu from './video-card-menu'
import Loader from '../loader'

type Props = {
  User: {
    firstname: string | null
    lastname: string | null
    image: string | null
  } | null
  id: string
  Folder: {
    id: string
    name: string
  } | null
  createdAt: Date
  title: string | null
  source: string
  processing: boolean
  workspaceId: string
}

const VideoCard = (props: Props) => {
    //WIP: write up date
    return (
        <Loader loading={false}>
            <div className="overflow-hidden cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl">
                <div className="absolute top-3 right-3 z-50 flex flex-col gap-y-3">
                    <CardMenu 
                    currentFolderName={props.Folder?.name}
                    videoId={props.id}
                    currentWorkspace={props.workspaceId}
                    currentFolder={props.Folder?.id}
                    />
                </div>
            </div>
        </Loader>
    )
}

export default VideoCard