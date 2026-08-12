export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const collection = resolveCollection(getRouterParam(event, 'collection'))
  const body = await readBody<Record<string, any>>(event)

  const columns = collection.columns(body)
  const ts = now()
  const names = [...Object.keys(columns), 'position', 'created_at', 'updated_at']
  const values = [...Object.values(columns), nextPosition(collection.table), ts, ts]

  const result = useDb()
    .prepare(
      `INSERT INTO ${collection.table} (${names.join(', ')})
       VALUES (${names.map(() => '?').join(', ')})`
    )
    .run(...values)

  return { ok: true, id: Number(result.lastInsertRowid) }
})
