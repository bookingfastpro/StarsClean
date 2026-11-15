# Star's Clean Conciergerie – site web

Site de la conciergerie Star's Clean (Corse-du-Sud) : présentation, catalogue des biens, prestations
et panneau de gestion des biens (`/admin`).

## Lancer en local

```bash
npm install
npm run dev        # http://localhost:3000
```

Production : `npm run build` puis `npm start` (ou `docker compose up`).

## Variables d'environnement

Voir `.env.example`. Les plus importantes :

| Variable | Rôle |
| --- | --- |
| `SITE_URL` | Adresse publique du site (canonical, sitemap, robots.txt) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Connexion au panneau `/admin` |
| `ADMIN_SESSION_SECRET` | Signature des sessions administrateur |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Base de données et photos (voir `SUPABASE_SETUP.md`) |

## Organisation du code

- `server.ts` – serveur Express : API, authentification, balises SEO injectées par page, `sitemap.xml`, `robots.txt`.
- `shared/` – code commun serveur + navigateur : routes, méta-données SEO, données structurées, prestations, pages locales.
- `src/pages/` – pages publiques ; `src/admin/` – panneau de gestion des biens (chargé uniquement sur `/admin`).

## Référencement

- Chaque page a sa propre URL, son titre, sa description, sa balise canonique et ses données structurées (JSON-LD).
- Pages locales : `/conciergerie-bonifacio`, `/conciergerie-porto-vecchio` (contenu dans `shared/localPages.ts`).
- Pour ajouter une ville : ajoutez une entrée dans `LOCAL_PAGES` avec un texte **unique**.
