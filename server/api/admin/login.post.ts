export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'inconnu'

  const blocked = loginBlockedFor(ip)
  if (blocked) {
    throw createError({
      statusCode: 429,
      message: `Trop de tentatives. Réessayez dans ${Math.ceil(blocked / 60)} minute(s).`
    })
  }

  const { password } = await readBody<{ password?: string }>(event)
  const stored = getSetting('admin_password')

  if (!password || !stored || !verifyPassword(password, stored)) {
    registerFailedLogin(ip)
    // Délai fixe : évite de distinguer un mot de passe faux d'un compte absent
    // au chronomètre, et ralentit mécaniquement une attaque par dictionnaire.
    await new Promise((resolve) => setTimeout(resolve, 400))
    throw createError({ statusCode: 401, message: 'Mot de passe incorrect.' })
  }

  clearFailedLogins(ip)
  createSession(event)
  return { ok: true }
})
