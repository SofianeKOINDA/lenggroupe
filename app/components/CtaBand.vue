<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <section class="container-page">
    <div
      v-reveal
      class="relative overflow-hidden rounded-2xl bg-ink-950 px-8 py-14 sm:px-14 sm:py-20"
    >
      <div
        class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-500/20 blur-3xl"
      />
      <div class="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
            Parlons de votre projet — le devis est gratuit
          </h2>
          <p class="mt-4 max-w-xl text-lg leading-relaxed text-ink-300">
            Décrivez-nous votre terrain, votre programme et votre budget. Nous revenons vers vous
            sous {{ site.responseTime }} avec une première estimation, sans frais supplémentaires.
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <NuxtLink
            to="/devis"
            class="rounded-full bg-brand-500 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-brand-600"
          >
            Demander un devis
          </NuxtLink>
          <a
            :href="site.phoneHref"
            class="rounded-full border border-ink-700 px-6 py-3.5 text-center font-semibold text-white transition hover:border-brand-500 hover:text-brand-400"
          >
            {{ site.phone }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
