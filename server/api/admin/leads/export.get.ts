const HEADERS = [
  'id',
  'date',
  'type',
  'statut',
  'nom',
  'telephone',
  'email',
  'service',
  'budget',
  'localisation',
  'echeance',
  'message',
  'notes'
]

/**
 * Échappement CSV : les guillemets sont doublés, et toute valeur est encadrée.
 * Le préfixe apostrophe neutralise les valeurs commençant par =, +, - ou @, que
 * Excel interpréterait comme une formule (injection CSV).
 */
function cell(value: unknown) {
  const text = value === null || value === undefined ? '' : String(value)
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}

export default defineEventHandler((event) => {
  requireAdmin(event)

  const leads = useDb().prepare('SELECT * FROM leads ORDER BY created_at DESC').all().map(toLead)

  const lines = [
    HEADERS.join(';'),
    ...leads.map((l) =>
      [
        l.id,
        l.createdAt,
        l.kind,
        l.status,
        l.name,
        l.phone,
        l.email,
        l.service,
        l.budget,
        l.location,
        l.deadline,
        l.message,
        l.notes
      ]
        .map(cell)
        .join(';')
    )
  ]

  setHeader(event, 'content-type', 'text/csv; charset=utf-8')
  setHeader(event, 'content-disposition', `attachment; filename="demandes-${today()}.csv"`)

  // BOM UTF-8 : sans lui, Excel sous Windows affiche « Ouagadougou » cassé.
  return `﻿${lines.join('\n')}`
})
