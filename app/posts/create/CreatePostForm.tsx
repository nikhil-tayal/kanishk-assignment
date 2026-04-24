'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { AlertCircle, ImagePlus, Sparkles } from 'lucide-react'
import { createPost } from '@/lib/actions/posts'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'

export default function CreatePostForm() {
  const [state, action, pending] = useActionState(createPost, undefined)

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Title</label>
        <Input
          type="text"
          name="title"
          required
          placeholder="Give your post a compelling title"
          className="text-base h-11"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
          <ImagePlus className="h-4 w-4 text-zinc-400" />
          Featured Image
          <span className="text-zinc-400 font-normal">(optional)</span>
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm cursor-pointer file:border-0 file:bg-zinc-100 file:text-zinc-700 file:px-3 file:py-1 file:rounded file:text-xs file:font-medium file:mr-3 hover:file:bg-zinc-200 transition-colors"
        />
        <p className="text-xs text-zinc-400">JPG, PNG or WebP. Shown as the post thumbnail.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Content</label>
        <Textarea
          name="body"
          required
          rows={16}
          placeholder="Write your post here…"
          className="resize-y text-base leading-7"
        />
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          A ~200-word AI summary will be generated automatically and shown on the post listing page.
        </p>
      </div>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Publishing & generating summary…' : 'Publish post'}
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
