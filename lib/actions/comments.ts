'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addComment(postId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be signed in to comment' }

  const comment_text = (formData.get('comment_text') as string).trim()
  if (!comment_text) return { error: 'Comment cannot be empty' }

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    comment_text,
  })

  if (error) return { error: error.message }

  revalidatePath(`/posts/${postId}`)
  return { success: true }
}

export async function getComments(postId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('comments')
    .select('*, users(name)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  return data ?? []
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) return { error: error.message }

  revalidatePath(`/posts/${postId}`)
  return { success: true }
}
