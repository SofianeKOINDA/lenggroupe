export type Review = {
  /** Nom réel de la personne, tel qu'elle a accepté d'être citée. */
  author: string
  /** Fonction et/ou entreprise, si la personne l'autorise. */
  role?: string
  /** Projet concerné — idéalement le slug d'une réalisation existante. */
  project?: string
  /** Note sur 5, uniquement si elle provient d'un avis réellement recueilli. */
  rating?: 1 | 2 | 3 | 4 | 5
  /** Date de recueil au format ISO (YYYY-MM-DD). */
  date?: string
  quote: string
}

/**
 * ⚠️ AVIS CLIENTS RÉELS UNIQUEMENT.
 *
 * Ce tableau est volontairement vide : aucun témoignage n'a été fourni à ce jour.
 * Les sections « avis » du site se masquent automatiquement tant qu'il l'est,
 * plutôt que d'afficher des témoignages inventés.
 *
 * Pour les remplir, recueillez l'accord écrit de chaque client (nom, fonction,
 * citation) puis ajoutez une entrée ici. N'inventez jamais d'avis : c'est une
 * pratique trompeuse, sanctionnée par Google et par le droit de la consommation.
 *
 * Le balisage schema.org AggregateRating ne sera émis que lorsque de vraies
 * notes seront présentes — voir app/composables/useJsonLd.ts.
 */
export const reviews: Review[] = []
