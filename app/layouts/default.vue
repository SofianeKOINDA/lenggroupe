<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <!-- Desktop : bulle WhatsApp. Mobile : barre d'action collante, qui reprend
         l'appel et WhatsApp — les deux ne coexistent jamais. -->
    <WhatsAppButton />
    <StickyMobileCta />
  </div>
</template>
