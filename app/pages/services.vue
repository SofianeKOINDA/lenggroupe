<script setup lang="ts">
import { process, services } from '~/data/services'

useSeoMeta({
  title: 'Nos services BTP',
  description:
    "Construction, second œuvre, architecture, aménagement intérieur, agences bancaires et titres fonciers au Burkina Faso."
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Nos services"
      title="Tous les métiers du bâtiment, sous un même toit"
      text="Six expertises complémentaires pour couvrir votre projet de bout en bout, sans multiplier les prestataires."
      image="/img/projets/immeuble-r2-gros-oeuvre.jpg"
      :breadcrumb="[{ label: 'Services' }]"
    />

    <section class="container-page py-24">
      <div class="space-y-24">
        <article
          v-for="(service, i) in services"
          :id="service.slug"
          :key="service.slug"
          v-reveal
          class="grid scroll-mt-32 gap-12 lg:grid-cols-2 lg:items-center"
        >
          <NuxtImg
            :src="service.image"
            :alt="service.title"
            width="720"
            height="540"
            loading="lazy"
            class="aspect-4/3 w-full rounded-xl object-cover"
            :class="i % 2 === 1 && 'lg:order-2'"
          />

          <div>
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
              Service {{ String(i + 1).padStart(2, '0') }}
            </p>
            <h2 class="mt-3 text-3xl font-extrabold sm:text-4xl">{{ service.title }}</h2>
            <p class="mt-5 text-lg leading-relaxed text-ink-500">{{ service.description }}</p>

            <ul class="mt-8 grid gap-3 sm:grid-cols-2">
              <li
                v-for="p in service.points"
                :key="p"
                class="flex items-center gap-3 rounded-lg bg-ink-50 px-4 py-3 text-sm font-medium text-ink-700"
              >
                <span class="size-1.5 shrink-0 rounded-full bg-brand-500" />
                {{ p }}
              </li>
            </ul>

            <NuxtLink
              to="/devis"
              class="mt-8 inline-flex items-center gap-2 font-semibold text-ink-950 transition hover:gap-3 hover:text-brand-600"
            >
              Demander un devis pour ce service
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section class="bg-ink-50 py-24">
      <div class="container-page">
        <SectionHeading
          v-reveal
          align="center"
          eyebrow="Comment on travaille"
          title="Une méthode éprouvée en quatre temps"
        />
        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(step, i) in process"
            :key="step.step"
            v-reveal="i * 90"
            class="rounded-xl bg-white p-7 ring-1 ring-ink-100"
          >
            <span class="font-display text-4xl font-extrabold text-brand-500/25">
              {{ step.step }}
            </span>
            <h3 class="mt-2 text-lg font-bold">{{ step.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-ink-500">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="pt-24">
      <CtaBand />
    </div>
  </div>
</template>
