"use client"
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import CommentForm from '../forms/comment-form'
import CommentCard from '../comment-card'
import { VideoCommentProps } from '@/types/index.type'
import { getVideoComments } from '@/actions/user'
import { useQueryData } from '@/hooks/useQueryData'
import { Button } from '@/components/ui/button'

type Props = {
  author: string
  videoId: string
}


const Activities = ({ author, videoId }: Props) => {
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const { data } = useQueryData(['video-comments'], () =>
    getVideoComments(videoId)
  )

  const { data: comments } = data as VideoCommentProps

  return (
    <TabsContent
      value="Activity"
      className="p-5 bg-[#1D1D1D] rounded-xl flex flex-col gap-y-5"
    >
      {isSignedIn ? (
        <CommentForm
          videoId={videoId}
          author={author}
        />
      ) : (
        <Button
          onClick={() => router.push('/sign-in')}
          className="w-full bg-[#252525] text-white rounded-full"
        >
          Sign in to comment
        </Button>
      )}
     {comments.map((comment)=>(
       <CommentCard
         comment={comment.comment}
         key={comment.id}
         author={{
           image: comment.User?.image!,
           firstname: comment.User?.firstname!,
           lastname: comment.User?.lastname!,
         }}
         videoId={videoId}
         reply={comment.reply}
         commentId={comment.id}
       />
     ))}
    </TabsContent>
  )
}

export default Activities