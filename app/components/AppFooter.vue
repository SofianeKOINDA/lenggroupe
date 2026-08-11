<script setup lang="ts">
import { nav, site } from '~/data/site'
import { services } from '~/data/services'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-24 bg-ink-950 text-ink-300">
    <div class="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <NuxtLink to="/" class="flex items-center gap-3">
          <span
            class="grid size-10 place-items-center rounded-lg bg-brand-500 font-display text-lg font-extrabold text-white"
          >
            L
          </span>
          <span class="font-display text-xl font-extrabold tracking-tight text-white">
            LENG GROUPE
          </span>
        </NuxtLink>
        <p class="mt-5 text-sm leading-relaxed">
          {{ site.description }}
        </p>
        <div class="mt-6 flex gap-2">
          <a
            v-for="s in site.socials"
            :key="s.label"
            :href="s.href"
            class="rounded-full border border-ink-800 px-3 py-1.5 text-xs font-medium transition hover:border-brand-500 hover:text-brand-400"
          >
            {{ s.label }}
          </a>
        </div>
      </div>

      <div>
        <h3 class="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
          Navigation
        </h3>
        <ul class="mt-5 space-y-3 text-sm">
          <li v-for="item in nav" :key="item.to">
            <NuxtLink :to="item.to" class="transition hover:text-brand-400">
              {{ item.label }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/devis" class="transition hover:text-brand-400">Demander un devis</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/politique-confidentialite" class="transition hover:text-brand-400">
              Politique de confidentialité
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
          Nos services
        </h3>
        <ul class="mt-5 space-y-3 text-sm">
          <li v-for="s in services" :key="s.slug">
            <NuxtLink :to="`/services#${s.slug}`" class="transition hover:text-brand-400">
              {{ s.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
          Contact
        </h3>
        <ul class="mt-5 space-y-3 text-sm">
          <li>{{ site.address }}</li>
          <li>
            <a :href="site.phoneHref" class="transition hover:text-brand-400">{{ site.phone }}</a>
          </li>
          <li>
            <a :href="`mailto:${site.email}`" class="transition hover:text-brand-400">
              {{ site.email }}
            </a>
          </li>
          <li class="text-ink-400">{{ site.hours }}</li>
        </ul>
      </div>
    </div>

    <div class="border-t border-ink-900">
      <div
        class="container-page flex flex-col gap-4 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} {{ site.legal }}. Tous droits réservés.</p>
        <nav class="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Liens légaux">
          <NuxtLink to="/politique-confidentialite" class="transition hover:text-brand-400">
            Politique de confidentialité
          </NuxtLink>
          <NuxtLink to="/faq" class="transition hover:text-brand-400">FAQ</NuxtLink>
          <span>Ouagadougou, Burkina Faso</span>
        </nav>
      </div>
    </div>
  </footer>
</template>
