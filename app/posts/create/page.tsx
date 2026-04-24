import { redirect } from 'next/navigation'
import { PenLine } from 'lucide-react'
import { getUser } from '@/lib/actions/auth'
import { Separator } from '@/app/components/ui/separator'
import CreatePostForm from './CreatePostForm'

export default async function CreatePostPage() {
  const user = await getUser()

  if (!user) redirect('/login')
  if (!['author', 'admin'].includes(user.role)) redirect('/')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-zinc-900 mb-1">
          <PenLine className="h-5 w-5" />
          <h1 className="text-2xl font-bold tracking-tight">New post</h1>
        </div>
        <p className="text-zinc-500 text-sm">
          Share your ideas with the community.
        </p>
      </div>
      <Separator className="mb-8" />
      <CreatePostForm />
    </div>
  )
}
