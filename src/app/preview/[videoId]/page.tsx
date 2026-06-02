import { QueryClient } from "@tanstack/react-query"

type Props = {
    params: Promise<{ videoId: string }>  // ← Next.js 15 params is a Promise
}

const VideoPage = async ({ params }: Props) => {
    const { videoId } = await params        // ← await it
    const query = new QueryClient()

    await query.prefetchQuery({
        queryKey: ['preview-video'],
        queryFn: () => getPreviewVideo(videoId),
    })

    return <div>VideoPage</div>
}

export default VideoPage