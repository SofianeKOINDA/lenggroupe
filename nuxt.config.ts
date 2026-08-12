import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/image', '@nuxt/fonts'],

  runtimeConfig: {
    public: {
      // URL canonique du site, utilisée pour les balises og:, le sitemap et le schema.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://lenggroupe.bf',
      // Laisser vide désactive complètement Google Analytics (aucun script chargé).
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID || ''
    }
  },

  // Le dashboard est privé et derrière authentification : le rendre côté serveur
  // n'apporte rien (ni référencement, ni partage) et compliquerait la
  // transmission du cookie de session aux appels d'API.
  routeRules: {
    '/admin': { ssr: false },
    '/admin/**': { ssr: false }
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Archivo', provider: 'google', weights: [600, 700, 800] }
    ]
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      titleTemplate: '%s | LENG GROUPE',
      link: [{ rel: 'icon', href: '/favicon.ico' }],
      // Marque le document dès le premier rendu : sans JS, les blocs animés
      // au scroll (.reveal) restent visibles au lieu de disparaître.
      script: [{ children: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#171412' }
      ]
    }
  }
})
