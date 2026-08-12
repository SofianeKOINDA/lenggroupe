/**
 * Charge le contenu du site avant le premier rendu.
 *
 * Nuxt attend les plugins asynchrones, donc les pages disposent des données dès
 * le rendu serveur — indispensable pour le référencement. Côté navigateur,
 * l'état est déjà rempli par la charge utile de la page : aucune requête n'est
 * relancée, et le contenu reste stable pendant toute la navigation.
 */
export default defineNuxtPlugin(async () => {
  if (!import.meta.server) return

  const content = useSiteContent()

  try {
    content.value = await $fetch<SiteContent>('/api/content')
  } catch (error) {
    // Le site doit rester debout même si la base est momentanément illisible :
    // on sert des sections vides plutôt qu'une page d'erreur complète.
    console.error('[content] Chargement du contenu impossible :', error)
  }
})
