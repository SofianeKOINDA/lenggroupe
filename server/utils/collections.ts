/**
 * Définition des collections éditables depuis le dashboard.
 *
 * Chaque collection décrit sa table, sa fonction de lecture et la façon de
 * transformer le formulaire reçu en colonnes SQL. Les routes CRUD sont
 * génériques et s'appuient uniquement sur ce fichier : ajouter un type de
 * contenu se fait ici, pas dans les routes.
 */

export type CollectionName = 'projects' | 'services' | 'faq' | 'reviews' | 'team'

type Collection = {
  table: CollectionName
  label: string
  list: (drafts: boolean) => any[]
  /** Colonnes à écrire, calculées depuis le corps de la requête. */
  columns: (body: Record<string, any>, id?: number) => Record<string, string | number | null>
}

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v.trim() : fallback)

const required = (v: unknown, field: string) => {
  const value = str(v)
  if (!value) throw createError({ statusCode: 400, message: `Le champ « ${field} » est obligatoire.` })
  return value
}

const list = (v: unknown) =>
  JSON.stringify(Array.isArray(v) ? v.map((item) => String(item).trim()).filter(Boolean) : [])

const bool = (v: unknown, fallback = 1) => (v === undefined || v === null ? fallback : v ? 1 : 0)

export const collections: Record<CollectionName, Collection> = {
  projects: {
    table: 'projects',
    label: 'Réalisation',
    list: listProjects,
    columns: (body, id) => {
      const title = required(body.title, 'titre')
      const facts = Array.isArray(body.facts)
        ? body.facts
            .map((f: any) => ({ label: str(f?.label), value: str(f?.value) }))
            .filter((f: any) => f.label || f.value)
        : []
      // L'étude de cas est facultative : entièrement vide, on la retire plutôt
      // que d'enregistrer un bloc de champs vides qui s'afficherait sur le site.
      const study = {
        context: str(body.study?.context),
        challenge: str(body.study?.challenge),
        answer: str(body.study?.answer),
        result: str(body.study?.result)
      }
      const hasStudy = Object.values(study).some(Boolean)

      return {
        slug: uniqueSlug('projects', str(body.slug) || title, id),
        title,
        category: required(body.category, 'catégorie'),
        location: str(body.location),
        year: str(body.year),
        status: str(body.status, 'Livré') || 'Livré',
        summary: str(body.summary),
        cover: str(body.cover),
        gallery: list(body.gallery),
        facts: JSON.stringify(facts),
        study: hasStudy ? JSON.stringify(study) : null,
        published: bool(body.published)
      }
    }
  },

  services: {
    table: 'services',
    label: 'Service',
    list: listServices,
    columns: (body, id) => {
      const title = required(body.title, 'titre')
      return {
        slug: uniqueSlug('services', str(body.slug) || title, id),
        title,
        short: str(body.short),
        description: str(body.description),
        image: str(body.image),
        points: list(body.points),
        published: bool(body.published)
      }
    }
  },

  faq: {
    table: 'faq',
    label: 'Question',
    list: listFaq,
    columns: (body) => ({
      question: required(body.question, 'question'),
      answer: required(body.answer, 'réponse'),
      published: bool(body.published)
    })
  },

  reviews: {
    table: 'reviews',
    label: 'Avis',
    list: listReviews,
    columns: (body) => {
      const rating = Number(body.rating)
      return {
        author: required(body.author, 'auteur'),
        role: str(body.role) || null,
        project: str(body.project) || null,
        rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null,
        date: str(body.date) || null,
        quote: required(body.quote, 'témoignage'),
        published: bool(body.published)
      }
    }
  },

  team: {
    table: 'team',
    label: 'Membre',
    list: listTeam,
    columns: (body) => ({
      name: required(body.name, 'nom'),
      role: str(body.role),
      photo: str(body.photo),
      bio: str(body.bio),
      published: bool(body.published)
    })
  }
}

/** Résout le paramètre d'URL `collection`, ou renvoie une 404 explicite. */
export function resolveCollection(name: string | undefined): Collection {
  const collection = name && (collections as Record<string, Collection>)[name]
  if (!collection) throw createError({ statusCode: 404, message: 'Type de contenu inconnu.' })
  return collection
}
