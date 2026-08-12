<script setup lang="ts">
/**
 * Galerie d'un chantier : plusieurs photos, réordonnables. La première sert de
 * grande image sur la page publique, d'où les flèches de déplacement.
 */
const model = defineModel<string[]>({ default: () => [] })

const input = ref<HTMLInputElement | null>(null)
const busy = ref(false)
const error = ref('')

async function onPick(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return

  busy.value = true
  error.value = ''
  try {
    model.value = [...model.value, ...(await uploadImages(files))]
  } catch (e) {
    error.value = apiMessage(e, 'Téléversement impossible.')
  } finally {
    busy.value = false
    if (input.value) input.value.value = ''
  }
}

function move(index: number, direction: -1 | 1) {
  const next = index + direction
  if (next < 0 || next >= model.value.length) return
  const copy = [...model.value]
  copy.splice(next, 0, ...copy.splice(index, 1))
  model.value = copy
}

const remove = (index: number) => (model.value = model.value.filter((_, i) => i !== index))
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <span class="adm-label mb-0">Galerie photos</span>
      <button type="button" class="adm-btn-ghost py-1.5 text-xs" :disabled="busy" @click="input?.click()">
        {{ busy ? 'Envoi…' : 'Ajouter des photos' }}
      </button>
    </div>

    <p v-if="error" class="mt-2 text-xs font-medium text-red-700">{{ error }}</p>

    <p v-if="!model.length" class="mt-3 rounded-lg border border-dashed border-ink-200 p-6 text-center text-sm text-ink-400">
      Aucune photo. La première photo ajoutée sera mise en avant sur la page du projet.
    </p>

    <ul v-else class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
      <li
        v-for="(image, i) in model"
        :key="`${image}-${i}`"
        class="group relative overflow-hidden rounded-lg bg-ink-100 ring-1 ring-ink-200"
      >
        <img :src="image" alt="" class="aspect-4/3 w-full object-cover" />

        <span
          v-if="i === 0"
          class="absolute left-2 top-2 rounded-full bg-ink-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
        >
          Mise en avant
        </span>

        <div class="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-ink-950/70 p-1.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
          <div class="flex gap-1">
            <button
              type="button"
              class="rounded bg-white/15 px-2 py-1 text-xs text-white hover:bg-white/30"
              aria-label="Déplacer vers la gauche"
              @click="move(i, -1)"
            >
              ←
            </button>
            <button
              type="button"
              class="rounded bg-white/15 px-2 py-1 text-xs text-white hover:bg-white/30"
              aria-label="Déplacer vers la droite"
              @click="move(i, 1)"
            >
              →
            </button>
          </div>
          <button
            type="button"
            class="rounded bg-white/15 px-2 py-1 text-xs text-white hover:bg-red-500"
            @click="remove(i)"
          >
            Retirer
          </button>
        </div>
      </li>
    </ul>

    <input
      ref="input"
      type="file"
      multiple
      accept="image/jpeg,image/png,image/webp,image/avif"
      class="hidden"
      @change="onPick"
    />
  </div>
</template>
