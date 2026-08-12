export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const collection = resolveCollection(getRouterParam(event, 'collection'))
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<Record<string, any>>(event)

  const exists = useDb().prepare(`SELECT id FROM ${collection.table} WHERE id = ?`).get(id)
  if (!exists) throw createError({ statusCode: 404, message: `${collection.label} introuvable.` })

  const columns = collection.columns(body, id)
  const assignments = [...Object.keys(columns).map((c) => `${c} = ?`), 'updated_at = ?']

  useDb()
    .prepare(`UPDATE ${collection.table} SET ${assignments.join(', ')} WHERE id = ?`)
    .run(...Object.values(columns), now(), id)

  return { ok: true }
})
