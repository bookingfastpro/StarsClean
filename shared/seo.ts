/**
 * Routage + SEO partagés entre le serveur (balises injectées dans le HTML, sitemap)
 * et le navigateur (mise à jour des balises lors de la navigation).
 */
import type { Property, Service } from './types';
import { SERVICES } from './services';
import { LOCAL_PAGES, HOME_FAQ, type FaqItem, type LocalPage } from './localPages';
import { BUSINESS } from './site';

// ---------------------------------------------------------------------------
// Chemins
// ---------------------------------------------------------------------------
export const PATHS = {
  home: '/',
  conciergerie: '/conciergerie-proprietaires',
  properties: '/locations',
  sejours: '/gestion-sejours',
  prestations: '/prestations',
  contact: '/contact',
  admin: '/admin',
} as const;

export const propertyPath = (slug: string) => `${PATHS.properties}/${slug}`;
export const servicePath = (s: Service) => `${PATHS.prestations}/${s.slug}`;
export const localPath = (l: LocalPage) => `/${l.slug}`;

export type RouteName =
  | 'home'
  | 'conciergerie'
  | 'properties'
  | 'detail'
  | 'sejours'
  | 'prestations'
  | 'service-detail'
  | 'contact'
  | 'admin'
  | 'local'
  | 'notfound';

export interface Route {
  name: RouteName;
  param?: string;
}

export function normalizePath(pathname: string): string {
  let p = pathname || '/';
  try {
    p = decodeURIComponent(p);
  } catch {
    /* garde tel quel */
  }
  if (p.length > 1 && p.endsWith('/')) p = p.replace(/\/+$/, '');
  return p || '/';
}

export function parseRoute(pathname: string): Route {
  const p = normalizePath(pathname);
  if (p === '/') return { name: 'home' };
  if (p === PATHS.conciergerie) return { name: 'conciergerie' };
  if (p === PATHS.properties) return { name: 'properties' };
  if (p.startsWith(PATHS.properties + '/')) return { name: 'detail', param: p.slice(PATHS.properties.length + 1) };
  if (p === PATHS.sejours) return { name: 'sejours' };
  if (p === PATHS.prestations) return { name: 'prestations' };
  if (p.startsWith(PATHS.prestations + '/')) return { name: 'service-detail', param: p.slice(PATHS.prestations.length + 1) };
  if (p === PATHS.contact) return { name: 'contact' };
  if (p === PATHS.admin) return { name: 'admin' };
  const local = LOCAL_PAGES.find((l) => `/${l.slug}` === p);
  if (local) return { name: 'local', param: local.slug };
  return { name: 'notfound' };
}

