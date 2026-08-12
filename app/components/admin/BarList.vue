<script setup lang="ts">
/**
 * Classement simple : la longueur de la barre porte la comparaison, la couleur
 * ne code rien (une seule teinte pour toutes les lignes). Le chiffre est écrit
 * à droite, donc la lecture ne dépend jamais de la couleur.
 */
const props = defineProps<{
  title: string
  rows: { label: string; value: number; sub?: string }[]
  empty?: string
}>()

const max = computed(() => Math.max(1, ...props.rows.map((r) => r.value)))
</script>

<template>
  <section class="adm-card p-5">
    <h2 class="font-display text-base font-bold text-ink-950">{{ title }}</h2>

    <p v-if="!rows.length" class="mt-6 text-sm text-ink-400">
      {{ empty ?? 'Aucune donnée sur la période.' }}
    </p>

    <ul v-else class="mt-4 space-y-2.5">
      <li v-for="row in rows" :key="row.label" class="relative">
        <div
          class="absolute inset-y-0 left-0 rounded-md bg-brand-50"
          :style="{ width: `${(row.value / max) * 100}%` }"
        />
        <div class="relative flex items-center gap-3 px-2.5 py-2 text-sm">
          <span class="min-w-0 flex-1 truncate text-ink-800" :title="row.label">{{ row.label }}</span>
          <span v-if="row.sub" class="shrink-0 text-xs text-ink-400">{{ row.sub }}</span>
          <span class="shrink-0 font-semibold tabular-nums text-ink-950">{{ row.value }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>
