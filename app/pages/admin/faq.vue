<script setup lang="ts">
import type { AdminFaqRow } from '~/composables/useAdminContent'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'FAQ — LENG GROUPE' })

const blank = () => ({ question: '', answer: '', published: true })
</script>

<template>
  <AdminCollectionManager
    name="faq"
    title="Questions fréquentes"
    description="Les cinq premières apparaissent sur l'accueil, toutes sur la page FAQ. Elles sont aussi transmises à Google en données structurées."
    add-label="Ajouter une question"
    :blank="blank"
    :name-of="(f: AdminFaqRow) => f.question"
  >
    <template #empty>Aucune question enregistrée.</template>

    <template #row="{ item }">
      <div class="flex flex-wrap items-center gap-2">
        <p class="font-semibold text-ink-950">{{ item.question }}</p>
        <span v-if="!item.published" class="adm-chip bg-ink-100 text-ink-600 ring-ink-200">
          Brouillon
        </span>
      </div>
      <p class="mt-1 line-clamp-1 text-sm text-ink-500">{{ item.answer }}</p>
    </template>

    <template #form="{ form }">
      <label class="block">
        <span class="adm-label">Question *</span>
        <input
          v-model="form.question"
          type="text"
          required
          class="adm-input"
          placeholder="Sous quel délai répondez-vous à une demande de devis ?"
        />
      </label>

      <label class="block">
        <span class="adm-label">Réponse *</span>
        <textarea v-model="form.answer" rows="7" required class="adm-input" />
        <span class="mt-1 block text-xs text-ink-400">
          Répondez précisément : Google affiche parfois ces réponses directement dans ses résultats.
        </span>
      </label>
    </template>
  </AdminCollectionManager>
</template>
