<script setup lang="ts">
import { site, stats } from '~/data/site'
import { guarantees, process, services } from '~/data/services'
import { projects, references } from '~/data/projects'
import { team } from '~/data/team'
import { faq } from '~/data/faq'

useSeoMeta({
  title: site.baseline,
  description: site.description,
  ogTitle: `${site.name} — ${site.baseline}`,
  ogDescription: site.description
})

const featured = computed(() => projects.slice(0, 3))

// Fiche établissement local, posée une seule fois pour tout le site.
useJsonLd(localBusinessSchema(useSiteUrl()))
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative isolate overflow-hidden bg-ink-950">
      <NuxtImg
        src="/img/projets/villa-r1-grise-01.jpg"
        alt=""
        aria-hidden="true"
        preload
        width="1920"
        height="1080"
        class="absolute inset-0 size-full object-cover"
      />
      <!-- Voile dégradé. En mobile le texte occupe toute la largeur : on voile
           verticalement. Dès lg, on dégrade vers la droite pour dégager la photo. -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/72 to-ink-950/78 lg:bg-gradient-to-r lg:from-ink-950/85 lg:via-ink-950/60 lg:to-ink-950/25"
      />

      <div
        class="container-page relative grid gap-14 pb-24 pt-36 lg:grid-cols-[1.15fr_1fr] lg:pb-32 lg:pt-44"
      >
        <div>
          <p
            v-reveal
            class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-300 ring-1 ring-white/15"
          >
            <span class="size-1.5 rounded-full bg-brand-400" />
            Agence BTP · Burkina Faso
          </p>

          <h1
            v-reveal="80"
            class="mt-6 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
          >
            Bâtissons l'Afrique de demain,
            <span class="text-brand-500">aujourd'hui</span>
          </h1>

          <p v-reveal="160" class="mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
            Construction, génie civil, aménagement intérieur et sécurisation foncière. Depuis plus
            de 20 ans, nous menons vos projets de la première esquisse à la remise des clés.
          </p>

          <div v-reveal="240" class="mt-9 flex flex-wrap gap-3">
            <NuxtLink
              to="/devis"
              class="rounded-full bg-brand-500 px-7 py-3.5 font-semibold text-white transition hover:bg-brand-600"
            >
              Devis gratuit
            </NuxtLink>
            <NuxtLink
              to="/realisations"
              class="rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition hover:border-brand-500 hover:bg-white/5"
            >
              Voir nos réalisations
            </NuxtLink>
          </div>

          <p v-reveal="280" class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-300">
            <span class="inline-flex items-center gap-2">
              <span class="size-1.5 rounded-full bg-emerald-400" />
              Réponse sous {{ site.responseTime }}
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="size-1.5 rounded-full bg-emerald-400" />
              Devis gratuit et sans engagement
            </span>
          </p>

          <dl v-reveal="320" class="mt-12 flex flex-wrap gap-x-10 gap-y-5 text-white">
            <div v-for="s in stats.slice(0, 3)" :key="s.label">
              <dt class="text-xs uppercase tracking-[0.14em] text-ink-400">{{ s.label }}</dt>
              <dd class="font-display text-2xl font-extrabold">{{ s.value }}{{ s.suffix }}</dd>
            </div>
          </dl>
        </div>

        <div v-reveal="200" class="hidden lg:block">
          <div class="relative ml-auto max-w-sm">
            <div class="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
              <NuxtImg
                src="/img/projets/briques-vue-ensemble.jpg"
                alt="Immeuble R+1 en briques de terre comprimée"
                width="480"
                height="600"
                class="aspect-4/5 w-full object-cover"
              />
            </div>
            <div
              class="absolute -bottom-8 -left-16 w-64 rounded-xl bg-white p-5 shadow-2xl"
            >
              <p class="font-display text-3xl font-extrabold text-ink-950">
                {{ stats[1].value }}{{ stats[1].suffix }}
              </p>
              <p class="mt-1 text-sm font-medium text-ink-500">{{ stats[1].label }}</p>
              <div class="mt-4 h-1 rounded-full bg-ink-100">
                <div class="h-1 w-4/5 rounded-full bg-brand-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bandeau chiffres -->
    <section class="bg-ink-900">
      <div class="container-page grid grid-cols-2 gap-10 py-14 lg:grid-cols-4">
        <StatCounter v-for="s in stats" :key="s.label" v-bind="s" />
      </div>
    </section>

    <!-- À propos -->
    <section class="container-page py-24">
      <div class="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div v-reveal class="grid grid-cols-2 gap-4">
          <NuxtImg
            src="/img/projets/villa-bleue-livree.jpg"
            alt="Villa plain-pied livrée à Ouagadougou"
            width="500"
            height="620"
            loading="lazy"
            class="col-span-1 aspect-4/5 w-full rounded-xl object-cover"
          />
          <div class="grid gap-4">
            <NuxtImg
              src="/img/interieurs/salon.jpg"
              alt="Salon aménagé par LENG GROUPE"
              width="400"
              height="300"
              loading="lazy"
              class="aspect-4/3 w-full rounded-xl object-cover"
            />
            <NuxtImg
              src="/img/projets/chantier-villa-gros-oeuvre.jpg"
              alt="Chantier de villa en gros œuvre"
              width="400"
              height="300"
              loading="lazy"
              class="aspect-4/3 w-full rounded-xl object-cover"
            />
          </div>
        </div>

        <div v-reveal="120">
          <SectionHeading
            eyebrow="Qui sommes-nous"
            title="La référence BTP au service de vos projets"
            text="LENG GROUPE accompagne particuliers, entreprises et institutions financières au Burkina Faso. Nous réunissons sous un même toit le bureau d'études, l'entreprise générale et l'aménagement intérieur."
          />

          <ul class="mt-8 space-y-4">
            <li v-for="g in guarantees.slice(0, 4)" :key="g.title" class="flex gap-4">
              <span
                class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-500 text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="size-3.5">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </span>
              <div>
                <p class="font-semibold text-ink-950">{{ g.title }}</p>
                <p class="mt-1 text-sm leading-relaxed text-ink-500">{{ g.text }}</p>
              </div>
            </li>
          </ul>

          <NuxtLink
            to="/a-propos"
            class="mt-9 inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-600"
          >
            En savoir plus sur nous
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="bg-ink-50 py-24">
      <div class="container-page">
        <SectionHeading
          v-reveal
          align="center"
          eyebrow="Nos expertises"
          title="Un seul interlocuteur, tous les corps de métier"
          text="Du plan au mobilier, chaque étape de votre projet est prise en charge par une équipe interne."
        />

        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            v-for="(service, i) in services"
            :key="service.slug"
            v-reveal="i * 60"
            :service="service"
            :index="i"
          />
        </div>
      </div>
    </section>

    <!-- Réalisations -->
    <section class="container-page py-24">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          v-reveal
          eyebrow="Nos réalisations"
          title="Des chantiers livrés, pas des promesses"
          text="Villas, immeubles, agences bancaires et aménagements : voici une sélection de nos travaux récents."
        />
        <NuxtLink
          v-reveal="80"
          to="/realisations"
          class="inline-flex items-center gap-2 rounded-full border border-ink-200 px-6 py-3 font-semibold text-ink-950 transition hover:border-brand-500 hover:text-brand-600"
        >
          Tout voir
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </NuxtLink>
      </div>

      <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="(project, i) in featured"
          :key="project.slug"
          v-reveal="i * 80"
          :project="project"
        />
      </div>
    </section>

    <!-- Processus -->
    <section class="bg-ink-950 py-24">
      <div class="container-page">
        <SectionHeading
          v-reveal
          invert
          align="center"
          eyebrow="Notre méthode"
          title="Quatre étapes, zéro mauvaise surprise"
        />

        <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(step, i) in process"
            :key="step.step"
            v-reveal="i * 90"
            class="relative"
          >
            <span class="font-display text-5xl font-extrabold text-brand-500/30">
              {{ step.step }}
            </span>
            <h3 class="mt-3 text-xl font-bold text-white">{{ step.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-ink-400">{{ step.text }}</p>
            <div class="mt-6 h-px w-full bg-ink-800">
              <div class="h-px w-1/3 bg-brand-500" />
            </div>
          </div>
        </div>

        <figure v-reveal class="mx-auto mt-20 max-w-3xl text-center">
          <blockquote class="font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
            « Nous ne vendons pas des mètres carrés. Nous livrons des ouvrages que nos clients
            transmettront à leurs enfants. »
          </blockquote>
          <figcaption class="mt-8 flex items-center justify-center gap-4">
            <NuxtImg
              :src="team[0].photo"
              :alt="team[0].name"
              width="56"
              height="56"
              loading="lazy"
              class="size-14 rounded-full object-cover object-top"
            />
            <div class="text-left">
              <p class="font-semibold text-white">{{ team[0].name }}</p>
              <p class="text-sm text-ink-400">{{ team[0].role }}</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Références clients -->
    <section class="container-page py-24">
      <SectionHeading
        v-reveal
        align="center"
        eyebrow="Ils nous font confiance"
        title="Réseaux d'agences accompagnés"
        text="Nous construisons et aménageons les agences de plusieurs institutions financières, du siège social à l'agence de quartier."
      />

      <div class="mt-14 grid gap-6 lg:grid-cols-2">
        <div
          v-for="(ref, i) in references"
          :key="ref.client"
          v-reveal="i * 100"
          class="rounded-xl bg-ink-50 p-8 ring-1 ring-ink-100"
        >
          <div class="flex items-baseline justify-between gap-4">
            <h3 class="font-display text-2xl font-extrabold text-ink-950">{{ ref.client }}</h3>
            <p class="text-sm text-ink-500">{{ ref.sector }}</p>
          </div>
          <p class="mt-1 text-sm font-medium text-brand-600">
            {{ ref.sites.length }} sites accompagnés
          </p>

          <ul class="mt-6 flex flex-wrap gap-2">
            <li
              v-for="s in ref.sites"
              :key="s.name"
              class="rounded-full bg-white px-3.5 py-1.5 text-sm text-ink-700 ring-1 ring-ink-200"
            >
              {{ s.name }}
              <span
                v-if="s.status !== 'Livré'"
                class="ml-1.5 text-xs font-medium text-brand-600"
              >
                · {{ s.status.toLowerCase() }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Équipe -->
    <section class="bg-ink-50 py-24">
      <div class="container-page">
        <SectionHeading
          v-reveal
          align="center"
          eyebrow="L'équipe"
          title="Des visages, pas un standard téléphonique"
        />

        <div class="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          <article
            v-for="(m, i) in team"
            :key="m.name"
            v-reveal="i * 100"
            class="overflow-hidden rounded-xl bg-white ring-1 ring-ink-100"
          >
            <NuxtImg
              :src="m.photo"
              :alt="m.name"
              width="520"
              height="600"
              loading="lazy"
              class="aspect-4/5 w-full object-cover object-top"
            />
            <div class="p-6">
              <h3 class="text-lg font-bold">{{ m.name }}</h3>
              <p class="mt-1 text-sm font-medium text-brand-600">{{ m.role }}</p>
              <p class="mt-3 text-sm leading-relaxed text-ink-500">{{ m.bio }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <TestimonialsSection />

    <!-- FAQ : les 5 questions les plus posées, le reste sur la page dédiée -->
    <section class="container-page py-24">
      <div class="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <div v-reveal>
          <SectionHeading
            eyebrow="Questions fréquentes"
            title="Vous vous demandez sûrement…"
            text="Les réponses aux questions que l'on nous pose avant chaque projet."
          />
          <NuxtLink
            to="/faq"
            class="mt-8 inline-flex items-center gap-2 rounded-full border border-ink-200 px-6 py-3 font-semibold transition hover:border-brand-500 hover:text-brand-600"
          >
            Toutes les questions
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </NuxtLink>
        </div>

        <div v-reveal="120">
          <FaqAccordion :items="faq.slice(0, 5)" />
        </div>
      </div>
    </section>

    <CtaBand />
  </div>
</template>
