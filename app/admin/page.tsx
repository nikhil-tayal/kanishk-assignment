import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileText, MessageSquare, Users, ExternalLink, Pencil } from 'lucide-react'
import { getUser } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Separator } from '@/app/components/ui/separator'

export default async function AdminPage() {
  const currentUser = await getUser()
  if (!currentUser || currentUser.role !== 'admin') redirect('/')

  const supabase = await createClient()

  const [{ data: posts }, { data: comments }, { data: users }] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title, created_at, users(name)')
      .order('created_at', { ascending: false }),
    supabase
      .from('comments')
      .select('id, comment_text, created_at, post_id, users(name), posts(title)')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false }),
  ])

  const roleVariant: Record<string, 'blue' | 'green' | 'purple'> = {
    viewer: 'blue',
    author: 'green',
    admin: 'purple',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <LayoutDashboard className="h-5 w-5 text-zinc-700" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Admin Dashboard</h1>
        </div>
        <p className="text-zinc-500 text-sm">Manage all posts, comments, and users.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Posts', value: posts?.length ?? 0, icon: FileText, color: 'text-blue-600' },
          { label: 'Total Comments', value: comments?.length ?? 0, icon: MessageSquare, color: 'text-green-600' },
          { label: 'Total Users', value: users?.length ?? 0, icon: Users, color: 'text-purple-600' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-zinc-900">{s.value}</p>
                </div>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Posts */}
      <section className="mb-10">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" /> All Posts
            </CardTitle>
          </CardHeader>
          <Separator />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Author</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {posts?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-zinc-900 max-w-xs truncate">{p.title}</td>
                    <td className="px-6 py-3.5 text-zinc-500">{p.users?.name}</td>
                    <td className="px-6 py-3.5 text-zinc-500 whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex gap-2">
                        <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                          <Link href={`/posts/${p.id}`}><ExternalLink className="h-3.5 w-3.5" /></Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                          <Link href={`/posts/${p.id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Recent Comments */}
      <section className="mb-10">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Recent Comments
            </CardTitle>
          </CardHeader>
          <Separator />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Comment</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Post</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {comments?.map((c: any) => (
                  <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-3.5 text-zinc-700 max-w-xs truncate">{c.comment_text}</td>
                    <td className="px-6 py-3.5 text-zinc-500">{c.users?.name}</td>
                    <td className="px-6 py-3.5 text-zinc-500 max-w-xs truncate">
                      <Link href={`/posts/${c.post_id}`} className="hover:underline hover:text-zinc-900">
                        {c.posts?.title}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-zinc-500 whitespace-nowrap">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Users */}
      <section>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> All Users
            </CardTitle>
          </CardHeader>
          <Separator />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-zinc-900">{u.name}</td>
                    <td className="px-6 py-3.5 text-zinc-500">{u.email}</td>
                    <td className="px-6 py-3.5">
                      <Badge variant={roleVariant[u.role] ?? 'secondary'} className="capitalize">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-zinc-500 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  )
}
