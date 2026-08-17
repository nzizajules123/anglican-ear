const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export type MediaAsset = {
  url: string
  publicId: string
  resourceType: 'image' | 'video' | 'raw' | 'auto'
  format?: string
  bytes?: number
  duration?: number
  originalName?: string
}

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024 // 50 MB

export const cloudinary = {
  cloudName,
  uploadPreset,
  enabled: Boolean(cloudName && uploadPreset),
  imageUrl: (publicId: string) =>
    cloudName ? `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}` : '',
  thumbUrl: (asset: MediaAsset, width = 480) =>
    asset.resourceType === 'image' && cloudName
      ? `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${width},q_auto,f_auto/${asset.publicId}`
      : asset.url,
}

/**
 * Uploads a single file to Cloudinary with an unsigned preset.
 * Only the returned metadata is ever written to Firestore — never the file itself.
 */
export function uploadToCloudinary(
  file: File | Blob,
  options: { folder?: string; onProgress?: (percent: number) => void; fileName?: string } = {}
): Promise<MediaAsset> {
  return new Promise((resolve, reject) => {
    if (!cloudinary.enabled) {
      reject(new Error('Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'))
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      reject(new Error(`File is too large (max ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB).`))
      return
    }

    const form = new FormData()
    const name = options.fileName || (file instanceof File ? file.name : 'upload')
    form.append('file', file, name)
    form.append('upload_preset', uploadPreset as string)
    if (options.folder) form.append('folder', options.folder)

    const request = new XMLHttpRequest()
    request.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`)
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && options.onProgress) {
        options.onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }
    request.onerror = () => reject(new Error('Upload failed. Check your connection and try again.'))
    request.onload = () => {
      let payload: Record<string, unknown> = {}
      try {
        payload = JSON.parse(request.responseText)
      } catch {
        reject(new Error('Cloudinary returned an unreadable response.'))
        return
      }
      if (request.status < 200 || request.status >= 300) {
        const message = (payload.error as { message?: string } | undefined)?.message
        reject(new Error(message || `Upload failed (${request.status}).`))
        return
      }
      resolve({
        url: String(payload.secure_url || ''),
        publicId: String(payload.public_id || ''),
        resourceType: (payload.resource_type as MediaAsset['resourceType']) || 'auto',
        format: payload.format ? String(payload.format) : undefined,
        bytes: typeof payload.bytes === 'number' ? payload.bytes : undefined,
        duration: typeof payload.duration === 'number' ? payload.duration : undefined,
        originalName: name,
      })
    }
    request.send(form)
  })
}

export function isAllowedType(file: File, accept: 'image' | 'media'): boolean {
  if (accept === 'image') return file.type.startsWith('image/')
  return file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')
}
