/** Reçoit la liste des identifiants dans le nouvel ordre d'affichage. */
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const collection = resolveCollection(getRouterParam(event, 'collection'))
  const { ids } = await readBody<{ ids?: number[] }>(event)

  if (!Array.isArray(ids)) throw createError({ statusCode: 400, message: 'Liste d’identifiants attendue.' })

  const db = useDb()
  const stmt = db.prepare(`UPDATE ${collection.table} SET position = ?, updated_at = ? WHERE id = ?`)
  const ts = now()

  db.exec('BEGIN')
  try {
    ids.forEach((id, index) => stmt.run(index, ts, Number(id)))
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }

  return { ok: true }
})
