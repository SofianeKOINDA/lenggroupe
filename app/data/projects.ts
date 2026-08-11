export type ProjectStatus = 'Livré' | 'En cours' | 'En finition' | 'À démarrer'

export type Project = {
  slug: string
  title: string
  category: string
  location: string
  year: string
  status: ProjectStatus
  summary: string
  cover: string
  gallery: string[]
  facts: { label: string; value: string }[]
  /**
   * Étude de cas. Textes à faire valider par LENG GROUPE : ils décrivent une
   * démarche de chantier plausible mais n'ont pas été rédigés à partir des
   * comptes rendus réels.
   */
  study?: {
    context: string
    challenge: string
    answer: string
    result: string
  }
}

export const categories = [
  'Tous',
  'Agences & tertiaire',
  'Résidentiel',
  'Immeubles',
  'Aménagement intérieur',
  'Études & 3D'
] as const

export const projects: Project[] = [
  {
    slug: 'cofina-bobo-agence',
    title: 'Agence COFINA Bobo 2',
    category: 'Agences & tertiaire',
    location: 'Bobo-Dioulasso',
    year: '2024',
    status: 'Livré',
    summary:
      "Réhabilitation complète et habillage de façade en panneaux composites d'une agence de la Compagnie Financière Africaine, dans le respect strict de la charte du réseau.",
    cover: '/img/projets/cofina-bobo-agence.jpg',
    gallery: ['/img/projets/cofina-bobo-agence.jpg'],
    facts: [
      { label: 'Client', value: 'COFINA Burkina' },
      { label: 'Mission', value: 'Façade, enseigne, espace client' },
      { label: 'Niveaux', value: 'RDC + R+1' },
      { label: 'Particularité', value: 'Chantier en site occupé' }
    ],
    study: {
      context:
        "COFINA exploitait déjà cette agence de Bobo-Dioulasso lorsque le réseau a décidé d'en aligner l'image sur sa charte nationale.",
      challenge:
        "Refaire entièrement la façade et l'espace client sans fermer l'agence : les guichets devaient continuer de recevoir du public pendant toute la durée des travaux.",
      answer:
        "Nous avons découpé le chantier en phases courtes, avec les interventions bruyantes et salissantes concentrées hors des heures d'ouverture, un cloisonnement provisoire de la zone client et un habillage de façade en panneaux composites posés depuis l'extérieur.",
      result:
        "Agence livrée conforme à la charte du réseau, sans un seul jour de fermeture ni incident de sécurité côté public."
    }
  },
  {
    slug: 'villa-r1-contemporaine-ouaga',
    title: 'Villa R+1 contemporaine',
    category: 'Résidentiel',
    location: 'Ouagadougou',
    year: '2024',
    status: 'Livré',
    summary:
      "Villa familiale R+1 à l'écriture contemporaine : volumes en béton brut, claustras métalliques découpés au laser, double garage et terrasses abritées.",
    cover: '/img/projets/villa-r1-grise-01.jpg',
    gallery: [
      '/img/projets/villa-r1-grise-01.jpg',
      '/img/projets/villa-r1-grise-02.jpg',
      '/img/projets/villa-r1-grise-03.jpg'
    ],
    facts: [
      { label: 'Typologie', value: 'Villa R+1' },
      { label: 'Mission', value: 'Conception + réalisation' },
      { label: 'Finitions', value: 'Enduit taloché, claustras métal' },
      { label: 'Extérieurs', value: 'Pavage et clôture briques' }
    ],
    study: {
      context:
        "Une famille souhaitant une villa contemporaine sur une parcelle d'angle, avec un double garage fermé et des espaces de vie protégés du regard de la rue.",
      challenge:
        "Obtenir une écriture architecturale moderne sans recourir à des matériaux d'importation coûteux, et préserver l'intimité malgré deux façades sur voie.",
      answer:
        "Volumes en béton enduit taloché, claustras métalliques découpés localement pour filtrer la vue et la lumière, terrasses abritées en étage et clôture en parement de briques rappelant la teinte du sol.",
      result:
        "Une villa livrée dans les délais, dont l'ensemble des ouvrages métalliques a été fabriqué par des artisans de Ouagadougou."
    }
  },
  {
    slug: 'immeuble-briques-r1',
    title: 'Immeuble R+1 en briques de terre',
    category: 'Immeubles',
    location: 'Ouagadougou',
    year: '2024',
    status: 'En finition',
    summary:
      "Bâtiment R+1 en briques de terre comprimée apparentes, structure poteaux-poutres béton armé, coursives et garde-corps métalliques sur mesure. Une réponse bioclimatique adaptée au climat sahélien.",
    cover: '/img/projets/briques-vue-ensemble.jpg',
    gallery: [
      '/img/projets/briques-vue-ensemble.jpg',
      '/img/projets/briques-r1-balcon.jpg',
      '/img/projets/briques-facade-laterale.jpg',
      '/img/projets/briques-cour-interieure.jpg',
      '/img/projets/briques-vue-balcon.jpg',
      '/img/projets/briques-detail-interieur.jpg'
    ],
    facts: [
      { label: 'Typologie', value: 'Immeuble R+1' },
      { label: 'Matériau', value: 'Brique de terre comprimée' },
      { label: 'Structure', value: 'Béton armé poteaux-poutres' },
      { label: 'Atout', value: 'Confort thermique passif' }
    ],
    study: {
      context:
        "Un immeuble de rapport R+1 en périphérie de Ouagadougou, sur une parcelle exposée plein ouest, avec un budget de fonctionnement à maîtriser sur le long terme.",
      challenge:
        "Limiter la surchauffe intérieure en saison sèche sans imposer aux futurs occupants une facture de climatisation permanente.",
      answer:
        "Maçonnerie en briques de terre comprimée laissées apparentes, forte inertie thermique, coursives extérieures faisant office de brise-soleil sur la façade la plus exposée, et structure béton armé pour la portance.",
      result:
        "Un bâtiment nettement plus tempéré que l'équivalent en agglos, avec une façade qui ne demande ni enduit ni peinture d'entretien."
    }
  },
  {
    slug: 'immeuble-r2-ouaga',
    title: 'Immeuble R+2 à usage mixte',
    category: 'Immeubles',
    location: 'Ouagadougou',
    year: '2025',
    status: 'En cours',
    summary:
      "Immeuble R+2 d'angle à usage mixte commerce et habitation. Gros œuvre achevé, façade et second œuvre en cours d'exécution.",
    cover: '/img/projets/immeuble-r2-gros-oeuvre.jpg',
    gallery: ['/img/projets/immeuble-r2-gros-oeuvre.jpg'],
    facts: [
      { label: 'Typologie', value: 'Immeuble R+2' },
      { label: 'Usage', value: 'Commerce et habitation' },
      { label: 'Phase', value: 'Gros œuvre achevé' },
      { label: 'Mission', value: 'Entreprise générale' }
    ]
  },
  {
    slug: 'villa-plain-pied-bleue',
    title: 'Villa plain-pied livrée',
    category: 'Résidentiel',
    location: 'Ouagadougou',
    year: '2023',
    status: 'Livré',
    summary:
      "Villa plain-pied économique livrée clé en main : parement en briques rouges, auvent béton, terrasse pavée et espaces verts.",
    cover: '/img/projets/villa-bleue-livree.jpg',
    gallery: ['/img/projets/villa-bleue-livree.jpg', '/img/projets/villa-r1-contemporaine.jpg'],
    facts: [
      { label: 'Typologie', value: 'Villa plain-pied' },
      { label: 'Mission', value: 'Clé en main' },
      { label: 'Délai', value: '7 mois' },
      { label: 'Finitions', value: 'Parement brique, pavage' }
    ]
  },
  {
    slug: 'siege-administratif-r1',
    title: 'Siège administratif R+1',
    category: 'Agences & tertiaire',
    location: 'Ouagadougou',
    year: '2024',
    status: 'Livré',
    summary:
      "Bâtiment tertiaire R+1 avec bureaux à l'étage et espaces d'accueil au rez-de-chaussée. Façade blanche et menuiseries alu, clôture et parking sécurisés.",
    cover: '/img/projets/agence-r1-blanc-bleu.jpg',
    gallery: ['/img/projets/agence-r1-blanc-bleu.jpg'],
    facts: [
      { label: 'Typologie', value: 'Bâtiment tertiaire R+1' },
      { label: 'Mission', value: 'Construction et finitions' },
      { label: 'Façade', value: 'Enduit et menuiserie alu' },
      { label: 'Extérieurs', value: 'Parking et clôture' }
    ]
  },
  {
    slug: 'cuisines-equipees',
    title: 'Cuisines équipées sur mesure',
    category: 'Aménagement intérieur',
    location: 'Ouagadougou',
    year: '2025',
    status: 'Livré',
    summary:
      "Cuisines équipées sur mesure : caissons laqués, plan de travail en marbre, hotte, four encastré, faux plafond lumineux et bar de séparation.",
    cover: '/img/interieurs/cuisine-02.jpg',
    gallery: [
      '/img/interieurs/cuisine-02.jpg',
      '/img/interieurs/cuisine-01.jpg',
      '/img/interieurs/cuisine-03.jpg',
      '/img/interieurs/salon.jpg'
    ],
    facts: [
      { label: 'Prestation', value: 'Mobilier sur mesure' },
      { label: 'Plan de travail', value: 'Marbre' },
      { label: 'Plafond', value: 'Faux plafond lumineux' },
      { label: 'Délai', value: '4 à 6 semaines' }
    ]
  },
  {
    slug: 'instech-bobo',
    title: 'INSTech Bobo — Institut des Sciences et Techniques',
    category: 'Études & 3D',
    location: 'Bobo-Dioulasso',
    year: '2024',
    status: 'À démarrer',
    summary:
      "Étude et modélisation d'un institut d'enseignement supérieur R+4 : porche monumental, circulations extérieures et façade rythmée par les balcons.",
    cover: '/img/rendus/instech-bobo.jpg',
    gallery: ['/img/rendus/instech-bobo.jpg'],
    facts: [
      { label: 'Programme', value: 'Établissement d’enseignement' },
      { label: 'Niveaux', value: 'R+4' },
      { label: 'Mission', value: 'Conception et modélisation 3D' },
      { label: 'Phase', value: 'Études achevées' }
    ]
  },
  {
    slug: 'etudes-villas-3d',
    title: 'Conceptions résidentielles en 3D',
    category: 'Études & 3D',
    location: 'Burkina Faso',
    year: '2023 — 2025',
    status: 'Livré',
    summary:
      "Une sélection d'avant-projets conçus par notre bureau d'études : villas plain-pied, duplex R+1 et logements jumelés, présentés en rendu 3D avant validation client.",
    cover: '/img/rendus/villa-r1-aerienne-01.jpg',
    gallery: [
      '/img/rendus/villa-r1-aerienne-01.jpg',
      '/img/rendus/villa-r1-aerienne-02.jpg',
      '/img/rendus/villa-r1-facade.jpg',
      '/img/rendus/duplex-r1-jumele.jpg',
      '/img/rendus/villa-toiture-tuiles.jpg',
      '/img/rendus/villa-moderne-rouge.jpg',
      '/img/rendus/villa-plain-pied.jpg',
      '/img/rendus/villa-r1-jaune.jpg'
    ],
    facts: [
      { label: 'Mission', value: 'Conception architecturale' },
      { label: 'Livrables', value: 'Plans, 3D, devis quantitatif' },
      { label: 'Typologies', value: 'Villas, duplex, jumelés' },
      { label: 'Délai moyen', value: '2 à 4 semaines' }
    ]
  },
  {
    slug: 'chantiers-en-cours',
    title: 'Chantiers en cours',
    category: 'Résidentiel',
    location: 'Ouagadougou et environs',
    year: '2025',
    status: 'En cours',
    summary:
      "Un aperçu de nos chantiers actifs : gros œuvre, murs de clôture décoratifs et villas en phase de finition.",
    cover: '/img/projets/chantier-villa-gros-oeuvre.jpg',
    gallery: [
      '/img/projets/chantier-villa-gros-oeuvre.jpg',
      '/img/projets/chantier-mur-decoratif.jpg'
    ],
    facts: [
      { label: 'Phase', value: 'Gros œuvre et finitions' },
      { label: 'Suivi', value: 'Reporting hebdomadaire' },
      { label: 'Encadrement', value: 'Chef de chantier dédié' },
      { label: 'Sécurité', value: 'EPI et balisage' }
    ]
  }
]

