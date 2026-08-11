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

  // TODO(livraison) : brancher l'envoi réel (SMTP Hostinger, Resend ou webhook WhatsApp).
  // Tant que ce n'est pas fait, la demande est journalisée côté serveur.
  console.info('[contact]', {
    receivedAt: new Date().toISOString(),
    kind: body.kind ?? 'contact',
    name,
    phone,
    email: body.email ?? null,
    service: body.service ?? null,
    budget: body.budget ?? null,
    location: body.location ?? null,
    deadline: body.deadline ?? null,
    message
  })

  return { ok: true }
})
