<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Demandes — LENG GROUPE' })

const route = useRoute()
const router = useRouter()

const status = ref(String(route.query.status ?? ''))
const kind = ref('')
const search = ref('')
const items = ref<Lead[]>([])
const counts = ref<Record<string, number>>({})
const total = ref(0)
const pending = ref(false)
const selected = ref<Lead | null>(null)
const saving = ref(false)
const notes = ref('')

const newLeads = useState('admin:new-leads', () => 0)

async function load() {
  pending.value = true
  try {
    const data = await adminFetch<{ items: Lead[]; total: number; counts: Record<string, number> }>(
      '/api/admin/leads',
      { query: { status: status.value, kind: kind.value, q: search.value, limit: 200 } }
    )
    items.value = data.items
    total.value = data.total
    counts.value = data.counts
    newLeads.value = data.counts.nouveau ?? 0
  } finally {
    pending.value = false
  }
}

/** La recherche attend une pause de frappe avant d'interroger le serveur. */
let timer: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(timer)
  timer = setTimeout(load, 300)
})
watch([status, kind], load)

await load()

// Arrivée depuis le tableau de bord avec ?id= : la demande s'ouvre directement.
onMounted(() => {
  const id = Number(route.query.id)
  if (id) open(items.value.find((l) => l.id === id) ?? null)
})

function open(lead: Lead | null) {
  selected.value = lead
  notes.value = lead?.notes ?? ''
  // L'identifiant reste dans l'URL : la page se partage et se recharge à l'identique.
  router.replace({ query: { ...route.query, id: lead?.id || undefined } })
}

async function update(payload: { status?: LeadStatus; notes?: string }) {
  if (!selected.value) return
  saving.value = true
  try {
    const updated = await adminFetch<Lead>(`/api/admin/leads/${selected.value.id}`, {
      method: 'PATCH',
      body: payload
    })
    selected.value = updated
    const index = items.value.findIndex((l) => l.id === updated.id)
    if (index >= 0) items.value[index] = updated
    await load()
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!selected.value) return
  if (!confirm(`Supprimer définitivement la demande de ${selected.value.name} ?`)) return
  await adminFetch(`/api/admin/leads/${selected.value.id}`, { method: 'DELETE' })
  open(null)
  await load()
}

const TABS = [
  { value: '', label: 'Toutes' },
  ...LEAD_STATUSES.map((s) => ({ value: s, label: LEAD_STATUS[s].label }))
]

