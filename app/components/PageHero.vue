<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  text?: string
  image?: string
  /** Segments après « Accueil ». Le dernier n'est pas cliquable. */
  breadcrumb?: { label: string; to?: string }[]
}>()
</script>

<template>
  <section class="relative overflow-hidden bg-ink-950">
    <NuxtImg
      v-if="image"
      :src="image"
      alt=""
      aria-hidden="true"
      width="1600"
      height="700"
      class="absolute inset-0 size-full object-cover opacity-60"
    />
    <!-- Voile dégradé. En mobile le texte occupe toute la largeur : on voile
         verticalement. Dès sm, on dégrade vers la droite pour dégager la photo. -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/70 to-ink-950/75 sm:bg-gradient-to-r sm:from-ink-950/85 sm:via-ink-950/60 sm:to-ink-950/25"
    />

    <!-- pt généreux : le header flottant recouvre le haut du hero -->
    <div class="container-page relative pb-20 pt-32 sm:pb-28 sm:pt-40">
      <BreadcrumbTrail v-if="breadcrumb" :trail="breadcrumb" invert class="mb-8" />

      <p
        v-if="eyebrow"
        class="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-300"
      >
        {{ eyebrow }}
      </p>
      <h1 class="max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">{{ title }}</h1>
      <p v-if="text" class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-200">{{ text }}</p>
    </div>
  </section>
</template>
