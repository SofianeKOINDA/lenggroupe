import type { Project, ProjectStatus } from '~/data/projects'
import type { Service } from '~/data/services'
import type { FaqItem } from '~/data/faq'
import type { Review } from '~/data/reviews'
import type { Member } from '~/data/team'
import type { AdminMeta } from '~/composables/useAdmin'

/**
 * Formes renvoyées par l'API d'administration : le contenu tel que le site le
 * connaît, augmenté de son identifiant, de son état de publication et de son
 * rang d'affichage.
 */
export type AdminProjectRow = Project & AdminMeta
export type AdminServiceRow = Service & AdminMeta
export type AdminFaqRow = FaqItem & AdminMeta
export type AdminReviewRow = Review & AdminMeta
export type AdminMemberRow = Member & AdminMeta

/** Avancement d'un chantier, tel qu'affiché en pastille sur les vignettes. */
export const PROJECT_STATUSES: ProjectStatus[] = ['Livré', 'En cours', 'En finition', 'À démarrer']

/** Formulaire vide d'une réalisation — sert aussi de valeur de repli à l'édition. */
export const emptyProject = () => ({
  title: '',
  category: '',
  location: '',
  year: String(new Date().getFullYear()),
  status: 'En cours' as ProjectStatus,
  summary: '',
  cover: '',
  gallery: [] as string[],
  facts: [] as { label: string; value: string }[],
  study: { context: '', challenge: '', answer: '', result: '' },
  published: true
})
