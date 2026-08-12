# syntax=docker/dockerfile:1

# ---------------------------------------------------------------- construction
# Node 24 : `node:sqlite`, utilisé pour la base du site, y est stable et intégré
# — aucun module natif à compiler.
FROM node:24-bookworm-slim AS build
WORKDIR /app

# Les dépendances bougent moins souvent que le code : cette couche est mise en
# cache et n'est reconstruite qu'au changement de package-lock.json.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# `nuxt prepare` a besoin de nuxt.config.ts : il est donc lancé après la copie
# des sources, pas pendant l'installation.
COPY . .
RUN npm run postinstall && npm run build

# ----------------------------------------------------------------- exécution
FROM node:24-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000 \
    NUXT_DATA_DIR=/data

# Seul le résultat du build est embarqué : ni sources, ni dépendances de dev.
COPY --from=build /app/.output ./.output

# La base et les photos téléversées vivent sur un volume : elles survivent à
# chaque reconstruction de l'image.
RUN mkdir -p /data && chown -R node:node /data
VOLUME /data

USER node
EXPOSE 3000

# Une page servie suffit à prouver que le serveur répond et que la base se lit.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/content').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
