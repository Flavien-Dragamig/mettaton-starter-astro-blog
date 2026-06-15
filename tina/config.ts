import { defineConfig } from 'tinacms';

/**
 * Configuration TinaCMS self-host — starter Astro Blog (Mettaton, Lot 1).
 *
 * Frontière de repo (canon §3) : Tina édite UNIQUEMENT `src/content/`.
 * Le code, les composants et les layouts (`src/components/`, `src/layouts/`, config)
 * restent édités par Claude Code. Ce schéma est le MIROIR de `src/content.config.ts`
 * (collection `blog`) : tout changement de champ doit être répercuté dans les deux fichiers.
 *
 * Sécurité (canon §6.3) : l'admin (`/admin`) ne doit JAMAIS être exposé sans authentification.
 * Mode local : auth servie par `tinacms dev` (LocalBackendAuthProvider).
 * Prod : AuthJS via le backend self-host (contrat figé dans `tina/backend/handler.ts`, hébergé au Lot 4).
 */

// Branche/identifiants Git du backend Tina (renseignés au Lot 4 ; valeurs neutres en local).
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

// En mode local, l'API GraphQL est servie par le serveur `tinacms dev`.
// En prod, le backend self-host (Lot 4) expose son URL via TINA_PUBLIC_CONTENT_API_URL.
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export default defineConfig({
  branch,
  // ID + token : utilisés uniquement par le backend distant (Tina Cloud OU self-host). Vides en local.
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  // En local on laisse Tina cibler le serveur de dev ; en prod on force l'URL du backend self-host.
  contentApiUrlOverride: isLocal
    ? '/api/tina/gql'
    : process.env.TINA_PUBLIC_CONTENT_API_URL || '/api/tina/gql',

  build: {
    // L'admin statique est généré dans `public/admin` → servi sous `/admin` par Astro.
    publicFolder: 'public',
    outputFolder: 'admin',
  },

  media: {
    tina: {
      // Toutes les images vivent dans `public/assets` (chemins absolus `/assets/...`),
      // éditables via Tina sans friction. Modèle unifié des starters (cf. ADR images).
      mediaRoot: 'assets',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Articles de blog',
        // Miroir du loader Astro : glob `src/content/blog/**/*.{md,mdx}`.
        path: 'src/content/blog',
        format: 'mdx',
        ui: {
          // Slug du fichier = basé sur le titre pour les nouveaux articles.
          filename: {
            slugify: (values) =>
              `${(values?.title || 'nouvel-article')
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^a-z0-9-]/g, '')}`,
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titre',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            required: true,
            ui: { component: 'textarea' },
          },
          {
            type: 'datetime',
            name: 'pubDate',
            label: 'Date de publication',
            required: true,
          },
          {
            type: 'datetime',
            name: 'updatedDate',
            label: 'Date de mise à jour',
            required: false,
          },
          {
            type: 'image',
            name: 'heroImage',
            label: 'Image à la une',
            required: false,
          },
          {
            // Corps Markdown/MDX de l'article (rich-text WYSIWYG).
            type: 'rich-text',
            name: 'body',
            label: 'Contenu',
            isBody: true,
          },
        ],
      },
    ],
  },
});
