<script setup lang="ts">
import type { FaqItem } from '~/data/faq'

const props = defineProps<{ items: FaqItem[] }>()

const openIndex = ref<number | null>(0)
const panels = ref<HTMLElement[]>([])

function setPanel(el: Element | ComponentPublicInstance | null, i: number) {
  if (el instanceof HTMLElement) panels.value[i] = el
}

function toggle(i: number) {
  const gsap = useNuxtApp().$gsap as typeof import('gsap').default
  const previous = openIndex.value
  openIndex.value = previous === i ? null : i

  if (previous !== null && previous !== i && panels.value[previous]) {
    gsap.to(panels.value[previous], { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' })
  }

  nextTick(() => {
    const el = panels.value[i]
    if (!el) return
    if (openIndex.value === i) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' })
    }
  })
}

// Le premier panneau est ouvert au chargement : pas d'animation à jouer.
onMounted(() => {
  const gsap = useNuxtApp().$gsap as typeof import('gsap').default
  props.items.forEach((_, i) => {
    if (i !== openIndex.value && panels.value[i]) gsap.set(panels.value[i], { height: 0, opacity: 0 })
  })
})
</script>

<template>
  <div class="divide-y divide-ink-100 overflow-hidden rounded-xl ring-1 ring-ink-100">
    <div v-for="(item, i) in items" :key="item.question" class="bg-white">
      <h3>
        <button
          type="button"
          class="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-ink-50 sm:px-8"
          :aria-expanded="openIndex === i"
          :aria-controls="`faq-panel-${i}`"
          @click="toggle(i)"
        >
          <span class="font-display text-base font-bold text-ink-950 sm:text-lg">
            {{ item.question }}
          </span>
          <span
            class="grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300"
            :class="openIndex === i ? 'rotate-45 bg-brand-500 text-white' : 'bg-ink-100 text-ink-600'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="size-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>
      </h3>

      <div :id="`faq-panel-${i}`" :ref="(el) => setPanel(el, i)" class="overflow-hidden">
        <p class="px-6 pb-6 text-ink-500 sm:px-8 sm:pb-7">{{ item.answer }}</p>
      </div>
    </div>
  </div>
</template>
