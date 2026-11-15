/**
 * Pages locales optimisées pour le référencement (« conciergerie Bonifacio », etc.).
 * Chaque page a un contenu unique : ne dupliquez pas les textes d'une ville à l'autre,
 * Google pénalise les pages « satellites » identiques.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export interface LocalPage {
  slug: string;
  city: string;
  /** Mot utilisé pour retrouver les biens de la ville (comparaison sur le champ « location »). */
  propertyMatch: string[];
  seoTitle: string;
  seoDescription: string;
  h1: string;
  tagline: string;
  intro: string[];
  zonesTitle: string;
  zones: { name: string; text: string }[];
  whyTitle: string;
  why: { title: string; text: string }[];
  faq: FaqItem[];
  image: string;
}

const STORAGE = 'https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images';

export const LOCAL_PAGES: LocalPage[] = [
  {
    slug: 'conciergerie-bonifacio',
    city: 'Bonifacio',
    propertyMatch: ['bonifacio'],
    seoTitle: "Conciergerie Bonifacio – Gestion locative & location saisonnière | Star's Clean",
    seoDescription:
      "Conciergerie à Bonifacio : gestion de votre location saisonnière, accueil des voyageurs, ménage, linge et optimisation des revenus. Star's Clean, conciergerie en Corse-du-Sud depuis 2021.",
    h1: 'Conciergerie à Bonifacio',
    tagline: 'Gestion locative et location saisonnière clé en main, de la citadelle à Santa Manza.',
    intro: [
      "Avec ses falaises calcaires, sa citadelle et l'archipel des Lavezzi à quelques minutes en bateau, Bonifacio est l'une des destinations les plus recherchées de Corse. Pour un propriétaire, c'est une formidable opportunité locative… à condition d'assurer un accueil irréprochable, un ménage parfait entre chaque séjour et une présence réactive en pleine saison.",
      "Star's Clean Conciergerie gère pour vous votre appartement, votre mini-villa ou votre villa à Bonifacio : création et optimisation des annonces, gestion du calendrier et des réservations, accueil des voyageurs, ménage professionnel, linge et assistance 7j/7. Vous percevez vos revenus, nous nous occupons du reste.",
    ],
    zonesTitle: 'Nous intervenons dans tout Bonifacio et ses environs',
    zones: [
      { name: 'Haute ville & citadelle', text: "Appartements de caractère au cœur des ruelles historiques, très demandés par les voyageurs." },
      { name: 'Port & quartier de la Marine', text: "Biens à quelques pas des quais, des restaurants et des départs de bateaux vers les Lavezzi." },
      { name: 'Santa Manza, Piantarella & Sperone', text: "Villas et mini-villas proches des plus belles plages et criques de la côte est de Bonifacio." },
      { name: 'Route de Porto-Vecchio & Rondinara', text: "Maisons au calme dans le maquis, idéales pour les familles et les longs séjours." },
    ],
    whyTitle: 'Pourquoi confier votre bien à une conciergerie à Bonifacio ?',
    why: [
      { title: 'Une équipe sur place', text: "Nous connaissons Bonifacio et ses contraintes (accès à la haute ville, stationnement, saisonnalité) et intervenons rapidement." },
      { title: 'Des revenus optimisés', text: "Tarification adaptée à la forte demande estivale et aux ailes de saison pour remplir votre calendrier." },
      { title: 'Des voyageurs choyés', text: "Accueil personnalisé, logement impeccable et accès à nos prestations : bateau, transferts depuis Figari, petit-déjeuner…" },
      { title: 'Zéro contrainte', text: "Ménage, linge, petites réparations, état des lieux : vous n'avez plus à vous déplacer." },
    ],
    faq: [
      {
        q: 'Combien coûte une conciergerie à Bonifacio ?',
        a: "Notre Forfait Saison est facturé 30 % du revenu locatif net, payé en fin de saison. Un Forfait Mensualisation à 200 € par mois (régularisé en fin de saison) et des prestations à la carte sur devis sont aussi disponibles.",
      },
      {
        q: 'Quels types de biens gérez-vous à Bonifacio ?',
        a: "Nous gérons des studios, appartements, mini-villas et villas, en location saisonnière comme en location de plus longue durée, à Bonifacio et dans les communes voisines (Figari, Pianottoli-Caldarello, Sotta).",
      },
      {
        q: 'Comment se passe l’accueil des voyageurs ?',
        a: "Un membre de notre équipe accueille vos voyageurs à leur arrivée, leur présente le logement et reste joignable pendant tout le séjour. Au départ, nous réalisons un état des lieux puis le ménage complet.",
      },
      {
        q: 'Pouvez-vous organiser le transfert depuis l’aéroport de Figari ?',
        a: "Oui. L'aéroport de Figari se trouve à une vingtaine de minutes de Bonifacio : nous organisons transferts privés et location de voiture pour vos voyageurs.",
      },
    ],
    image: `${STORAGE}/calanques-de-bonifacio.jpg`,
  },
  {
    slug: 'conciergerie-porto-vecchio',
    city: 'Porto-Vecchio',
    propertyMatch: ['porto-vecchio', 'porto vecchio'],
    seoTitle: "Conciergerie Porto-Vecchio – Gestion de location saisonnière | Star's Clean",
    seoDescription:
      "Conciergerie à Porto-Vecchio : gestion locative de villas et appartements près de Palombaggia et Santa Giulia. Annonces, accueil, ménage et linge pris en charge par Star's Clean.",
    h1: 'Conciergerie à Porto-Vecchio',
    tagline: 'Votre location saisonnière gérée de A à Z, de la Marina à Palombaggia.',
    intro: [
      "Porto-Vecchio et ses plages de sable fin – Palombaggia, Santa Giulia, Cala Rossa – attirent chaque été une clientèle exigeante. Les voyageurs y recherchent des logements irréprochables et un service à la hauteur de la destination.",
      "Star's Clean Conciergerie accompagne les propriétaires de Porto-Vecchio et des alentours : mise en valeur de votre annonce, gestion des réservations sur les plateformes, accueil, ménage professionnel, linge de maison et assistance aux voyageurs pendant tout leur séjour.",
    ],
    zonesTitle: 'Nos zones d’intervention autour de Porto-Vecchio',
    zones: [
      { name: 'Centre & Marina', text: "Appartements proches de la vieille ville, des commerces et du port de plaisance." },
      { name: 'Palombaggia & Santa Giulia', text: "Villas et mini-villas à proximité des plages les plus célèbres du Sud de la Corse." },
      { name: 'Lecci & Cala Rossa', text: "Biens au calme au nord du golfe, très appréciés des familles." },
      { name: 'Sotta & l’arrière-pays', text: "Maisons avec piscine entre mer et montagne, à quelques minutes des plages." },
    ],
    whyTitle: 'Les avantages d’une conciergerie à Porto-Vecchio',
    why: [
      { title: 'Réactivité', text: "Une équipe basée dans l'extrême Sud, disponible pour vos voyageurs comme pour les imprévus." },
      { title: 'Taux de remplissage', text: "Annonces soignées, photos et tarifs ajustés à la saison pour maximiser vos réservations." },
      { title: 'Qualité hôtelière', text: "Ménage du sol au plafond, linge et contrôle qualité avant chaque arrivée." },
      { title: 'Services premium', text: "Location de voiture, bateau, petit-déjeuner, massage : vos voyageurs profitent de nos prestations." },
    ],
    faq: [
      {
        q: 'Quel est le tarif de votre conciergerie à Porto-Vecchio ?',
        a: "Le Forfait Saison représente 30 % du revenu locatif net, payable en fin de saison. Vous pouvez aussi opter pour le Forfait Mensualisation à 200 € par mois ou des services à la carte.",
      },
      {
        q: 'Gérez-vous les annonces Airbnb et Booking ?',
        a: "Oui, nous créons ou optimisons vos annonces (photos, descriptions, tarifs) et gérons votre calendrier sur les différentes plateformes de réservation.",
      },
      {
        q: 'Mon bien est à Lecci ou Sotta, pouvez-vous le gérer ?',
        a: "Bien sûr. Nous intervenons à Porto-Vecchio et dans toutes les communes de l'extrême Sud : Lecci, Sotta, Zonza, Figari, Bonifacio…",
      },
    ],
    image: `${STORAGE}/properties/1776076788739-g4kq76f7xcq.jpg`,
  },
];

