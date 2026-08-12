import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto'
import type { H3Event } from 'h3'

/**
 * Authentification du dashboard : un seul compte administrateur.
 *
 * Le mot de passe n'est jamais stocké en clair — seul un condensat scrypt
 * (salé, coûteux à calculer) est conservé dans la table `settings`. Les
 * sessions vivent en base : se déconnecter invalide réellement le jeton, et on
 * peut révoquer toutes les sessions d'un coup en cas de doute.
 */

const COOKIE = 'leng_session'
const SESSION_DAYS = 30

/* ---------------------------------------------------------------- mot de passe */

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = stored.split(':')
  if (scheme !== 'scrypt' || !salt || !hash) return false
  const candidate = scryptSync(password, salt, 64)
  const expected = Buffer.from(hash, 'hex')
  if (candidate.length !== expected.length) return false
  return timingSafeEqual(candidate, expected)
}

/**
 * Garantit qu'un mot de passe admin existe au démarrage.
 *
 * - `NUXT_ADMIN_PASSWORD` défini : il fait foi, à chaque démarrage. C'est le
 *   mode attendu en production (et la façon de reprendre la main si le mot de
 *   passe a été perdu : on renseigne la variable, on redémarre).
 * - sinon : un mot de passe aléatoire est généré une seule fois et affiché
 *   dans les logs du serveur, pour pouvoir se connecter immédiatement en local.
 */
export function ensureAdminPassword() {
  const fromEnv = process.env.NUXT_ADMIN_PASSWORD?.trim()

  if (fromEnv) {
    const current = getSetting('admin_password')
    if (!current || !verifyPassword(fromEnv, current)) {
      setSetting('admin_password', hashPassword(fromEnv))
      setSetting('admin_password_source', 'env')
    }
    return
  }

  if (!getSetting('admin_password')) {
    const generated = randomBytes(9).toString('base64url')
    setSetting('admin_password', hashPassword(generated))
    setSetting('admin_password_source', 'généré')
    console.warn(
      `\n[admin] Aucun NUXT_ADMIN_PASSWORD défini. Mot de passe généré pour /admin : ${generated}\n` +
        `[admin] Notez-le : il ne sera plus affiché. Vous pourrez le changer depuis le dashboard.\n`
    )
  }
}

export function changePassword(current: string, next: string) {
  const stored = getSetting('admin_password')
  if (!stored || !verifyPassword(current, stored)) return false
  setSetting('admin_password', hashPassword(next))
  setSetting('admin_password_source', 'dashboard')
  // Toutes les autres sessions tombent : un changement de mot de passe doit
  // déconnecter les appareils encore ouverts ailleurs.
  useDb().exec('DELETE FROM sessions')
  return true
}

/* -------------------------------------------------------------------- sessions */

const digest = (token: string) => createHash('sha256').update(token).digest('hex')

export function createSession(event: H3Event) {
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000)

  useDb()
    .prepare('INSERT INTO sessions (token, created_at, expires_at, user_agent) VALUES (?, ?, ?, ?)')
    .run(digest(token), now(), expires.toISOString(), getRequestHeader(event, 'user-agent') ?? null)

  setCookie(event, COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    expires
  })
}

export function destroySession(event: H3Event) {
  const token = getCookie(event, COOKIE)
  if (token) useDb().prepare('DELETE FROM sessions WHERE token = ?').run(digest(token))
  deleteCookie(event, COOKIE, { path: '/' })
}

export function isAuthenticated(event: H3Event) {
  const token = getCookie(event, COOKIE)
  if (!token) return false

  const row = useDb().prepare('SELECT expires_at FROM sessions WHERE token = ?').get(digest(token)) as
    | { expires_at: string }
    | undefined
  if (!row) return false

  if (new Date(row.expires_at).getTime() < Date.now()) {
    useDb().prepare('DELETE FROM sessions WHERE token = ?').run(digest(token))
    return false
  }
  return true
}

/** À appeler en tête de chaque route /api/admin/**. */
export function requireAdmin(event: H3Event) {
  if (!isAuthenticated(event)) {
    throw createError({ statusCode: 401, message: 'Session expirée. Reconnectez-vous.' })
  }
}

export function purgeExpiredSessions() {
  useDb().prepare('DELETE FROM sessions WHERE expires_at < ?').run(now())
}

/* ------------------------------------------------- limitation des tentatives */

const attempts = new Map<string, { count: number; until: number }>()
const MAX_ATTEMPTS = 8
const WINDOW = 15 * 60_000

/** Renvoie le nombre de secondes de blocage restantes, 0 si l'essai est permis. */
export function loginBlockedFor(ip: string) {
  const entry = attempts.get(ip)
  if (!entry) return 0
  if (Date.now() > entry.until) {
    attempts.delete(ip)
    return 0
  }
  return entry.count >= MAX_ATTEMPTS ? Math.ceil((entry.until - Date.now()) / 1000) : 0
}

export function registerFailedLogin(ip: string) {
  const entry = attempts.get(ip)
  if (!entry || Date.now() > entry.until) {
    attempts.set(ip, { count: 1, until: Date.now() + WINDOW })
    return
  }
  entry.count += 1
}

export function clearFailedLogins(ip: string) {
  attempts.delete(ip)
}
