'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

async function generateSummary(title: string, body: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `Write a concise ~200-word summary of the following blog post. The summary should capture the key points and be suitable for a post listing page. Do not use headers or bullet points — write in plain paragraph form.

Title: ${title}

Content:
${body.slice(0, 4000)}`

    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch {
    return body.slice(0, 200) + '...'
  }
}

export async function createPost(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['author', 'admin'].includes(profile.role)) {
    return { error: 'Only authors and admins can create posts' }
  }

  const title = (formData.get('title') as string).trim()
  const body = (formData.get('body') as string).trim()
  const imageFile = formData.get('image') as File | null

  if (!title || !body) return { error: 'Title and body are required' }

  let image_url: string | null = null

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, imageFile)

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName)
      image_url = urlData.publicUrl
    }
  }

  const summary = await generateSummary(title, body)

  const { error } = await supabase.from('posts').insert({
    title,
    body,
    image_url,
    summary,
    author_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/')
  redirect('/')
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: post } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', id)
    .single()

  if (!post) return { error: 'Post not found' }
  if (post.author_id !== user.id && profile?.role !== 'admin') {
    return { error: 'Permission denied' }
  }

  const title = (formData.get('title') as string).trim()
  const body = (formData.get('body') as string).trim()

  if (!title || !body) return { error: 'Title and body are required' }

  const { error } = await supabase
    .from('posts')
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath(`/posts/${id}`)
  redirect(`/posts/${id}`)
}

export async function getPosts({
  search = '',
  page = 1,
  pageSize = 6,
}: {
  search?: string
  page?: number
  pageSize?: number
}) {
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('posts')
    .select('id, title, image_url, summary, created_at, author_id, users(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) {
    query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`)
  }

  const { data, count, error } = await query
  if (error) return { posts: [], total: 0 }
  return { posts: data ?? [], total: count ?? 0 }
}

export async function getPost(id: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('posts')
    .select('*, users(name, email)')
    .eq('id', id)
    .single()

  return data
}
