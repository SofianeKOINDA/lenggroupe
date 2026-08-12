<script setup lang="ts">
/**
 * La section entière disparaît tant qu'aucun avis réel n'a été publié depuis le
 * dashboard. Aucun témoignage fictif n'est généré.
 */
const reviews = useReviews()
const hasReviews = computed(() => reviews.value.length > 0)
</script>

<template>
  <section v-if="hasReviews" class="bg-ink-50 py-24">
    <div class="container-page">
      <SectionHeading
        v-reveal
        align="center"
        eyebrow="Avis clients"
        title="Ce que disent nos clients"
      />

      <div class="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <figure
          v-for="(review, i) in reviews"
          :key="review.author"
          v-reveal="i * 80"
          class="flex flex-col rounded-xl bg-white p-8 ring-1 ring-ink-100"
        >
          <div v-if="review.rating" class="flex gap-1" :aria-label="`${review.rating} sur 5`">
            <svg
              v-for="star in 5"
              :key="star"
              viewBox="0 0 24 24"
              class="size-4"
              :class="star <= review.rating ? 'text-brand-500' : 'text-ink-200'"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3l-5-4.9 7-.9L12 2Z" />
            </svg>
          </div>

          <blockquote class="mt-5 flex-1 leading-relaxed text-ink-700">
            « {{ review.quote }} »
          </blockquote>

          <figcaption class="mt-6 border-t border-ink-100 pt-5">
            <p class="font-semibold text-ink-950">{{ review.author }}</p>
            <p v-if="review.role" class="mt-1 text-sm text-ink-500">{{ review.role }}</p>
            <NuxtLink
              v-if="review.project"
              :to="`/realisations/${review.project}`"
              class="mt-2 inline-block text-sm font-medium text-brand-600 hover:underline"
            >
              Voir le projet
            </NuxtLink>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
