export const site = {
  name: 'LENG GROUPE',
  legal: 'LENG GROUPE — Agence BTP',
  baseline: "Bâtissons l'Afrique de demain, aujourd'hui",
  description:
    "Agence BTP basée à Ouagadougou : construction, génie civil, aménagement intérieur, titres fonciers et maîtrise d'œuvre au Burkina Faso.",
  phone: '+226 71 53 53 21',
  phoneHref: 'tel:+22671535321',
  whatsapp: 'https://wa.me/22671535321',
  email: 'contact@lenggroupe.bf',
  address: 'Rue 09, Pilimpiku — Ouagadougou, Burkina Faso',
  hours: 'Lun — Sam · 08h00 à 18h00',
  /** Promesse de délai de réponse, affichée sur les formulaires et le bandeau CTA. */
  responseTime: '48 h ouvrées',
  /** Coordonnées approximatives de Pilimpiku, Ouagadougou — à affiner si besoin. */
  geo: { lat: 12.3714, lng: -1.5197 },
  /** Horaires structurés pour le schema.org LocalBusiness. */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' }
  ],
  socials: [
    { label: 'Facebook', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' }
  ]
} as const

/** Lien « itinéraire » : ouvre l'app de navigation du visiteur. */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  'Rue 09, Pilimpiku, Ouagadougou, Burkina Faso'
)}`

export const stats = [
  { value: 20, suffix: '+', label: "Années d'expérience" },
  { value: 50, suffix: '+', label: 'Chantiers livrés' },
  { value: 15, suffix: '+', label: 'Agences bancaires réalisées' },
  { value: 98, suffix: '%', label: 'Clients satisfaits' }
] as const

export const nav = [
  { label: 'Accueil', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Réalisations', to: '/realisations' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' }
] as const
