'use client'
import { getAllUserVideos } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import VideoRecorderDuotone from '@/icons/VideoRecorderDuotone'
import { cn } from '@/lib/utils'
import { VideosProps } from '@/types/index.type'
import React from 'react'
import VideoCard from './Video-Card'



type Props = {
    folderId?: string
    videosKey: string
    workspaceId: string
}

const Videos = ({ folderId, videosKey, workspaceId }: Props) => {
    const { data: videoData } = useQueryData(
        [videosKey],
        () => getAllUserVideos( folderId ?? workspaceId)
    )
    
    

    console.log('videoData:', videoData)  // ← add this
    console.log('folderId:', folderId)  
    console.log('workspaceId:', workspaceId)  

    const { status: videosStatus, data: videos } = (videoData as VideosProps) ?? { status: 404, data: [] }

    return (
        <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <VideoRecorderDuotone/>
                    <h2 className="text-[#BdBdBd] text-xl">Videos</h2>
                </div>
            </div>
            <section
                className={cn(
                    videosStatus !== 200
                        ? 'p-5'
                        : 'grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                )}
            >
                {videosStatus === 200 ? (
                    videos.map((video) =>
                <VideoCard 
                    key={video.id}
                    workspaceId={workspaceId} 
                    {...video} />)
                ) : (
                    <p className="text-[#BDBDBD]">No videos in workspace</p>
                )}
            </section>
        </div>
    )
}

export default Videos