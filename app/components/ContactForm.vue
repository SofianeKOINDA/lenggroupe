<script setup lang="ts">
import { site } from '~/data/site'

const props = withDefaults(defineProps<{ detailed?: boolean }>(), { detailed: false })

const services = useServices()
const route = useRoute()

type Status = 'idle' | 'sending' | 'sent' | 'error'

const status = ref<Status>('idle')
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  service: '',
  budget: '',
  location: '',
  deadline: '',
  message: '',
  // Honeypot anti-spam : doit rester vide.
  company: ''
})

const budgets = [
  'Moins de 10 000 000 FCFA',
  '10 à 30 000 000 FCFA',
  '30 à 75 000 000 FCFA',
  'Plus de 75 000 000 FCFA',
  'À définir ensemble'
]

/**
 * Étapes réellement effectuées côté serveur : l'envoi, la validation des
 * champs obligatoires, puis l'enregistrement de la demande.
 */
const steps = ['Envoi de votre demande', 'Vérification des informations', 'Enregistrement du dossier']
const stepsDone = ref(0)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function submit() {
  if (status.value === 'sending') return
  status.value = 'sending'
  stepsDone.value = 0
  errorMessage.value = ''

  // La requête part tout de suite ; la séquence visuelle se déroule en parallèle
  // pour que l'utilisateur voie le traitement au lieu d'un saut de page brutal.
  const request = $fetch('/api/contact', {
    method: 'POST',
    // `source` : la page d'où part la demande, visible ensuite dans le dashboard.
    body: { ...form, kind: props.detailed ? 'devis' : 'contact', source: route.path }
  })
    .then(() => ({ ok: true as const }))
    .catch((e: unknown) => ({ ok: false as const, error: e }))

  for (let i = 0; i < steps.length - 1; i++) {
    await wait(750)
    stepsDone.value = i + 1
  }

  const result = await request

  if (!result.ok) {
    status.value = 'error'
    stepsDone.value = 0
    errorMessage.value =
      (result.error as { data?: { message?: string } })?.data?.message ??
      "L'envoi a échoué. Réessayez ou appelez-nous directement."
    return
  }

  // Dernière étape validée, puis courte respiration avant la redirection.
  stepsDone.value = steps.length
  status.value = 'sent'
  await wait(1100)

  // Page de remerciement dédiée : elle sert aussi de point de conversion
  // mesurable dans Analytics, ce qu'un état inline ne permet pas.
  await navigateTo({ path: '/merci', query: props.detailed ? { type: 'devis' } : undefined })
}
</script>

<template>
  <div class="rounded-xl bg-white p-7 ring-1 ring-ink-100 sm:p-9">
    <!-- Le voile de traitement reste affiché jusqu'à la redirection vers /merci -->
    <SubmissionOverlay
      v-if="status === 'sending' || status === 'sent'"
      :steps="steps"
      :done="stepsDone"
    />

    <form class="space-y-5" novalidate @submit.prevent="submit">
      <!-- Honeypot -->
      <div class="hidden" aria-hidden="true">
        <label>Société<input v-model="form.company" type="text" tabindex="-1" autocomplete="off" /></label>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <label class="block">
          <span class="mb-2 block text-sm font-semibold text-ink-800">Nom complet *</span>
          <input
            v-model.trim="form.name"
            type="text"
            required
            autocomplete="name"
            placeholder="Votre nom"
            class="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-semibold text-ink-800">Téléphone *</span>
          <input
            v-model.trim="form.phone"
            type="tel"
            required
            autocomplete="tel"
            placeholder="+226 ..."
            class="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
      </div>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold text-ink-800">Email</span>
        <input
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          placeholder="vous@exemple.com"
          class="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </label>

      <div v-if="detailed" class="grid gap-5 sm:grid-cols-2">
        <label class="block">
          <span class="mb-2 block text-sm font-semibold text-ink-800">Type de projet *</span>
          <select
            v-model="form.service"
            required
            class="w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="" disabled>Choisir un service</option>
            <option v-for="s in services" :key="s.slug" :value="s.title">{{ s.title }}</option>
            <option value="Autre">Autre</option>
          </select>
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-semibold text-ink-800">Budget estimé</span>
          <select
            v-model="form.budget"
            class="w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Non défini</option>
            <option v-for="b in budgets" :key="b" :value="b">{{ b }}</option>
          </select>
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-semibold text-ink-800">Localisation du terrain</span>
          <input
            v-model.trim="form.location"
            type="text"
            placeholder="Ville, quartier, secteur"
            class="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-semibold text-ink-800">Démarrage souhaité</span>
          <input
            v-model.trim="form.deadline"
            type="text"
            placeholder="Ex. : dans 3 mois"
            class="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
      </div>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold text-ink-800">
          {{ detailed ? 'Décrivez votre projet *' : 'Votre message *' }}
        </span>
        <textarea
          v-model.trim="form.message"
          required
          rows="5"
          :placeholder="
            detailed
              ? 'Surface, nombre de pièces, niveaux, contraintes particulières…'
              : 'Comment pouvons-nous vous aider ?'
          "
          class="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </label>

      <p v-if="status === 'error'" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ errorMessage }}
      </p>

      <div class="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          :disabled="status === 'sending'"
          class="rounded-full bg-ink-950 px-7 py-3.5 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ status === 'sending' ? 'Envoi en cours…' : detailed ? 'Envoyer ma demande' : 'Envoyer le message' }}
        </button>
        <p class="text-xs text-ink-400">Réponse sous {{ site.responseTime }} · Devis gratuit et sans engagement</p>
      </div>
    </form>
  </div>
</template>
