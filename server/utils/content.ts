import type { Project, ProjectStatus } from '../../app/data/projects'
import type { Service } from '../../app/data/services'
import type { FaqItem } from '../../app/data/faq'
import type { Review } from '../../app/data/reviews'
import type { Member } from '../../app/data/team'

/**
 * Lecture du contenu éditorial. Les mêmes fonctions servent au site public
 * (`published = 1` uniquement) et au dashboard (`drafts: true` pour voir aussi
 * les brouillons). Les objets renvoyés respectent les types déjà utilisés par
 * les pages, augmentés de `id`, `published` et `position` côté admin.
 */

export type Row = Record<string, any>

export type AdminMeta = { id: number; published: boolean; position: number }
export type AdminProject = Project & AdminMeta
export type AdminService = Service & AdminMeta
export type AdminFaq = FaqItem & AdminMeta
export type AdminReview = Review & AdminMeta
export type AdminMember = Member & AdminMeta

const meta = (row: Row): AdminMeta => ({
  id: row.id,
  published: !!row.published,
  position: row.position
})

export const toProject = (row: Row): AdminProject => ({
  ...meta(row),
  slug: row.slug,
  title: row.title,
  category: row.category,
  location: row.location,
  year: row.year,
  status: row.status as ProjectStatus,
  summary: row.summary,
  cover: row.cover,
  gallery: parseJson<string[]>(row.gallery, []),
  facts: parseJson<{ label: string; value: string }[]>(row.facts, []),
  study: parseJson<Project['study'] | undefined>(row.study, undefined)
})

export const toService = (row: Row): AdminService => ({
  ...meta(row),
  slug: row.slug,
  title: row.title,
  short: row.short,
  description: row.description,
  image: row.image,
  points: parseJson<string[]>(row.points, [])
})

export const toFaq = (row: Row): AdminFaq => ({
  ...meta(row),
  question: row.question,
  answer: row.answer
})

export const toReview = (row: Row): AdminReview => ({
  ...meta(row),
  author: row.author,
  role: row.role ?? undefined,
  project: row.project ?? undefined,
  rating: (row.rating ?? undefined) as Review['rating'],
  date: row.date ?? undefined,
  quote: row.quote
})

export const toMember = (row: Row): AdminMember => ({
  ...meta(row),
  name: row.name,
  role: row.role,
  photo: row.photo,
  bio: row.bio
})

function select(table: string, drafts: boolean) {
  const where = drafts ? '' : 'WHERE published = 1'
  return useDb().prepare(`SELECT * FROM ${table} ${where} ORDER BY position ASC, id ASC`).all() as Row[]
}

export const listProjects = (drafts = false) => select('projects', drafts).map(toProject)
export const listServices = (drafts = false) => select('services', drafts).map(toService)
export const listFaq = (drafts = false) => select('faq', drafts).map(toFaq)
export const listReviews = (drafts = false) => select('reviews', drafts).map(toReview)
export const listTeam = (drafts = false) => select('team', drafts).map(toMember)

export function getProject(slug: string, drafts = false) {
  const row = useDb()
    .prepare(`SELECT * FROM projects WHERE slug = ? ${drafts ? '' : 'AND published = 1'}`)
    .get(slug) as Row | undefined
  return row ? toProject(row) : null
}

/** Catégories réellement utilisées, dans l'ordre d'affichage des projets. */
export function projectCategories(drafts = false) {
  const seen: string[] = []
  for (const p of listProjects(drafts)) if (!seen.includes(p.category)) seen.push(p.category)
  return ['Tous', ...seen]
}

/**
 * Fabrique un identifiant d'URL propre à partir d'un titre, et le rend unique
 * dans sa table (suffixe -2, -3… en cas de collision).
 */
export function uniqueSlug(table: 'projects' | 'services', input: string, ignoreId?: number) {
  const base =
    input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70) || 'element'

  const db = useDb()
  let candidate = base
  let n = 1
  while (true) {
    const row = db.prepare(`SELECT id FROM ${table} WHERE slug = ?`).get(candidate) as
      | { id: number }
      | undefined
    if (!row || row.id === ignoreId) return candidate
    candidate = `${base}-${++n}`
  }
}

/** Position à donner à un nouvel élément : à la fin de la liste. */
export function nextPosition(table: string) {
  const row = useDb().prepare(`SELECT COALESCE(MAX(position), -1) + 1 AS n FROM ${table}`).get() as {
    n: number
  }
  return row.n
}
