import { getPreviewVideo } from "@/actions/workspace"
import VideoPreview from "@/components/global/videos/preview"
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
type Props = {
    params: Promise<{ videoId: string }>  
}

const VideoPage = async ({ params }: Props) => {
    const { videoId } = await params        
    const query = new QueryClient()

    await query.prefetchQuery({
        queryKey: ['preview-video'],
        queryFn: () => getPreviewVideo(videoId),
    })

    return (
        <HydrationBoundary state={dehydrate(query)}>
            <VideoPreview videoId={videoId} />
        </HydrationBoundary>
    )
}

export default VideoPage