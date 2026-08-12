<script setup lang="ts">
import type { AdminReviewRow } from '~/composables/useAdminContent'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Avis clients — LENG GROUPE' })

const projects = useAdminCollection('projects')
await projects.refresh()

const blank = () => ({
  author: '',
  role: '',
  project: '',
  rating: '',
  date: new Date().toISOString().slice(0, 10),
  quote: '',
  published: true
})
</script>

<template>
  <AdminCollectionManager
    name="reviews"
    title="Avis clients"
    description="La section « avis » reste masquée sur le site tant qu'aucun témoignage n'est publié."
    add-label="Ajouter un avis"
    :blank="blank"
    :name-of="(r: AdminReviewRow) => r.author"
  >
    <template #empty>
      Aucun avis publié — la section correspondante n'apparaît pas sur le site.
    </template>

    <template #row="{ item }">
      <div class="flex flex-wrap items-center gap-2">
        <p class="font-semibold text-ink-950">{{ item.author }}</p>
        <span v-if="item.rating" class="text-sm text-brand-600">
          {{ '★'.repeat(item.rating) }}<span class="text-ink-300">{{ '★'.repeat(5 - item.rating) }}</span>
        </span>
        <span v-if="!item.published" class="adm-chip bg-ink-100 text-ink-600 ring-ink-200">
          Brouillon
        </span>
      </div>
      <p class="mt-1 line-clamp-1 text-sm text-ink-500">« {{ item.quote }} »</p>
    </template>

    <template #form="{ form }">
      <div
        class="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200"
      >
        N'enregistrez que des témoignages réellement recueillis, avec l'accord de la personne citée.
        Un avis inventé est sanctionné par Google et par le droit de la consommation.
      </div>

      <label class="block">
        <span class="adm-label">Nom de la personne *</span>
        <input v-model="form.author" type="text" required class="adm-input" />
      </label>

      <label class="block">
        <span class="adm-label">Fonction / entreprise</span>
        <input v-model="form.role" type="text" class="adm-input" placeholder="Directeur, SAFINE" />
      </label>

      <div class="grid gap-5 sm:grid-cols-2">
        <label class="block">
          <span class="adm-label">Note</span>
          <select v-model="form.rating" class="adm-input">
            <option value="">Sans note</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }} / 5</option>
          </select>
        </label>

        <label class="block">
          <span class="adm-label">Date de recueil</span>
          <input v-model="form.date" type="date" class="adm-input" />
        </label>
      </div>

      <label class="block">
        <span class="adm-label">Projet concerné</span>
        <select v-model="form.project" class="adm-input">
          <option value="">Aucun</option>
          <option v-for="p in projects.items.value" :key="p.id" :value="p.slug">{{ p.title }}</option>
        </select>
        <span class="mt-1 block text-xs text-ink-400">
          Ajoute un lien « Voir le projet » sous le témoignage.
        </span>
      </label>

      <label class="block">
        <span class="adm-label">Témoignage *</span>
        <textarea v-model="form.quote" rows="5" required class="adm-input" />
      </label>
    </template>
  </AdminCollectionManager>
</template>
