export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const { current, next } = await readBody<{ current?: string; next?: string }>(event)

  if (!next || next.length < 10) {
    throw createError({ statusCode: 400, message: 'Le nouveau mot de passe doit faire au moins 10 caractères.' })
  }

  if (!current || !changePassword(current, next)) {
    throw createError({ statusCode: 401, message: 'Mot de passe actuel incorrect.' })
  }

  // changePassword a supprimé toutes les sessions, y compris celle-ci : on en
  // ouvre une nouvelle pour ne pas éjecter la personne qui vient de le changer.
  createSession(event)
  return { ok: true }
})
