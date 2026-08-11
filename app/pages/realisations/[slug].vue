<script setup lang="ts">
import { projects } from '~/data/projects'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const project = computed(() => projects.find((p) => p.slug === slug.value))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Réalisation introuvable', fatal: true })
}

const others = computed(() => projects.filter((p) => p.slug !== slug.value).slice(0, 3))

const studyBlocks = computed(() => {
  const s = project.value?.study
  if (!s) return []
  return [
    { step: '1', title: 'Le contexte', text: s.context },
    { step: '2', title: "L'enjeu", text: s.challenge },
    { step: '3', title: 'Notre réponse', text: s.answer },
    { step: '4', title: 'Le résultat', text: s.result }
  ]
})

const lightbox = ref<string | null>(null)

useSeoMeta({
  title: () => project.value!.title,
  description: () => project.value!.summary,
  ogImage: () => project.value!.cover
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') lightbox.value = null
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="project">
    <PageHero
      :eyebrow="project.category"
      :title="project.title"
      :text="project.summary"
      :image="project.cover"
      :breadcrumb="[
        { label: 'Réalisations', to: '/realisations' },
        { label: project.title }
      ]"
    />

    <section class="container-page py-16">
      <dl class="grid gap-6 border-b border-ink-100 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="fact in project.facts" :key="fact.label">
          <dt class="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">
            {{ fact.label }}
          </dt>
          <dd class="mt-2 font-semibold text-ink-950">{{ fact.value }}</dd>
        </div>
      </dl>

      <div class="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-500">
        <p><span class="font-semibold text-ink-950">Localisation :</span> {{ project.location }}</p>
        <p><span class="font-semibold text-ink-950">Année :</span> {{ project.year }}</p>
        <p><span class="font-semibold text-ink-950">Statut :</span> {{ project.status }}</p>
      </div>

      <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="(img, i) in project.gallery"
          :key="img"
          v-reveal="i * 60"
          type="button"
          class="group overflow-hidden rounded-xl bg-ink-100"
          :class="i === 0 && project.gallery.length > 2 && 'sm:col-span-2 sm:row-span-2'"
          @click="lightbox = img"
        >
          <NuxtImg
            :src="img"
            :alt="`${project.title} — photo ${i + 1}`"
            width="900"
            height="675"
            loading="lazy"
            class="aspect-4/3 w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </button>
      </div>

      <div
        v-if="project.study"
        v-reveal
        class="mt-20 grid gap-10 rounded-xl bg-ink-50 p-8 sm:p-12 lg:grid-cols-2"
      >
        <div class="lg:col-span-2">
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">Étude de cas</p>
          <h2 class="mt-3 text-3xl font-extrabold">Comment nous avons mené ce chantier</h2>
        </div>

        <div v-for="block in studyBlocks" :key="block.title">
          <h3 class="flex items-center gap-3 text-lg font-bold">
            <span
              class="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white"
            >
              {{ block.step }}
            </span>
            {{ block.title }}
          </h3>
          <p class="mt-4 leading-relaxed text-ink-600">{{ block.text }}</p>
        </div>
      </div>

      <div
        class="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-ink-100 pt-10"
      >
        <ShareButtons :title="`${project.title} — LENG GROUPE`" label="Partager ce projet" />
        <NuxtLink
          to="/devis"
          class="rounded-full bg-ink-950 px-6 py-3 font-semibold text-white transition hover:bg-brand-600"
        >
          Un projet similaire ? Demandez un devis
        </NuxtLink>
      </div>
    </section>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0"
      >
        <div
          v-if="lightbox"
          class="fixed inset-0 z-60 grid place-items-center bg-ink-950/95 p-6"
          role="dialog"
          aria-modal="true"
          @click="lightbox = null"
        >
          <img :src="lightbox" alt="" class="max-h-[88dvh] max-w-full rounded-lg object-contain" />
          <button
            type="button"
            class="absolute right-6 top-6 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            aria-label="Fermer"
          >
            Fermer ✕
          </button>
        </div>
      </Transition>
    </Teleport>

    <section class="bg-ink-50 py-20">
      <div class="container-page">
        <SectionHeading v-reveal eyebrow="Poursuivre" title="D'autres réalisations" />
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard v-for="p in others" :key="p.slug" :project="p" />
        </div>
        <div class="mt-12">
          <NuxtLink
            to="/realisations"
            class="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-6 py-3 font-semibold transition hover:border-brand-500 hover:text-brand-600"
          >
            ← Toutes les réalisations
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="pt-24">
      <CtaBand />
    </div>
  </div>
</template>
