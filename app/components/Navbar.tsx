import Link from 'next/link'
import { PenLine, LayoutDashboard, LogOut, BookOpen } from 'lucide-react'
import { logout, getUser } from '@/lib/actions/auth'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Separator } from '@/app/components/ui/separator'

export default async function Navbar() {
  const user = await getUser()

  const roleVariant: Record<string, 'blue' | 'green' | 'purple'> = {
    viewer: 'blue',
    author: 'green',
    admin: 'purple',
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 shrink-0">
          <BookOpen className="h-5 w-5 text-zinc-700" />
          <span>BlogSpace</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:flex items-center gap-2 text-sm text-zinc-600">
                <span>{user.name}</span>
                <Badge variant={roleVariant[user.role] ?? 'secondary'} className="capitalize">
                  {user.role}
                </Badge>
              </span>

              <Separator orientation="vertical" className="h-5 hidden sm:block mx-1" />

              {(user.role === 'author' || user.role === 'admin') && (
                <Button asChild size="sm">
                  <Link href="/posts/create">
                    <PenLine className="h-3.5 w-3.5" />
                    New post
                  </Link>
                </Button>
              )}

              {user.role === 'admin' && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                </Button>
              )}

              <form action={logout}>
                <Button variant="ghost" size="sm" type="submit" className="text-zinc-500 hover:text-red-600">
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
