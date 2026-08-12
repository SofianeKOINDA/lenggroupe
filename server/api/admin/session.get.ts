/** Consultée par le middleware de route pour savoir si la session est valide. */
export default defineEventHandler((event) => ({
  authenticated: isAuthenticated(event)
}))
