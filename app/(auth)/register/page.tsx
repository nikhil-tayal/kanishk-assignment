'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { BookOpen, AlertCircle } from 'lucide-react'
import { register } from '@/lib/actions/auth'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">Join BlogSpace</h1>
          <p className="text-sm text-zinc-500">Create your account to get started</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Create account</CardTitle>
            <CardDescription>Choose your role and fill in your details</CardDescription>
          </CardHeader>

          <CardContent>
            {state?.error && (
              <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2.5 mb-4 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={action} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Full name</label>
                <Input type="text" name="name" required placeholder="Jane Smith" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Email</label>
                <Input type="email" name="email" required placeholder="you@example.com" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Password</label>
                <Input type="password" name="password" required minLength={6} placeholder="Min 6 characters" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Role</label>
                <select
                  name="role"
                  required
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                >
                  <option value="viewer">Viewer — read posts and comment</option>
                  <option value="author">Author — create and manage posts</option>
                </select>
              </div>

              <Button type="submit" disabled={pending} className="w-full">
                {pending ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t pt-4">
            <p className="text-sm text-zinc-500">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-zinc-900 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
