# Mettaton Starter — Astro Blog

Starter Mettaton basé sur le template officiel Astro Blog. Prêt à cloner et personnaliser.

## Démarrage

```bash
npm install     # installe les dépendances
npm run dev     # serveur de dev sur http://localhost:4321
npm run build   # build de production dans dist/ (admin Tina inclus, voir ci-dessous)
```

## Édition de contenu (TinaCMS)

Ce starter intègre **TinaCMS self-host** pour l'édition WYSIWYG du contenu.

### Frontière de repo (à respecter)

| Zone | Périmètre | Édité par |
|---|---|---|
| `src/content/` | Contenu éditorial (articles de blog) | **Tina** + Claude Code |
| `src/components/`, `src/layouts/`, config (`astro.config.mjs`, `tina/config.ts`…) | Code, structure, templates | **Claude Code uniquement** |

Le schéma Tina (`tina/config.ts`) est le **miroir** de `src/content.config.ts` : toute évolution
de champ doit être répercutée dans les deux fichiers pour rester cohérent.

### Lancer l'éditeur en local

```bash
cp .env.example .env.local       # TINA_PUBLIC_IS_LOCAL=true par défaut
npm run dev:cms                  # lance `tinacms dev` + `astro dev`
```

Puis ouvrir l'admin sur **http://localhost:4321/admin** (login local requis — l'admin n'est
**jamais** exposé sans authentification). Les modifications sont écrites dans `src/content/blog/`
puis commitées dans Git (source de vérité du contenu).

### Backend de production

En local, l'auth + le datalayer sont servis par `tinacms dev` (filesystem + git, sans base de
données). En production, le backend Tina self-host (datalayer + AuthJS + git provider) est hébergé
séparément (**Docker / Dokploy — Lot 4**) ; son contrat figure dans `tina/backend/handler.ts` et
les variables d'environnement correspondantes dans `.env.example`.
