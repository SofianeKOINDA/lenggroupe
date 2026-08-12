import { createReadStream, statSync } from 'node:fs'
import { join, normalize, extname } from 'node:path'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif'
}

/**
 * Sert les images téléversées depuis le dashboard. Elles vivent hors de
 * `public/` pour survivre aux déploiements, il faut donc les exposer nous-mêmes.
 */
export default defineEventHandler((event) => {
  const requested = getRouterParam(event, 'path') ?? ''
  const root = join(dataDir(), 'uploads')

  // Normalisation puis vérification du préfixe : bloque les « ../ » qui
  // permettraient de lire n'importe quel fichier du serveur.
  const file = normalize(join(root, requested))
  if (!file.startsWith(root)) throw createError({ statusCode: 400 })

  const type = MIME[extname(file).toLowerCase()]
  if (!type) throw createError({ statusCode: 404 })

  let size: number
  try {
    const stats = statSync(file)
    if (!stats.isFile()) throw new Error('not a file')
    size = stats.size
  } catch {
    throw createError({ statusCode: 404, message: 'Image introuvable.' })
  }

  setHeader(event, 'content-type', type)
  setHeader(event, 'content-length', size)
  // Le nom de fichier est aléatoire et ne change jamais : cache long sans risque.
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')

  return sendStream(event, createReadStream(file))
})
