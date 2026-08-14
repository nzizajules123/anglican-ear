const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const cloudinary = {
  cloudName,
  uploadPreset,
  enabled: Boolean(cloudName && uploadPreset),
  imageUrl: (publicId: string) =>
    cloudName ? `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}` : '',
}
