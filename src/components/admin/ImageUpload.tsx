import { useState } from 'react'
import { uploadImageFile } from '../../services/uploadService'

interface ImageUploadProps {
  imageUrl?: string
  onUpload: (url: string) => void
}

export default function ImageUpload({ imageUrl, onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setUploading(true)

    try {
      const { publicUrl } = await uploadImageFile(file)
      onUpload(publicUrl)
    } catch (uploadError) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text">Thumbnail image</label>
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white hover:file:bg-[#1D4ED8] focus:outline-none"
        />
        {uploading && <p className="mt-3 text-sm text-text-secondary">Uploading image…</p>}
        {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Thumbnail preview"
            className="mt-4 h-40 w-full rounded-2xl object-cover border border-border"
          />
        ) : (
          <div className="mt-4 h-40 rounded-2xl border border-dashed border-border bg-[#fafaf9] flex items-center justify-center text-sm text-text-secondary">
            No thumbnail selected yet.
          </div>
        )}
      </div>
    </div>
  )
}
