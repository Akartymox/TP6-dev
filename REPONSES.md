# TP6 — Réponses Partie 1

## Q1 — Commande httpie équivalente à curl POST

\`\`\`bash
http POST http://localhost:8080/api-v1/ url="https://perdu.com"
\`\`\`

## Q2 — Différences npm run prod / npm run dev

| Aspect | dev | prod |
|---|---|---|
| NODE_ENV | development | production |
| Nodemon | oui (rechargement auto) | non |
| Morgan | activé | désactivé |
| Niveau de log | DEBUG | WARN |
| Stack trace d'erreur | affichée | masquée |

## Q3 — Script npm de formatage

\`\`\`json
"format": "prettier \"**/*.{mjs,json,css,md}\" --write"
\`\`\`

## Q4 — Masquer X-Powered-By

\`\`\`js
app.disable("x-powered-by");
\`\`\`

## Q5 — Middleware X-API-version

\`\`\`js
app.use((_request, response, next) => {
  response.setHeader("X-API-version", APP_VERSION);
  next();
});
\`\`\`

## Q6 — Middleware favicon

\`\`\`js
import favicon from "serve-favicon";
app.use(favicon("static/logo_univ_16.png"));
\`\`\`

## Q7 — Documentation SQLite

Driver : **better-sqlite3**
- https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
- https://www.sqlite.org/docs.html

## Q8 — Ouverture / fermeture de la connexion

La connexion SQLite est ouverte **au chargement du module** `database/database.mjs` (donc au démarrage du serveur) et fermée **à l'arrêt du process** (fermeture par Node.js ou par le système). better-sqlite3 garde la connexion ouverte tant que le process vit.

## Q9 — Cache Express

- **1er appel** : `200 OK`
- **Ctrl+R** : `304 Not Modified` (le navigateur envoie `If-None-Match` avec l'ETag reçu)
- **Ctrl+Shift+R** : `200 OK` (bypass du cache)

Express gère automatiquement les **ETag** → réponse `304` si la ressource n'a pas changé.

## Q10 — Deux instances sur ports différents

Les liens créés sur **8080** sont visibles sur **8081** (et inversement) parce que les deux instances partagent le **même fichier SQLite** (`database/database.sqlite`). La base de données est le point de stockage commun.