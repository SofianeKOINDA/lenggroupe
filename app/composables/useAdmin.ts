/**
 * Boîte à outils des écrans d'administration : appels API, collections
 * éditables et formats d'affichage communs.
 */

export type CollectionName = 'projects' | 'services' | 'faq' | 'reviews' | 'team'

export type AdminMeta = { id: number; published: boolean; position: number }

/** Message lisible d'une erreur d'API, quelle que soit sa forme. */
export function apiMessage(error: unknown, fallback = 'Une erreur est survenue.') {
  const data = (error as { data?: { message?: string }; message?: string })?.data
  return data?.message || (error as { message?: string })?.message || fallback
}

/**
 * Appel authentifié. Une session expirée renvoie vers la connexion plutôt que
 * d'afficher une erreur technique au milieu d'un formulaire.
 */
export async function adminFetch<T>(url: string, options: Parameters<typeof $fetch>[1] = {}) {
  try {
    return await $fetch<T>(url, options)
  } catch (error) {
    if ((error as { statusCode?: number })?.statusCode === 401) {
      // Lu depuis l'URL du navigateur : cette fonction est appelée depuis des
      // gestionnaires d'événement, où les composables de route ne sont plus
      // dans le contexte du composant.
      const redirect = import.meta.client ? window.location.pathname : '/admin'
      await navigateTo({ path: '/admin/login', query: { redirect } })
    }
    throw error
  }
}

/** Charge et manipule une collection de contenu (brouillons compris). */
export function useAdminCollection<T extends AdminMeta>(name: CollectionName) {
  const items = useState<T[]>(`admin:${name}`, () => [])
  const pending = ref(false)
  const error = ref('')

  async function refresh() {
    pending.value = true
    error.value = ''
    try {
      items.value = await adminFetch<T[]>(`/api/admin/content/${name}`)
    } catch (e) {
      error.value = apiMessage(e, 'Chargement impossible.')
    } finally {
      pending.value = false
    }
  }

  /** Crée l'élément s'il n'a pas d'identifiant, le met à jour sinon. */
  async function save(payload: Record<string, any>, id?: number) {
    const result = await adminFetch<{ ok: boolean; id?: number }>(
      id ? `/api/admin/content/${name}/${id}` : `/api/admin/content/${name}`,
      { method: id ? 'PUT' : 'POST', body: payload }
    )
    await refresh()
    return result
  }

  async function remove(id: number) {
    await adminFetch(`/api/admin/content/${name}/${id}`, { method: 'DELETE' })
    await refresh()
  }

  /** Déplace un élément d'un cran et enregistre le nouvel ordre. */
  async function move(id: number, direction: -1 | 1) {
    const order = items.value.map((i) => i.id)
    const from = order.indexOf(id)
    const to = from + direction
    if (from < 0 || to < 0 || to >= order.length) return

    order.splice(to, 0, ...order.splice(from, 1))
    // Réordonnancement optimiste : la liste bouge tout de suite à l'écran.
    items.value = order.map((i) => items.value.find((item) => item.id === i)!)

    await adminFetch(`/api/admin/content/${name}/reorder`, { method: 'POST', body: { ids: order } })
  }

  async function togglePublished(item: T) {
    await save({ ...item, published: !item.published }, item.id)
  }

  return { items, pending, error, refresh, save, remove, move, togglePublished }
}

/** Téléverse une ou plusieurs images et renvoie leurs adresses publiques. */
export async function uploadImages(files: FileList | File[]) {
  const body = new FormData()
  for (const file of files) body.append('files', file)

  const { urls } = await adminFetch<{ urls: string[] }>('/api/admin/upload', {
    method: 'POST',
    body
  })
  return urls
}

/* ------------------------------------------------------------------ formats */

const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
const timeFormat = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })

export const formatDate = (iso: string) => dateFormat.format(new Date(iso))
export const formatDateTime = (iso: string) => `${dateFormat.format(new Date(iso))} à ${timeFormat.format(new Date(iso))}`

/** « il y a 3 h », « hier »… pour situer une demande d'un coup d'œil. */
export function timeAgo(iso: string) {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return "à l'instant"
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  if (days === 1) return 'hier'
  if (days < 30) return `il y a ${days} jours`
  return formatDate(iso)
}

export const formatNumber = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

/* -------------------------------------------------------------- statuts lead */

export const LEAD_STATUSES = ['nouveau', 'en_cours', 'traite', 'perdu'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

/**
 * Couleurs de statut : réservées à cet usage, jamais réutilisées pour une série
 * de graphique. Chaque pastille porte aussi son libellé, jamais la couleur seule.
 */
export const LEAD_STATUS: Record<LeadStatus, { label: string; chip: string }> = {
  nouveau: { label: 'Nouveau', chip: 'bg-blue-50 text-blue-700 ring-blue-200' },
  en_cours: { label: 'En cours', chip: 'bg-amber-50 text-amber-800 ring-amber-200' },
  traite: { label: 'Traité', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  perdu: { label: 'Sans suite', chip: 'bg-ink-100 text-ink-600 ring-ink-200' }
}

export type Lead = {
  id: number
  kind: 'contact' | 'devis'
  name: string
  phone: string
  email: string | null
  service: string | null
  budget: string | null
  location: string | null
  deadline: string | null
  message: string
  status: LeadStatus
  notes: string
  source: string | null
  createdAt: string
  updatedAt: string
}
