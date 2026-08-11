<script setup lang="ts">
import { faq } from '~/data/faq'
import { site } from '~/data/site'

useSeoMeta({
  title: 'Questions fréquentes',
  description:
    "Délais, devis gratuit, coût de construction, titre foncier, garanties, paiement : les réponses aux questions les plus posées à LENG GROUPE."
})

useJsonLd(faqSchema(faq))
</script>

<template>
  <div>
    <PageHero
      eyebrow="FAQ"
      title="Questions fréquentes"
      text="Les réponses aux questions que nos clients nous posent avant de démarrer un projet."
      image="/img/projets/briques-facade-laterale.jpg"
      :breadcrumb="[{ label: 'FAQ' }]"
    />

    <section class="container-page py-20">
      <div class="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div v-reveal>
          <FaqAccordion :items="faq" />
        </div>

        <aside v-reveal="120" class="space-y-6 lg:sticky lg:top-28">
          <div class="rounded-xl bg-ink-950 p-8 text-ink-300">
            <h2 class="font-display text-xl font-extrabold text-white">
              Votre question n'est pas là ?
            </h2>
            <p class="mt-3 text-sm leading-relaxed">
              Posez-la directement, nous répondons sous {{ site.responseTime }}.
            </p>
            <div class="mt-6 flex flex-col gap-3">
              <NuxtLink
                to="/contact"
                class="rounded-full bg-brand-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Poser une question
              </NuxtLink>
              <a
                :href="site.phoneHref"
                class="rounded-full border border-ink-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-brand-500"
              >
                {{ site.phone }}
              </a>
            </div>
          </div>

          <div class="rounded-xl p-8 ring-1 ring-ink-100">
            <h2 class="font-display text-lg font-extrabold">Aller plus loin</h2>
            <ul class="mt-4 space-y-3 text-sm">
              <li>
                <NuxtLink to="/services" class="text-ink-600 hover:text-brand-600">
                  Le détail de nos six services
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/realisations" class="text-ink-600 hover:text-brand-600">
                  Nos réalisations et études de cas
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/a-propos" class="text-ink-600 hover:text-brand-600">
                  Nos engagements et notre méthode
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/devis" class="text-ink-600 hover:text-brand-600">
                  Demander un devis gratuit
                </NuxtLink>
              </li>
            </ul>
          </div>

          <ShareButtons title="FAQ — LENG GROUPE, agence BTP au Burkina Faso" />
        </aside>
      </div>
    </section>

    <CtaBand />
  </div>
</template>
