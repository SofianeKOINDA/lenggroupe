import { site } from '~/data/site'
import type { Review } from '~/data/reviews'
import type { FaqItem } from '~/data/faq'

type Json = Record<string, unknown>

/** Injecte un bloc <script type="application/ld+json"> dans le <head>. */
export function useJsonLd(data: Json | Json[]) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => JSON.stringify(data))
      }
    ]
  })
}

export function useSiteUrl() {
  return useRuntimeConfig().public.siteUrl as string
}

/** Fiche établissement local — à poser une seule fois, sur l'accueil. */
export function localBusinessSchema(baseUrl: string, reviews: Review[] = []): Json {
  const schema: Json = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${baseUrl}/#organization`,
    name: site.name,
    legalName: site.legal,
    description: site.description,
    url: baseUrl,
    telephone: site.phone,
    email: site.email,
    image: `${baseUrl}/img/projets/villa-r1-grise-01.jpg`,
    priceRange: '$$',
    currenciesAccepted: 'XOF',
    areaServed: { '@type': 'Country', name: 'Burkina Faso' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue 09, Pilimpiku',
      addressLocality: 'Ouagadougou',
      addressCountry: 'BF'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng
    },
    openingHoursSpecification: site.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes
    }))
  }

  // AggregateRating uniquement si de vrais avis notés existent : publier une
  // note inventée est trompeur et sanctionné par Google.
  const rated = reviews.filter((r) => typeof r.rating === 'number')
  if (rated.length) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: (rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length).toFixed(1),
      reviewCount: rated.length,
      bestRating: 5
    }
    schema.review = rated.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      datePublished: r.date,
      reviewBody: r.quote
    }))
  }

  return schema
}

export function breadcrumbSchema(
  baseUrl: string,
  trail: { label: string; to?: string }[]
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: `${baseUrl}${item.to}` } : {})
    }))
  }
}

export function faqSchema(items: FaqItem[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  }
}
