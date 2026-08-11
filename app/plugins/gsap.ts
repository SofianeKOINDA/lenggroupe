import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Expose GSAP + ScrollTrigger (`useNuxtApp().$gsap`) et fournit la directive
 * `v-reveal` qui anime l'entrée d'un bloc dans le viewport.
 *
 * Usage : <div v-reveal> ou <div v-reveal="150"> (délai en ms)
 *
 * Côté serveur, la directive se contente d'ajouter la classe `.reveal` :
 * combinée au `.js` posé sur <html>, elle masque le bloc avant hydratation
 * pour éviter tout flash, tout en le laissant visible si JS est désactivé.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive('reveal', {
      getSSRProps: () => ({ class: 'reveal' })
    })
    return
  }

  gsap.registerPlugin(ScrollTrigger)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      el.classList.remove('reveal')

      if (reduced) return

      gsap.set(el, { opacity: 0, y: 28 })

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () =>
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: (Number(binding.value) || 0) / 1000,
            ease: 'power3.out',
            clearProps: 'transform'
          })
      })
    },
    unmounted(el: HTMLElement) {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill()
      })
      gsap.killTweensOf(el)
    }
  })

  // Les hauteurs bougent quand les images se chargent ou qu'on change de page.
  nuxtApp.hook('page:finish', () => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh())

  return {
    provide: { gsap, ScrollTrigger }
  }
})
