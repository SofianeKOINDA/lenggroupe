<script setup lang="ts">
/**
 * Champ image unique : téléversement depuis l'ordinateur ou saisie directe du
 * chemin, pour continuer à pointer les visuels déjà présents dans /public.
 */
const model = defineModel<string>({ default: '' })

defineProps<{ label: string; hint?: string }>()

const input = ref<HTMLInputElement | null>(null)
const busy = ref(false)
const error = ref('')

async function onPick(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return

  busy.value = true
  error.value = ''
  try {
    const [url] = await uploadImages(files)
    if (url) model.value = url
  } catch (e) {
    error.value = apiMessage(e, 'Téléversement impossible.')
  } finally {
    busy.value = false
    if (input.value) input.value.value = ''
  }
}
</script>

<template>
  <div>
    <span class="adm-label">{{ label }}</span>

    <div class="flex items-start gap-4">
      <div class="grid size-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-ink-100 ring-1 ring-ink-200">
        <img v-if="model" :src="model" alt="" class="size-full object-cover" />
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          class="size-7 text-ink-400"
        >
          <path d="M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6" />
          <circle cx="8.5" cy="9.5" r="1.5" />
        </svg>
      </div>

      <div class="min-w-0 flex-1 space-y-2">
        <input v-model="model" type="text" class="adm-input" placeholder="/img/projets/photo.jpg" />

        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="adm-btn-ghost py-2" :disabled="busy" @click="input?.click()">
            {{ busy ? 'Envoi…' : 'Téléverser une image' }}
          </button>
          <button
            v-if="model"
            type="button"
            class="text-xs font-semibold text-ink-500 hover:text-red-700"
            @click="model = ''"
          >
            Retirer
          </button>
        </div>

        <p v-if="hint" class="text-xs text-ink-400">{{ hint }}</p>
        <p v-if="error" class="text-xs font-medium text-red-700">{{ error }}</p>
      </div>
    </div>

    <input
      ref="input"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/avif"
      class="hidden"
      @change="onPick"
    />
  </div>
</template>
