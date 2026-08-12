import { projects as seedProjects } from '../../app/data/projects'
import { services as seedServices } from '../../app/data/services'
import { faq as seedFaq } from '../../app/data/faq'
import { reviews as seedReviews } from '../../app/data/reviews'
import { team as seedTeam } from '../../app/data/team'

/**
 * Démarrage : ouvre la base (ce qui crée le schéma si besoin), y verse le
 * contenu initial la première fois, et s'assure qu'un mot de passe admin existe.
 *
 * Les fichiers `app/data/*.ts` restent la source du premier remplissage. Une
 * fois la base créée, c'est elle qui fait foi : ces fichiers ne sont plus
 * relus, et modifier le contenu passe désormais par le dashboard.
 */
export default defineNitroPlugin(() => {
  const db = useDb()

  const count = (table: string) =>
    (db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n

  if (getSetting('seeded') !== '1') {
    const ts = now()

    if (count('projects') === 0) {
      const stmt = db.prepare(`INSERT INTO projects
        (slug, title, category, location, year, status, summary, cover, gallery, facts, study, published, position, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`)
      seedProjects.forEach((p, i) => {
        stmt.run(
          p.slug,
          p.title,
          p.category,
          p.location,
          p.year,
          p.status,
          p.summary,
          p.cover,
          JSON.stringify(p.gallery),
          JSON.stringify(p.facts),
          p.study ? JSON.stringify(p.study) : null,
          i,
          ts,
          ts
        )
      })
    }

    if (count('services') === 0) {
      const stmt = db.prepare(`INSERT INTO services
        (slug, title, short, description, image, points, published, position, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`)
      seedServices.forEach((s, i) => {
        stmt.run(s.slug, s.title, s.short, s.description, s.image, JSON.stringify(s.points), i, ts, ts)
      })
    }

    if (count('faq') === 0) {
      const stmt = db.prepare(
        'INSERT INTO faq (question, answer, published, position, created_at, updated_at) VALUES (?, ?, 1, ?, ?, ?)'
      )
      seedFaq.forEach((f, i) => stmt.run(f.question, f.answer, i, ts, ts))
    }

    if (count('reviews') === 0) {
      const stmt = db.prepare(`INSERT INTO reviews
        (author, role, project, rating, date, quote, published, position, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`)
      seedReviews.forEach((r, i) =>
        stmt.run(r.author, r.role ?? null, r.project ?? null, r.rating ?? null, r.date ?? null, r.quote, i, ts, ts)
      )
    }

    if (count('team') === 0) {
      const stmt = db.prepare(
        'INSERT INTO team (name, role, photo, bio, published, position, created_at, updated_at) VALUES (?, ?, ?, ?, 1, ?, ?, ?)'
      )
      seedTeam.forEach((m, i) => stmt.run(m.name, m.role, m.photo, m.bio, i, ts, ts))
    }

    setSetting('seeded', '1')
  }

  ensureAdminPassword()
  purgeExpiredSessions()
})
