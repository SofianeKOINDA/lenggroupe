<script setup lang="ts">
import { site, stats } from '~/data/site'

/**
 * Hero en trois plans superposés :
 *   1. le ciel (photo)
 *   2. le mot LENGGROUPE
 *   3. le bâtiment détouré, dont la ligne de toit vient couper le mot
 *
 * Deux compositions selon la largeur :
 *
 * — Dès `sm`, tout se superpose : le bâtiment occupe la pleine largeur dans un
 *   bandeau au ratio 12/5, et le contenu se pose dessus sur un fondu sombre.
 *   La hauteur du hero vaut au moins 100svh ET 100vw/1.9 pour garder au-dessus
 *   du bandeau la bande de ciel qui porte le mot.
 *
 * — En mobile, la superposition ne tient pas verticalement : le bloc visuel et
 *   le contenu sont empilés, le second sur fond plein. Le mot reste découpé par
 *   la ligne de toit, mais le texte ne recouvre plus le bâtiment.
 *
 * Police et position du mot sont en unités de conteneur (cqw) relatives au
 * bandeau : la découpe reste identique à toute largeur. Le plafond à 18rem
 * évite qu'au-delà de ~2500 px le mot ne vienne toucher le header flottant.
 */

const root = ref<HTMLElement | null>(null)
const sky = ref<HTMLElement | null>(null)
const word = ref<HTMLElement | null>(null)
const building = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)

onMounted(() => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()
  const gsap = $gsap as typeof import('gsap').default
  const ScrollTrigger = $ScrollTrigger as typeof import('gsap/ScrollTrigger').ScrollTrigger

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from(sky.value, { scale: 1.1, opacity: 0, duration: 1.6 })
    .from(word.value, { yPercent: 24, opacity: 0, duration: 1.1 }, 0.25)
    .from(building.value, { yPercent: 12, opacity: 0, duration: 1.2 }, 0.35)
    .from(
      panel.value?.children ? Array.from(panel.value.children) : [],
      { y: 26, opacity: 0, duration: 0.7, stagger: 0.12 },
      0.9
    )

  // Parallaxe : le ciel descend, le mot remonte, le bâtiment reste ancré.
  const parallax = gsap
    .timeline({
      scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: 0.6 }
    })
    .to(sky.value, { yPercent: 10 }, 0)
    .to(word.value, { yPercent: -16 }, 0)

  onBeforeUnmount(() => {
    parallax.scrollTrigger?.kill()
    parallax.kill()
    ScrollTrigger.refresh()
  })
})
</script>

<template>
  <section
    ref="root"
    class="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink-950 md:h-hero md:block md:min-h-0"
  >
    <!-- Bloc visuel : empilé en mobile, plein cadre dès sm -->
    <div class="relative h-[54svh] min-h-[280px] shrink-0 md:absolute md:inset-0 md:h-auto">
      <!-- Plan 1 : le ciel -->
      <div ref="sky" class="absolute inset-0">
        <picture>
          <source srcset="/img/hero-ciel-mobile.webp" media="(max-width: 767px)" />
          <img
            src="/img/hero-ciel.webp"
            alt=""
            aria-hidden="true"
            width="2000"
            height="1290"
            fetchpriority="high"
            class="size-full scale-105 object-cover"
          />
        </picture>
      </div>

      <!-- Voile haut : lisibilité du header flottant -->
      <div class="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-ink-950/75 to-transparent" />

      <!-- Plans 2 et 3 : le mot, puis le bâtiment qui le recouvre -->
      <div class="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <div class="@container w-full max-w-[2600px]">
          <div class="relative aspect-[12/5]">
            <span
              ref="word"
              aria-hidden="true"
              class="absolute inset-x-0 bottom-[74%] whitespace-nowrap text-center font-display text-[13vw] font-extrabold leading-none tracking-[-0.045em] text-white/95 md:bottom-[85%] md:text-[min(11.5cqw,18rem)]"
            >
              NOVITECH
            </span>

            <!-- div porteuse de la ref : une ref sur <NuxtImg> renvoie
                 l'instance du composant, pas le noeud DOM attendu par GSAP -->
            <div ref="building" class="absolute inset-0">
              <picture>
                <source srcset="/img/hero-batiment-mobile.webp" media="(max-width: 767px)" />
                <img
                  src="/img/hero-batiment.webp"
                  alt="Villa contemporaine en briques et béton réalisée par LENG GROUPE"
                  width="1448"
                  height="603"
                  fetchpriority="high"
                  class="size-full object-cover object-bottom"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>

      <!-- Fondu bas : dès sm, le contenu se pose sur la façade, qui est claire -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950 to-transparent md:h-3/5 md:via-ink-950/70"
      />
    </div>

    <!-- Contenu : sous le visuel en mobile, superposé dès sm -->
    <div class="relative bg-ink-950 md:absolute md:inset-x-0 md:bottom-0 md:bg-transparent">
      <div ref="panel" class="container-page pb-9 pt-7 md:pb-12 md:pt-0">
        <p
          class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white ring-1 ring-white/20 backdrop-blur-sm sm:text-xs"
        >
          <span class="size-1.5 rounded-full bg-brand-400" />
          Agence BTP · Burkina Faso
        </p>

        <div class="mt-5 grid gap-8 sm:mt-6 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-10">
          <div>
            <h1
              class="max-w-2xl text-[1.75rem] font-extrabold leading-[1.08] text-white sm:text-4xl lg:text-5xl"
            >
              Bâtissons l'Afrique de demain,
              <span class="text-brand-300">aujourd'hui</span>
            </h1>

            <p class="mt-4 max-w-lg text-sm leading-relaxed text-white/75 sm:mt-5 sm:text-base">
              Construction, génie civil, aménagement intérieur et sécurisation foncière. De la
              première esquisse à la remise des clés.
            </p>

            <div class="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <NuxtLink
                to="/devis"
                class="flex-1 rounded-full bg-white px-5 py-3.5 text-center font-semibold text-ink-950 transition hover:bg-brand-500 hover:text-white sm:flex-none sm:px-7"
              >
                Devis gratuit
              </NuxtLink>
              <NuxtLink
                to="/realisations"
                class="flex-1 rounded-full bg-white/10 px-5 py-3.5 text-center font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/20 sm:flex-none sm:px-7"
              >
                Nos réalisations
              </NuxtLink>
            </div>
          </div>

          <!-- Chiffres. Masqués en mobile : le bandeau qui suit les reprend. -->
          <dl class="hidden grid-cols-2 gap-3 md:grid md:gap-4">
            <div
              v-for="s in stats.slice(0, 2)"
              :key="s.label"
              class="rounded-2xl bg-white/8 p-4 ring-1 ring-white/15 backdrop-blur-md sm:p-5"
            >
              <dt class="sr-only">{{ s.label }}</dt>
              <dd>
                <span class="block font-display text-3xl font-extrabold text-white sm:text-4xl">
                  {{ s.value }}{{ s.suffix }}
                </span>
                <span class="mt-1.5 block text-sm leading-snug text-white/70">{{ s.label }}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div
          class="mt-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-white/15 pt-4 text-xs text-white/65 sm:mt-9 sm:pt-5"
        >
          <p class="hidden sm:block">{{ site.address }}</p>
          <p>Réponse sous {{ site.responseTime }}</p>
          <a :href="site.phoneHref" class="font-semibold text-white hover:text-brand-300">
            {{ site.phone }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
