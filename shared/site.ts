/**
 * Informations de l'entreprise, utilisées partout (pages, balises SEO, données structurées).
 * ⚠️ Gardez ces informations STRICTEMENT identiques à votre fiche Google Business Profile
 * (nom, téléphone, adresse) : la cohérence « NAP » est un facteur clé du référencement local.
 */
export const DEFAULT_SITE_URL = 'https://conciergerie-corse-du-sud.com';

const STORAGE = 'https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images';

export const BUSINESS = {
  name: "Star's Clean Conciergerie",
  shortName: "Star's Clean",
  phone: '+33642658598',
  phoneDisplay: '+33 6 42 65 85 98',
  email: 'conciergerie.prestige2a@gmail.com',
  instagram: 'https://www.instagram.com/conciergerie_prestige2a/',
  googleReviewsUrl: 'https://share.google/pYtB9A5Wx0rAZWp1c',
  bookingUrl: 'https://conciergerie-star-s-clean.amenitiz.io/fr/booking/room#DatesGuests-BE',
  foundingYear: '2021',
  logo: `${STORAGE}/logo-en-cours-stars-clean-conciergerie-V5-blanc.png`,
  heroImage: `${STORAGE}/properties/1776076788739-g4kq76f7xcq.jpg`,
  teamImage: `${STORAGE}/properties/1776702830928-iaob3fpycmb.jpg`,
  bonifacioImage: `${STORAGE}/calanques-de-bonifacio.jpg`,
  region: 'Corse-du-Sud',
  /** Communes desservies (affichées sur le site et dans les données structurées). */
  areaServed: [
    'Bonifacio',
    'Porto-Vecchio',
    'Figari',
    'Pianottoli-Caldarello',
    'Sotta',
    'Lecci',
    'Zonza',
    'Propriano',
  ],
};

export const telHref = `tel:${BUSINESS.phone}`;
export const mailHref = `mailto:${BUSINESS.email}`;
