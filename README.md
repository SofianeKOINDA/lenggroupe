# Site LENG GROUPE

Site vitrine de LENG GROUPE (agence BTP, Ouagadougou) et son espace
d'administration. Nuxt 4, Tailwind 4, base SQLite.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

Au premier démarrage, la base est créée dans `data/` et remplie avec le contenu
présent dans `app/data/*.ts`. Un mot de passe administrateur est généré et
**affiché une seule fois dans le terminal** — notez-le, ou définissez
`NUXT_ADMIN_PASSWORD` avant de lancer (voir `.env.example`).

L'administration est sur [`/admin`](http://localhost:3000/admin).

## Ce que gère le dashboard

| Écran | Contenu |
| --- | --- |
| Tableau de bord | Fréquentation, sources, pages vues, demandes, conversion |
| Demandes | Contacts et devis reçus : statut, notes, export CSV |
| Réalisations | Chantiers, photos, chiffres clés, étude de cas |
| Services · FAQ · Avis · Équipe | Contenu éditorial du site |
| Réglages | Mot de passe |

Restent dans le code, parce qu'ils changent rarement : les coordonnées de
l'agence et les chiffres clés (`app/data/site.ts`), les étapes de la méthode et
les engagements (`app/data/services.ts`), les réseaux d'agences accompagnés
(`app/data/projects.ts`).

## Données

Tout vit dans le dossier `data/` :

- `data/lenggroupe.sqlite` — contenu du site, demandes reçues, statistiques ;
- `data/uploads/` — photos téléversées depuis le dashboard.

Ce dossier n'est pas versionné. **La sauvegarde du site, c'est la copie de ce
dossier.** À faire régulièrement, et avant toute mise à jour.

Placez-le en dehors du répertoire de déploiement (`NUXT_DATA_DIR`) pour qu'un
redéploiement ne l'écrase jamais.

## Mesure d'audience

Les statistiques sont calculées par le site lui-même : aucun cookie, aucune
donnée envoyée à un tiers, aucune adresse IP conservée (les visiteurs sont
comptés via une empreinte anonyme renouvelée chaque jour). Google Analytics
reste disponible en parallèle si `NUXT_PUBLIC_GTAG_ID` est renseigné.

## Mise en production (VPS Ubuntu + Docker)

Le site a besoin d'un serveur **Node** qui tourne en continu : `npm run generate`
(site statique) est incompatible avec le dashboard et l'enregistrement des
demandes.

Le VPS héberge déjà un autre projet (`farmlink`, dans `/opt/farmlink`) dont le
Caddy détient les ports 80 et 443. Ce site ne les réclame pas : il tourne dans
un conteneur sans port publié, et le proxy existant l'atteint par un réseau
Docker partagé. Aucun redémarrage de l'autre site n'est nécessaire.

### Une seule fois

```bash
# 1. Réseau partagé entre le proxy et les sites qu'il dessert
docker network create proxy
docker network connect proxy farmlink_caddy      # à chaud, sans coupure

# 2. Le projet
git clone <votre-dépôt> /opt/lenggroupe && cd /opt/lenggroupe
cp .env.example .env && nano .env                # NUXT_ADMIN_PASSWORD au minimum
mkdir -p data && chown -R 1000:1000 data         # uid du conteneur

# 3. Démarrer le site
docker compose up -d --build
docker compose logs -f site

# 4. Ajouter le contenu de ./Caddyfile au Caddyfile du proxy, puis
docker compose -f /opt/farmlink/docker-compose.yml exec caddy \
  caddy reload --config /etc/caddy/Caddyfile
```

Pour que l'appartenance au réseau `proxy` survive à une recréation du conteneur
Caddy, ajoutez-la aussi au `docker-compose.yml` de `farmlink` :

```yaml
services:
  caddy:
    networks: [default, proxy]

networks:
  proxy:
    external: true
```

### Mettre à jour

```bash
cd /opt/lenggroupe
git pull
docker compose up -d --build
```

Le proxy n'est pas touché : seul le conteneur du site est reconstruit.

Le dossier `data/` n'est jamais touché par une reconstruction : contenu,
demandes reçues et photos sont conservés.

### Sauvegardes

```bash
./scripts/sauvegarde.sh                  # → ./sauvegardes
```

Copie à chaud de la base (`VACUUM INTO`, cohérente même pendant une écriture)
et archive des photos, les 30 dernières conservées. À automatiser :

```bash
crontab -e
0 3 * * * cd /srv/lenggroupe && ./scripts/sauvegarde.sh >> /var/log/leng-backup.log 2>&1
```

Pensez à recopier ces sauvegardes hors du VPS — une sauvegarde qui vit sur la
machine sauvegardée ne protège de rien.

### Restaurer

```bash
docker compose stop site
cp sauvegardes/base-AAAAMMJJ-HHMM.sqlite data/lenggroupe.sqlite
rm -f data/lenggroupe.sqlite-wal data/lenggroupe.sqlite-shm
tar xzf sauvegardes/photos-AAAAMMJJ-HHMM.tar.gz -C data
sudo chown -R 1000:1000 data
docker compose start site
```

### Sans Docker

```bash
npm ci && npm run build
NUXT_DATA_DIR=/var/lib/lenggroupe node .output/server/index.mjs
```

À placer derrière un service systemd et un reverse proxy HTTPS : le cookie de
session n'est émis en `Secure` qu'en production, et un mot de passe qui transite
en clair ne protège rien.
