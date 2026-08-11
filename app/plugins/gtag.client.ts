/**
 * Google Analytics 4 — chargé uniquement si NUXT_PUBLIC_GTAG_ID est défini.
 * Sans identifiant, aucun script tiers n'est injecté et aucun cookie n'est posé.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const id = useRuntimeConfig().public.gtagId as string
  if (!id) return

  useHead({
    script: [
      { src: `https://www.googletagmanager.com/gtag/js?id=${id}`, async: true },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true, send_page_view: false });
        `
      }
    ]
  })

  type Gtag = (...args: unknown[]) => void
  const gtag = () => (window as unknown as { gtag?: Gtag }).gtag

  // Nuxt est une SPA après le premier rendu : on envoie la vue nous-mêmes.
  const router = useRouter()
  router.afterEach((to) => {
    nextTick(() =>
      gtag()?.('event', 'page_view', {
        page_path: to.fullPath,
        page_title: document.title,
        page_location: window.location.href
      })
    )
  })

  nuxtApp.hook('app:mounted', () => {
    gtag()?.('event', 'page_view', {
      page_path: router.currentRoute.value.fullPath,
      page_title: document.title,
      page_location: window.location.href
    })
  })

  return {
    provide: {
      /** Suivi d'événement : useNuxtApp().$track('generate_lead', { type: 'devis' }) */
      track: (event: string, params: Record<string, unknown> = {}) => gtag()?.('event', event, params)
    }
  }
})
