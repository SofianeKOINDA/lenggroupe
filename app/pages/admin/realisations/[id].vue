<script setup lang="ts">
import type { AdminProjectRow } from '~/composables/useAdminContent'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const isNew = computed(() => route.params.id === 'nouveau')
const id = computed(() => (isNew.value ? undefined : Number(route.params.id)))

const { items, refresh, save } = useAdminCollection<AdminProjectRow>('projects')
if (!items.value.length) await refresh()

const form = reactive(emptyProject())

// Catégories déjà utilisées : proposées en suggestion pour éviter d'en créer
// une variante à chaque saisie (« Résidentiel » / « residentiel »).
const knownCategories = computed(() => [...new Set(items.value.map((p) => p.category))].filter(Boolean))

if (!isNew.value) {
  const existing = items.value.find((p) => p.id === id.value)
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Réalisation introuvable', fatal: true })
  }
  Object.assign(form, {
    ...existing,
    facts: existing.facts.map((f) => ({ ...f })),
    gallery: [...existing.gallery],
    study: { ...emptyProject().study, ...(existing.study ?? {}) }
  })
}

const saving = ref(false)
const error = ref('')

const addFact = () => form.facts.push({ label: '', value: '' })
const removeFact = (i: number) => form.facts.splice(i, 1)

async function submit() {
  if (saving.value) return
  saving.value = true
  error.value = ''

  try {
    await save({ ...form }, id.value)
    await navigateTo('/admin/realisations')
  } catch (e) {
    error.value = apiMessage(e, 'Enregistrement impossible.')
  } finally {
    saving.value = false
  }
}

useHead({ title: () => `${isNew.value ? 'Nouvelle réalisation' : form.title} — LENG GROUPE` })
</script>

<template>
  <form class="mx-auto max-w-3xl space-y-6" @submit.prevent="submit">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <NuxtLink to="/admin/realisations" class="text-sm font-semibold text-ink-500 hover:text-brand-600">
          ← Réalisations
        </NuxtLink>
        <h1 class="mt-1 font-display text-2xl font-extrabold text-ink-950">
          {{ isNew ? 'Nouvelle réalisation' : 'Modifier la réalisation' }}
        </h1>
      </div>

      <label class="flex items-center gap-2.5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-ink-200">
        <input v-model="form.published" type="checkbox" class="size-4 accent-brand-600" />
        Visible sur le site
      </label>
    </header>

    <!-- Identité -->
    <section class="adm-card space-y-5 p-6">
      <label class="block">
        <span class="adm-label">Titre *</span>
        <input v-model="form.title" type="text" required class="adm-input" placeholder="Villa R+1 contemporaine" />
      </label>

      <div class="grid gap-5 sm:grid-cols-2">
        <label class="block">
          <span class="adm-label">Catégorie *</span>
          <input
            v-model="form.category"
            type="text"
            required
            list="project-categories"
            class="adm-input"
            placeholder="Résidentiel"
          />
          <datalist id="project-categories">
            <option v-for="c in knownCategories" :key="c" :value="c" />
          </datalist>
        </label>

        <label class="block">
          <span class="adm-label">Avancement</span>
          <select v-model="form.status" class="adm-input">
            <option v-for="s in PROJECT_STATUSES" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>

        <label class="block">
          <span class="adm-label">Localisation</span>
          <input v-model="form.location" type="text" class="adm-input" placeholder="Ouagadougou" />
        </label>

        <label class="block">
          <span class="adm-label">Année</span>
          <input v-model="form.year" type="text" class="adm-input" placeholder="2025" />
        </label>
      </div>

      <label class="block">
        <span class="adm-label">Résumé</span>
        <textarea
          v-model="form.summary"
          rows="3"
          class="adm-input"
          placeholder="Deux ou trois phrases décrivant le chantier, affichées sur la vignette et en tête de page."
        />
      </label>
    </section>

    <!-- Images -->
    <section class="adm-card space-y-6 p-6">
      <AdminImageField
        v-model="form.cover"
        label="Photo principale"
        hint="Utilisée sur la vignette, en haut de la page projet et lors des partages sur les réseaux."
      />
      <AdminGalleryField v-model="form.gallery" />
    </section>

    <!-- Chiffres clés -->
    <section class="adm-card space-y-4 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-display text-base font-bold text-ink-950">Chiffres clés</h2>
          <p class="mt-1 text-sm text-ink-500">
            Affichés en bandeau sous le titre du projet. Quatre suffisent.
          </p>
        </div>
        <button type="button" class="adm-btn-ghost py-2 text-xs" @click="addFact">+ Ajouter</button>
      </div>

      <div v-for="(fact, i) in form.facts" :key="i" class="flex flex-wrap items-center gap-2">
        <input v-model="fact.label" type="text" class="adm-input flex-1" placeholder="Typologie" />
        <input v-model="fact.value" type="text" class="adm-input flex-1" placeholder="Villa R+1" />
        <button
          type="button"
          class="grid size-10 place-items-center rounded-lg text-ink-400 ring-1 ring-ink-200 hover:bg-red-50 hover:text-red-700"
          aria-label="Retirer"
          @click="removeFact(i)"
        >
          ✕
        </button>
      </div>
    </section>

    <!-- Étude de cas -->
    <section class="adm-card space-y-5 p-6">
      <div>
        <h2 class="font-display text-base font-bold text-ink-950">Étude de cas (facultatif)</h2>
        <p class="mt-1 text-sm text-ink-500">
          Laissez ces quatre champs vides pour ne pas afficher la section sur le site.
        </p>
      </div>

      <label class="block">
        <span class="adm-label">Le contexte</span>
        <textarea v-model="form.study.context" rows="2" class="adm-input" />
      </label>
      <label class="block">
        <span class="adm-label">L'enjeu</span>
        <textarea v-model="form.study.challenge" rows="2" class="adm-input" />
      </label>
      <label class="block">
        <span class="adm-label">Notre réponse</span>
        <textarea v-model="form.study.answer" rows="2" class="adm-input" />
      </label>
      <label class="block">
        <span class="adm-label">Le résultat</span>
        <textarea v-model="form.study.result" rows="2" class="adm-input" />
      </label>
    </section>

    <p v-if="error" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

    <div class="flex flex-wrap gap-3">
      <button type="submit" class="adm-btn-primary" :disabled="saving">
        {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
      <NuxtLink to="/admin/realisations" class="adm-btn-ghost">Annuler</NuxtLink>
    </div>
  </form>
</template>
