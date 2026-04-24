import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 mb-6">
        <FileQuestion className="h-8 w-8 text-zinc-400" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-2">Page not found</h2>
      <p className="text-zinc-500 text-sm mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  )
}
