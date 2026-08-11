export type Service = {
  slug: string
  title: string
  short: string
  description: string
  image: string
  points: string[]
}

export const services: Service[] = [
  {
    slug: 'construction-batiment',
    title: 'Construction & gros œuvre',
    short: 'Villas, immeubles R+1 à R+4, bâtiments administratifs et commerciaux.',
    description:
      "De la fondation à la livraison, nous assurons l'intégralité du gros œuvre : terrassement, béton armé, maçonnerie en briques de terre comprimée ou en agglos, dallage, charpente et couverture.",
    image: '/img/projets/immeuble-r2-gros-oeuvre.jpg',
    points: [
      'Terrassement et fondations',
      'Béton armé et structure',
      'Maçonnerie brique / agglo',
      'Charpente et couverture'
    ]
  },
  {
    slug: 'second-oeuvre-finitions',
    title: 'Second œuvre & finitions',
    short: 'Peinture, carrelage, faux plafonds, menuiserie métallique et bois.',
    description:
      "Nous soignons la finition parce que c'est elle que vous vivez au quotidien : revêtements, plomberie, électricité, menuiseries, faux plafonds décoratifs et peinture.",
    image: '/img/interieurs/cuisine-02.jpg',
    points: [
      'Carrelage et revêtements',
      'Électricité et plomberie',
      'Faux plafonds et éclairage',
      'Menuiserie alu, métal et bois'
    ]
  },
  {
    slug: 'architecture-etudes',
    title: 'Architecture & études techniques',
    short: 'Plans, modélisation 3D, dossiers de permis et devis quantitatifs.',
    description:
      "Avant la première brique, il y a le plan. Notre bureau d'études conçoit, modélise en 3D et chiffre votre projet, puis monte le dossier technique et administratif.",
    image: '/img/rendus/villa-r1-aerienne-01.jpg',
    points: [
      'Plans architecturaux et 3D',
      'Études de structure',
      'Devis quantitatif et estimatif',
      'Dossier de permis de construire'
    ]
  },
  {
    slug: 'amenagement-interieur',
    title: 'Aménagement intérieur',
    short: 'Cuisines équipées, dressings, décoration et mobilier sur mesure.',
    description:
      "Cuisines équipées, placards, dressings, salons : nous aménageons et décorons vos espaces avec des matériaux certifiés et des artisans qualifiés.",
    image: '/img/interieurs/salon.jpg',
    points: [
      'Cuisines et placards sur mesure',
      'Décoration et mobilier',
      'Éclairage d’ambiance',
      'Livraison clé en main'
    ]
  },
  {
    slug: 'amenagement-agences',
    title: "Aménagement d'agences",
    short: 'Agences bancaires et microfinance : façade, enseigne, espace client.',
    description:
      "Nous sommes le partenaire de référence de plusieurs réseaux bancaires et de microfinance au Burkina Faso, du siège social à l'agence de quartier, dans le respect strict de la charte du réseau.",
    image: '/img/projets/cofina-bobo-agence.jpg',
    points: [
      'Respect de la charte réseau',
      'Façade et habillage ACM',
      'Espace client et back-office',
      'Chantiers en site occupé'
    ]
  },
  {
    slug: 'foncier-titres',
    title: 'Foncier & titres de propriété',
    short: 'Accompagnement pour titre foncier, permis urbain et régularisation.',
    description:
      "L'immobilier commence par un titre sécurisé. Nous accompagnons nos clients dans la constitution et le suivi de leurs dossiers fonciers auprès des administrations compétentes.",
    image: '/img/projets/chantier-mur-decoratif.jpg',
    points: [
      'Titre foncier et PUH',
      'Bornage et morcellement',
      'Régularisation de parcelle',
      'Conseil et accompagnement'
    ]
  }
]

export const process = [
  {
    step: '01',
    title: 'Écoute',
    text: "Nous prenons le temps de comprendre votre besoin, votre usage et votre budget réel."
  },
  {
    step: '02',
    title: 'Conception',
    text: 'Plans, rendus 3D et devis détaillé : vous validez avant que le chantier ne démarre.'
  },
  {
    step: '03',
    title: 'Exécution',
    text: 'Un chef de chantier dédié, un planning tenu, des matériaux certifiés et un reporting régulier.'
  },
  {
    step: '04',
    title: 'Livraison',
    text: 'Réception, levée des réserves et suivi après livraison. Nous restons joignables ensuite.'
  }
] as const

export const guarantees = [
  {
    title: 'Expertise locale',
    text: "Plus de 20 ans de terrain au Burkina Faso : sols, matériaux, fournisseurs et administrations, nous connaissons."
  },
  {
    title: 'Équipe pluridisciplinaire',
    text: 'Architectes, ingénieurs, conducteurs de travaux et artisans qualifiés réunis sous un seul interlocuteur.'
  },
  {
    title: 'Transparence',
    text: 'Devis détaillé ligne par ligne, sans frais cachés, et point d’avancement documenté à chaque étape.'
  },
  {
    title: 'Délais respectés',
    text: 'Un planning contractuel réaliste, suivi chaque semaine, et une alerte immédiate en cas d’aléa.'
  },
  {
    title: 'Matériaux certifiés',
    text: 'Ciment, acier et briques sourcés auprès de fournisseurs agréés, avec contrôle à la réception.'
  },
  {
    title: 'Sécurité du chantier',
    text: 'EPI obligatoires, balisage et respect des règles de sécurité pour les équipes comme pour les riverains.'
  }
] as const
