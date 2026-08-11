<script setup lang="ts">
import { site } from '~/data/site'
import { process } from '~/data/services'

useSeoMeta({
  title: 'Demander un devis gratuit',
  description:
    'Décrivez votre projet de construction, rénovation ou aménagement : LENG GROUPE vous répond sous 48 h avec une première estimation gratuite.'
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Devis gratuit"
      title="Votre estimation en 48 heures"
      text="Remplissez le formulaire ci-dessous. Plus votre description est précise, plus notre estimation le sera."
      image="/img/rendus/villa-r1-aerienne-02.jpg"
      :breadcrumb="[{ label: 'Demander un devis' }]"
    />

    <section class="container-page py-24">
      <div class="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
        <div v-reveal>
          <ContactForm detailed />
        </div>

        <aside v-reveal="120" class="space-y-8">
          <div class="rounded-xl bg-ink-950 p-8 text-ink-300">
            <h2 class="font-display text-xl font-extrabold text-white">Ce qui se passe ensuite</h2>
            <ol class="mt-6 space-y-5">
              <li v-for="step in process" :key="step.step" class="flex gap-4">
                <span
                  class="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white"
                >
                  {{ Number(step.step) }}
                </span>
                <div>
                  <p class="font-semibold text-white">{{ step.title }}</p>
                  <p class="mt-1 text-sm leading-relaxed">{{ step.text }}</p>
                </div>
              </li>
            </ol>
          </div>

          <div class="rounded-xl bg-brand-50 p-8">
            <h2 class="font-display text-xl font-extrabold text-ink-950">Vous préférez parler ?</h2>
            <p class="mt-3 text-sm leading-relaxed text-ink-600">
              Appelez-nous directement, {{ site.hours.toLowerCase() }}. Nous répondons aussi sur
              WhatsApp.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <a
                :href="site.phoneHref"
                class="rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                {{ site.phone }}
              </a>
              <a
                :href="site.whatsapp"
                target="_blank"
                rel="noopener"
                class="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink-950 ring-1 ring-ink-200 transition hover:ring-brand-500"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div class="rounded-xl p-8 ring-1 ring-ink-100">
            <h2 class="font-display text-xl font-extrabold">Aucun frais supplémentaire</h2>
            <p class="mt-3 text-sm leading-relaxed text-ink-500">
              L'étude préalable et le devis sont offerts. Vous ne payez qu'après validation d'un
              devis détaillé, ligne par ligne, sans surprise en cours de chantier.
            </p>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
