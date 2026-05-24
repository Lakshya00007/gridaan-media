import { supabase } from '../lib/supabase'

export const uploadImageFile = async (file: File, folder = 'article-images') => {
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

  const { data } = supabase.storage
    .from('article-images')
    .getPublicUrl(filePath)

  return { publicUrl: data.publicUrl, path: filePath }
}

export const removeImageFile = async (filePath: string) => {
  if (!filePath) return true
  const { error } = await supabase.storage.from('article-images').remove([filePath])
  if (error) throw error
  return true
}

export const publicUrlToPath = (publicUrl: string) => {
  // Attempts to extract the storage path from a public URL
  // e.g. https://xyz.supabase.co/storage/v1/object/public/article-images/123-name.jpg
  const marker = '/object/public/article-images/'
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return ''
  return decodeURIComponent(publicUrl.substring(idx + marker.length))
}
