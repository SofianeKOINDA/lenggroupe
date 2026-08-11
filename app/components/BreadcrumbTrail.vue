<script setup lang="ts">
const props = defineProps<{
  /** Segments après l'accueil, du plus général au plus précis. Le dernier n'est pas cliquable. */
  trail: { label: string; to?: string }[]
  invert?: boolean
}>()

const full = computed(() => [{ label: 'Accueil', to: '/' }, ...props.trail])

useJsonLd(breadcrumbSchema(useSiteUrl(), full.value))
</script>

<template>
  <nav :aria-label="'Fil d’Ariane'" class="text-sm">
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
      <li v-for="(item, i) in full" :key="item.label" class="flex items-center gap-2">
        <NuxtLink
          v-if="item.to && i < full.length - 1"
          :to="item.to"
          class="transition-colors"
          :class="invert ? 'text-white/60 hover:text-white' : 'text-ink-500 hover:text-brand-600'"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else aria-current="page" :class="invert ? 'text-white/90' : 'text-ink-800'">
          {{ item.label }}
        </span>

        <svg
          v-if="i < full.length - 1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="size-3.5 shrink-0"
          :class="invert ? 'text-white/30' : 'text-ink-300'"
          aria-hidden="true"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
      </li>
    </ol>
  </nav>
</template>
