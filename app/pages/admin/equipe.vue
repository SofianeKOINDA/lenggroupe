<script setup lang="ts">
import type { AdminMemberRow } from '~/composables/useAdminContent'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Équipe — LENG GROUPE' })

const blank = () => ({ name: '', role: '', photo: '', bio: '', published: true })
</script>

<template>
  <AdminCollectionManager
    name="team"
    title="Équipe"
    description="Présentés sur la page À propos. La première personne de la liste signe la citation de la page d'accueil."
    add-label="Ajouter un membre"
    :blank="blank"
    :name-of="(m: AdminMemberRow) => m.name"
  >
    <template #empty>Aucun membre enregistré.</template>

    <template #row="{ item }">
      <div class="flex items-center gap-3">
        <img
          v-if="item.photo"
          :src="item.photo"
          alt=""
          class="size-11 rounded-full object-cover object-top ring-1 ring-ink-200"
        />
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <p class="font-semibold text-ink-950">{{ item.name }}</p>
            <span v-if="!item.published" class="adm-chip bg-ink-100 text-ink-600 ring-ink-200">
              Brouillon
            </span>
          </div>
          <p class="mt-0.5 text-sm text-ink-500">{{ item.role }}</p>
        </div>
      </div>
    </template>

    <template #form="{ form }">
      <label class="block">
        <span class="adm-label">Nom complet *</span>
        <input v-model="form.name" type="text" required class="adm-input" />
      </label>

      <label class="block">
        <span class="adm-label">Fonction</span>
        <input
          v-model="form.role"
          type="text"
          class="adm-input"
          placeholder="Fondateur & Directeur Général"
        />
      </label>

      <AdminImageField
        v-model="form.photo"
        label="Photo"
        hint="Portrait cadré serré, de préférence carré."
      />

      <label class="block">
        <span class="adm-label">Présentation</span>
        <textarea v-model="form.bio" rows="5" class="adm-input" />
      </label>
    </template>
  </AdminCollectionManager>
</template>
