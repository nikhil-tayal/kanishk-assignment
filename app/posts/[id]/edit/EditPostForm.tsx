'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { updatePost } from '@/lib/actions/posts'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'

type Props = { id: string; title: string; body: string }

export default function EditPostForm({ id, title, body }: Props) {
  const boundAction = updatePost.bind(null, id)

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      return await boundAction(formData)
    },
    undefined
  )

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Title</label>
        <Input
          type="text"
          name="title"
          required
          defaultValue={title}
          className="text-base h-11"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Content</label>
        <Textarea
          name="body"
          required
          rows={18}
          defaultValue={body}
          className="resize-y text-base leading-7"
        />
      </div>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
        <Button asChild variant="outline">
          <Link href={`/posts/${id}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
