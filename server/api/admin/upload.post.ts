import { randomBytes } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** Formats acceptés — ceux que le site sait afficher, rien d'autre. */
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif'
}

const MAX_BYTES = 8 * 1024 * 1024

/**
 * Réception des photos de chantier. Les fichiers sont écrits hors du dossier
 * du site (dans `data/uploads`), ce qui leur évite d'être effacés au prochain
 * déploiement, et servis par la route /uploads/**.
 */
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const files = parts?.filter((part) => part.filename && part.data?.length) ?? []

  if (!files.length) throw createError({ statusCode: 400, message: 'Aucun fichier reçu.' })

  const urls: string[] = []
  const month = new Date().toISOString().slice(0, 7) // YYYY-MM
  const dir = join(dataDir(), 'uploads', month)
  mkdirSync(dir, { recursive: true })

  for (const file of files) {
    const extension = TYPES[file.type ?? '']
    if (!extension) {
      throw createError({
        statusCode: 415,
        message: `Format non accepté pour « ${file.filename} ». Utilisez JPG, PNG, WebP ou AVIF.`
      })
    }
    if (file.data.length > MAX_BYTES) {
      throw createError({
        statusCode: 413,
        message: `« ${file.filename} » dépasse 8 Mo. Réduisez la photo avant de l'envoyer.`
      })
    }

    // Nom aléatoire : deux photos nommées IMG_0001.jpg ne s'écrasent jamais,
    // et le nom d'origine (parfois sensible) n'est pas exposé publiquement.
    const name = `${randomBytes(8).toString('hex')}.${extension}`
    writeFileSync(join(dir, name), file.data)
    urls.push(`/uploads/${month}/${name}`)
  }

  return { urls }
})
