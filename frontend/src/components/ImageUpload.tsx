import { useRef, useState } from 'react'
import { uploadImage } from '../api/upload'

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
  aspectRatio?: 'square' | 'wide' | 'portrait'
}

const ASPECT: Record<string, string> = {
  square: 'aspect-square',
  wide: 'aspect-video',
  portrait: 'aspect-[3/4]',
}

function Placeholder({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-600 h-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M21 12V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75v10.5" />
      </svg>
      <span className="text-xs">{label ?? 'Zum Hochladen klicken'}</span>
    </div>
  )
}

export function ImageUpload({ value, onChange, label, aspectRatio = 'wide' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file: File) {
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch {
      setError('Upload fehlgeschlagen. Bitte erneut versuchen.')
    } finally {
      setUploading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  return (
    <div className="space-y-1">
      {label && <span className="block text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>}
      <div
        className={`relative ${ASPECT[aspectRatio]} w-full rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden cursor-pointer group transition-colors hover:border-brand-400 dark:hover:border-brand-600`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full">Bild ändern</span>
            </div>
          </>
        ) : uploading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500" />
          </div>
        ) : (
          <Placeholder label="Klicken oder ziehen zum Hochladen" />
        )}

        {uploading && value && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500" />
          </div>
        )}
      </div>

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-xs text-red-400 hover:text-red-600"
        >
          Bild entfernen
        </button>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  )
}
