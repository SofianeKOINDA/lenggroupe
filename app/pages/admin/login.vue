<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const password = ref('')
const error = ref('')
const pending = ref(false)

useHead({
  title: 'Administration — LENG GROUPE',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

async function submit() {
  if (pending.value) return
  pending.value = true
  error.value = ''

  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    // On revient sur la page demandée avant la redirection, l'accueil sinon.
    const redirect = String(route.query.redirect ?? '/admin')
    await navigateTo(redirect.startsWith('/admin') ? redirect : '/admin')
  } catch (e) {
    error.value = apiMessage(e, 'Connexion impossible.')
    password.value = ''
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="grid min-h-dvh place-items-center bg-ink-950 px-5 py-12">
    <div class="w-full max-w-sm">
      <div class="text-center">
        <p class="font-display text-2xl font-extrabold tracking-tight text-white">LENG GROUPE</p>
        <p class="mt-2 text-sm text-ink-400">Espace d'administration</p>
      </div>

      <form class="mt-8 rounded-xl bg-white p-7 shadow-2xl" @submit.prevent="submit">
        <label class="block">
          <span class="adm-label">Mot de passe</span>
          <input
            v-model="password"
            type="password"
            required
            autofocus
            autocomplete="current-password"
            class="adm-input"
            placeholder="••••••••••"
          />
        </label>

        <p v-if="error" class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ error }}
        </p>

        <button type="submit" :disabled="pending" class="adm-btn-primary mt-5 w-full py-3">
          {{ pending ? 'Vérification…' : 'Se connecter' }}
        </button>
      </form>

      <p class="mt-6 text-center text-xs text-ink-500">
        Accès réservé à l'équipe LENG GROUPE.
      </p>
    </div>
  </div>
</template>
