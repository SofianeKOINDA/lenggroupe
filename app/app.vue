<script setup lang="ts">
import { site } from '~/data/site'

const route = useRoute()
const baseUrl = useSiteUrl()

// URL canonique + valeurs Open Graph par défaut, valables sur toute page ;
// chaque page reste libre de surcharger title/description/ogImage.
useHead({
  link: [{ rel: 'canonical', href: () => `${baseUrl}${route.path}` }]
})

useSeoMeta({
  ogSiteName: site.name,
  ogType: 'website',
  ogLocale: 'fr_FR',
  ogUrl: () => `${baseUrl}${route.path}`,
  ogImage: `${baseUrl}/img/projets/villa-r1-grise-01.jpg`,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
