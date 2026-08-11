<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  text?: string
  align?: 'left' | 'center'
  invert?: boolean
}>()
</script>

<template>
  <div
    class="max-w-2xl"
    :class="align === 'center' && 'mx-auto text-center'"
  >
    <p
      v-if="eyebrow"
      class="mb-3 text-xs font-bold uppercase tracking-[0.22em]"
      :class="invert ? 'text-brand-400' : 'text-brand-600'"
    >
      {{ eyebrow }}
    </p>
    <h2
      class="text-3xl font-extrabold sm:text-4xl"
      :class="invert && 'text-white'"
    >
      {{ title }}
    </h2>
    <p
      v-if="text"
      class="mt-4 text-lg leading-relaxed"
      :class="invert ? 'text-ink-300' : 'text-ink-500'"
    >
      {{ text }}
    </p>
  </div>
</template>
