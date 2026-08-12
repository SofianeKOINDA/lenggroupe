export default defineEventHandler((event) => {
  requireAdmin(event)

  const requested = Number(getQuery(event).days)
  const days = [7, 30, 90].includes(requested) ? requested : 30

  return buildStats(days)
})
