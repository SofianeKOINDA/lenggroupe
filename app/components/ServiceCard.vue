<script setup lang="ts">
import type { Service } from '~/data/services'

defineProps<{ service: Service; index: number }>()
</script>

<template>
  <NuxtLink
    :to="`/services#${service.slug}`"
    class="group relative flex flex-col overflow-hidden rounded-xl bg-white p-7 ring-1 ring-ink-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/10"
  >
    <span
      class="absolute right-6 top-5 font-display text-5xl font-extrabold text-ink-50 transition group-hover:text-brand-50"
    >
      {{ String(index + 1).padStart(2, '0') }}
    </span>

    <div
      class="relative grid size-12 place-items-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="size-6">
        <path d="M3 21h18M5 21V9l7-5 7 5v12M9.5 21v-5h5v5" />
      </svg>
    </div>

    <h3 class="relative mt-5 text-lg font-bold leading-snug group-hover:text-brand-600">
      {{ service.title }}
    </h3>
    <p class="relative mt-3 flex-1 text-sm leading-relaxed text-ink-500">
      {{ service.short }}
    </p>
    <span
      class="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-950 transition group-hover:gap-3 group-hover:text-brand-600"
    >
      En savoir plus
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  </NuxtLink>
</template>
