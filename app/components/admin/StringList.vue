<script setup lang="ts">
/** Liste de courtes lignes de texte : les points d'un service, par exemple. */
const model = defineModel<string[]>({ default: () => [] })

defineProps<{ label: string; placeholder?: string; hint?: string }>()

const add = () => (model.value = [...model.value, ''])
const remove = (i: number) => (model.value = model.value.filter((_, index) => index !== i))
const update = (i: number, value: string) =>
  (model.value = model.value.map((item, index) => (index === i ? value : item)))
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <span class="adm-label mb-0">{{ label }}</span>
      <button type="button" class="adm-btn-ghost py-1.5 text-xs" @click="add">+ Ajouter</button>
    </div>

    <p v-if="hint" class="mt-1 text-xs text-ink-400">{{ hint }}</p>

    <div class="mt-3 space-y-2">
      <div v-for="(item, i) in model" :key="i" class="flex items-center gap-2">
        <input
          :value="item"
          type="text"
          class="adm-input"
          :placeholder="placeholder"
          @input="update(i, ($event.target as HTMLInputElement).value)"
        />
        <button
          type="button"
          class="grid size-10 shrink-0 place-items-center rounded-lg text-ink-400 ring-1 ring-ink-200 hover:bg-red-50 hover:text-red-700"
          aria-label="Retirer"
          @click="remove(i)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
