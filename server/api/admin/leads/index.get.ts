export default defineEventHandler((event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const status = String(query.status ?? '')
  const kind = String(query.kind ?? '')
  const search = String(query.q ?? '').trim()
  const limit = Math.min(Number(query.limit) || 50, 200)
  const offset = Math.max(Number(query.offset) || 0, 0)

  const where: string[] = []
  const params: any[] = []

  if (LEAD_STATUSES.includes(status as LeadStatus)) {
    where.push('status = ?')
    params.push(status)
  }
  if (kind === 'contact' || kind === 'devis') {
    where.push('kind = ?')
    params.push(kind)
  }
  if (search) {
    where.push('(name LIKE ? OR phone LIKE ? OR email LIKE ? OR message LIKE ? OR location LIKE ?)')
    params.push(...Array(5).fill(`%${search}%`))
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const db = useDb()

  const items = db
    .prepare(`SELECT * FROM leads ${clause} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset)
    .map(toLead)

  const total = Number(
    (db.prepare(`SELECT COUNT(*) AS n FROM leads ${clause}`).get(...params) as { n: number }).n
  )

  // Compteurs par statut : ils alimentent les onglets, donc ils ignorent le
  // filtre de statut en cours mais respectent la recherche.
  const counts = db.prepare('SELECT status, COUNT(*) AS n FROM leads GROUP BY status').all() as {
    status: string
    n: number
  }[]

  return {
    items,
    total,
    counts: Object.fromEntries(counts.map((c) => [c.status, c.n])) as Record<string, number>
  }
})
