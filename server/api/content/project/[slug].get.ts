/** Fiche complète d'une réalisation, galerie et étude de cas comprises. */
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const project = getProject(slug, false)

  if (!project) throw createError({ statusCode: 404, message: 'Réalisation introuvable.' })

  return project
})
