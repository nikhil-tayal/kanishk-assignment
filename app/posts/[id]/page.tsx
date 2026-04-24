import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Pencil, Calendar, User, Sparkles } from 'lucide-react'
import { getPost } from '@/lib/actions/posts'
import { getComments } from '@/lib/actions/comments'
import { getUser } from '@/lib/actions/auth'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Separator } from '@/app/components/ui/separator'
import CommentSection from './CommentSection'

type Params = Promise<{ id: string }>

export default async function PostPage({ params }: { params: Params }) {
  const { id } = await params
  const [post, comments, currentUser] = await Promise.all([
    getPost(id),
    getComments(id),
    getUser(),
  ])

  if (!post) notFound()

  const canEdit =
    currentUser &&
    (currentUser.role === 'admin' || currentUser.id === post.author_id)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back + Edit */}
      <div className="flex items-center justify-between mb-8">
        <Button asChild variant="ghost" size="sm" className="text-zinc-500 -ml-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to posts
          </Link>
        </Button>
        {canEdit && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/posts/${id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
              Edit post
            </Link>
          </Button>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 mb-8">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {(post.users as any)?.name ?? 'Unknown'}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(post.created_at).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </span>
        <Badge variant="secondary" className="ml-auto">Article</Badge>
      </div>

      {/* Featured image */}
      {post.image_url && (
        <div className="relative h-72 sm:h-96 w-full mb-10 rounded-xl overflow-hidden border border-zinc-200">
          <Image src={post.image_url} alt={post.title} fill className="object-cover" />
        </div>
      )}

      {/* AI Summary */}
      {post.summary && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              AI Summary
            </span>
          </div>
          <p className="text-zinc-700 text-sm leading-relaxed">{post.summary}</p>
        </div>
      )}

      {/* Body */}
      <div className="text-zinc-700 text-base leading-8 space-y-4 mb-12">
        {post.body.split('\n').map((paragraph: string, i: number) =>
          paragraph.trim() ? (
            <p key={i}>{paragraph}</p>
          ) : (
            <br key={i} />
          )
        )}
      </div>

      <Separator className="mb-10" />

      <CommentSection postId={id} comments={comments} currentUser={currentUser} />
    </div>
  )
}
