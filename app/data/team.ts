export type Member = {
  name: string
  role: string
  photo: string
  bio: string
}

export const team: Member[] = [
  {
    name: 'Abdoul Aziz LENGANI',
    role: 'Fondateur & Directeur Général',
    photo: '/img/equipe/aziz-lengani.png',
    bio: "Plus de 20 ans d'expérience dans l'immobilier et la construction au Burkina Faso. Il suit personnellement chaque chantier de l'écoute du besoin à la remise des clés."
  },
  {
    name: 'Saouda LENGANI',
    role: 'Technicienne — Suivi de chantier',
    photo: '/img/equipe/saouda-lengani.png',
    bio: "Elle assure le suivi technique quotidien des chantiers, le contrôle des matériaux à la réception et la coordination des équipes sur site."
  }
]
