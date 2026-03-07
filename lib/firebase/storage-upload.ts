import { adminStorage } from './admin'

export async function uploadBase64ToStorage(
  base64Data: string,
  path: string,
  contentType: string = 'image/png'
): Promise<{ storagePath: string; downloadUrl: string }> {
  const bucket = adminStorage.bucket()
  const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data
  const buffer = Buffer.from(cleanBase64, 'base64')

  const file = bucket.file(path)
  await file.save(buffer, {
    metadata: { contentType },
    public: true,
  })

  const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${path}`
  return { storagePath: path, downloadUrl }
}

export async function uploadVideoToStorage(
  videoBuffer: Buffer,
  path: string
): Promise<{ storagePath: string; downloadUrl: string }> {
  const bucket = adminStorage.bucket()
  const file = bucket.file(path)
  await file.save(videoBuffer, {
    metadata: { contentType: 'video/mp4' },
    public: true,
  })

  const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${path}`
  return { storagePath: path, downloadUrl }
}
