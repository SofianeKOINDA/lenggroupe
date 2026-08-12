type Payload = {
  kind?: 'contact' | 'devis'
  name?: string
  email?: string
  phone?: string
  service?: string
  budget?: string
  location?: string
  deadline?: string
  message?: string
  company?: string
  /** Page depuis laquelle le formulaire a été envoyé, pour le suivi. */
  source?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Payload>(event)

  // Honeypot : un bot remplit le champ caché, un humain non.
  if (body.company) {
    return { ok: true }
  }

  const name = body.name?.trim()
  const phone = body.phone?.trim()
  const message = body.message?.trim()

  if (!name || !phone || !message) {
    throw createError({
      statusCode: 400,
      message: 'Nom, téléphone et message sont obligatoires.'
    })
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw createError({ statusCode: 400, message: 'Adresse email invalide.' })
  }

  const kind = body.kind === 'devis' ? 'devis' : 'contact'
  const ts = now()

  useDb()
    .prepare(
      `INSERT INTO leads (kind, name, phone, email, service, budget, location, deadline, message, status, notes, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'nouveau', '', ?, ?, ?)`
    )
    .run(
      kind,
      name,
      phone,
      body.email?.trim() || null,
      body.service?.trim() || null,
      body.budget?.trim() || null,
      body.location?.trim() || null,
      body.deadline?.trim() || null,
      message,
      body.source?.trim() || null,
      ts,
      ts
    )

  // Compté comme conversion dans les statistiques du dashboard.
  recordEvent(kind === 'devis' ? 'devis_envoye' : 'contact_envoye', body.source ?? null, null)

  return { ok: true }
})
