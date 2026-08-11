<script setup lang="ts">
import type { Project } from '~/data/projects'

defineProps<{ project: Project }>()

const statusStyle: Record<string, string> = {
  'Livré': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'En cours': 'bg-brand-50 text-brand-700 ring-brand-200',
  'En finition': 'bg-amber-50 text-amber-700 ring-amber-200',
  'À démarrer': 'bg-ink-100 text-ink-600 ring-ink-200'
}
</script>

<template>
  <NuxtLink
    :to="`/realisations/${project.slug}`"
    class="group flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-ink-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/10"
  >
    <div class="relative aspect-4/3 overflow-hidden bg-ink-100">
      <NuxtImg
        :src="project.cover"
        :alt="project.title"
        loading="lazy"
        width="640"
        height="480"
        class="size-full object-cover transition duration-700 group-hover:scale-105"
      />
      <span
        class="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset"
        :class="statusStyle[project.status]"
      >
        {{ project.status }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
        {{ project.category }}
      </p>
      <h3 class="mt-2 text-lg font-bold leading-snug group-hover:text-brand-600">
        {{ project.title }}
      </h3>
      <p class="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">
        {{ project.summary }}
      </p>
      <div
        class="mt-5 flex items-center gap-2 border-t border-ink-100 pt-4 text-sm text-ink-400"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-4">
          <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        {{ project.location }}
        <span class="ml-auto font-medium text-ink-500">{{ project.year }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
