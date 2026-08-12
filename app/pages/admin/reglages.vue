<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Réglages — LENG GROUPE' })

const current = ref('')
const next = ref('')
const confirmation = ref('')
const message = ref('')
const error = ref('')
const saving = ref(false)

async function changePassword() {
  error.value = ''
  message.value = ''

  if (next.value !== confirmation.value) {
    error.value = 'Les deux nouveaux mots de passe ne sont pas identiques.'
    return
  }

  saving.value = true
  try {
    await adminFetch('/api/admin/password', {
      method: 'POST',
      body: { current: current.value, next: next.value }
    })
    message.value =
      'Mot de passe modifié. Les autres appareils encore connectés ont été déconnectés.'
    current.value = next.value = confirmation.value = ''
  } catch (e) {
    error.value = apiMessage(e, 'Modification impossible.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <header>
      <h1 class="font-display text-2xl font-extrabold text-ink-950">Réglages</h1>
      <p class="mt-1 text-sm text-ink-500">Accès au dashboard et informations sur le site.</p>
    </header>

    <form class="adm-card space-y-5 p-6" @submit.prevent="changePassword">
      <div>
        <h2 class="font-display text-base font-bold text-ink-950">Changer le mot de passe</h2>
        <p class="mt-1 text-sm text-ink-500">
          Un seul compte donne accès à cet espace. Choisissez un mot de passe long, utilisé nulle
          part ailleurs.
        </p>
      </div>

      <label class="block">
        <span class="adm-label">Mot de passe actuel</span>
        <input
          v-model="current"
          type="password"
          required
          autocomplete="current-password"
          class="adm-input"
        />
      </label>

      <label class="block">
        <span class="adm-label">Nouveau mot de passe</span>
        <input
          v-model="next"
          type="password"
          required
          minlength="10"
          autocomplete="new-password"
          class="adm-input"
        />
        <span class="mt-1 block text-xs text-ink-400">10 caractères minimum.</span>
      </label>

      <label class="block">
        <span class="adm-label">Confirmer le nouveau mot de passe</span>
        <input
          v-model="confirmation"
          type="password"
          required
          autocomplete="new-password"
          class="adm-input"
        />
      </label>

      <p v-if="message" class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        {{ message }}
      </p>
      <p v-if="error" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

      <button type="submit" class="adm-btn-primary" :disabled="saving">
        {{ saving ? 'Modification…' : 'Modifier le mot de passe' }}
      </button>
    </form>

    <section class="adm-card space-y-4 p-6 text-sm text-ink-600">
      <h2 class="font-display text-base font-bold text-ink-950">Ce qui n'est pas modifiable ici</h2>
      <p>
        Les coordonnées de l'agence (téléphone, WhatsApp, adresse, horaires), les chiffres clés
        affichés sur l'accueil et les textes de méthode restent dans le code du site, dans
        <code class="rounded bg-ink-100 px-1.5 py-0.5 text-xs">app/data/site.ts</code> et
        <code class="rounded bg-ink-100 px-1.5 py-0.5 text-xs">app/data/services.ts</code>.
        Ils changent rarement et demandent une intervention technique.
      </p>
      <p>
        Les demandes reçues, les réalisations, les services, la FAQ, les avis et l'équipe sont
        stockés en base de données et pilotés depuis ce dashboard.
      </p>
    </section>

    <section class="adm-card space-y-3 p-6 text-sm text-ink-600">
      <h2 class="font-display text-base font-bold text-ink-950">Mesure d'audience</h2>
      <p>
        Les statistiques affichées sur le tableau de bord sont calculées par le site lui-même : pas
        de cookie déposé, pas de données envoyées à un service tiers. Les visiteurs sont comptés via
        une empreinte anonyme renouvelée chaque jour, ce qui permet de mesurer sans conserver
        d'adresse IP.
      </p>
    </section>
  </div>
</template>