// ---------------------------------------------------------------------------
// Slugs des biens
// ---------------------------------------------------------------------------
export function slugify(input: string): string {
  return (input || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'bien';
}

/** Associe un slug unique et stable à chaque bien (le titre, suffixé en cas de doublon). */
export function buildPropertySlugs(properties: Property[]): Map<string, string> {
  const used = new Set<string>();
  const map = new Map<string, string>();
  // Ordre stable : par date de création puis id, pour que les suffixes ne changent pas.
  const sorted = [...properties].sort((a, b) =>
    String(a.created_at || '').localeCompare(String(b.created_at || '')) || String(a.id).localeCompare(String(b.id)),
  );
  for (const p of sorted) {
    let slug = slugify(p.title);
    if (used.has(slug)) slug = `${slug}-${String(p.id).slice(0, 6).toLowerCase()}`;
    used.add(slug);
    map.set(String(p.id), slug);
  }
  return map;
}

export function findPropertyBySlug(properties: Property[], slug: string): Property | undefined {
  const slugs = buildPropertySlugs(properties);
  return properties.find((p) => slugs.get(String(p.id)) === slug);
}

export const findService = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const findLocalPage = (slug: string) => LOCAL_PAGES.find((l) => l.slug === slug);

export const CATEGORY_LABELS: Record<string, string> = {
  studios: 'Studios / T2',
  minivillas: 'Mini villas',
  villas: 'Villas',
  appartements: 'Appartements',
  all: 'Tous',
};

// ---------------------------------------------------------------------------
// Méta-données
// ---------------------------------------------------------------------------
export interface PageMeta {
  title: string;
  description: string;
  /** Chemin canonique (sans domaine). */
  path: string;
  image: string;
  noindex?: boolean;
  status: number;
  ogType?: string;
  jsonLd: object[];
}

const truncate = (s: string, n = 158) => {
  const clean = (s || '').replace(/\s+/g, ' ').trim();
  return clean.length > n ? clean.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : clean;
};

const abs = (siteUrl: string, path: string) => (path.startsWith('http') ? path : siteUrl.replace(/\/$/, '') + path);

export function businessJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#business`,
    name: BUSINESS.name,
    alternateName: ["Star's Clean", 'Conciergerie Prestige 2A'],
    description:
      "Conciergerie et gestion locative en Corse-du-Sud : gestion de locations saisonnières, accueil des voyageurs, ménage et services de conciergerie à Bonifacio, Porto-Vecchio et dans l'extrême Sud de la Corse.",
    url: siteUrl + '/',
    logo: BUSINESS.logo,
    image: BUSINESS.heroImage,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    foundingDate: BUSINESS.foundingYear,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressRegion: BUSINESS.region,
      addressCountry: 'FR',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Corse-du-Sud' },
      { '@type': 'AdministrativeArea', name: 'Corse' },
      ...BUSINESS.areaServed.map((name) => ({ '@type': 'City', name })),
    ],
    knowsAbout: ['Conciergerie', 'Gestion locative', 'Location saisonnière', 'Ménage professionnel', 'Accueil des voyageurs'],
    sameAs: [BUSINESS.instagram],
  };
}

function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function breadcrumb(siteUrl: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Accueil', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(siteUrl, it.path),
    })),
  };
}

