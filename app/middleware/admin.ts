/**
 * Protège les écrans d'administration. La vérification passe par le serveur :
 * le cookie de session est signé et vérifié en base, rien n'est décidé côté
 * navigateur. Une session expirée renvoie vers la connexion en gardant la page
 * demandée, pour y revenir juste après.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const request = useRequestFetch()

  try {
    const { authenticated } = await request<{ authenticated: boolean }>('/api/admin/session')
    if (authenticated) return
  } catch {
    // Serveur injoignable : on retombe sur l'écran de connexion.
  }

  return navigateTo({ path: '/admin/login', query: { redirect: to.fullPath } })
})
