'use client'

import { useActionState, startTransition, useRef } from 'react'
import Link from 'next/link'
import { MessageSquare, Trash2, LogIn } from 'lucide-react'
import { addComment, deleteComment } from '@/lib/actions/comments'
import { Button } from '@/app/components/ui/button'
import { Textarea } from '@/app/components/ui/textarea'

type Comment = {
  id: string
  comment_text: string
  created_at: string
  user_id: string
  users: { name: string } | null
}

type User = { id: string; name: string; role: string } | null

export default function CommentSection({
  postId,
  comments,
  currentUser,
}: {
  postId: string
  comments: Comment[]
  currentUser: User
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const boundAdd = addComment.bind(null, postId)

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await boundAdd(formData)
      if (!result?.error) formRef.current?.reset()
      return result
    },
    undefined
  )

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-zinc-600" />
        <h2 className="text-xl font-semibold text-zinc-900">
          Comments <span className="text-zinc-400 font-normal text-base">({comments.length})</span>
        </h2>
      </div>

      {/* Comment list */}
      <div className="space-y-3 mb-8">
        {comments.length === 0 && (
          <p className="text-sm text-zinc-400 py-4">No comments yet — be the first to share your thoughts!</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-600">
                  {(c.users?.name ?? 'A')[0].toUpperCase()}
                </div>
                <div>
                  <span className="text-sm font-medium text-zinc-800">{c.users?.name ?? 'Anonymous'}</span>
                  <span className="text-xs text-zinc-400 ml-2">
                    {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              {currentUser && (currentUser.id === c.user_id || currentUser.role === 'admin') && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-zinc-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                  onClick={() => startTransition(async () => { await deleteComment(c.id, postId) })}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed pl-9">{c.comment_text}</p>
          </div>
        ))}
      </div>

      {/* Add comment */}
      {currentUser ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-zinc-800 mb-3">Leave a comment</h3>
          <form ref={formRef} action={action} className="space-y-3">
            <Textarea
              name="comment_text"
              required
              rows={3}
              placeholder="Share your thoughts…"
              className="resize-none"
            />
            {state?.error && (
              <p className="text-xs text-red-600">{state.error}</p>
            )}
            <Button type="submit" disabled={pending} size="sm">
              {pending ? 'Posting…' : 'Post comment'}
            </Button>
          </form>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
          <LogIn className="h-5 w-5 text-zinc-400 mx-auto mb-2" />
          <p className="text-sm text-zinc-600">
            <Link href="/login" className="font-semibold text-zinc-900 hover:underline">Sign in</Link>{' '}
            to join the conversation
          </p>
        </div>
      )}
    </section>
  )
}