/**
 * Références clients : réseaux d'agences accompagnés par LENG GROUPE.
 * Liste transmise par le client — les visuels associés restent à fournir.
 */
export const references = [
  {
    client: 'SAFINE',
    sector: 'Microfinance',
    sites: [
      { name: 'Siège', status: 'Livré' as ProjectStatus },
      { name: 'Bobo-Dioulasso', status: 'Livré' as ProjectStatus },
      { name: 'Kouritenga', status: 'Livré' as ProjectStatus },
      { name: 'Hamdalaye', status: 'Livré' as ProjectStatus },
      { name: 'Koudougou', status: 'Livré' as ProjectStatus },
      { name: 'Tenkodogo', status: 'Livré' as ProjectStatus },
      { name: 'Dédougou', status: 'En finition' as ProjectStatus },
      { name: 'Ouahigouya', status: 'À démarrer' as ProjectStatus }
    ]
  },
  {
    client: 'COFINA',
    sector: 'Compagnie Financière Africaine',
    sites: [
      { name: 'Bobo — Agence', status: 'Livré' as ProjectStatus },
      { name: 'Bobo — R+1', status: 'Livré' as ProjectStatus },
      { name: 'Cissin', status: 'Livré' as ProjectStatus },
      { name: 'Zaca — RDC, R+1, R+2, R+3', status: 'Livré' as ProjectStatus }
    ]
  }
] as const
