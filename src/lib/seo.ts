import { useEffect } from 'react';
import { getPageMeta, renderHeadTags, type Route } from '../../shared/seo';
import { DEFAULT_SITE_URL } from '../../shared/site';
import type { Property } from '../types';

declare global {
  interface Window {
    __SITE_URL__?: string;
  }
}

/** URL publique du site, fournie par le serveur (la même que pour les balises canoniques). */
const siteUrl = () => window.__SITE_URL__ || DEFAULT_SITE_URL;

/** Met à jour <title>, meta description, canonical, Open Graph et JSON-LD à chaque changement de page. */
export function useSeo(route: Route, properties: Property[], path: string) {
  useEffect(() => {
    const url = siteUrl();
    const meta = getPageMeta(route, properties, url);
    document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
    document.head.insertAdjacentHTML('beforeend', renderHeadTags(meta, url));
    document.title = meta.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, properties]);
}
