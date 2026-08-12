<script setup lang="ts">
import { nav, site } from '~/data/site'

const open = ref(false)
const scrolled = ref(false)

const shell = ref<HTMLElement | null>(null)
const pill = ref<HTMLElement | null>(null)
const brand = ref<unknown>(null)
const links = ref<HTMLElement | null>(null)
const actions = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)

/** Une ref posée sur <NuxtLink> renvoie l'instance du composant, pas le noeud DOM. */
function toEl(target: unknown): HTMLElement | null {
  if (!target) return null
  if (target instanceof HTMLElement) return target
  const el = (target as { $el?: unknown }).$el
  return el instanceof HTMLElement ? el : null
}

const route = useRoute()
watch(() => route.fullPath, () => (open.value = false))

onMounted(() => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()
  const gsap = $gsap as typeof import('gsap').default
  const ScrollTrigger = $ScrollTrigger as typeof import('gsap/ScrollTrigger').ScrollTrigger

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // État « flottant au-dessus du hero » : GSAP pilote fond, ombre et respiration.
  gsap.set(pill.value, {
    backgroundColor: 'rgba(255,255,255,0.06)',
    boxShadow: '0 0 0 0 rgba(23,20,18,0)',
    paddingTop: 14,
    paddingBottom: 14
  })

  if (!reduced) {
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from(shell.value, { y: -110, opacity: 0, duration: 0.9 })
      .from(toEl(brand.value), { y: -12, opacity: 0, duration: 0.5 }, '-=0.45')
      .from(
        links.value?.children ? Array.from(links.value.children) : [],
        { y: -14, opacity: 0, duration: 0.45, stagger: 0.06 },
        '<0.05'
      )
      .from(actions.value, { y: -12, opacity: 0, duration: 0.5 }, '<0.1')
  }

  // Passage à l'état « pilule blanche » après quelques dizaines de pixels.
  const condense = gsap
    .timeline({ paused: true, defaults: { duration: 0.45, ease: 'power2.out' } })
    .to(
      pill.value,
      {
        backgroundColor: 'rgba(255,255,255,0.94)',
        boxShadow: '0 18px 40px -22px rgba(23,20,18,0.5)',
        paddingTop: 9,
        paddingBottom: 9
      },
      0
    )
    .to(shell.value, { paddingTop: 10 }, 0)

  const trigger = ScrollTrigger.create({
    start: 'top -60',
    end: 99999,
    onToggle: (self) => {
      scrolled.value = self.isActive
      self.isActive ? condense.play() : condense.reverse()
    }
  })

  onBeforeUnmount(() => {
    trigger.kill()
    condense.kill()
  })
})

// Ouverture / fermeture du menu mobile
watch(open, async (value) => {
  const { $gsap } = useNuxtApp()
  const gsap = $gsap as typeof import('gsap').default

  if (value) {
    await nextTick()
    if (!panel.value) return
    gsap.fromTo(
      panel.value,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
    )
    gsap.from(Array.from(panel.value.children), {
      y: -10,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      delay: 0.1
    })
  }
})
</script>

<template>
  <header ref="shell" class="fixed inset-x-0 top-0 z-50 px-3 pt-4 sm:px-5">
    <!-- Pas de transition CSS sur cette pilule : fond, ombre et padding sont pilotés par GSAP. -->
    <div
      ref="pill"
      class="mx-auto w-full max-w-[1200px] rounded-2xl px-4 backdrop-blur-md sm:px-6"
      :class="scrolled ? 'ring-1 ring-ink-900/5' : 'ring-1 ring-white/12'"
    >
      <div class="flex items-center justify-between gap-6">
        <NuxtLink
          ref="brand"
          to="/"
          class="group flex items-center gap-3"
          aria-label="LENG GROUPE — accueil"
        >
          <span
            class="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-500 font-display text-lg font-extrabold text-white transition-transform duration-300 group-hover:-rotate-6"
          >
            L
          </span>
          <span class="leading-none">
            <span
              class="block font-display text-lg font-extrabold tracking-tight transition-colors duration-300 sm:text-xl"
              :class="scrolled ? 'text-ink-950' : 'text-white'"
            >
              LENG GROUPE
            </span>
            <span
              class="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300"
              :class="scrolled ? 'text-ink-400' : 'text-white/55'"
            >
              Agence BTP
            </span>
          </span>
        </NuxtLink>

        <nav ref="links" class="hidden items-center gap-0.5 lg:flex">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300"
            :class="
              scrolled
                ? 'text-ink-600 hover:bg-ink-50 hover:text-ink-950'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            "
            :active-class="scrolled ? '!text-brand-600' : '!text-brand-300'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div ref="actions" class="flex items-center gap-2 sm:gap-3">
          <a
            :href="site.phoneHref"
            class="hidden text-sm font-semibold transition-colors duration-300 xl:block"
            :class="scrolled ? 'text-ink-700 hover:text-brand-600' : 'text-white/80 hover:text-white'"
          >
            {{ site.phone }}
          </a>

          <NuxtLink
            to="/devis"
            class="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 sm:inline-flex"
            :class="scrolled ? 'bg-ink-950 hover:bg-brand-600' : 'bg-brand-500 hover:bg-brand-600'"
          >
            Demander un devis
          </NuxtLink>

          <button
            type="button"
            class="grid size-11 place-items-center rounded-full ring-1 transition-colors duration-300 lg:hidden"
            :class="scrolled ? 'ring-ink-200' : 'ring-white/25'"
            :aria-expanded="open"
            aria-label="Ouvrir le menu"
            @click="open = !open"
          >
            <span class="relative block h-3.5 w-5">
              <span
                class="absolute inset-x-0 top-0 h-0.5 rounded transition-all duration-300"
                :class="[scrolled ? 'bg-ink-900' : 'bg-white', open && 'translate-y-1.5 rotate-45']"
              />
              <span
                class="absolute inset-x-0 top-1.5 h-0.5 rounded transition-all duration-300"
                :class="[scrolled ? 'bg-ink-900' : 'bg-white', open && 'opacity-0']"
              />
              <span
                class="absolute inset-x-0 top-3 h-0.5 rounded transition-all duration-300"
                :class="[scrolled ? 'bg-ink-900' : 'bg-white', open && '-translate-y-1.5 -rotate-45']"
              />
            </span>
          </button>
        </div>
      </div>

      <nav
        v-if="open"
        ref="panel"
        class="overflow-hidden lg:hidden"
        :class="scrolled ? 'border-t border-ink-100' : 'border-t border-white/10'"
      >
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="block rounded-full px-3 py-3 font-medium transition-colors first:mt-3"
          :class="scrolled ? 'text-ink-700 hover:bg-ink-50' : 'text-white/85 hover:bg-white/10'"
          :active-class="scrolled ? '!text-brand-600' : '!text-brand-300'"
        >
          {{ item.label }}
        </NuxtLink>

        <NuxtLink
          to="/devis"
          class="my-3 block rounded-full bg-brand-500 px-4 py-3 text-center font-semibold text-white"
        >
          Demander un devis
        </NuxtLink>

        <a
          :href="site.phoneHref"
          class="mb-3 block px-3 pb-1 text-center text-sm font-semibold"
          :class="scrolled ? 'text-ink-600' : 'text-white/70'"
        >
          {{ site.phone }}
        </a>
      </nav>
    </div>
  </header>
</template>
