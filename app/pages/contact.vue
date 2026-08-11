<script setup lang="ts">
import { directionsUrl, site } from '~/data/site'

useSeoMeta({
  title: 'Contact',
  description: `Contactez LENG GROUPE — ${site.address}. Téléphone ${site.phone}, email ${site.email}.`
})

const infos = [
  { label: 'Adresse', value: site.address, href: null },
  { label: 'Téléphone', value: site.phone, href: site.phoneHref },
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'Horaires', value: site.hours, href: null }
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Contact"
      title="Parlons de votre projet"
      text="Un terrain, une idée, une question de titre foncier ? Écrivez-nous ou passez nous voir."
      image="/img/projets/agence-r1-blanc-bleu.jpg"
      :breadcrumb="[{ label: 'Contact' }]"
    />

    <section class="container-page py-24">
      <div class="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div v-reveal>
          <SectionHeading eyebrow="Nos coordonnées" title="Où nous trouver" />

          <dl class="mt-10 space-y-7">
            <div v-for="info in infos" :key="info.label" class="flex gap-4">
              <span
                class="mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div>
                <dt class="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">
                  {{ info.label }}
                </dt>
                <dd class="mt-1 font-semibold text-ink-950">
                  <a v-if="info.href" :href="info.href" class="hover:text-brand-600">
                    {{ info.value }}
                  </a>
                  <span v-else>{{ info.value }}</span>
                </dd>
              </div>
            </div>
          </dl>

          <div class="mt-10 flex flex-wrap gap-3">
            <a
              :href="site.whatsapp"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white transition hover:brightness-95"
            >
              Discuter sur WhatsApp
            </a>
            <a
              :href="directionsUrl"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-600"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-5">
                <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Itinéraire
            </a>
          </div>

          <p class="mt-4 text-sm text-ink-500">
            Le bouton « Itinéraire » ouvre la navigation guidée dans votre application de cartes.
          </p>

          <div class="mt-8">
            <ShareButtons title="LENG GROUPE — Agence BTP à Ouagadougou" />
          </div>

          <div class="mt-10 overflow-hidden rounded-xl ring-1 ring-ink-100">
            <iframe
              title="Localisation de LENG GROUPE à Ouagadougou"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-1.58%2C12.32%2C-1.44%2C12.42&layer=mapnik"
              class="h-72 w-full"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div v-reveal="120">
          <SectionHeading eyebrow="Écrivez-nous" title="Envoyer un message" />
          <div class="mt-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>

    <CtaBand />
  </div>
</template>
