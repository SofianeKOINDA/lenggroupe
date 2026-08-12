import type { Project } from '~/data/projects'
import type { Service } from '~/data/services'
import type { FaqItem } from '~/data/faq'
import type { Review } from '~/data/reviews'
import type { Member } from '~/data/team'

/**
 * Contenu éditorial du site, servi par la base et administré depuis /admin.
 *
 * Il est chargé une seule fois par le plugin `content` (côté serveur), puis
 * transmis au navigateur dans la charge utile de la page. Les composants
 * appellent ces fonctions comme avant : elles renvoient des données réactives,
 * sans requête supplémentaire.
 */

/** Réalisation telle qu'affichée en vignette : sans galerie ni étude de cas. */
export type ProjectCardData = Omit<Project, 'gallery' | 'study' | 'facts'>

export type SiteContent = {
  projects: ProjectCardData[]
  categories: string[]
  services: Service[]
  faq: FaqItem[]
  reviews: Review[]
  team: Member[]
}

export const emptyContent = (): SiteContent => ({
  projects: [],
  categories: ['Tous'],
  services: [],
  faq: [],
  reviews: [],
  team: []
})

export const useSiteContent = () => useState<SiteContent>('site-content', emptyContent)

export const useProjects = () => computed(() => useSiteContent().value.projects)
export const useProjectCategories = () => computed(() => useSiteContent().value.categories)
export const useServices = () => computed(() => useSiteContent().value.services)
export const useFaq = () => computed(() => useSiteContent().value.faq)
export const useReviews = () => computed(() => useSiteContent().value.reviews)
export const useTeam = () => computed(() => useSiteContent().value.team)
