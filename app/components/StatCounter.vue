<script setup lang="ts">
const props = defineProps<{ value: number; suffix?: string; label: string }>()

const display = ref(0)
const root = ref<HTMLElement | null>(null)

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    display.value = props.value
    return
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    display.value = props.value
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()

      const duration = 1400
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        // easeOutCubic
        display.value = Math.round(props.value * (1 - Math.pow(1 - p, 3)))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    { threshold: 0.4 }
  )

  if (root.value) observer.observe(root.value)
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <div ref="root" class="text-center">
    <p class="font-display text-4xl font-extrabold text-white sm:text-5xl">
      {{ display }}<span class="text-brand-500">{{ suffix }}</span>
    </p>
    <p class="mt-2 text-sm font-medium text-ink-400">{{ label }}</p>
  </div>
</template>
