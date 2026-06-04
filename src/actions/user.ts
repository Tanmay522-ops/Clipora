'use server'

import { client } from '@/lib/prisma'

import { currentUser, auth } from '@clerk/nextjs/server'

export const onAuthenticateUser = async () => {
  try {

    const { userId } = await auth()

    if (!userId) {
      console.log("NO SESSION FOUND")
      return { status: 403 }
    }

    const user = await currentUser()
    if (!user) {
      return { status: 403 }
    }

    const userExist = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: true,
        subscription: {
          select: { plan: true }
        }
      },
    })

    if (userExist) {
      return { status: 200, user: userExist }
    }

    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: 'PERSONAL',
          },
        },
      },
      include: {
        workspace: true, // ✅ simplified
        subscription: {
          select: { plan: true },
        },
      },
    })

    if (newUser) {
      return { status: 201, user: newUser }
    }

    return { status: 400 }

  } catch (error) {
    console.error("onAuthenticateUser ERROR:", error)
    return { status: 500 }
  }
}



export const getNotifications = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }

    const notifications = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: {
          select: {
            id: true,
            content: true,
            userId: true,
          },
        },
        _count: {
          select: {
            notification: true,
          },
        },
      },
    })

    if (notifications && notifications.notification.length > 0) {
      return { status: 200, data: notifications }
    }

    return { status: 404, data: [] }

  } catch (error) {
    console.error("getNotifications ERROR:", error)
    return { status: 400, data: [] }
  }
}



export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }

    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          { lastname: { contains: query } },
        ],
        NOT: [{ clerkid: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    })

    if (users && users.length > 0) {
      return { status: 200, data: users }
    }

    return { status: 404, data: undefined }
  } catch (error) {
    return { status: 500, data: undefined }
  }
}



export const getPaymentInfo = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }

    const payment = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: { plan: true },
        },
      },
    })
    if (payment) {
      return { status: 200, data: payment }
    }
  } catch (error) {
    console.error("Error in getting paymentInfo")
    return { status: 400 }
  }
}


export const getFirstView = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const userData = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        firstView: true,
      },
    })
    if (userData) {
      return { status: 200, data: userData.firstView }
    }
    return { status: 400, data: false }
  } catch (error) {
    return { status: 400 }
  }
}


export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser()

    if (!user) return { status: 404 }

    const view = await client.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        firstView: state,
      },
    })

    if (view) {
      return { status: 200, data: 'Setting updated' }
    }
  } catch (error) {
    return { status: 400 }
  }
}




export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    if (commentId) {
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      })
      if (reply) {
        return { status: 200, data: 'Reply posted' }
      }
    }

    const newComment = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        comments: {
          create: {
            comment,
            userId,
          },
        },
      },
    })
    if (newComment) return { status: 200, data: 'New comment added' }
  } catch (error) {
    return { status: 400 }
  }
}



export const getUserProfile = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const profileIdAndImage = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    })

    if (profileIdAndImage) return { status: 200, data: profileIdAndImage }
  } catch (error) {
    return { status: 400 }
  }
}



export const getVideoComments = async (id: string) => {
  
  try {
    const comments = await client.comment.findMany({
      where: {
        OR: [{ videoId: id }, { commentId: id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    })

  return { status: 200, data: comments }
  } catch (error) {
    return { status: 400 }
  }
}