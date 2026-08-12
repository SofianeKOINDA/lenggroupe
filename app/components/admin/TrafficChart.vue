<script setup lang="ts">
/**
 * Fréquentation jour par jour : visiteurs et pages vues sur un même axe — les
 * deux se comptent en visites, les superposer a du sens. Les demandes, qui se
 * comptent par unités, ont leur propre graphique : deux échelles sur un même
 * cadre donneraient une comparaison trompeuse.
 */
const props = defineProps<{ points: { day: string; views: number; visitors: number }[] }>()

const SERIES = [
  { key: 'visitors', label: 'Visiteurs', color: '#c05621' },
  { key: 'views', label: 'Pages vues', color: '#1d6fd0' }
] as const

// Repère fixe : le SVG est mis à l'échelle du conteneur, les proportions et
// l'épaisseur des traits restent identiques quelle que soit la largeur.
const W = 800
const H = 240
const PAD = { top: 16, right: 18, bottom: 26, left: 42 }

const plotW = W - PAD.left - PAD.right
const plotH = H - PAD.top - PAD.bottom

const max = computed(() => {
  const highest = Math.max(1, ...props.points.flatMap((p) => [p.views, p.visitors]))
  // Arrondi supérieur « rond » : l'axe se lit 0 / 25 / 50 plutôt que 0 / 23 / 46.
  const step = Math.pow(10, Math.floor(Math.log10(highest)))
  return Math.ceil(highest / step) * step
})

const stepX = computed(() => (props.points.length > 1 ? plotW / (props.points.length - 1) : 0))

const x = (i: number) => PAD.left + i * stepX.value
const y = (value: number) => PAD.top + plotH - (value / max.value) * plotH

const linePath = (key: 'views' | 'visitors') =>
  props.points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(' ')

const areaPath = (key: 'views' | 'visitors') => {
  if (!props.points.length) return ''
  const last = props.points.length - 1
  return `${linePath(key)} L${x(last).toFixed(1)} ${PAD.top + plotH} L${PAD.left} ${PAD.top + plotH} Z`
}

const ticks = computed(() => [0, max.value / 2, max.value])

/** Quatre dates réparties sur l'axe : au-delà, les libellés se chevauchent. */
const dayLabels = computed(() => {
  const n = props.points.length
  if (!n) return []
  const every = Math.max(1, Math.ceil(n / 5))
  return props.points
    .map((p, i) => ({ i, day: p.day }))
    .filter(({ i }) => i % every === 0 || i === n - 1)
})

const shortDay = (day: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(day))

/* ------------------------------------------------------------------ survol */

const hovered = ref<number | null>(null)
const plot = ref<SVGRectElement | null>(null)

function onMove(event: MouseEvent) {
  const rect = plot.value?.getBoundingClientRect()
  if (!rect || !props.points.length) return
  // Position ramenée au repère du SVG : le graphique est redimensionné en CSS.
  const ratio = (event.clientX - rect.left) / rect.width
  const index = Math.round(ratio * (props.points.length - 1))
  hovered.value = Math.min(props.points.length - 1, Math.max(0, index))
}

const active = computed(() => (hovered.value === null ? null : props.points[hovered.value]))

/** Position du panneau de survol, en pourcentage de la largeur du graphique. */
const tooltipLeft = computed(() => {
  if (hovered.value === null) return '0%'
  return `${(x(hovered.value) / W) * 100}%`
})
const tooltipFlip = computed(() => hovered.value !== null && x(hovered.value) > W * 0.62)
</script>

<template>
  <figure class="adm-card p-5">
    <figcaption class="flex flex-wrap items-baseline justify-between gap-3">
      <h2 class="font-display text-base font-bold text-ink-950">Fréquentation du site</h2>
      <div class="flex items-center gap-4 text-xs font-medium text-ink-500">
        <span v-for="s in SERIES" :key="s.key" class="inline-flex items-center gap-1.5">
          <span class="size-2.5 rounded-full" :style="{ background: s.color }" />
          {{ s.label }}
        </span>
      </div>
    </figcaption>

    <div class="relative mt-4">
      <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" role="img" aria-label="Évolution du trafic">
        <!-- Grille : volontairement discrète, elle ne doit pas concurrencer les courbes -->
        <g>
          <line
            v-for="t in ticks"
            :key="t"
            :x1="PAD.left"
            :x2="W - PAD.right"
            :y1="y(t)"
            :y2="y(t)"
            stroke="#efece8"
            stroke-width="1"
          />
          <text
            v-for="t in ticks"
            :key="`l-${t}`"
            :x="PAD.left - 8"
            :y="y(t) + 4"
            text-anchor="end"
            font-size="11"
            fill="#9d9387"
          >
            {{ Math.round(t) }}
          </text>
        </g>

        <g v-for="s in SERIES" :key="s.key">
          <path :d="areaPath(s.key)" :fill="s.color" opacity="0.07" />
          <path
            :d="linePath(s.key)"
            fill="none"
            :stroke="s.color"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        </g>

        <text
          v-for="label in dayLabels"
          :key="label.day"
          :x="x(label.i)"
          :y="H - 8"
          text-anchor="middle"
          font-size="11"
          fill="#9d9387"
        >
          {{ shortDay(label.day) }}
        </text>

        <!-- Repère de survol -->
        <g v-if="hovered !== null">
          <line
            :x1="x(hovered)"
            :x2="x(hovered)"
            :y1="PAD.top"
            :y2="PAD.top + plotH"
            stroke="#c2bab0"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <circle
            v-for="s in SERIES"
            :key="s.key"
            :cx="x(hovered)"
            :cy="y(points[hovered]![s.key])"
            r="5"
            :fill="s.color"
            stroke="#fff"
            stroke-width="2"
          />
        </g>

        <rect
          ref="plot"
          :x="PAD.left"
          :y="PAD.top"
          :width="plotW"
          :height="plotH"
          fill="transparent"
          @mousemove="onMove"
          @mouseleave="hovered = null"
        />
      </svg>

      <div
        v-if="active"
        class="pointer-events-none absolute top-2 z-10 w-40 rounded-lg bg-ink-950 px-3 py-2 text-xs text-white shadow-lg"
        :style="{ left: tooltipLeft, transform: tooltipFlip ? 'translateX(-105%)' : 'translateX(5%)' }"
      >
        <p class="font-semibold">{{ shortDay(active.day) }}</p>
        <p v-for="s in SERIES" :key="s.key" class="mt-1 flex items-center gap-2">
          <span class="size-2 rounded-full" :style="{ background: s.color }" />
          <span class="text-ink-300">{{ s.label }}</span>
          <span class="ml-auto font-semibold tabular-nums">{{ active[s.key] }}</span>
        </p>
      </div>
    </div>
  </figure>
</template>
