<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<template>
  <div class="grid min-h-dvh place-items-center bg-ink-950 px-6 text-center">
    <div>
      <p class="font-display text-7xl font-extrabold text-brand-500 sm:text-9xl">
        {{ error.statusCode }}
      </p>
      <h1 class="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
        {{ error.statusCode === 404 ? 'Cette page est introuvable' : 'Une erreur est survenue' }}
      </h1>
      <p class="mx-auto mt-4 max-w-md text-ink-400">
        {{
          error.statusCode === 404
            ? "La page que vous cherchez a peut-être été déplacée. Revenons sur des fondations solides."
            : 'Nos équipes ont été notifiées. Merci de réessayer dans un instant.'
        }}
      </p>
      <div class="mt-10 flex flex-wrap justify-center gap-3">
        <NuxtLink
          to="/"
          class="rounded-full bg-brand-500 px-7 py-3.5 font-semibold text-white transition hover:bg-brand-600"
        >
          Retour à l'accueil
        </NuxtLink>
        <NuxtLink
          to="/realisations"
          class="rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition hover:border-brand-500"
        >
          Voir nos réalisations
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
