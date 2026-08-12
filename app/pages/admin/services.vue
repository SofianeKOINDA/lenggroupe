<script setup lang="ts">
import type { AdminServiceRow } from '~/composables/useAdminContent'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Services — LENG GROUPE' })

const blank = () => ({
  title: '',
  short: '',
  description: '',
  image: '',
  points: [] as string[],
  published: true
})
</script>

<template>
  <AdminCollectionManager
    name="services"
    title="Services"
    description="Les prestations proposées sur le site. Elles alimentent la page Services, le pied de page et la liste déroulante du formulaire de devis."
    add-label="Ajouter un service"
    :blank="blank"
    :name-of="(s: AdminServiceRow) => s.title"
  >
    <template #empty>Aucun service publié.</template>

    <template #row="{ item }">
      <div class="flex flex-wrap items-center gap-2">
        <p class="font-semibold text-ink-950">{{ item.title }}</p>
        <span v-if="!item.published" class="adm-chip bg-ink-100 text-ink-600 ring-ink-200">
          Brouillon
        </span>
      </div>
      <p class="mt-1 line-clamp-1 text-sm text-ink-500">{{ item.short }}</p>
    </template>

    <template #form="{ form }">
      <label class="block">
        <span class="adm-label">Titre *</span>
        <input v-model="form.title" type="text" required class="adm-input" placeholder="Construction & gros œuvre" />
      </label>

      <label class="block">
        <span class="adm-label">Résumé court</span>
        <input
          v-model="form.short"
          type="text"
          class="adm-input"
          placeholder="Villas, immeubles R+1 à R+4, bâtiments administratifs."
        />
        <span class="mt-1 block text-xs text-ink-400">Affiché sur la vignette de la page d'accueil.</span>
      </label>

      <label class="block">
        <span class="adm-label">Description complète</span>
        <textarea v-model="form.description" rows="5" class="adm-input" />
      </label>

      <AdminImageField v-model="form.image" label="Illustration" />

      <AdminStringList
        v-model="form.points"
        label="Points détaillés"
        placeholder="Terrassement et fondations"
        hint="Listés sous la description, sur la page Services."
      />
    </template>
  </AdminCollectionManager>
</template>