export function getPageMeta(route: Route, properties: Property[], siteUrl: string): PageMeta {
  const base = { image: BUSINESS.heroImage, status: 200, jsonLd: [] as object[] };
  switch (route.name) {
    case 'home':
      return {
        ...base,
        title: "Conciergerie Corse-du-Sud – Bonifacio & Porto-Vecchio | Star's Clean",
        description:
          "Star's Clean, conciergerie en Corse-du-Sud depuis 2021 : gestion locative, location saisonnière, accueil, ménage et services à Bonifacio, Porto-Vecchio et dans l'extrême Sud de la Corse.",
        path: '/',
        jsonLd: [
          businessJsonLd(siteUrl),
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            name: BUSINESS.name,
            url: siteUrl + '/',
            inLanguage: 'fr-FR',
            publisher: { '@id': `${siteUrl}/#business` },
          },
          faqJsonLd(HOME_FAQ),
        ],
      };
    case 'conciergerie':
      return {
        ...base,
        title: "Gestion locative en Corse-du-Sud pour propriétaires – Tarifs | Star's Clean",
        description:
          "Confiez votre location saisonnière en Corse-du-Sud à Star's Clean : réservations, accueil, ménage, assistance 24/7. Forfait Saison 30 % ou 200 €/mois. Bonifacio, Porto-Vecchio.",
        path: PATHS.conciergerie,
        image: BUSINESS.teamImage,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Conciergerie et gestion locative',
            name: 'Gestion locative et conciergerie pour propriétaires',
            provider: { '@id': `${siteUrl}/#business` },
            areaServed: ['Corse-du-Sud', ...BUSINESS.areaServed],
            offers: [
              { '@type': 'Offer', name: 'Forfait Saison', description: '30 % du revenu locatif net, payé en fin de saison' },
              { '@type': 'Offer', name: 'Forfait Mensualisation', price: '200', priceCurrency: 'EUR', description: 'Par mois, régularisation en fin de saison' },
            ],
          },
          breadcrumb(siteUrl, [{ name: 'Propriétaires', path: PATHS.conciergerie }]),
        ],
      };
    case 'properties':
      return {
        ...base,
        title: "Locations de vacances en Corse-du-Sud – Villas & appartements | Star's Clean",
        description:
          "Villas avec piscine, mini-villas et appartements à louer à Bonifacio, Porto-Vecchio et Pianottoli-Caldarello. Locations de vacances gérées par Star's Clean Conciergerie.",
        path: PATHS.properties,
        jsonLd: [breadcrumb(siteUrl, [{ name: 'Nos locations', path: PATHS.properties }])],
      };
    case 'detail': {
      const p = route.param ? findPropertyBySlug(properties, route.param) : undefined;
      if (!p) return notFound(base);
      const path = propertyPath(route.param!);
      const type = p.category === 'villas' || p.category === 'minivillas' ? 'House' : 'Apartment';
      return {
        ...base,
        title: `${p.title} – Location ${p.location} | Star's Clean`,
        description: truncate(`${p.title} à ${p.location} · ${p.capacity} · ${p.beds} chambre(s). ${p.desc}`),
        path,
        image: p.images?.[0] || base.image,
        ogType: 'website',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': type,
            name: p.title,
            description: truncate(p.desc, 500),
            url: abs(siteUrl, path),
            image: p.images?.slice(0, 6),
            numberOfRooms: p.beds,
            numberOfBathroomsTotal: p.bathrooms,
            amenityFeature: (p.features || []).map((f) => ({ '@type': 'LocationFeatureSpecification', name: f, value: true })),
            address: { '@type': 'PostalAddress', addressLocality: p.location, addressRegion: 'Corse-du-Sud', addressCountry: 'FR' },
          },
          breadcrumb(siteUrl, [
            { name: 'Nos locations', path: PATHS.properties },
            { name: p.title, path },
          ]),
        ],
      };
    }
    case 'sejours':
      return {
        ...base,
        title: "Organisation de séjour sur mesure en Corse-du-Sud | Star's Clean",
        description:
          "Bateau, plongée, randonnée, dégustation de vins, hélicoptère : Star's Clean Conciergerie organise votre séjour sur mesure dans l'extrême Sud de la Corse.",
        path: PATHS.sejours,
        image: BUSINESS.bonifacioImage,
        jsonLd: [breadcrumb(siteUrl, [{ name: 'Gestion des séjours', path: PATHS.sejours }])],
      };
    case 'prestations':
      return {
        ...base,
        title: "Prestations de conciergerie en Corse-du-Sud – Voiture, bateau, massage | Star's Clean",
        description:
          "Location de voiture à Figari, location de bateau, visite de caves, petit-déjeuner livré, massage à domicile et transferts aéroport : les prestations Star's Clean en Corse-du-Sud.",
        path: PATHS.prestations,
        jsonLd: [breadcrumb(siteUrl, [{ name: 'Prestations', path: PATHS.prestations }])],
      };
    case 'service-detail': {
      const s = route.param ? findService(route.param) : undefined;
      if (!s) return notFound(base);
      const path = servicePath(s);
      return {
        ...base,
        title: s.seoTitle,
        description: s.seoDescription,
        path,
        image: s.images[0] || base.image,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: s.title,
            description: s.seoDescription,
            provider: { '@id': `${siteUrl}/#business` },
            areaServed: 'Corse-du-Sud',
            url: abs(siteUrl, path),
          },
          breadcrumb(siteUrl, [
            { name: 'Prestations', path: PATHS.prestations },
            { name: s.title, path },
          ]),
        ],
      };
    }
    case 'local': {
      const l = route.param ? findLocalPage(route.param) : undefined;
      if (!l) return notFound(base);
      return {
        ...base,
        title: l.seoTitle,
        description: l.seoDescription,
        path: localPath(l),
        image: l.image,
        jsonLd: [
          {
            ...businessJsonLd(siteUrl),
            '@id': undefined,
            '@type': 'LocalBusiness',
            name: `${BUSINESS.name} – ${l.city}`,
            url: abs(siteUrl, localPath(l)),
            areaServed: { '@type': 'City', name: l.city },
            parentOrganization: { '@id': `${siteUrl}/#business` },
          },
          faqJsonLd(l.faq),
          breadcrumb(siteUrl, [{ name: `Conciergerie ${l.city}`, path: localPath(l) }]),
        ],
      };
    }
    case 'contact':
      return {
        ...base,
        title: "Contact – Star's Clean Conciergerie Corse-du-Sud",
        description: `Contactez Star's Clean Conciergerie au ${BUSINESS.phoneDisplay} ou par e-mail : gestion locative, réservation de séjour et prestations en Corse-du-Sud.`,
        path: PATHS.contact,
        jsonLd: [breadcrumb(siteUrl, [{ name: 'Contact', path: PATHS.contact }])],
      };
    case 'admin':
      return { ...base, title: "Gestion des biens – Star's Clean", description: 'Espace privé', path: PATHS.admin, noindex: true };
    default:
      return notFound(base);
  }
}

