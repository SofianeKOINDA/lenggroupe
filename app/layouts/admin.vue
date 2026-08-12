<script setup lang="ts">
/**
 * Cadre commun aux écrans d'administration : navigation latérale à gauche sur
 * grand écran, tiroir escamotable sur mobile. Le site public et son en-tête ne
 * sont jamais chargés ici.
 */

const route = useRoute()
const open = ref(false)

const entries = [
  { to: '/admin', label: 'Tableau de bord', icon: 'grid' },
  { to: '/admin/demandes', label: 'Demandes', icon: 'inbox', badge: true },
  { to: '/admin/realisations', label: 'Réalisations', icon: 'building' },
  { to: '/admin/services', label: 'Services', icon: 'layers' },
  { to: '/admin/faq', label: 'FAQ', icon: 'help' },
  { to: '/admin/avis', label: 'Avis clients', icon: 'star' },
  { to: '/admin/equipe', label: 'Équipe', icon: 'users' },
  { to: '/admin/reglages', label: 'Réglages', icon: 'settings' }
] as const

const paths: Record<string, string> = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  inbox: 'M4 13h4l1.5 3h5L16 13h4M4 13 6 5h12l2 8v6H4z',
  building: 'M4 21V6l7-3 7 3v15M9 21v-4h6v4M8 9h2M14 9h2M8 13h2M14 13h2',
  layers: 'm12 3 8 5-8 5-8-5 8-5ZM4 13l8 5 8-5M4 17l8 5 8-5',
  help: 'M12 17h.01M9.2 9a3 3 0 1 1 4.2 2.8c-.8.4-1.4 1.1-1.4 2.2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z',
  star: 'm12 3 2.8 6 6.2.8-4.5 4.3 1.1 6.2L12 17.4 6.4 20.3l1.1-6.2L3 9.8 9.2 9 12 3Z',
  users: 'M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 20v-2a4 4 0 0 0-3-3.9M16 3.6a4 4 0 0 1 0 7.8',
  settings:
    'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8-3.5a8 8 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a8 8 0 0 0-2-1.2L15.2 3H8.8l-.4 2.7a8 8 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a8.1 8.1 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a8 8 0 0 0 2 1.2l.4 2.7h6.4l.4-2.7a8 8 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.06-.4.1-.8.1-1.2Z'
}

const newLeads = useState('admin:new-leads', () => 0)

async function refreshBadge() {
  try {
    const { counts } = await adminFetch<{ counts: Record<string, number> }>(
      '/api/admin/leads?limit=1'
    )
    newLeads.value = counts.nouveau ?? 0
  } catch {
    // Le compteur est un confort : son échec ne doit rien casser à l'écran.
  }
}

onMounted(refreshBadge)
watch(() => route.path, () => (open.value = false))

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

const isActive = (to: string) => (to === '/admin' ? route.path === to : route.path.startsWith(to))

// Le dashboard n'a rien à faire dans un index de moteur de recherche.
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
</script>

<template>
  <div class="min-h-dvh bg-ink-50 text-ink-800">
    <!-- Barre mobile -->
    <header
      class="sticky top-0 z-40 flex items-center gap-3 border-b border-ink-200 bg-white px-4 py-3 lg:hidden"
    >
      <button
        type="button"
        class="grid size-9 place-items-center rounded-lg ring-1 ring-ink-200"
        :aria-expanded="open"
        aria-label="Ouvrir le menu"
        @click="open = !open"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-5">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <p class="font-display text-sm font-extrabold tracking-tight">LENG GROUPE · Admin</p>
    </header>

    <div class="lg:flex">
      <!-- Navigation -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-64 shrink-0 -translate-x-full border-r border-ink-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0"
        :class="open && 'translate-x-0 shadow-2xl'"
      >
        <div class="flex h-full flex-col p-4">
          <div class="flex items-center justify-between px-2 py-3">
            <NuxtLink to="/admin" class="font-display text-base font-extrabold tracking-tight text-ink-950">
              LENG GROUPE
            </NuxtLink>
            <button
              type="button"
              class="text-ink-400 lg:hidden"
              aria-label="Fermer le menu"
              @click="open = false"
            >
              ✕
            </button>
          </div>

          <nav class="mt-4 flex-1 space-y-1">
            <NuxtLink
              v-for="entry in entries"
              :key="entry.to"
              :to="entry.to"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
              :class="
                isActive(entry.to)
                  ? 'bg-ink-950 text-white'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-950'
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-[18px] shrink-0"
              >
                <path :d="paths[entry.icon]" />
              </svg>
              {{ entry.label }}
              <span
                v-if="'badge' in entry && entry.badge && newLeads"
                class="ml-auto rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-white"
              >
                {{ newLeads }}
              </span>
            </NuxtLink>
          </nav>

          <div class="space-y-1 border-t border-ink-100 pt-4">
            <NuxtLink
              to="/"
              target="_blank"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="size-[18px]">
                <path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
              </svg>
              Voir le site
            </NuxtLink>
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              @click="logout"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="size-[18px]">
                <path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Se déconnecter
            </button>
          </div>
        </div>
      </aside>

      <!-- Voile mobile -->
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-ink-950/40 lg:hidden"
        @click="open = false"
      />

      <main class="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
        <slot />
      </main>
    </div>
  </div>
</template>
