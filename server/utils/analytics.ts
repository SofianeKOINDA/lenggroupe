import { createHash, randomBytes } from 'node:crypto'
import type { H3Event } from 'h3'

/**
 * Mesure d'audience maison, sans cookie ni service tiers.
 *
 * Le visiteur est identifié par une empreinte éphémère : condensat de son IP,
 * de son navigateur et d'un sel qui change chaque jour. On peut donc compter
 * les visiteurs uniques d'une journée sans jamais conserver d'IP, et l'empreinte
 * devient inexploitable dès le lendemain.
 */

/** Sel du jour, régénéré à la première visite de chaque journée. */
function dailySalt() {
  const key = `analytics_salt_${today()}`
  let salt = getSetting(key)
  if (!salt) {
    salt = randomBytes(16).toString('hex')
    setSetting(key, salt)
    // On ne garde que les sels récents : les anciens ne servent plus à rien.
    useDb()
      .prepare("DELETE FROM settings WHERE key LIKE 'analytics_salt_%' AND key < ?")
      .run(`analytics_salt_${daysAgo(7)}`)
  }
  return salt
}

export function visitorId(event: H3Event) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? ''
  const ua = getRequestHeader(event, 'user-agent') ?? ''
  return createHash('sha256').update(`${dailySalt()}:${ip}:${ua}`).digest('hex').slice(0, 32)
}

export function deviceFrom(userAgent: string | undefined) {
  if (!userAgent) return 'inconnu'
  if (/iPad|Tablet/i.test(userAgent)) return 'tablette'
  if (/Mobi|Android|iPhone/i.test(userAgent)) return 'mobile'
  return 'ordinateur'
}

export function recordPageView(event: H3Event, path: string, referrer: string | null) {
  useDb()
    .prepare('INSERT INTO page_views (path, referrer, visitor, device, created_at, day) VALUES (?, ?, ?, ?, ?, ?)')
    .run(
      path,
      referrer,
      visitorId(event),
      deviceFrom(getRequestHeader(event, 'user-agent')),
      now(),
      today()
    )
}

export function recordEvent(name: string, path: string | null, visitor: string | null) {
  useDb()
    .prepare('INSERT INTO events (name, path, visitor, created_at, day) VALUES (?, ?, ?, ?, ?)')
    .run(name, path, visitor, now(), today())
}

/** Date au format YYYY-MM-DD, n jours avant aujourd'hui. */
export function daysAgo(n: number) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - n)
  return d.toISOString().slice(0, 10)
}

type Range = { from: string; days: number }

const rangeFor = (days: number): Range => ({ from: daysAgo(days - 1), days })

/** Série journalière complète : les jours sans trafic valent 0, pas de trou. */
function fillDays(rows: { day: string; [k: string]: any }[], range: Range, keys: string[]) {
  const byDay = new Map(rows.map((r) => [r.day, r]))
  const out: Record<string, any>[] = []
  for (let i = range.days - 1; i >= 0; i--) {
    const day = daysAgo(i)
    const row = byDay.get(day)
    const entry: Record<string, any> = { day }
    for (const key of keys) entry[key] = Number(row?.[key] ?? 0)
    out.push(entry)
  }
  return out
}

export function buildStats(days = 30) {
  const db = useDb()
  const range = rangeFor(days)
  const previousFrom = daysAgo(days * 2 - 1)

  const scalar = (sql: string, ...params: any[]) =>
    Number((db.prepare(sql).get(...params) as { n: number } | undefined)?.n ?? 0)

  const views = scalar('SELECT COUNT(*) AS n FROM page_views WHERE day >= ?', range.from)
  const visitors = scalar('SELECT COUNT(DISTINCT visitor) AS n FROM page_views WHERE day >= ?', range.from)
  const leads = scalar('SELECT COUNT(*) AS n FROM leads WHERE substr(created_at, 1, 10) >= ?', range.from)

  const previous = {
    views: scalar('SELECT COUNT(*) AS n FROM page_views WHERE day >= ? AND day < ?', previousFrom, range.from),
    visitors: scalar(
      'SELECT COUNT(DISTINCT visitor) AS n FROM page_views WHERE day >= ? AND day < ?',
      previousFrom,
      range.from
    ),
    leads: scalar(
      'SELECT COUNT(*) AS n FROM leads WHERE substr(created_at, 1, 10) >= ? AND substr(created_at, 1, 10) < ?',
      previousFrom,
      range.from
    )
  }

  const traffic = fillDays(
    db
      .prepare(
        `SELECT day, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
         FROM page_views WHERE day >= ? GROUP BY day`
      )
      .all(range.from) as any[],
    range,
    ['views', 'visitors']
  )

  const leadsByDay = fillDays(
    db
      .prepare(
        `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS leads
         FROM leads WHERE substr(created_at, 1, 10) >= ? GROUP BY day`
      )
      .all(range.from) as any[],
    range,
    ['leads']
  )

  // Une seule série pour le graphique : trafic et demandes partagent l'axe des jours.
  const timeline = traffic.map((row, i) => ({ ...row, leads: leadsByDay[i]?.leads ?? 0 }))

  const topPages = db
    .prepare(
      `SELECT path, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
       FROM page_views WHERE day >= ? GROUP BY path ORDER BY views DESC LIMIT 8`
    )
    .all(range.from) as { path: string; views: number; visitors: number }[]

  const devices = db
    .prepare(
      `SELECT device, COUNT(DISTINCT visitor) AS visitors FROM page_views
       WHERE day >= ? GROUP BY device ORDER BY visitors DESC`
    )
    .all(range.from) as { device: string; visitors: number }[]

  const sources = db
    .prepare(
      `SELECT COALESCE(NULLIF(referrer, ''), 'Direct') AS source, COUNT(*) AS views
       FROM page_views WHERE day >= ? GROUP BY source ORDER BY views DESC LIMIT 8`
    )
    .all(range.from) as { source: string; views: number }[]

  const leadsByStatus = db
    .prepare('SELECT status, COUNT(*) AS total FROM leads GROUP BY status')
    .all() as { status: string; total: number }[]

  const leadsByService = db
    .prepare(
      `SELECT COALESCE(NULLIF(service, ''), 'Non précisé') AS service, COUNT(*) AS total
       FROM leads WHERE substr(created_at, 1, 10) >= ? GROUP BY service ORDER BY total DESC LIMIT 6`
    )
    .all(range.from) as { service: string; total: number }[]

  const conversion = visitors ? (leads / visitors) * 100 : 0
  const previousConversion = previous.visitors ? (previous.leads / previous.visitors) * 100 : 0

  return {
    days,
    totals: {
      views,
      visitors,
      leads,
      conversion: Number(conversion.toFixed(1)),
      newLeads: scalar("SELECT COUNT(*) AS n FROM leads WHERE status = 'nouveau'")
    },
    previous: { ...previous, conversion: Number(previousConversion.toFixed(1)) },
    timeline,
    topPages,
    devices,
    sources,
    leadsByStatus,
    leadsByService
  }
}
