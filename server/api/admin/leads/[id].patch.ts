export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<{ status?: string; notes?: string }>(event)

  const updates: string[] = []
  const params: any[] = []

  if (body.status !== undefined) {
    if (!LEAD_STATUSES.includes(body.status as LeadStatus)) {
      throw createError({ statusCode: 400, message: 'Statut inconnu.' })
    }
    updates.push('status = ?')
    params.push(body.status)
  }

  if (body.notes !== undefined) {
    updates.push('notes = ?')
    params.push(String(body.notes).slice(0, 5000))
  }

  if (!updates.length) throw createError({ statusCode: 400, message: 'Rien à modifier.' })

  updates.push('updated_at = ?')
  params.push(now(), id)

  useDb()
    .prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`)
    .run(...params)

  const row = useDb().prepare('SELECT * FROM leads WHERE id = ?').get(id)
  if (!row) throw createError({ statusCode: 404, message: 'Demande introuvable.' })

  return toLead(row as Record<string, any>)
})
