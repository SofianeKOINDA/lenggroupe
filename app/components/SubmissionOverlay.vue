<script setup lang="ts">
const props = defineProps<{
  /** Étapes du traitement, dans l'ordre. */
  steps: string[]
  /** Nombre d'étapes terminées. Égal à steps.length quand tout est fait. */
  done: number
}>()

const card = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)

const complete = computed(() => props.done >= props.steps.length)

onMounted(() => {
  const gsap = useNuxtApp().$gsap as typeof import('gsap').default
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Empêche le scroll de la page derrière le voile.
  const previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  onBeforeUnmount(() => {
    document.body.style.overflow = previousOverflow
  })

  if (reduced) return
  gsap.from(card.value, { y: 24, opacity: 0, scale: 0.96, duration: 0.45, ease: 'power3.out' })
})

// La barre suit la progression réelle, pas une animation décorative.
watch(
  () => props.done,
  (value) => {
    const gsap = useNuxtApp().$gsap as typeof import('gsap').default
    gsap.to(bar.value, {
      width: `${(value / props.steps.length) * 100}%`,
      duration: 0.5,
      ease: 'power2.out'
    })
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-70 grid place-items-center bg-ink-950/92 px-5 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div ref="card" class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
        <div class="flex items-center gap-4">
          <span
            class="grid size-11 shrink-0 place-items-center rounded-lg font-display text-lg font-extrabold text-white transition-colors duration-500"
            :class="complete ? 'bg-emerald-500' : 'bg-brand-500'"
          >
            <svg
              v-if="complete"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              class="size-6"
            >
              <path d="m5 13 4 4L19 7" />
            </svg>
            <template v-else>L</template>
          </span>
          <div>
            <p class="font-display text-lg font-extrabold text-ink-950">
              {{ complete ? 'Demande transmise' : 'Traitement en cours' }}
            </p>
            <p class="mt-0.5 text-sm text-ink-500">
              {{ complete ? 'Redirection…' : 'Merci de patienter quelques secondes.' }}
            </p>
          </div>
        </div>

        <div class="mt-7 h-1.5 overflow-hidden rounded-full bg-ink-100">
          <div
            ref="bar"
            class="h-full w-0 rounded-full transition-colors duration-500"
            :class="complete ? 'bg-emerald-500' : 'bg-brand-500'"
          />
        </div>

        <ul class="mt-7 space-y-4">
          <li
            v-for="(step, i) in steps"
            :key="step"
            class="flex items-center gap-3.5 text-sm transition-colors duration-300"
            :class="i <= done ? 'text-ink-800' : 'text-ink-300'"
          >
            <!-- Terminée -->
            <span
              v-if="i < done"
              class="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="size-3.5">
                <path d="m5 13 4 4L19 7" />
              </svg>
            </span>

            <!-- En cours -->
            <span
              v-else-if="i === done"
              class="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50"
            >
              <span
                class="size-3.5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
              />
            </span>

            <!-- À venir -->
            <span v-else class="grid size-6 shrink-0 place-items-center">
              <span class="size-2 rounded-full bg-ink-200" />
            </span>

            <span :class="i === done && 'font-semibold text-ink-950'">{{ step }}</span>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>
