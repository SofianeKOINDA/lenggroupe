<script setup lang="ts">
import { site } from '~/data/site'

useSeoMeta({
  title: 'Politique de confidentialité',
  description:
    "Comment LENG GROUPE collecte, utilise et protège vos données personnelles, et comment exercer vos droits."
})

const updated = '11 août 2026'
</script>

<template>
  <div>
    <PageHero
      eyebrow="Mentions"
      title="Politique de confidentialité"
      :text="`Dernière mise à jour : ${updated}`"
      :breadcrumb="[{ label: 'Politique de confidentialité' }]"
    />

    <section class="container-page py-20">
      <div class="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <article class="max-w-2xl space-y-10">
          <div>
            <h2 class="text-2xl font-extrabold">1. Qui est responsable de vos données</h2>
            <p class="mt-4 leading-relaxed text-ink-600">
              {{ site.legal }}, dont le siège est situé {{ site.address }}, est responsable du
              traitement des données personnelles collectées via le site
              <strong>lenggroupe.bf</strong>. Pour toute question, écrivez à
              <a :href="`mailto:${site.email}`" class="font-medium text-brand-600 hover:underline">
                {{ site.email }}
              </a>
              ou appelez le {{ site.phone }}.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-extrabold">2. Les données que nous collectons</h2>
            <p class="mt-4 leading-relaxed text-ink-600">
              Nous ne collectons que ce que vous nous transmettez volontairement, et rien de plus :
            </p>
            <ul class="mt-4 space-y-2 text-ink-600">
              <li class="flex gap-3">
                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
                <span>
                  <strong class="text-ink-950">Formulaire de contact et de devis</strong> : nom,
                  numéro de téléphone, adresse email, et les informations que vous choisissez de
                  décrire (type de projet, budget indicatif, localisation du terrain, échéance).
                </span>
              </li>
              <li class="flex gap-3">
                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
                <span>
                  <strong class="text-ink-950">Données de navigation</strong> : pages consultées,
                  provenance, type d'appareil, sous forme agrégée et anonymisée, uniquement si la
                  mesure d'audience est activée (voir section 5).
                </span>
              </li>
            </ul>
            <p class="mt-4 leading-relaxed text-ink-600">
              Nous ne collectons aucune donnée sensible et ne demandons jamais d'informations
              bancaires via ce site.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-extrabold">3. Pourquoi nous les utilisons</h2>
            <p class="mt-4 leading-relaxed text-ink-600">
              Vos données servent exclusivement à répondre à votre demande, établir un devis, assurer
              le suivi de votre projet et conserver une trace de nos échanges contractuels. La base
              légale est votre consentement, puis l'exécution de mesures précontractuelles ou du
              contrat.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-extrabold">4. Combien de temps nous les conservons</h2>
            <p class="mt-4 leading-relaxed text-ink-600">
              Les demandes sans suite sont conservées 3 ans à compter du dernier contact. Les données
              liées à un chantier réalisé sont conservées pendant la durée légale de conservation des
              pièces contractuelles et comptables, puis supprimées.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-extrabold">5. Cookies et mesure d'audience</h2>
            <p class="mt-4 leading-relaxed text-ink-600">
              Le site ne dépose aucun cookie publicitaire et ne pratique aucun profilage. Si la
              mesure d'audience Google Analytics est activée, elle l'est en mode anonymisé, à seule
              fin de comprendre quelles pages sont utiles à nos visiteurs. Vous pouvez la refuser
              via les réglages de votre navigateur ou une extension de blocage.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-extrabold">6. Avec qui nous les partageons</h2>
            <p class="mt-4 leading-relaxed text-ink-600">
              Vos données ne sont ni vendues, ni louées, ni cédées à des tiers à des fins
              commerciales. Elles peuvent être traitées par nos prestataires techniques
              (hébergement du site, service d'envoi d'emails) agissant sur nos instructions, ainsi
              que par nos partenaires directement impliqués dans l'exécution de votre chantier.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-extrabold">7. Vos droits</h2>
            <p class="mt-4 leading-relaxed text-ink-600">
              Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition et de
              portabilité sur vos données. Pour l'exercer, écrivez à
              <a :href="`mailto:${site.email}`" class="font-medium text-brand-600 hover:underline">
                {{ site.email }}
              </a>
              en précisant votre demande. Nous répondons sous 30 jours. Au Burkina Faso, vous pouvez
              également saisir la Commission de l'Informatique et des Libertés (CIL).
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-extrabold">8. Sécurité</h2>
            <p class="mt-4 leading-relaxed text-ink-600">
              Le site est servi en HTTPS et l'accès aux demandes reçues est restreint aux personnes
              de l'équipe qui en ont besoin pour traiter votre dossier.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-extrabold">9. Modifications</h2>
            <p class="mt-4 leading-relaxed text-ink-600">
              Cette politique peut être mise à jour. La date en tête de page indique la version en
              vigueur.
            </p>
          </div>
        </article>

        <aside class="space-y-6 lg:sticky lg:top-28">
          <div class="rounded-xl bg-ink-50 p-8">
            <h2 class="font-display text-lg font-extrabold">Une question sur vos données ?</h2>
            <p class="mt-3 text-sm leading-relaxed text-ink-600">
              Écrivez-nous, nous répondons sous {{ site.responseTime }}.
            </p>
            <NuxtLink
              to="/contact"
              class="mt-6 inline-block rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Nous contacter
            </NuxtLink>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
