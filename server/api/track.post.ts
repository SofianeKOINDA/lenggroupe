const BOTS = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|preview|monitor/i

/**
 * Balise d'audience appelée par le plugin client à chaque changement de page.
 * Elle ne pose aucun cookie et n'accepte que deux informations : le chemin
 * consulté et le domaine référent.
 */
export default defineEventHandler(async (event) => {
  const ua = getRequestHeader(event, 'user-agent')
  if (!ua || BOTS.test(ua)) return { ok: true }

  const body = await readBody<{ path?: string; referrer?: string; event?: string }>(event)
  const path = (body.path ?? '/').split('?')[0]!.slice(0, 200)

  // Le dashboard n'est pas du trafic public : on ne le compte pas.
  if (path.startsWith('/admin')) return { ok: true }

  if (body.event) {
    recordEvent(String(body.event).slice(0, 40), path, visitorId(event))
    return { ok: true }
  }

  // On ne garde que le domaine du référent : assez pour savoir d'où viennent
  // les visiteurs, sans conserver l'URL complète de provenance.
  let referrer: string | null = null
  if (body.referrer) {
    try {
      const url = new URL(body.referrer)
      const host = getRequestHost(event, { xForwardedHost: true })
      referrer = url.host === host ? null : url.host
    } catch {
      referrer = null
    }
  }

  recordPageView(event, path, referrer)
  return { ok: true }
})
