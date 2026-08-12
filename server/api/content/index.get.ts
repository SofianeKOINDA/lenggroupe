/**
 * Tout le contenu publié dont le site a besoin sur n'importe quelle page,
 * en une seule requête : le plugin `content` le charge au rendu et le dépose
 * dans l'état partagé, les composants le lisent ensuite sans requête.
 *
 * Les réalisations sont volontairement allégées ici (ni galerie ni étude de
 * cas) : ces champs pèsent lourd et ne servent qu'à la page de détail, qui les
 * charge séparément.
 */
export default defineEventHandler((event) => {
  const projects = listProjects(false).map(({ gallery, study, facts, ...card }) => card)

  setHeader(event, 'cache-control', 'no-cache')

  return {
    projects,
    categories: projectCategories(false),
    services: listServices(false),
    faq: listFaq(false),
    reviews: listReviews(false),
    team: listTeam(false)
  }
})
