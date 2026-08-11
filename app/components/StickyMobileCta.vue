<script setup lang="ts">
import { site } from '~/data/site'

const bar = ref<HTMLElement | null>(null)
const route = useRoute()

// Sur la page devis, la barre ferait doublon avec le formulaire lui-même.
const hidden = computed(() => route.path === '/devis' || route.path === '/merci')

onMounted(() => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()
  const gsap = $gsap as typeof import('gsap').default
  const ScrollTrigger = $ScrollTrigger as typeof import('gsap/ScrollTrigger').ScrollTrigger

  gsap.set(bar.value, { yPercent: 130 })

  // La barre n'apparaît qu'une fois le hero dépassé, pour ne pas masquer
  // le CTA principal au premier écran.
  const trigger = ScrollTrigger.create({
    start: 'top -420',
    end: 99999,
    onToggle: (self) =>
      gsap.to(bar.value, {
        yPercent: self.isActive && !hidden.value ? 0 : 130,
        duration: 0.45,
        ease: 'power3.out'
      })
  })

  onBeforeUnmount(() => trigger.kill())
})

watch(hidden, (value) => {
  const gsap = useNuxtApp().$gsap as typeof import('gsap').default
  if (value) gsap.to(bar.value, { yPercent: 130, duration: 0.3, ease: 'power2.in' })
})
</script>

<template>
  <div
    ref="bar"
    class="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden"
  >
    <div class="flex items-center gap-2">
      <a
        :href="site.phoneHref"
        class="grid size-12 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-800 transition active:scale-95"
        aria-label="Appeler LENG GROUPE"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-5">
          <path
            d="M5 4h3l2 5-2.5 1.5a12 12 0 0 0 5.5 5.5L15 13.5l5 2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z"
          />
        </svg>
      </a>

      <a
        :href="site.whatsapp"
        target="_blank"
        rel="noopener"
        class="grid size-12 shrink-0 place-items-center rounded-full bg-[#25D366]/12 text-[#128C4B] transition active:scale-95"
        aria-label="Écrire sur WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" class="size-5">
          <path
            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.92-4.45 9.92-9.91C21.96 6.45 17.5 2 12.04 2Zm5.43 12.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z"
          />
        </svg>
      </a>

      <NuxtLink
        to="/devis"
        class="flex-1 rounded-full bg-brand-500 px-5 py-3.5 text-center font-semibold text-white transition active:scale-[0.98]"
      >
        Devis gratuit
      </NuxtLink>
    </div>
  </div>
</template>
