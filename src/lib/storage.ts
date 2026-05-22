import { supabase } from './supabase'

export const uploadImage = async (file: File, folder = 'article-images') => {
  const name = `${Date.now()}-${file.name}`.replace(/\s+/g, '-')
  const filePath = `${folder}/${name}`

  const { error: uploadError } = await supabase.storage
    .from('article-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data, error } = supabase.storage
    .from('article-images')
    .getPublicUrl(filePath)

  if (error) {
    throw error
  }

  return data.publicUrl
}
