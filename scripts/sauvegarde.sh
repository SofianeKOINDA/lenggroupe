#!/usr/bin/env bash
# Sauvegarde du site sans l'arrêter.
#
# `VACUUM INTO` produit une copie cohérente de la base même pendant une
# écriture — contrairement à un simple `cp`, qui peut attraper un fichier
# à moitié écrit quand le mode WAL est actif.
#
# Usage : ./scripts/sauvegarde.sh [dossier de destination]

set -euo pipefail

cd "$(dirname "$0")/.."

DEST=${1:-./sauvegardes}
STAMP=$(date +%Y%m%d-%H%M)
mkdir -p "$DEST"

rm -f data/sauvegarde-en-cours.sqlite

docker compose exec -T site node -e "
  const { DatabaseSync } = require('node:sqlite')
  new DatabaseSync('/data/lenggroupe.sqlite')
    .exec(\"VACUUM INTO '/data/sauvegarde-en-cours.sqlite'\")
"

mv data/sauvegarde-en-cours.sqlite "$DEST/base-$STAMP.sqlite"

if [ -d data/uploads ]; then
  tar czf "$DEST/photos-$STAMP.tar.gz" -C data uploads
fi

echo "Sauvegarde écrite dans $DEST :"
ls -lh "$DEST" | tail -2

# Ne garde que les 30 dernières sauvegardes de chaque type.
ls -1t "$DEST"/base-*.sqlite 2>/dev/null | tail -n +31 | xargs -r rm --
ls -1t "$DEST"/photos-*.tar.gz 2>/dev/null | tail -n +31 | xargs -r rm --
