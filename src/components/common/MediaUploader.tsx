import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { isAllowedType, uploadToCloudinary, cloudinary, type MediaAsset } from '../../lib/cloudinary'

interface MediaUploaderProps {
  folder: string
  accept?: 'image' | 'media'
  multiple?: boolean
  value: MediaAsset[]
  onChange: (assets: MediaAsset[]) => void
  label?: string
}

export function MediaUploader({ folder, accept = 'image', multiple = true, value, onChange, label = 'Add pictures' }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const pick = async (files: FileList | null) => {
    if (!files || !files.length) return
    setError('')
    setBusy(true)
    const uploaded: MediaAsset[] = []
    try {
      for (const file of Array.from(files)) {
        if (!isAllowedType(file, accept)) {
          throw new Error(`"${file.name}" is not an allowed file type.`)
        }
        const asset = await uploadToCloudinary(file, { folder, onProgress: setProgress })
        uploaded.push(asset)
      }
      onChange([...value, ...uploaded])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setBusy(false)
      setProgress(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-100 disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {busy ? `Uploading ${progress}%` : label}
        </button>
        {!cloudinary.enabled && (
          <span className="text-xs font-medium text-amber-700">
            Cloudinary isn&apos;t configured yet, so uploads are disabled.
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        multiple={multiple}
        accept={accept === 'image' ? 'image/*' : 'image/*,video/*,audio/*'}
        onChange={(event) => void pick(event.target.files)}
      />

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((asset) => (
            <div key={asset.publicId} className="relative h-20 w-20 overflow-hidden rounded-xl border border-stone-200">
              {asset.resourceType === 'image' ? (
                <img src={cloudinary.thumbUrl(asset, 200)} alt={asset.originalName || 'Upload'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-100 p-1 text-center text-[10px] font-semibold text-stone-600">
                  {asset.resourceType}
                </div>
              )}
              <button
                type="button"
                aria-label="Remove upload"
                onClick={() => onChange(value.filter((item) => item.publicId !== asset.publicId))}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
