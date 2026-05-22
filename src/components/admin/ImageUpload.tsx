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
      <label className="block text-sm font-medium text-slate-200">Thumbnail image</label>
      <div className="rounded-3xl border border-slate-700 bg-[#0B1224]/80 p-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#327CFA] file:text-white hover:file:bg-[#327CFA]"
        />
        {uploading && <p className="mt-3 text-sm text-[#94A3B8]">Uploading image…</p>}
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Thumbnail preview"
            className="mt-4 h-40 w-full rounded-3xl object-cover border border-slate-700"
          />
        ) : (
          <div className="mt-4 h-40 rounded-3xl border border-dashed border-slate-700 bg-[#060A16]/50 flex items-center justify-center text-sm text-slate-500">
            No thumbnail selected yet.
          </div>
        )}
      </div>
    </div>
  )
}
