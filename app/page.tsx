import Link from 'next/link'
import Image from 'next/image'
import { Search, X, Calendar, User } from 'lucide-react'
import { getPosts } from '@/lib/actions/posts'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Badge } from '@/app/components/ui/badge'

const PAGE_SIZE = 6

type SearchParams = Promise<{ search?: string; page?: string }>

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const search = params.search ?? ''
  const page = Number(params.page ?? 1)

  const { posts, total } = await getPosts({ search, page, pageSize: PAGE_SIZE })
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero header */}
      <div className="mb-10 text-center sm:text-left">
        <Badge variant="secondary" className="mb-3">Community blog</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-2">
          Latest Stories
        </h1>
        <p className="text-zinc-500">
          Discover ideas, tutorials, and stories from our community.
        </p>
      </div>

      {/* Search bar */}
      <form method="GET" className="mb-10">
        <div className="flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search posts..."
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="default" size="default">Search</Button>
          {search && (
            <Button asChild variant="outline" size="default">
              <Link href="/"><X className="h-4 w-4" /></Link>
            </Button>
          )}
        </div>
      </form>

      {search && (
        <p className="text-sm text-zinc-500 mb-6">
          {total} result{total !== 1 ? 's' : ''} for <span className="font-medium text-zinc-800">&ldquo;{search}&rdquo;</span>
        </p>
      )}

      {/* Post grid */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-zinc-800 mb-1">No posts found</h3>
          <p className="text-zinc-500 text-sm max-w-sm">
            {search
              ? `No posts match "${search}". Try a different keyword.`
              : 'No posts yet. Be the first to share something!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/posts/${post.id}`} className="group block">
              <article className="h-full flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all duration-200">
                {post.image_url ? (
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                    <span className="text-4xl opacity-40">✍️</span>
                  </div>
                )}

                <div className="flex flex-col flex-1 p-5">
                  <h2 className="font-semibold text-zinc-900 text-base leading-snug mb-2 group-hover:text-zinc-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {post.summary && (
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                      {post.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-auto pt-3 border-t border-zinc-100">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {(post.users as any)?.name ?? 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-12">
          <Button asChild variant="outline" size="sm" className={page <= 1 ? 'pointer-events-none opacity-40' : ''}>
            <Link href={`/?search=${search}&page=${page - 1}`}>Previous</Link>
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              asChild
              variant={p === page ? 'default' : 'outline'}
              size="sm"
            >
              <Link href={`/?search=${search}&page=${p}`}>{p}</Link>
            </Button>
          ))}

          <Button asChild variant="outline" size="sm" className={page >= totalPages ? 'pointer-events-none opacity-40' : ''}>
            <Link href={`/?search=${search}&page=${page + 1}`}>Next</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
