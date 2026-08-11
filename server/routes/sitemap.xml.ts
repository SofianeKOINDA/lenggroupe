import { projects } from '../../app/data/projects'

/** Pages statiques, avec leur priorité relative. */
const staticRoutes: { path: string; priority: number; changefreq: string }[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/services', priority: 0.9, changefreq: 'monthly' },
  { path: '/realisations', priority: 0.9, changefreq: 'weekly' },
  { path: '/devis', priority: 0.9, changefreq: 'monthly' },
  { path: '/a-propos', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/faq', priority: 0.7, changefreq: 'monthly' },
  { path: '/politique-confidentialite', priority: 0.3, changefreq: 'yearly' }
]

export default defineEventHandler((event) => {
  const base = (useRuntimeConfig().public.siteUrl as string).replace(/\/$/, '')
  const lastmod = new Date().toISOString().slice(0, 10)

  const urls = [
    ...staticRoutes,
    ...projects.map((p) => ({
      path: `/realisations/${p.slug}`,
      priority: 0.8,
      changefreq: 'monthly'
    }))
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${base}${u.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return body
})
