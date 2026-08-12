import sharp from 'sharp'
import fs from 'node:fs'

const S = 'design' // sources décompressées du SVG d'origine
const IMG = 'public/img'

// 1. Reconstruit un RGBA réel : photo (RGB) + masque (luminance) comme alpha.
const photo = await sharp(`${S}/hero-2.png`).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const mask = await sharp(`${S}/hero-1.png`).toColourspace('b-w').raw().toBuffer({ resolveWithObject: true })

const { width, height } = photo.info
if (mask.info.width !== width || mask.info.height !== height) throw new Error('masque de taille différente')

const rgba = Buffer.alloc(width * height * 4)
for (let i = 0, p = 0, m = 0; i < rgba.length; i += 4, p += 3, m += 1) {
  rgba[i] = photo.data[p]
  rgba[i + 1] = photo.data[p + 1]
  rgba[i + 2] = photo.data[p + 2]
  rgba[i + 3] = mask.data[m]
}

const full = sharp(rgba, { raw: { width, height, channels: 4 } })

// 2. Recadre en bandeau 2.4:1 avec la ligne de toit (y≈400) à 20 % du haut.
const ASPECT = 2.4
const ROOF_SRC = 400
const ROOF_AT = 0.2
const bandH = Math.round(width / ASPECT)
const top = Math.round(ROOF_SRC - ROOF_AT * bandH)

const band = await full.png().toBuffer().then((b) =>
  sharp(b).extract({ left: 0, top, width, height: bandH }).png().toBuffer()
)

await sharp(band).webp({ quality: 90, alphaQuality: 95 }).toFile(`${IMG}/hero-batiment.webp`)
await sharp(band).resize({ width: 760 }).webp({ quality: 84, alphaQuality: 92 }).toFile(`${IMG}/hero-batiment-mobile.webp`)

for (const f of ['hero-batiment.webp', 'hero-batiment-mobile.webp']) {
  const m = await sharp(`${IMG}/${f}`).metadata()
  console.log(f.padEnd(28), (fs.statSync(`${IMG}/${f}`).size / 1024).toFixed(0) + ' Ko', '| alpha:', m.hasAlpha, '|', m.width + 'x' + m.height)
}
console.log('bandeau', width + 'x' + bandH, '| recadré depuis y=' + top)
