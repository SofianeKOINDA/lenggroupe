export default defineEventHandler((event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  useDb().prepare('DELETE FROM leads WHERE id = ?').run(id)

  return { ok: true }
})
