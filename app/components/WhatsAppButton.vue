<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <a
    :href="site.whatsapp"
    target="_blank"
    rel="noopener"
    class="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3.5 pr-5 font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-105 lg:flex"
    aria-label="Nous écrire sur WhatsApp"
  >
    <svg viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor" aria-hidden="true">
      <path
        d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z"
      />
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.53 3.7-8.22 8.24-8.22 4.54 0 8.22 3.69 8.22 8.22 0 4.54-3.68 8.22-8.22 8.22Z"
      />
    </svg>
    <span class="hidden text-sm sm:inline">WhatsApp</span>
  </a>
</template>
