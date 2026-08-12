<script setup lang="ts" generic="T extends AdminMeta">
import type { AdminMeta, CollectionName } from '~/composables/useAdmin'

/**
 * Écran type d'une collection de contenu : liste ordonnée, panneau d'édition,
 * publication et suppression. Services, FAQ, avis et équipe partagent
 * exactement ces gestes — seuls leurs champs diffèrent, fournis en slot.
 */
const props = defineProps<{
  name: CollectionName
  title: string
  description: string
  addLabel: string
  /** Valeurs par défaut d'un nouvel élément. */
  blank: () => Record<string, any>
  /** Texte repris dans la demande de confirmation de suppression. */
  nameOf: (item: T) => string
  /** Masque les flèches quand l'ordre d'affichage n'a pas de sens. */
  orderable?: boolean
}>()

const { items, pending, refresh, save, remove, move, togglePublished } = useAdminCollection<T>(props.name)
await refresh()

const editing = ref<Record<string, any> | null>(null)
const editingId = ref<number | undefined>()
const saving = ref(false)
const error = ref('')

function open(item?: T) {
  editingId.value = item?.id
  // Copie profonde : on modifie un brouillon, la liste ne bouge qu'après
  // enregistrement (et « Annuler » ne laisse aucune trace).
  editing.value = item ? JSON.parse(JSON.stringify(item)) : props.blank()
  error.value = ''
}

async function submit() {
  if (!editing.value || saving.value) return
  saving.value = true
  error.value = ''
  try {
    await save(editing.value, editingId.value)
    editing.value = null
  } catch (e) {
    error.value = apiMessage(e, 'Enregistrement impossible.')
  } finally {
    saving.value = false
  }
}

async function destroy(item: T) {
  if (!confirm(`Supprimer « ${props.nameOf(item)} » ? Cette action est définitive.`)) return
  await remove(item.id)
}
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-extrabold text-ink-950">{{ title }}</h1>
        <p class="mt-1 max-w-xl text-sm text-ink-500">{{ description }}</p>
      </div>
      <button type="button" class="adm-btn-primary" @click="open()">+ {{ addLabel }}</button>
    </header>

    <p v-if="pending && !items.length" class="mt-8 text-sm text-ink-400">Chargement…</p>

    <p
      v-else-if="!items.length"
      class="adm-card mt-6 p-10 text-center text-sm text-ink-400"
    >
      <slot name="empty">Rien à afficher pour le moment.</slot>
    </p>

    <ul v-else class="mt-6 space-y-3">
      <li
        v-for="(item, i) in items"
        :key="item.id"
        class="adm-card flex flex-wrap items-center gap-4 p-4"
        :class="!item.published && 'opacity-70'"
      >
        <div class="min-w-0 flex-1">
          <slot name="row" :item="item" />
        </div>

        <div v-if="orderable !== false" class="flex items-center gap-1">
          <button
            type="button"
            class="grid size-8 place-items-center rounded-lg text-ink-500 ring-1 ring-ink-200 transition hover:bg-ink-50 disabled:opacity-30"
            :disabled="i === 0"
            aria-label="Monter"
            @click="move(item.id, -1)"
          >
            ↑
          </button>
          <button
            type="button"
            class="grid size-8 place-items-center rounded-lg text-ink-500 ring-1 ring-ink-200 transition hover:bg-ink-50 disabled:opacity-30"
            :disabled="i === items.length - 1"
            aria-label="Descendre"
            @click="move(item.id, 1)"
          >
            ↓
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="adm-btn-ghost py-2 text-xs" @click="togglePublished(item)">
            {{ item.published ? 'Dépublier' : 'Publier' }}
          </button>
          <button type="button" class="adm-btn-ghost py-2 text-xs" @click="open(item)">Modifier</button>
          <button type="button" class="adm-btn-danger py-2 text-xs" @click="destroy(item)">
            Supprimer
          </button>
        </div>
      </li>
    </ul>

    <!-- Panneau d'édition -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0"
      >
        <div
          v-if="editing"
          class="fixed inset-0 z-50 flex justify-end bg-ink-950/40"
          @click.self="editing = null"
        >
          <form
            class="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl"
            @submit.prevent="submit"
          >
            <header class="flex items-center justify-between gap-4 border-b border-ink-100 p-6">
              <h2 class="font-display text-lg font-extrabold text-ink-950">
                {{ editingId ? 'Modifier' : addLabel }}
              </h2>
              <button
                type="button"
                class="grid size-9 place-items-center rounded-lg text-ink-400 ring-1 ring-ink-200 hover:bg-ink-50"
                aria-label="Fermer"
                @click="editing = null"
              >
                ✕
              </button>
            </header>

            <div class="flex-1 space-y-5 p-6">
              <slot name="form" :form="editing" />

              <label class="flex items-center gap-2.5 text-sm font-semibold text-ink-800">
                <input v-model="editing.published" type="checkbox" class="size-4 accent-brand-600" />
                Visible sur le site
              </label>

              <p v-if="error" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
            </div>

            <footer class="flex gap-3 border-t border-ink-100 p-6">
              <button type="submit" class="adm-btn-primary flex-1" :disabled="saving">
                {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
              </button>
              <button type="button" class="adm-btn-ghost" @click="editing = null">Annuler</button>
            </footer>
          </form>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
