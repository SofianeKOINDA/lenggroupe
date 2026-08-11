<script setup lang="ts">
const props = defineProps<{ title: string; label?: string }>()

const route = useRoute()
const url = computed(() => `${useSiteUrl()}${route.path}`)

const copied = ref(false)
const canShare = ref(false)

onMounted(() => {
  canShare.value = typeof navigator !== 'undefined' && 'share' in navigator
})

const targets = computed(() => {
  const u = encodeURIComponent(url.value)
  const t = encodeURIComponent(props.title)
  return [
    { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: 'Email', href: `mailto:?subject=${t}&body=${u}` }
  ]
})

async function nativeShare() {
  try {
    await navigator.share({ title: props.title, url: url.value })
  } catch {
    // L'utilisateur a annulé le partage : rien à signaler.
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(url.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2200)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="mr-1 text-sm font-semibold text-ink-500">{{ label ?? 'Partager' }}</span>

    <button
      v-if="canShare"
      type="button"
      class="rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 sm:hidden"
      @click="nativeShare"
    >
      Partager
    </button>

    <a
      v-for="t in targets"
      :key="t.label"
      :href="t.href"
      target="_blank"
      rel="noopener"
      class="rounded-full px-4 py-2 text-sm font-medium text-ink-600 ring-1 ring-ink-200 transition hover:text-brand-600 hover:ring-brand-500"
      :class="canShare && 'max-sm:hidden'"
    >
      {{ t.label }}
    </a>

    <button
      type="button"
      class="rounded-full px-4 py-2 text-sm font-medium text-ink-600 ring-1 ring-ink-200 transition hover:text-brand-600 hover:ring-brand-500"
      @click="copyLink"
    >
      {{ copied ? 'Lien copié ✓' : 'Copier le lien' }}
    </button>
  </div>
</template>
