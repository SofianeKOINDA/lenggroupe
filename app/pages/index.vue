<script setup lang="ts">
import { site, stats } from '~/data/site'
import { guarantees, process } from '~/data/services'
import { references } from '~/data/projects'

// Contenu administrable depuis /admin, chargé par le plugin `content`.
const services = useServices()
const projects = useProjects()
const team = useTeam()
const faq = useFaq()

/** Signataire de la citation : le premier membre de l'équipe publié. */
const founder = computed(() => team.value[0])

useSeoMeta({
  title: site.baseline,
  description: site.description,
  ogTitle: `${site.name} — ${site.baseline}`,
  ogDescription: site.description
})

const featured = computed(() => projects.value.slice(0, 3))

// Fiche établissement local, posée une seule fois pour tout le site. Les avis
// publiés y alimentent la note agrégée, s'ils portent une note.
useJsonLd(localBusinessSchema(useSiteUrl(), useReviews().value))
</script>

<template>
  <div>
    <HomeHero />

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
          <figcaption v-if="founder" class="mt-8 flex items-center justify-center gap-4">
            <NuxtImg
              :src="founder.photo"
              :alt="founder.name"
              width="56"
              height="56"
              loading="lazy"
              class="size-14 rounded-full object-cover object-top"
            />
            <div class="text-left">
              <p class="font-semibold text-white">{{ founder.name }}</p>
              <p class="text-sm text-ink-400">{{ founder.role }}</p>
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