const digits = (phone: string) => phone.replace(/[^\d]/g, '')
const whatsapp = (phone: string) => `https://wa.me/${digits(phone)}`
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-extrabold text-ink-950">Demandes</h1>
        <p class="mt-1 text-sm text-ink-500">
          {{ total }} demande(s) · les formulaires du site arrivent ici.
        </p>
      </div>
      <a href="/api/admin/leads/export" class="adm-btn-ghost" download>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-4">
          <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
        </svg>
        Exporter en CSV
      </a>
    </header>

    <!-- Filtres -->
    <div class="mt-6 flex flex-wrap items-center gap-2">
      <button
        v-for="tab in TABS"
        :key="tab.value"
        type="button"
        class="rounded-full px-4 py-2 text-sm font-semibold transition"
        :class="
          status === tab.value
            ? 'bg-ink-950 text-white'
            : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
        "
        @click="status = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.value && counts[tab.value]" class="ml-1 tabular-nums opacity-70">
          {{ counts[tab.value] }}
        </span>
      </button>

      <div class="ms-auto flex gap-2">
        <select v-model="kind" class="adm-input w-auto py-2">
          <option value="">Tous les types</option>
          <option value="devis">Demandes de devis</option>
          <option value="contact">Messages de contact</option>
        </select>
        <input v-model="search" type="search" placeholder="Rechercher…" class="adm-input w-auto py-2" />
      </div>
    </div>

    <!-- Liste -->
    <div class="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-ink-100">
      <p v-if="pending && !items.length" class="px-5 py-10 text-center text-sm text-ink-400">
        Chargement…
      </p>

      <p v-else-if="!items.length" class="px-5 py-14 text-center text-sm text-ink-400">
        Aucune demande ne correspond à ces filtres.
      </p>

      <ul v-else class="divide-y divide-ink-100">
        <li v-for="lead in items" :key="lead.id">
          <button
            type="button"
            class="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 px-5 py-4 text-left transition hover:bg-ink-50"
            :class="selected?.id === lead.id && 'bg-brand-50/60'"
            @click="open(lead)"
          >
            <span class="font-semibold text-ink-950">{{ lead.name }}</span>
            <span class="adm-chip" :class="LEAD_STATUS[lead.status].chip">
              {{ LEAD_STATUS[lead.status].label }}
            </span>
            <span
              v-if="lead.kind === 'devis'"
              class="adm-chip bg-brand-50 text-brand-700 ring-brand-200"
            >
              Devis
            </span>
            <span class="w-full truncate text-sm text-ink-500 sm:w-auto sm:flex-1">
              {{ lead.message }}
            </span>
            <span class="text-xs text-ink-400">{{ timeAgo(lead.createdAt) }}</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Fiche détaillée -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0"
      >
        <div v-if="selected" class="fixed inset-0 z-50 flex justify-end bg-ink-950/40" @click.self="open(null)">
          <aside class="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl">
            <header class="flex items-start justify-between gap-4 border-b border-ink-100 p-6">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
                  {{ selected.kind === 'devis' ? 'Demande de devis' : 'Message de contact' }}
                </p>
                <h2 class="mt-1 font-display text-xl font-extrabold text-ink-950">
                  {{ selected.name }}
                </h2>
                <p class="mt-1 text-sm text-ink-500">
                  Reçue le {{ formatDateTime(selected.createdAt) }}
                  <span v-if="selected.source"> · depuis {{ selected.source }}</span>
                </p>
              </div>
              <button
                type="button"
                class="grid size-9 shrink-0 place-items-center rounded-lg text-ink-400 ring-1 ring-ink-200 hover:bg-ink-50"
                aria-label="Fermer"
                @click="open(null)"
              >
                ✕
              </button>
            </header>

            <div class="flex-1 space-y-6 p-6">
              <!-- Contacter -->
              <div class="grid grid-cols-3 gap-2">
                <a :href="`tel:${selected.phone}`" class="adm-btn-ghost flex-col py-3 text-xs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="size-5">
                    <path
                      d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z"
                    />
                  </svg>
                  Appeler
                </a>
                <a
                  :href="whatsapp(selected.phone)"
                  target="_blank"
                  rel="noopener"
                  class="adm-btn-ghost flex-col py-3 text-xs"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" class="size-5">
                    <path
                      d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1-3.9-1.5-5.5-5.3-5.6-5.5-.2-.2-1-1.4-1-2.6s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.5-.3.3c-.1.1-.2.3 0 .5.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.5-.1l2 1c.2.1.4.2.4.3.1.2.1.7-.1 1.3Z"
                    />
                  </svg>
                  WhatsApp
                </a>
                <a
                  :href="selected.email ? `mailto:${selected.email}` : undefined"
                  class="adm-btn-ghost flex-col py-3 text-xs"
                  :class="!selected.email && 'pointer-events-none opacity-40'"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="size-5">
                    <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
                  </svg>
                  Email
                </a>
              </div>

              <!-- Coordonnées et projet -->
              <dl class="grid gap-x-6 gap-y-4 rounded-lg bg-ink-50 p-5 sm:grid-cols-2">
                <div>
                  <dt class="text-xs font-bold uppercase tracking-[0.12em] text-ink-400">Téléphone</dt>
                  <dd class="mt-1 font-medium text-ink-950">{{ selected.phone }}</dd>
                </div>
                <div v-if="selected.email">
                  <dt class="text-xs font-bold uppercase tracking-[0.12em] text-ink-400">Email</dt>
                  <dd class="mt-1 break-all font-medium text-ink-950">{{ selected.email }}</dd>
                </div>
                <div v-if="selected.service">
                  <dt class="text-xs font-bold uppercase tracking-[0.12em] text-ink-400">Service</dt>
                  <dd class="mt-1 font-medium text-ink-950">{{ selected.service }}</dd>
                </div>
                <div v-if="selected.budget">
                  <dt class="text-xs font-bold uppercase tracking-[0.12em] text-ink-400">Budget</dt>
                  <dd class="mt-1 font-medium text-ink-950">{{ selected.budget }}</dd>
                </div>
                <div v-if="selected.location">
                  <dt class="text-xs font-bold uppercase tracking-[0.12em] text-ink-400">Terrain</dt>
                  <dd class="mt-1 font-medium text-ink-950">{{ selected.location }}</dd>
                </div>
                <div v-if="selected.deadline">
                  <dt class="text-xs font-bold uppercase tracking-[0.12em] text-ink-400">Démarrage</dt>
                  <dd class="mt-1 font-medium text-ink-950">{{ selected.deadline }}</dd>
                </div>
              </dl>

              <div>
                <h3 class="adm-label">Message</h3>
                <p class="whitespace-pre-line rounded-lg border border-ink-100 p-4 text-sm leading-relaxed text-ink-700">
                  {{ selected.message }}
                </p>
              </div>

              <!-- Suivi -->
              <div>
                <h3 class="adm-label">Statut du dossier</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="s in LEAD_STATUSES"
                    :key="s"
                    type="button"
                    :disabled="saving"
                    class="rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset transition"
                    :class="
                      selected.status === s
                        ? LEAD_STATUS[s].chip
                        : 'bg-white text-ink-500 ring-ink-200 hover:bg-ink-50'
                    "
                    @click="update({ status: s })"
                  >
                    {{ LEAD_STATUS[s].label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="adm-label" for="lead-notes">Notes internes</label>
                <textarea
                  id="lead-notes"
                  v-model="notes"
                  rows="4"
                  class="adm-input"
                  placeholder="Compte rendu d'appel, visite planifiée, montant proposé…"
                />
                <button
                  type="button"
                  class="adm-btn-primary mt-3"
                  :disabled="saving || notes === selected.notes"
                  @click="update({ notes })"
                >
                  {{ saving ? 'Enregistrement…' : 'Enregistrer la note' }}
                </button>
              </div>
            </div>

            <footer class="border-t border-ink-100 p-6">
              <button type="button" class="adm-btn-danger w-full" @click="remove">
                Supprimer cette demande
              </button>
            </footer>
          </aside>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
