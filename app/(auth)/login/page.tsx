'use client'

import { useActionState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { BookOpen, AlertCircle } from 'lucide-react'
import { login } from '@/lib/actions/auth'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'

function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">Sign in to BlogSpace</h1>
          <p className="text-sm text-zinc-500">Enter your credentials to continue</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>

          <CardContent>
            {(urlError || state?.error) && (
              <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2.5 mb-4 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{urlError ?? state?.error}</span>
              </div>
            )}

            <form action={action} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Email</label>
                <Input type="email" name="email" required placeholder="you@example.com" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Password</label>
                <Input type="password" name="password" required placeholder="••••••••" />
              </div>

              <Button type="submit" disabled={pending} className="w-full">
                {pending ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t pt-4">
            <p className="text-sm text-zinc-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-zinc-900 hover:underline">
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
