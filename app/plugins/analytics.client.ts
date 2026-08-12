/**
 * Mesure d'audience interne : une balise par page vue, envoyée au serveur du
 * site. Aucun cookie, aucun script tiers, rien qui parte à l'étranger — les
 * chiffres du dashboard viennent de là.
 *
 * Google Analytics (plugin gtag) reste indépendant : si aucun identifiant n'est
 * configuré, ce compteur-ci fonctionne quand même.
 */
export default defineNuxtPlugin(() => {
  const router = useRouter()

  const send = (payload: Record<string, string>) => {
    // sendBeacon survit à la fermeture de l'onglet ; fetch en repli.
    const body = JSON.stringify(payload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
      return
    }
    $fetch('/api/track', { method: 'POST', body: payload }).catch(() => {})
  }

  const track = (path: string, referrer: string) => {
    if (path.startsWith('/admin')) return
    send({ path, referrer })
  }

  // Première page : le référent du navigateur indique la provenance réelle.
  track(router.currentRoute.value.fullPath, document.referrer)

  router.afterEach((to, from) => {
    // Navigation interne : la page précédente n'est pas une « source », on
    // n'envoie donc pas de référent pour ne pas fausser le rapport des sources.
    if (to.path !== from.path) track(to.fullPath, '')
  })

  return {
    provide: {
      /** Événement de conversion ponctuel (clic téléphone, WhatsApp…). */
      trackEvent: (name: string) => send({ event: name, path: router.currentRoute.value.path })
    }
  }
})
