<script setup lang="ts">
import { site } from '~/data/site'
import { process } from '~/data/services'

const projects = useProjects()

const route = useRoute()
const isQuote = computed(() => route.query.type === 'devis')

useSeoMeta({
  title: 'Merci pour votre demande',
  description:
    "Votre demande a bien été transmise à LENG GROUPE. Notre équipe revient vers vous sous 48 h ouvrées.",
  // Page de confirmation : aucun intérêt à l'indexer, et cela fausserait les stats.
  robots: 'noindex, nofollow'
})

const suggestions = computed(() => projects.value.slice(0, 3))

// La pastille de validation se dessine à l'arrivée : la page prolonge la
// séquence de traitement du formulaire au lieu d'apparaître d'un bloc.
const badge = ref<HTMLElement | null>(null)

onMounted(() => {
  const gsap = useNuxtApp().$gsap as typeof import('gsap').default
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.from(badge.value, {
    scale: 0.4,
    opacity: 0,
    duration: 0.7,
    ease: 'back.out(1.7)'
  })
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-ink-950">
      <div class="container-page relative pb-20 pt-36 text-center sm:pb-24 sm:pt-44">
        <div
          ref="badge"
          class="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500 text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-8">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </div>

        <h1 v-reveal="120" class="mt-8 text-4xl font-extrabold text-white sm:text-5xl">
          {{ isQuote ? 'Votre demande de devis est partie' : 'Votre message est bien arrivé' }}
        </h1>

        <p v-reveal="220" class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-300">
          Merci de votre confiance. Un membre de l'équipe vous rappelle sous
          <strong class="font-semibold text-white">{{ site.responseTime }}</strong
          >. Si votre projet est urgent, appelez-nous directement — c'est toujours plus rapide.
        </p>

        <div v-reveal="320" class="mt-10 flex flex-wrap justify-center gap-3">
          <a
            :href="site.phoneHref"
            class="rounded-full bg-brand-500 px-7 py-3.5 font-semibold text-white transition hover:bg-brand-600"
          >
            {{ site.phone }}
          </a>
          <a
            :href="site.whatsapp"
            target="_blank"
            rel="noopener"
            class="rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition hover:border-brand-400 hover:bg-white/5"
          >
            Écrire sur WhatsApp
          </a>
        </div>
      </div>
    </section>

    <section class="container-page py-20">
      <SectionHeading
        v-reveal
        align="center"
        eyebrow="La suite"
        title="Ce qui se passe maintenant"
      />
      <ol class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="(step, i) in process"
          :key="step.step"
          v-reveal="i * 90"
          class="rounded-xl bg-ink-50 p-7"
        >
          <span class="font-display text-4xl font-extrabold text-brand-500/30">{{ step.step }}</span>
          <h3 class="mt-2 text-lg font-bold">{{ step.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-ink-500">{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <section class="bg-ink-50 py-20">
      <div class="container-page">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            v-reveal
            eyebrow="En attendant"
            title="Jetez un œil à nos chantiers"
          />
          <NuxtLink
            v-reveal="80"
            to="/realisations"
            class="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-6 py-3 font-semibold transition hover:border-brand-500 hover:text-brand-600"
          >
            Toutes les réalisations
          </NuxtLink>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard v-for="p in suggestions" :key="p.slug" :project="p" />
        </div>

        <div class="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-ink-200 pt-10">
          <ShareButtons title="LENG GROUPE — Agence BTP au Burkina Faso" label="Parlez de nous" />
          <NuxtLink to="/" class="font-semibold text-ink-950 hover:text-brand-600">
            ← Retour à l'accueil
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
