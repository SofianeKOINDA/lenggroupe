export default defineEventHandler((event) => {
  requireAdmin(event)

  const collection = resolveCollection(getRouterParam(event, 'collection'))
  const id = Number(getRouterParam(event, 'id'))

  useDb().prepare(`DELETE FROM ${collection.table} WHERE id = ?`).run(id)

  return { ok: true }
})
