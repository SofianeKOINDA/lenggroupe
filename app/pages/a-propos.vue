<script setup lang="ts">
import { site, stats } from '~/data/site'
import { guarantees, process } from '~/data/services'

const team = useTeam()

useSeoMeta({
  title: 'À propos',
  description:
    "LENG GROUPE, agence BTP à Ouagadougou : plus de 20 ans d'expérience en construction, génie civil et immobilier au Burkina Faso."
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="À propos"
      title="Une entreprise burkinabè, un savoir-faire de terrain"
      text="LENG GROUPE est née d'une conviction simple : un ouvrage bien construit se voit vingt ans plus tard."
      image="/img/projets/villa-r1-grise-02.jpg"
      :breadcrumb="[{ label: 'À propos' }]"
    />

    <section class="container-page py-24">
      <div class="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div v-reveal>
          <SectionHeading eyebrow="Notre histoire" title="20 ans de chantiers au Burkina Faso" />
          <div class="mt-6 space-y-5 text-lg leading-relaxed text-ink-500">
            <p>
              Fondée et dirigée par Abdoul Aziz LENGANI, LENG GROUPE s'est construite chantier après
              chantier, de la villa familiale à l'immeuble R+3, du siège social à l'agence de
              quartier.
            </p>
            <p>
              Notre différence tient à un choix assumé : garder en interne le bureau d'études,
              l'exécution et l'aménagement. Vous avez un seul interlocuteur, un seul devis, une seule
              responsabilité.
            </p>
            <p>
              Nous travaillons aussi bien la brique de terre comprimée que le béton armé, parce qu'un
              bâtiment adapté au climat sahélien coûte moins cher à vivre qu'à construire.
            </p>
          </div>
        </div>

        <div v-reveal="120" class="grid gap-4 sm:grid-cols-2">
          <NuxtImg
            src="/img/projets/briques-r1-balcon.jpg"
            alt="Chantier en briques de terre comprimée"
            width="500"
            height="620"
            loading="lazy"
            class="aspect-4/5 w-full rounded-xl object-cover sm:mt-10"
          />
          <NuxtImg
            src="/img/projets/villa-r1-grise-03.jpg"
            alt="Villa R+1 contemporaine livrée"
            width="500"
            height="620"
            loading="lazy"
            class="aspect-4/5 w-full rounded-xl object-cover"
          />
        </div>
      </div>
    </section>

    <section class="bg-ink-900">
      <div class="container-page grid grid-cols-2 gap-10 py-14 lg:grid-cols-4">
        <StatCounter v-for="s in stats" :key="s.label" v-bind="s" />
      </div>
    </section>

    <section class="container-page py-24">
      <SectionHeading
        v-reveal
        align="center"
        eyebrow="Nos engagements"
        title="Ce sur quoi nous ne transigeons pas"
      />
      <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(g, i) in guarantees"
          :key="g.title"
          v-reveal="i * 70"
          class="rounded-xl bg-white p-7 ring-1 ring-ink-100"
        >
          <div class="grid size-11 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-5">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </div>
          <h3 class="mt-5 text-lg font-bold">{{ g.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-ink-500">{{ g.text }}</p>
        </div>
      </div>
    </section>

    <section class="bg-ink-50 py-24">
      <div class="container-page">
        <SectionHeading v-reveal align="center" eyebrow="L'équipe" title="Ceux qui suivent votre chantier" />
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

    <section class="container-page py-24">
      <SectionHeading v-reveal align="center" eyebrow="Notre méthode" title="De l'écoute à la livraison" />
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

      <p class="mt-14 text-center text-ink-500">
        Une question sur notre façon de travailler ?
        <a :href="site.phoneHref" class="font-semibold text-brand-600 hover:underline">
          Appelez-nous au {{ site.phone }}
        </a>
      </p>
    </section>

    <CtaBand />
  </div>
</template>
