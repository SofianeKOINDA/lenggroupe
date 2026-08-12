import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, join, isAbsolute } from 'node:path'

/**
 * Base de données du site : un unique fichier SQLite.
 *
 * On utilise `node:sqlite`, intégré à Node depuis la 22.5, plutôt qu'un pilote
 * natif à compiler (better-sqlite3) : rien à installer sur le serveur, et
 * aucune dépendance à recompiler à chaque mise à jour de Node.
 *
 * Sauvegarde = copier le fichier. Le chemin est configurable via NUXT_DB_PATH
 * pour pouvoir stocker la base hors du dossier de déploiement (recommandé :
 * la base survit ainsi à un redéploiement qui écraserait le dossier du site).
 */

let instance: DatabaseSync | null = null

export function dataDir() {
  const configured = process.env.NUXT_DATA_DIR
  if (configured) return isAbsolute(configured) ? configured : join(process.cwd(), configured)
  return join(process.cwd(), 'data')
}

export function dbPath() {
  const configured = process.env.NUXT_DB_PATH
  if (configured) return isAbsolute(configured) ? configured : join(process.cwd(), configured)
  return join(dataDir(), 'lenggroupe.sqlite')
}

export function useDb(): DatabaseSync {
  if (instance) return instance

  const file = dbPath()
  mkdirSync(dirname(file), { recursive: true })

  const db = new DatabaseSync(file)
  // WAL : les lectures du site public ne sont jamais bloquées par une écriture
  // du dashboard. busy_timeout évite un SQLITE_BUSY sur écritures concurrentes.
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')
  db.exec('PRAGMA busy_timeout = 5000')

  migrate(db)
  instance = db
  return db
}

/**
 * Création du schéma. Chaque instruction est idempotente : la fonction est
 * rejouée à chaque démarrage, ce qui tient lieu de migration tant que le
 * schéma n'évolue que par ajout de tables ou de colonnes.
 */
function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      user_agent TEXT
    );

    CREATE TABLE IF NOT EXISTS leads (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      kind       TEXT NOT NULL DEFAULT 'contact',
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      email      TEXT,
      service    TEXT,
      budget     TEXT,
      location   TEXT,
      deadline   TEXT,
      message    TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'nouveau',
      notes      TEXT NOT NULL DEFAULT '',
      source     TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);
    CREATE INDEX IF NOT EXISTS leads_status_idx  ON leads (status);

    CREATE TABLE IF NOT EXISTS projects (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      slug       TEXT NOT NULL UNIQUE,
      title      TEXT NOT NULL,
      category   TEXT NOT NULL,
      location   TEXT NOT NULL DEFAULT '',
      year       TEXT NOT NULL DEFAULT '',
      status     TEXT NOT NULL DEFAULT 'Livré',
      summary    TEXT NOT NULL DEFAULT '',
      cover      TEXT NOT NULL DEFAULT '',
      gallery    TEXT NOT NULL DEFAULT '[]',
      facts      TEXT NOT NULL DEFAULT '[]',
      study      TEXT,
      published  INTEGER NOT NULL DEFAULT 1,
      position   INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT NOT NULL UNIQUE,
      title       TEXT NOT NULL,
      short       TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      image       TEXT NOT NULL DEFAULT '',
      points      TEXT NOT NULL DEFAULT '[]',
      published   INTEGER NOT NULL DEFAULT 1,
      position    INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS faq (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      question   TEXT NOT NULL,
      answer     TEXT NOT NULL,
      published  INTEGER NOT NULL DEFAULT 1,
      position   INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      author     TEXT NOT NULL,
      role       TEXT,
      project    TEXT,
      rating     INTEGER,
      date       TEXT,
      quote      TEXT NOT NULL,
      published  INTEGER NOT NULL DEFAULT 1,
      position   INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS team (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      role       TEXT NOT NULL DEFAULT '',
      photo      TEXT NOT NULL DEFAULT '',
      bio        TEXT NOT NULL DEFAULT '',
      published  INTEGER NOT NULL DEFAULT 1,
      position   INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      path       TEXT NOT NULL,
      referrer   TEXT,
      visitor    TEXT NOT NULL,
      device     TEXT NOT NULL DEFAULT 'desktop',
      created_at TEXT NOT NULL,
      day        TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS views_day_idx  ON page_views (day);
    CREATE INDEX IF NOT EXISTS views_path_idx ON page_views (path);

    CREATE TABLE IF NOT EXISTS events (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      path       TEXT,
      visitor    TEXT,
      created_at TEXT NOT NULL,
      day        TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS events_day_idx ON events (day, name);
  `)
}

/** Horodatage unique pour toutes les écritures : ISO 8601 en UTC. */
export const now = () => new Date().toISOString()

/** Jour calendaire (YYYY-MM-DD) utilisé pour agréger les statistiques. */
export const today = () => new Date().toISOString().slice(0, 10)

export function getSetting(key: string): string | null {
  const row = useDb().prepare('SELECT value FROM settings WHERE key = ?').get(key) as
    | { value: string }
    | undefined
  return row?.value ?? null
}

export function setSetting(key: string, value: string) {
  useDb()
    .prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .run(key, value)
}

/** Parse un champ JSON stocké en TEXT, en retombant sur une valeur par défaut. */
export function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== 'string' || !raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