/** FAQ générale de la page d'accueil. */
export const HOME_FAQ: FaqItem[] = [
  {
    q: 'Qu’est-ce qu’une conciergerie en Corse-du-Sud ?',
    a: "Une conciergerie gère votre location saisonnière à votre place : annonces, réservations, accueil des voyageurs, ménage, linge et assistance. Star's Clean intervient dans tout l'extrême Sud de la Corse, de Bonifacio à Porto-Vecchio.",
  },
  {
    q: 'Dans quelles communes intervenez-vous ?',
    a: "Principalement à Bonifacio, Porto-Vecchio, Figari, Pianottoli-Caldarello, Sotta, Lecci et Zonza, ainsi que dans le reste de la Corse-du-Sud sur demande.",
  },
  {
    q: 'Combien coûte votre conciergerie ?',
    a: "Le Forfait Saison est à 30 % du revenu locatif net, payé en fin de saison (septembre). Le Forfait Mensualisation est à 200 € par mois avec régularisation en fin de saison. Des services à la carte sont proposés sur devis.",
  },
  {
    q: 'Proposez-vous des services aux vacanciers ?',
    a: "Oui : location de voiture à l'aéroport de Figari, location de bateau, visite de caves, livraison de petit-déjeuner, massages à domicile et transferts aéroport.",
  },
];
