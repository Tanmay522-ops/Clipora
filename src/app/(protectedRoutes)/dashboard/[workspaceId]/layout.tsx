import { getNotifications, onAuthenticateUser } from "@/actions/user"
import { getAllUserVideos, getWorkspaceFolders, getWorkSpaces, verifyAccessToWorkspace } from "@/actions/workspace"
import { redirect } from "next/navigation"

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import Sidebar from "@/components/global/sidebar"

type Props = {
    params: Promise<{ workspaceId: string }>  // ✅ wrap in Promise
    children: React.ReactNode
}

const Layout = async ({ params, children }: Props) => {  // ✅ don't destructure here

    const { workspaceId } = await params  // ✅ await first, then destructure

    const auth = await onAuthenticateUser()

    if (!auth.user?.workspace) redirect("/sign-in")
    if (!auth.user.workspace.length) redirect("/sign-in")

    const hasAccess = await verifyAccessToWorkspace(workspaceId)

    if (hasAccess.status !== 200) {
        redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    }

    if (!hasAccess.data?.workspace) return null


    const query = new QueryClient()

    await query.prefetchQuery({
        queryKey: ['workspace-folders'],
        queryFn: () => getWorkspaceFolders(workspaceId),
    })

    await query.prefetchQuery({
        queryKey: ['user-videos'],
        queryFn: () => getAllUserVideos(workspaceId),
    })

    await query.prefetchQuery({
        queryKey: ['user-workspaces'],
        queryFn: () => getWorkSpaces(),
    })

    await query.prefetchQuery({
        queryKey: ['user-notifications'],
        queryFn: () => getNotifications(),
    })

    return (
       <HydrationBoundary state={dehydrate(query)}>
        <div className="flex h-screen w-screen">
                <Sidebar activeWorkspaceId={workspaceId} />
                hi
        </div>

       </HydrationBoundary>
    )
}

export default Layout