import { notFound, redirect } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { getPost } from '@/lib/actions/posts'
import { getUser } from '@/lib/actions/auth'
import { Separator } from '@/app/components/ui/separator'
import EditPostForm from './EditPostForm'

type Params = Promise<{ id: string }>

export default async function EditPostPage({ params }: { params: Params }) {
  const { id } = await params
  const [post, currentUser] = await Promise.all([getPost(id), getUser()])

  if (!post) notFound()
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.id !== post.author_id)) {
    redirect('/')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-zinc-900 mb-1">
          <Pencil className="h-5 w-5" />
          <h1 className="text-2xl font-bold tracking-tight">Edit post</h1>
        </div>
        <p className="text-zinc-500 text-sm">Make changes to your post below.</p>
      </div>
      <Separator className="mb-8" />
      <EditPostForm id={id} title={post.title} body={post.body} />
    </div>
  )
}
