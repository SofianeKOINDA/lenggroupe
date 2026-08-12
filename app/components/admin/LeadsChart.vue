<script setup lang="ts">
/**
 * Demandes reçues par jour. Série unique : le titre suffit à l'identifier, pas
 * besoin de légende. L'échelle est propre à ce graphique — quelques demandes
 * par jour et quelques centaines de pages vues ne partagent pas d'axe.
 */
const props = defineProps<{ points: { day: string; leads: number }[] }>()

const W = 800
const H = 160
const PAD = { top: 14, right: 18, bottom: 26, left: 42 }

const plotW = W - PAD.left - PAD.right
const plotH = H - PAD.top - PAD.bottom

const max = computed(() => Math.max(1, ...props.points.map((p) => p.leads)))
const total = computed(() => props.points.reduce((sum, p) => sum + p.leads, 0))

const slot = computed(() => (props.points.length ? plotW / props.points.length : plotW))
// 2 px de fond entre deux barres : elles restent distinctes sans trait de séparation.
const barWidth = computed(() => Math.max(2, slot.value - 2))

const barX = (i: number) => PAD.left + i * slot.value + 1
const barHeight = (value: number) => (value / max.value) * plotH
const barY = (value: number) => PAD.top + plotH - barHeight(value)

const hovered = ref<number | null>(null)

const shortDay = (day: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(day))

const dayLabels = computed(() => {
  const n = props.points.length
  if (!n) return []
  const every = Math.max(1, Math.ceil(n / 5))
  return props.points.map((p, i) => ({ i, day: p.day })).filter(({ i }) => i % every === 0 || i === n - 1)
})
</script>

<template>
  <figure class="adm-card p-5">
    <figcaption class="flex flex-wrap items-baseline justify-between gap-3">
      <h2 class="font-display text-base font-bold text-ink-950">Demandes reçues</h2>
      <p class="text-xs font-medium text-ink-500">
        {{ total }} sur la période
      </p>
    </figcaption>

    <div class="relative mt-4">
      <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" role="img" aria-label="Demandes reçues par jour">
        <line
          :x1="PAD.left"
          :x2="W - PAD.right"
          :y1="PAD.top + plotH"
          :y2="PAD.top + plotH"
          stroke="#ddd8d1"
          stroke-width="1"
        />
        <text :x="PAD.left - 8" :y="PAD.top + 10" text-anchor="end" font-size="11" fill="#9d9387">
          {{ max }}
        </text>
        <text :x="PAD.left - 8" :y="PAD.top + plotH + 4" text-anchor="end" font-size="11" fill="#9d9387">
          0
        </text>

        <g v-for="(point, i) in points" :key="point.day">
          <!-- Zone de survol pleine hauteur : viser une barre de 3 px serait pénible -->
          <rect
            :x="barX(i)"
            :y="PAD.top"
            :width="barWidth"
            :height="plotH"
            fill="transparent"
            @mouseenter="hovered = i"
            @mouseleave="hovered = null"
          />
          <rect
            v-if="point.leads"
            :x="barX(i)"
            :y="barY(point.leads)"
            :width="barWidth"
            :height="barHeight(point.leads)"
            rx="3"
            fill="#c05621"
            :opacity="hovered === null || hovered === i ? 1 : 0.45"
            class="pointer-events-none transition-opacity"
          />
        </g>

        <text
          v-for="label in dayLabels"
          :key="label.day"
          :x="barX(label.i) + barWidth / 2"
          :y="H - 8"
          text-anchor="middle"
          font-size="11"
          fill="#9d9387"
        >
          {{ shortDay(label.day) }}
        </text>
      </svg>

      <div
        v-if="hovered !== null"
        class="pointer-events-none absolute top-0 z-10 rounded-lg bg-ink-950 px-3 py-2 text-xs text-white shadow-lg"
        :style="{
          left: `${(barX(hovered) / W) * 100}%`,
          transform: barX(hovered) > W * 0.7 ? 'translateX(-100%)' : 'none'
        }"
      >
        <span class="font-semibold">{{ points[hovered]!.leads }}</span>
        demande(s) · {{ shortDay(points[hovered]!.day) }}
      </div>
    </div>
  </figure>
</template>
