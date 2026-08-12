/** Cycle de vie d'une demande, du dépôt du formulaire à sa clôture. */
export const LEAD_STATUSES = ['nouveau', 'en_cours', 'traite', 'perdu'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

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

export const toLead = (row: Record<string, any>): Lead => ({
  id: row.id,
  kind: row.kind,
  name: row.name,
  phone: row.phone,
  email: row.email,
  service: row.service,
  budget: row.budget,
  location: row.location,
  deadline: row.deadline,
  message: row.message,
  status: row.status,
  notes: row.notes,
  source: row.source,
  createdAt: row.created_at,
  updatedAt: row.updated_at
})
