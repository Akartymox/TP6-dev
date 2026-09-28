# TP6 — Réducteur d'URL Node.js/Express

## Auteur
Liam J.

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

Créer un fichier `.env` à la racine :

\`\`\`env
PORT=8080
LINK_LEN=6
DB_FILE=database/database.sqlite
DB_SCHEMA=database/database.sql
\`\`\`

## Lancement

- Développement : `npm run dev`
- Production : `npm run prod`

Accès à la doc interactive : <http://localhost:8080/api-docs>

## Routes

### API v1 (`/api-v1`)
- `GET /` → nombre de liens
- `POST /` → créer un lien
- `GET /status/:url` → infos du lien
- `GET /:url` → redirection
- `GET /error` → test 500

### API v2 (`/api-v2`)
- `GET /` → JSON count OU HTML form
- `POST /` → JSON link OU HTML page
- `GET /:url` → JSON status OU HTML redirect
- `DELETE /:url` → suppression avec X-API-KEY

## Tags Git

- `reponses` : partie 1
- `api-v1` : partie 2
- `api-v2` : partie 3
- `client-ajax` : partie 4
- `api-v2-delete` : partie 5

## Déploiement

Déployé sur Render : <https://tp6-dev.onrender.com>