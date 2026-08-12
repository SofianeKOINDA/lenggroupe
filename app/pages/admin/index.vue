<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Tableau de bord — LENG GROUPE' })

type Stats = {
  days: number
  totals: { views: number; visitors: number; leads: number; conversion: number; newLeads: number }
  previous: { views: number; visitors: number; leads: number; conversion: number }
  timeline: { day: string; views: number; visitors: number; leads: number }[]
  topPages: { path: string; views: number; visitors: number }[]
  devices: { device: string; visitors: number }[]
  sources: { source: string; views: number }[]
  leadsByStatus: { status: LeadStatus; total: number }[]
  leadsByService: { service: string; total: number }[]
}

const days = ref(30)
const RANGES = [
  { value: 7, label: '7 jours' },
  { value: 30, label: '30 jours' },
  { value: 90, label: '90 jours' }
]

const { data: stats, pending } = await useFetch<Stats>('/api/admin/stats', {
  query: { days },
  default: () => null as unknown as Stats
})

const { data: recent } = await useFetch<{ items: Lead[] }>('/api/admin/leads', {
  query: { limit: 6 },
  default: () => ({ items: [] })
})

const statusRows = computed(() =>
  LEAD_STATUSES.map((status) => ({
    status,
    label: LEAD_STATUS[status].label,
    chip: LEAD_STATUS[status].chip,
    total: stats.value?.leadsByStatus.find((s) => s.status === status)?.total ?? 0
  }))
)
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-extrabold text-ink-950">Tableau de bord</h1>
        <p class="mt-1 text-sm text-ink-500">
          Fréquentation du site et demandes reçues, mesurées sans cookie ni service tiers.
        </p>
      </div>

      <div class="flex rounded-lg bg-white p-1 ring-1 ring-ink-200">
        <button
          v-for="range in RANGES"
          :key="range.value"
          type="button"
          class="rounded-md px-3 py-1.5 text-sm font-semibold transition"
          :class="days === range.value ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-50'"
          @click="days = range.value"
        >
          {{ range.label }}
        </button>
      </div>
    </header>

    <div v-if="stats" class="mt-6 space-y-6" :class="pending && 'opacity-60 transition-opacity'">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatTile
          label="Visiteurs"
          :value="formatNumber(stats.totals.visitors)"
          :current="stats.totals.visitors"
          :previous="stats.previous.visitors"
        />
        <AdminStatTile
          label="Pages vues"
          :value="formatNumber(stats.totals.views)"
          :current="stats.totals.views"
          :previous="stats.previous.views"
        />
        <AdminStatTile
          label="Demandes"
          :value="formatNumber(stats.totals.leads)"
          :current="stats.totals.leads"
          :previous="stats.previous.leads"
        />
        <AdminStatTile
          label="Taux de conversion"
          :value="String(stats.totals.conversion).replace('.', ',')"
          unit="%"
          :current="stats.totals.conversion"
          :previous="stats.previous.conversion"
          hint="demandes / visiteurs"
        />
      </div>

      <AdminTrafficChart :points="stats.timeline" />
      <AdminLeadsChart :points="stats.timeline" />

      <div class="grid gap-4 lg:grid-cols-2">
        <AdminBarList
          title="Pages les plus vues"
          :rows="stats.topPages.map((p) => ({ label: p.path, value: p.views, sub: `${p.visitors} visiteurs` }))"
        />
        <AdminBarList
          title="Provenance des visites"
          :rows="stats.sources.map((s) => ({ label: s.source, value: s.views }))"
        />
        <AdminBarList
          title="Appareils"
          :rows="stats.devices.map((d) => ({ label: d.device, value: d.visitors }))"
        />
        <AdminBarList
          title="Services demandés"
          :rows="stats.leadsByService.map((s) => ({ label: s.service, value: s.total }))"
          empty="Aucune demande sur la période."
        />
      </div>

      <!-- Suivi des demandes -->
      <section class="adm-card p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="font-display text-base font-bold text-ink-950">Dernières demandes</h2>
          <NuxtLink to="/admin/demandes" class="text-sm font-semibold text-brand-600 hover:underline">
            Tout voir →
          </NuxtLink>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <NuxtLink
            v-for="row in statusRows"
            :key="row.status"
            :to="`/admin/demandes?status=${row.status}`"
            class="adm-chip"
            :class="row.chip"
          >
            {{ row.label }}
            <span class="font-bold tabular-nums">{{ row.total }}</span>
          </NuxtLink>
        </div>

        <ul v-if="recent.items.length" class="mt-5 divide-y divide-ink-100">
          <li v-for="lead in recent.items" :key="lead.id">
            <NuxtLink
              :to="`/admin/demandes?id=${lead.id}`"
              class="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 transition hover:bg-ink-50"
            >
              <span class="font-semibold text-ink-950">{{ lead.name }}</span>
              <span class="adm-chip" :class="LEAD_STATUS[lead.status].chip">
                {{ LEAD_STATUS[lead.status].label }}
              </span>
              <span v-if="lead.kind === 'devis'" class="text-xs font-semibold text-brand-600">
                Devis
              </span>
              <span class="min-w-0 flex-1 truncate text-sm text-ink-500">{{ lead.message }}</span>
              <span class="text-xs text-ink-400">{{ timeAgo(lead.createdAt) }}</span>
            </NuxtLink>
          </li>
        </ul>

        <p v-else class="mt-5 text-sm text-ink-400">Aucune demande reçue pour le moment.</p>
      </section>
    </div>
  </div>
</template>
