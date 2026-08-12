<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string
  /** Valeur de la période précédente, pour situer l'évolution. */
  previous?: number
  current?: number
  hint?: string
  unit?: string
}>()

/** Évolution en pourcentage. Nulle quand la période précédente est vide : on ne
 *  peut pas annoncer « +100 % » à partir de zéro sans induire en erreur. */
const change = computed(() => {
  if (props.previous === undefined || props.current === undefined) return null
  if (!props.previous) return null
  return Math.round(((props.current - props.previous) / props.previous) * 100)
})
</script>

<template>
  <div class="adm-card p-5">
    <p class="text-xs font-bold uppercase tracking-[0.14em] text-ink-400">{{ label }}</p>

    <p class="mt-3 font-display text-3xl font-extrabold tabular-nums text-ink-950">
      {{ value }}<span v-if="unit" class="ml-1 text-xl text-ink-400">{{ unit }}</span>
    </p>

    <div class="mt-2 flex items-center gap-2 text-xs">
      <span
        v-if="change !== null"
        class="inline-flex items-center gap-1 font-semibold"
        :class="change > 0 ? 'text-emerald-700' : change < 0 ? 'text-red-700' : 'text-ink-500'"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="size-3.5">
          <path v-if="change > 0" d="M12 19V5M5 12l7-7 7 7" />
          <path v-else-if="change < 0" d="M12 5v14M5 12l7 7 7-7" />
          <path v-else d="M5 12h14" />
        </svg>
        {{ change > 0 ? '+' : '' }}{{ change }} %
      </span>
      <span class="text-ink-400">{{ hint ?? 'vs période précédente' }}</span>
    </div>
  </div>
</template>
