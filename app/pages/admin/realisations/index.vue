<script setup lang="ts">
import type { AdminProjectRow } from '~/composables/useAdminContent'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Réalisations — LENG GROUPE' })

const { items, pending, refresh, remove, move, togglePublished } =
  useAdminCollection<AdminProjectRow>('projects')

await refresh()

async function destroy(project: AdminProjectRow) {
  if (!confirm(`Supprimer « ${project.title} » ? Cette action est définitive.`)) return
  await remove(project.id)
}
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-extrabold text-ink-950">Réalisations</h1>
        <p class="mt-1 text-sm text-ink-500">
          L'ordre ci-dessous est celui du site. Les trois premières apparaissent sur l'accueil.
        </p>
      </div>
      <NuxtLink to="/admin/realisations/nouveau" class="adm-btn-primary">
        + Ajouter une réalisation
      </NuxtLink>
    </header>

    <p v-if="pending && !items.length" class="mt-8 text-sm text-ink-400">Chargement…</p>

    <ul v-else class="mt-6 space-y-3">
      <li
        v-for="(project, i) in items"
        :key="project.id"
        class="adm-card flex flex-wrap items-center gap-4 p-4"
        :class="!project.published && 'opacity-70'"
      >
        <img
          v-if="project.cover"
          :src="project.cover"
          alt=""
          class="size-16 shrink-0 rounded-lg object-cover ring-1 ring-ink-200"
        />
        <div v-else class="size-16 shrink-0 rounded-lg bg-ink-100 ring-1 ring-ink-200" />

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="font-semibold text-ink-950">{{ project.title }}</p>
            <span v-if="!project.published" class="adm-chip bg-ink-100 text-ink-600 ring-ink-200">
              Brouillon
            </span>
          </div>
          <p class="mt-1 text-sm text-ink-500">
            {{ project.category }} · {{ project.location || 'lieu non précisé' }} ·
            {{ project.year || '—' }} · {{ project.status }}
          </p>
        </div>

        <div class="flex items-center gap-1">
          <button
            type="button"
            class="grid size-8 place-items-center rounded-lg text-ink-500 ring-1 ring-ink-200 transition hover:bg-ink-50 disabled:opacity-30"
            :disabled="i === 0"
            aria-label="Monter"
            @click="move(project.id, -1)"
          >
            ↑
          </button>
          <button
            type="button"
            class="grid size-8 place-items-center rounded-lg text-ink-500 ring-1 ring-ink-200 transition hover:bg-ink-50 disabled:opacity-30"
            :disabled="i === items.length - 1"
            aria-label="Descendre"
            @click="move(project.id, 1)"
          >
            ↓
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="adm-btn-ghost py-2 text-xs" @click="togglePublished(project)">
            {{ project.published ? 'Dépublier' : 'Publier' }}
          </button>
          <NuxtLink :to="`/admin/realisations/${project.id}`" class="adm-btn-ghost py-2 text-xs">
            Modifier
          </NuxtLink>
          <button type="button" class="adm-btn-danger py-2 text-xs" @click="destroy(project)">
            Supprimer
          </button>
        </div>
      </li>
    </ul>

    <p v-if="!pending && !items.length" class="adm-card mt-6 p-10 text-center text-sm text-ink-400">
      Aucune réalisation. Ajoutez votre premier chantier.
    </p>
  </div>
</template>
