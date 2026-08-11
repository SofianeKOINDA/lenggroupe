<script setup lang="ts">
import { categories, projects, references } from '~/data/projects'

useSeoMeta({
  title: 'Nos réalisations',
  description:
    'Villas, immeubles, agences bancaires, aménagements intérieurs et études 3D réalisés par LENG GROUPE au Burkina Faso.'
})

const active = ref<(typeof categories)[number]>('Tous')

const filtered = computed(() =>
  active.value === 'Tous' ? projects : projects.filter((p) => p.category === active.value)
)
</script>

<template>
  <div>
    <PageHero
      eyebrow="Portfolio"
      title="Nos réalisations"
      text="Chaque projet ci-dessous a été conçu, chiffré et exécuté par nos équipes. Filtrez par type d'ouvrage."
      image="/img/projets/briques-vue-ensemble.jpg"
      :breadcrumb="[{ label: 'Réalisations' }]"
    />

    <section class="container-page py-20">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in categories"
          :key="c"
          type="button"
          class="rounded-full px-5 py-2.5 text-sm font-semibold transition"
          :class="
            active === c
              ? 'bg-ink-950 text-white'
              : 'bg-ink-50 text-ink-600 ring-1 ring-ink-200 hover:bg-ink-100'
          "
          @click="active = c"
        >
          {{ c }}
        </button>
      </div>

      <TransitionGroup
        tag="div"
        class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        leave-active-class="absolute transition duration-200 ease-in"
        leave-to-class="opacity-0"
      >
        <ProjectCard v-for="project in filtered" :key="project.slug" :project="project" />
      </TransitionGroup>

      <p v-if="!filtered.length" class="py-16 text-center text-ink-500">
        Aucun projet dans cette catégorie pour le moment.
      </p>
    </section>

    <section class="bg-ink-50 py-20">
      <div class="container-page">
        <SectionHeading
          v-reveal
          eyebrow="Références"
          title="Réseaux d'agences accompagnés"
          text="Au-delà des chantiers présentés ci-dessus, nous intervenons de façon récurrente pour ces réseaux financiers."
        />

        <div class="mt-12 grid gap-6 lg:grid-cols-2">
          <div
            v-for="(ref, i) in references"
            :key="ref.client"
            v-reveal="i * 100"
            class="rounded-xl bg-white p-8 ring-1 ring-ink-100"
          >
            <h3 class="font-display text-2xl font-extrabold">{{ ref.client }}</h3>
            <p class="mt-1 text-sm text-ink-500">{{ ref.sector }}</p>

            <ul class="mt-6 divide-y divide-ink-100">
              <li
                v-for="s in ref.sites"
                :key="s.name"
                class="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <span class="font-medium text-ink-800">{{ s.name }}</span>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="
                    s.status === 'Livré'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-brand-50 text-brand-700'
                  "
                >
                  {{ s.status }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <div class="pt-24">
      <CtaBand />
    </div>
  </div>
</template>
