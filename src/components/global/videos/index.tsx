'use client'
import { getAllUserVideos } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import VideoRecorderDuotone from '@/icons/VideoRecorderDuotone'
import { cn } from '@/lib/utils'
import { VideosProps } from '@/types/index.type'
import React from 'react'
import VideoCard from './Video-Card'



type Props = {
    folderId: string
    videosKey: string
    workspaceId: string
}

const video =  {
    User: {
      firstname: 'John',
      lastname: 'Doe',
      image: 'https://example.com/profile-image.jpg',
    },
    id: 'video123',
    processing: false,
    Folder: {
      id: 'folder456',
      name: 'Marketing Videos',
    },
    createdAt: new Date('2023-04-15T10:30:00Z'),
    title: 'Product Demo: New Features',
    source: 'https://example.com/videos/product-demo.mp4',
  }


const Videos = ({ folderId, videosKey, workspaceId }: Props) => {
    const { data: videoData } = useQueryData(
        [videosKey],
        () => getAllUserVideos(folderId)
    )

    const { status: videosStatus, data: videos } = videoData as VideosProps

    return (
        <div className="flex flex-col gap-4 mt-4">
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
                {/* {videosStatus === 200 ? (
                    videos.map((video) => <VideoCard />)
                ) : (
                    <p className="text-[#BDBDBD]">No videos in workspace</p>
                )} */}

                <VideoCard workspaceId={workspaceId} {...video}/>
            </section>
        </div>
    )
}

export default Videos