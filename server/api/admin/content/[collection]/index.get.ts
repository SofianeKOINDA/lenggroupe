export default defineEventHandler((event) => {
  requireAdmin(event)

  const collection = resolveCollection(getRouterParam(event, 'collection'))
  return collection.list(true)
})