function notFound(base: { image: string; jsonLd: object[] }): PageMeta {
  return {
    ...base,
    title: "Page introuvable – Star's Clean Conciergerie",
    description: "Cette page n'existe pas ou n'est plus disponible.",
    path: '/',
    noindex: true,
    status: 404,
  };
}

// ---------------------------------------------------------------------------
// Rendu HTML des balises <head>
// ---------------------------------------------------------------------------
const escAttr = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const safeJson = (data: unknown) =>
  JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

export function renderHeadTags(meta: PageMeta, siteUrl: string): string {
  const url = abs(siteUrl, meta.path);
  const tags = [
    `<title data-seo>${escAttr(meta.title)}</title>`,
    `<meta data-seo name="description" content="${escAttr(meta.description)}">`,
    `<meta data-seo name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">`,
    meta.noindex ? '' : `<link data-seo rel="canonical" href="${escAttr(url)}">`,
    `<meta data-seo property="og:type" content="${escAttr(meta.ogType || 'website')}">`,
    `<meta data-seo property="og:site_name" content="${escAttr(BUSINESS.name)}">`,
    `<meta data-seo property="og:locale" content="fr_FR">`,
    `<meta data-seo property="og:title" content="${escAttr(meta.title)}">`,
    `<meta data-seo property="og:description" content="${escAttr(meta.description)}">`,
    `<meta data-seo property="og:url" content="${escAttr(url)}">`,
    `<meta data-seo property="og:image" content="${escAttr(meta.image)}">`,
    `<meta data-seo name="twitter:card" content="summary_large_image">`,
    `<meta data-seo name="twitter:title" content="${escAttr(meta.title)}">`,
    `<meta data-seo name="twitter:description" content="${escAttr(meta.description)}">`,
    `<meta data-seo name="twitter:image" content="${escAttr(meta.image)}">`,
    ...meta.jsonLd.map((j) => `<script data-seo type="application/ld+json">${safeJson(j)}</script>`),
  ];
  return tags.filter(Boolean).join('\n    ');
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------
export function buildSitemap(properties: Property[], siteUrl: string): string {
  const visible = properties.filter((p) => p.isVisible !== false);
  const slugs = buildPropertySlugs(properties);
  const entries: { path: string; priority: string; changefreq: string; lastmod?: string }[] = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    ...LOCAL_PAGES.map((l) => ({ path: localPath(l), priority: '0.9', changefreq: 'monthly' })),
    { path: PATHS.conciergerie, priority: '0.9', changefreq: 'monthly' },
    { path: PATHS.properties, priority: '0.8', changefreq: 'weekly' },
    ...visible.map((p) => ({
      path: propertyPath(slugs.get(String(p.id))!),
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: p.created_at ? p.created_at.slice(0, 10) : undefined,
    })),
    { path: PATHS.sejours, priority: '0.6', changefreq: 'monthly' },
    { path: PATHS.prestations, priority: '0.7', changefreq: 'monthly' },
    ...SERVICES.map((s) => ({ path: servicePath(s), priority: '0.6', changefreq: 'monthly' })),
    { path: PATHS.contact, priority: '0.5', changefreq: 'yearly' },
  ];
  const body = entries
    .map(
      (e) =>
        `  <url><loc>${escAttr(abs(siteUrl, e.path))}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}<changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
