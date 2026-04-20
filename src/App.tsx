import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Home, MapPin, BedDouble, Phone, Mail, Instagram, 
  ChevronDown, Menu, X, Plus, Trash2, Image as ImageIcon, Sparkles, 
  ShieldCheck, Clock, ArrowRight, Key, Users, Bath, Accessibility, Edit2, FileText,
  Briefcase, Ship, Car, Coffee, Heart, Plane, Calendar, Camera, Sun, Wine, Bell, Umbrella, CheckCircle,
  ChevronLeft, ChevronRight, Star, Quote, TrendingUp, Map, Award, Zap, Lock, LogOut, Compass, Waves, Mountain
} from 'lucide-react';
import { Property, Review, Category, Service } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';

// --- DONNÉES DE DÉPART (Gérées via properties.json sur le serveur) ---

// --- AVIS GOOGLE ---
const GOOGLE_REVIEWS: Review[] = [
  { 
    id: 1, 
    author: "AMELIE AMORE", 
    date: "Il y a 3 mois", 
    rating: 5, 
    text: "Une très belle expérience avec Stars Clean! Dès notre arrivée en Corse-du-Sud, on est pris en charge par une équipe bienveillante, disponible et efficace. Tout est pensé pour que le séjour commence immédiatement, sans contraintes : on pose les valises et on profite pleinement. Le logement est impeccable et les services proposés parfaitement adaptés à notre séjour. Un vrai bonheur ! Pour des vacances sereines je vous recommande à 100%", 
    avatar: "https://ui-avatars.com/api/?name=Amelie+Amore&background=0D8ABC&color=fff" 
  },
  { 
    id: 2, 
    author: "Léa", 
    date: "Il y a un an", 
    rating: 5, 
    text: "L’équipe de Star’s clean est très professionnelle et à l’écoute. Elle saura parfaitement comment rendre vos vacances agréables grâce a son large choix de biens proposés à la location, à l’organisation de votre séjour et la location de véhicule qu’elle propose également. Je recommande +++", 
    avatar: "https://ui-avatars.com/api/?name=Lea&background=1D4ED8&color=fff" 
  },
  { 
    id: 3, 
    author: "Celine Frechou", 
    date: "Il y a un an", 
    rating: 5, 
    text: "Cela fait 3 ans que j’ai confié mon bien à la conciergerie stars clean et j’en suis ravie. Les revenus augmentent d’années en années, la conciergerie est sans cesse en train de se développer et c’est ce qui me permet d’avoir un calendrier complet je les remercie pour leur professionnalisme.", 
    avatar: "https://ui-avatars.com/api/?name=Celine+Frechou&background=4338CA&color=fff" 
  }
];

const SERVICES: Service[] = [
  {
    id: "car-rental",
    title: "location de voiture",
    desc: "Une large gamme de véhicules pour parcourir les routes corses en toute liberté.",
    longDesc: "La voiture familiale qui se plie à vos envies. Enfin de l'espace pour tous vos passagers ! Le véhicule Jogger se décline en plusieurs versions modulables pour accueillir de 2 à 7 passagers sans concession pour le confort et l'habitabilité.\n\nÀ l'intérieur comme à l'extérieur, Jogger vous offre la polyvalence d'un break et le confort d'un SUV. Le tarif de location commence à partir de 50€/j * selon la période.\n\nLe véhicule est disponible au départ et au retour de l'aéroport de Figari. Il est également possible de le récupérer ou de le laisser à l'aéroport de Bastia ou d'Ajaccio avec un supplément de 100€.",
    icon: "Car",
    images: [
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/voiture1.png",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/voiture2.png",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/voiture3.png"
    ]
  },
  {
    id: "boat-rental",
    title: "location de bateau",
    desc: "Explorez les criques inaccessibles et profitez d'une journée en mer exceptionnelle.",
    longDesc: "Préparez-vous à vivre une soirée magique en mer avec notre prestataire BBQ Boat ! Naviguez et grillez en toute convivialité.\n\nL’expérience BBQ Boat en Corse vous propose la location d’un bateau sans permis pouvant accueillir jusqu’à 9 personnes. Naviguez en toute liberté tout en savourant de délicieuses grillades grâce à un barbecue XXL intégré.\n\nLe forfait de location comprend le carburant, la vaisselle, une enceinte Bluetooth et un éclairage pour les sorties nocturnes. Des options avec capitaine ainsi que des équipements de cuisson Weber sont également disponibles.\n\nLaissez-vous séduire par une expérience unique à bord du BBQ Boat, idéal pour partager des moments inoubliables entre amis ou en famille. Équipé d’un barbecue à gaz ou d’une vasque à boissons XXL, ce bateau vous permet de profiter de petits-déjeuners, déjeuners, dîners ou apéritifs dans les magnifiques criques sauvages du Valincu.",
    icon: "Ship",
    images: [
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/bbq%20boat.png",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/locationbat.jpeg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/locationbateau.jpeg"
    ]
  },
  {
    id: "wine-tasting",
    title: "visite des caves",
    desc: "Dégustation des meilleurs crus locaux et découverte du terroir corse.",
    longDesc: "Profitez d’une expérience unique de visite du cave avec Star's Clean Conciergerie en Corse-du-Sud. Star's Clean Conciergerie dans l'extrême Sud de la Corse vous propose une expérience unique de visite des caves et de dégustation de vins.\n\nQue vous soyez un amateur de vin passionné ou simplement curieux de découvrir les secrets de la vinification, notre visite vous promet une expérience inoubliable.\n\nPour plus d’informations, contactez-nous via le formulaire de contact. Nous sommes toujours disponibles pour répondre à toutes vos demandes dans les plus brefs délais.",
    icon: "Wine",
    images: [
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776673200225-xipa0i7hix.png"
    ]
  },
  {
    id: "breakfast",
    title: "petit déjeuner",
    desc: "Livraison de viennoiseries fraîches et produits locaux directement à votre porte.",
    longDesc: "Livraison de petit déjeuner\nExplorez notre service de livraison de petit-déjeuner, alliant saveurs exquises et praticité.\n\nSavourez des délices matinaux, avec une sélection variée de produits frais.\n\nNotre livraison rapide vous assure un début de journée délicieux, sans tracas. Commandez dès maintenant pour une expérience gourmande à votre porte.",
    icon: "Coffee",
    images: [
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/dejeuner.jpg"
    ]
  },
  {
    id: "massage",
    title: "Soin & Massage",
    desc: "Un moment de détente absolue avec nos praticiens qualifiés à domicile.",
    longDesc: "Soin et massage à domicile\nOffrez-vous une oasis de bien-être avec nos soins et massages à domicile. Nos praticiens qualifiés créent une expérience relaxante, directement chez vous. Libérez le stress, revitalisez votre corps et esprit.\n\nRéservez votre moment de détente dès maintenant pour une parenthèse de bien-être personnalisée, sans quitter votre cocon.\n\nDécouvrez les cartes de visites des prestataires dans votre livret d'Accueil.\n\nPour toute présentation des praticiens, merci de contacter la conciergerie.",
    icon: "Heart",
    images: [
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/massage.png"
    ]
  },
  {
    id: "airport-transfer",
    title: "Transport Aéroport",
    desc: "Transferts privés depuis et vers l'aéroport de Figari en toute sérénité.",
    longDesc: "Transport depuis l'aéroport\nPour un transport serein et sans encombre depuis l'aéroport, nous vous recommandons de réserver à l'avance en vous rapprochant de notre conciergerie pour obtenir un devis personnalisé.\n\nQue vous préfériez un van ou un taxi à votre arrivée, notre équipe dédiée se charge de tout pour vous offrir une expérience de transport confortable et fiable.\n\nSimplifiez votre arrivée et laissez-nous vous conduire en toute sécurité vers votre destination. Profitez d'une solution de transport efficace et sans stress, pour démarrer votre voyage de la meilleure manière possible.\n\nRéservez dès maintenant et assurez-vous un trajet fluide et agréable dès votre arrivée.",
    icon: "Plane",
    images: [
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/trasnport.png"
    ]
  }
];

// --- COMPOSANTS RÉUTILISABLES ---
const GlassContainer = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void, key?: string | number }) => (
  <div onClick={onClick} className={`bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-lg rounded-2xl ${className}`}>{children}</div>
);

const getCategoryLabel = (cat: Category) => {
  switch (cat) {
    case 'studios': return 'Studios / T2';
    case 'minivillas': return 'Mini Villas';
    case 'villas': return 'Villas';
    case 'appartements': return 'Appartements';
    case 'all': return 'Tous';
    default: return cat;
  }
};

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-base md:text-lg shadow-xl";
  const variants: any = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/40",
    secondary: "bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/30",
    gold: "bg-gradient-to-br from-[#A87952] via-[#825A3C] to-[#5E3F29] text-white border border-[#A87952]/40 shadow-stone-900/20 hover:shadow-[#825A3C]/40",
    danger: "bg-red-500/90 text-white hover:bg-red-600"
  };
  return <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const ElegantLogo = ({ isDark = false }) => (
  <div className="flex items-center gap-4">
    <img 
      src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/logo-en-cours-stars-clean-conciergerie-V5-blanc.png" 
      alt="Logo Star's Clean" 
      className={`h-10 md:h-12 object-contain ${!isDark ? 'brightness-0 opacity-90' : ''}`}
      referrerPolicy="no-referrer"
    />
    <div className="flex flex-col leading-none">
      <span className={`text-[10px] sm:text-sm md:text-base font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase ${!isDark ? 'text-slate-900' : 'text-white'}`}>Star's Clean</span>
      <span className={`text-[8px] sm:text-[10px] md:text-[11px] font-light tracking-[0.3em] sm:tracking-[0.4em] uppercase mt-0.5 sm:mt-1 ${!isDark ? 'text-slate-500' : 'text-slate-300'}`}>Conciergerie</span>
    </div>
  </div>
);

// --- APPLICATION PRINCIPALE ---
function MainApp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState('home'); 
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const reviewSliderRef = useRef<HTMLDivElement>(null);

  const handleSliderScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const width = sliderRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActiveSlideIndex(index);
    }
  };

  const handleReviewScroll = () => {
    if (reviewSliderRef.current) {
      const scrollLeft = reviewSliderRef.current.scrollLeft;
      const width = reviewSliderRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActiveReviewIndex(index);
    }
  };
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Utiliser les données réelles
  const displayProperties = useMemo(() => {
    return properties.filter(p => p.isVisible !== false);
  }, [properties]);

  // État du formulaire Admin
  const [adminFormData, setAdminFormData] = useState({
    title: '', category: 'studios' as Category, location: '', capacity: '', beds: 1, bathrooms: 1, pmr: false, desc: '', images: '', isVisible: true, bookingAction: 'iframe' as 'iframe' | 'contact'
  });
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Initialisation Auth (Session locale)
  useEffect(() => {
    const savedAdmin = localStorage.getItem('isAdmin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Synchronisation des données (Lecture seule via API locale)
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    // On pourrait ajouter un intervalle pour simuler le temps réel si besoin
    const interval = setInterval(fetchProperties, 30000); // Toutes les 30s
    return () => clearInterval(interval);
  }, []);

  const navigate = (newRoute: string, data: any = null) => {
    setRoute(newRoute);
    if (newRoute === 'detail') {
      setSelectedProperty(data);
    } else if (newRoute === 'service-detail') {
      setSelectedService(data);
    }
    setCurrentImageIndex(0);
    setIsMobileMenuOpen(false);
    setIsDescExpanded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getServiceIcon = (iconName: string, size = 32, className = "") => {
    const icons: any = {
      Car: <Car size={size} className={className} />,
      Ship: <Ship size={size} className={className} />,
      Wine: <Wine size={size} className={className} />,
      Coffee: <Coffee size={size} className={className} />,
      Heart: <Heart size={size} className={className} />,
      Plane: <Plane size={size} className={className} />,
      Waves: <Waves size={size} className={className} />,
      Mountain: <Mountain size={size} className={className} />,
      Sun: <Sun size={size} className={className} />,
      Compass: <Compass size={size} className={className} />,
    };
    return icons[iconName] || <Sparkles size={size} className={className} />;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
      } else {
        alert(data.error || 'Identifiants incorrects');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert('Une erreur est survenue lors de la connexion');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    navigate('home');
  };

  // --- COMPOSANTS DE VUE ---

  const renderNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="cursor-pointer group" onClick={() => navigate('home')}>
          <ElegantLogo />
        </div>
        <div className="hidden lg:flex items-center gap-6 font-medium text-slate-700 text-sm">
          <button onClick={() => navigate('home')} className={`hover:text-blue-600 transition-colors ${route === 'home' ? 'text-blue-600 font-bold' : ''}`}>Accueil</button>
          <button onClick={() => navigate('conciergerie')} className={`hover:text-blue-600 transition-colors ${route === 'conciergerie' ? 'text-blue-600 font-bold' : ''}`}>Propriétaires</button>
          <div className="relative group">
            <button onClick={() => navigate('properties')} className="flex items-center gap-1 hover:text-blue-600 font-medium transition-colors">Nos Biens <ChevronDown size={14}/></button>
            <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <GlassContainer className="flex flex-col p-2 !bg-white shadow-xl border-slate-100">
                <button onClick={() => { setActiveCategory('studios'); navigate('properties'); }} className="text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-800 transition-colors">Studios / T2</button>
                <button onClick={() => { setActiveCategory('minivillas'); navigate('properties'); }} className="text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-800 transition-colors">Mini Villas</button>
                <button onClick={() => { setActiveCategory('villas'); navigate('properties'); }} className="text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-800 transition-colors">Villas</button>
                <button onClick={() => { setActiveCategory('appartements'); navigate('properties'); }} className="text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-800 transition-colors">Appartements</button>
              </GlassContainer>
            </div>
          </div>
          <button onClick={() => navigate('sejours')} className={`hover:text-blue-600 transition-colors ${route === 'sejours' ? 'text-blue-600 font-bold' : ''}`}>Gestion séjours</button>
          <div className="relative group">
            <button onClick={() => navigate('prestations')} className="flex items-center gap-1 hover:text-blue-600 font-medium transition-colors">Prestations <ChevronDown size={14}/></button>
            <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <GlassContainer className="flex flex-col p-2 !bg-white shadow-xl border-slate-100">
                {SERVICES.map((s) => (
                  <button 
                    key={s.id} 
                    onClick={() => navigate('service-detail', s)} 
                    className="text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-800 transition-colors text-xs font-semibold capitalize"
                  >
                    {s.title}
                  </button>
                ))}
              </GlassContainer>
            </div>
          </div>
          <button onClick={() => navigate('contact')} className={`hover:text-blue-600 transition-colors ${route === 'contact' ? 'text-blue-600 font-bold' : ''}`}>Contact</button>
          {isAdmin && (
            <button onClick={() => navigate('admin')} className={`px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-colors ${route === 'admin' ? 'bg-blue-100' : ''}`}>Admin</button>
          )}
        </div>
        <button className="lg:hidden text-slate-800" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[76px] left-4 right-4 animate-fade-in-down z-50">
          <GlassContainer className="flex flex-col p-4 gap-3 !bg-white/95 shadow-2xl">
            <button onClick={() => navigate('home')} className="text-left font-medium p-2 hover:bg-slate-100 rounded-lg">Accueil</button>
            <button onClick={() => navigate('conciergerie')} className="text-left font-medium p-2 hover:bg-slate-100 rounded-lg">Propriétaires</button>
            <button onClick={() => navigate('properties')} className="text-left font-medium p-2 hover:bg-slate-100 rounded-lg">Nos Biens</button>
            <button onClick={() => navigate('sejours')} className="text-left font-medium p-2 hover:bg-slate-100 rounded-lg">Gestion séjours</button>
            <div className="flex flex-col gap-1">
              <button onClick={() => navigate('prestations')} className="text-left font-bold p-2 hover:bg-slate-100 rounded-lg text-blue-600">Prestations</button>
              <div className="grid grid-cols-1 gap-1 pl-4">
                {SERVICES.map((s) => (
                  <button 
                    key={s.id} 
                    onClick={() => navigate('service-detail', s)} 
                    className="text-left text-sm p-2 hover:bg-slate-50 rounded-lg text-slate-600 capitalize"
                  >
                    • {s.title}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => navigate('contact')} className="text-left font-medium p-2 hover:bg-slate-100 rounded-lg">Contact</button>
            {isAdmin && <button onClick={() => navigate('admin')} className="text-left font-bold p-2 text-blue-600 hover:bg-blue-50 rounded-lg">Admin</button>}
          </GlassContainer>
        </div>
      )}
    </nav>
  );

  const PropertyCard = ({ property, layout = 'grid' }: { property: Property, layout?: 'grid' | 'list', key?: string | number }) => {
    const isList = layout === 'list';
    const coverImage = property.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80";
    return (
      <GlassContainer 
        className={`overflow-hidden group flex cursor-pointer hover:border-slate-300 transition-all ${isList ? 'flex-col md:flex-row md:h-[350px]' : 'flex-col h-full'}`} 
        onClick={() => navigate('detail', property)}
      >
        <div className={`relative overflow-hidden shrink-0 ${isList ? 'h-72 md:h-full md:w-5/12' : 'h-64'}`}>
          <img src={coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={property.title} referrerPolicy="no-referrer" />
          <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold uppercase rounded-full shadow-sm">{getCategoryLabel(property.category)}</span></div>
          {property.images?.length > 1 && <div className="absolute bottom-4 right-4 px-2 py-1 bg-slate-900/60 text-white text-xs rounded-md flex items-center gap-1"><Camera size={12} />{property.images.length}</div>}
        </div>
        <div className={`p-6 flex flex-col flex-grow overflow-hidden ${isList ? 'md:p-8 md:w-7/12' : ''}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{property.title}</h3>
          <div className="flex items-center gap-2 text-slate-500 mb-4 text-sm shrink-0"><MapPin size={16} className="text-blue-500" /><span>{property.location}</span></div>
          <div className="flex flex-wrap items-center gap-4 mb-4 text-slate-700 text-sm shrink-0">
            <div className="flex items-center gap-1"><Users size={16} className="text-blue-500" /><span>{property.capacity}</span></div>
            <div className="flex items-center gap-1"><BedDouble size={16} className="text-indigo-500" /><span>{property.beds} Ch.</span></div>
            <div className="flex items-center gap-1"><Bath size={16} className="text-cyan-500" /><span>{property.bathrooms} Sdb.</span></div>
            {property.pmr && <div className="flex items-center gap-1" title="Accès PMR"><Accessibility size={16} className="text-emerald-500" /><span>PMR</span></div>}
          </div>
          <p className={`text-slate-600 text-sm mb-6 ${isList ? 'line-clamp-4' : 'line-clamp-2'}`}>{property.desc}</p>
          <div className="mt-auto pt-4 border-t border-slate-200/60 flex items-center justify-between text-blue-600 font-semibold group-hover:text-indigo-600 shrink-0">
            <span>Voir les détails</span><ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </GlassContainer>
    );
  };

  const renderHome = () => (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center px-4 pt-24 pb-12 md:py-0 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 w-full h-full animate-slow-pan opacity-70" style={{ backgroundImage: "url('https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776076788739-g4kq76f7xcq.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80"></div>
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 backdrop-blur-md font-semibold text-xs md:text-sm mb-4 md:mb-8 animate-slide-up shadow-lg"><Award size={18} /> Conciergerie d'excellence</span>
          <h1 className="text-3xl sm:text-4xl md:text-8xl font-semibold text-white mb-4 md:mb-8 leading-[1.2] md:leading-[1.1] animate-slide-up drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] tracking-tighter">Conciergerie, gestion locative <br/> en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 filter drop-shadow-sm font-semibold">Corse-du-Sud</span></h1>
          <div className="max-w-3xl mx-auto mb-6 md:mb-10 space-y-2 md:space-y-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <p className="text-base md:text-2xl text-slate-100 drop-shadow-lg font-medium leading-relaxed">Star's Clean Conciergerie est une entreprise spécialisée dans la gestion des séjours dans l'extrême Sud de la Corse.</p>
            <p className="text-sm md:text-lg text-slate-300 drop-shadow-md font-normal leading-relaxed">Professionnels de l'immobilier avec 5 ans d'expérience dans le domaine, nous vous assurons la réussite de tous vos projets.</p>
            <p className="text-xs md:text-base text-blue-400 uppercase tracking-[0.2em] font-bold mt-4 md:mt-6">Particuliers • Professionnels</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 animate-slide-up w-full max-w-xs sm:max-w-none" style={{ animationDelay: '0.3s' }}>
            <Button variant="primary" onClick={() => navigate('properties')} className="px-8 md:px-10 w-full sm:w-auto">Découvrir nos biens <ArrowRight size={22} className="ml-1" /></Button>
            <Button variant="secondary" onClick={() => navigate('contact')} className="px-8 md:px-10 w-full sm:w-auto">Nous contacter</Button>
          </div>
        </div>
        <div className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-50 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}><ChevronDown size={32} className="text-white" /></div>
      </section>

      {/* Biens à la une */}
      <section className="py-20 px-4 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Nos Biens à la une</h2>
          <p className="text-slate-500 text-lg">Découvrez une sélection de nos plus beaux logements en gestion.</p>
        </div>
        {loading ? <div className="h-40 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div> :
          <div className="relative">
            <div 
              ref={sliderRef}
              onScroll={handleSliderScroll}
              className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0"
            >
              {displayProperties.slice(0, 6).map((p) => (
                <div key={p.id} className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center">
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
            
            {/* Pagination dots for mobile */}
            <div className="flex md:hidden flex-col items-center gap-3 mt-6">
              <div className="flex justify-center gap-2">
                {displayProperties.slice(0, 6).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-300 ${activeSlideIndex === i ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {activeSlideIndex + 1} / {Math.min(displayProperties.length, 6)}
              </span>
            </div>
          </div>
        }
        <div className="mt-12 flex justify-center w-full"><Button onClick={() => navigate('properties')}>Voir tout notre catalogue ({displayProperties.length})</Button></div>
      </section>

      {/* Pourquoi nous choisir - Version Prestige */}
      <section className="py-32 px-4 bg-slate-950 relative overflow-hidden">
        {/* Background elements for prestige feel */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block py-1 px-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-[0.3em] mb-6">L'Excellence au Sommet</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Pourquoi choisir <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Star's Clean</span> ?</h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-xl leading-relaxed">
              Nous redéfinissons les standards de la conciergerie de luxe en Corse-du-Sud, alliant <span className="text-white font-bold">performance financière</span> et <span className="text-white font-bold">préservation d'exception</span>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: <TrendingUp size={32} />, 
                title: "Rentabilité Optimisée", 
                desc: "Stratégie de Yield Management avancée pour maximiser vos revenus selon les flux touristiques.",
                accent: "from-blue-500 to-blue-700"
              },
              { 
                icon: <ShieldCheck size={32} />, 
                title: "Sérénité Absolue", 
                desc: "Une gestion 360° incluant assurances, cautions et maintenance préventive rigoureuse.",
                accent: "from-indigo-500 to-indigo-700"
              },
              { 
                icon: <Map size={32} />, 
                title: "Ancrage Local", 
                desc: "Une connaissance intime du territoire pour offrir des expériences authentiques et exclusives.",
                accent: "from-slate-700 to-slate-900"
              },
              { 
                icon: <Award size={32} />, 
                title: "Standard Hôtelier", 
                desc: "Un service de gouvernance méticuleux et des prestations de luxe pour une satisfaction totale.",
                accent: "from-amber-500 to-amber-700"
              }
            ].map((f, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-[2.5rem] -m-1"></div>
                <div className="h-full p-10 bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 hover:border-blue-500/50 transition-all duration-500 flex flex-col">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.accent} flex items-center justify-center text-white mb-8 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm flex-grow">{f.desc}</p>
                  <div className="mt-8 h-1 w-12 bg-blue-600 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avis Google */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center overflow-hidden">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Avis de nos clients</h2>
        <p className="text-slate-500 mb-12">La satisfaction de nos propriétaires et voyageurs est notre priorité.</p>
        
        <div className="relative">
          <div 
            ref={reviewSliderRef}
            onScroll={handleReviewScroll}
            className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0"
          >
            {GOOGLE_REVIEWS.map(r => (
              <div key={r.id} className="min-w-[85vw] sm:min-w-[350px] md:min-w-0 snap-center">
                <GlassContainer className="p-8 text-left h-full !bg-white border-slate-100 shadow-sm flex flex-col">
                  <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />)}</div>
                  <p className="text-slate-700 italic mb-6 leading-relaxed flex-grow">"{r.text}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <img src={r.avatar} className="w-10 h-10 rounded-full border border-slate-100" alt="" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-sm">{r.author}</p>
                      <p className="text-xs text-slate-500">{r.date}</p>
                    </div>
                  </div>
                </GlassContainer>
              </div>
            ))}
          </div>

          {/* Pagination dots for mobile */}
          <div className="flex md:hidden flex-col items-center gap-3 mt-8">
            <div className="flex justify-center gap-2">
              {GOOGLE_REVIEWS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${activeReviewIndex === i ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'}`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {activeReviewIndex + 1} / {GOOGLE_REVIEWS.length}
            </span>
          </div>
        </div>

        <div className="mt-12"><a href="https://share.google/pYtB9A5Wx0rAZWp1c" target="_blank" className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full font-bold hover:shadow-md transition-all"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5" alt="" referrerPolicy="no-referrer" /> Voir les 4 avis Google</a></div>
      </section>
    </div>
  );

  const renderProperties = () => {
    const filtered = activeCategory === 'all' ? displayProperties : displayProperties.filter(p => p.category === activeCategory);
    return (
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Nos Biens en Gestion</h1>
          <p className="text-slate-500">Découvrez notre sélection exclusive ({filtered.length} biens)</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['all', 'studios', 'minivillas', 'villas', 'appartements'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as Category)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {getCategoryLabel(cat as Category)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!selectedProperty) return null;
    const p = selectedProperty;
    const images = p.images?.length > 0 ? p.images : ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"];
    return (
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <button onClick={() => navigate('properties')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors"><ChevronLeft size={20}/> Retour à la liste</button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl shadow-2xl relative group bg-slate-100">
              <div className="h-[400px] md:h-[600px] relative">
                <img src={images[currentImageIndex]} className="w-full h-full object-cover transition-opacity duration-500" alt="" referrerPolicy="no-referrer" />
                {images.length > 1 && <>
                  <button onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all"><ChevronLeft size={24}/></button>
                  <button onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all"><ChevronRight size={24}/></button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">{images.map((_, i) => <div key={i} className={`h-2 rounded-full transition-all ${i === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} />)}</div>
                </>}
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">{images.map((img, i) => <img key={i} src={img} onClick={() => setCurrentImageIndex(i)} className={`w-24 h-20 object-cover rounded-xl cursor-pointer border-2 ${i === currentImageIndex ? 'border-blue-600 scale-105' : 'border-transparent opacity-70'}`} alt="" referrerPolicy="no-referrer" />)}</div>
          </div>
          <div className="flex flex-col">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">{getCategoryLabel(p.category)}</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">{p.title}</h1>
            <p className="text-slate-500 flex items-center gap-2 mb-8 text-lg"><MapPin size={22} className="text-blue-600" /> {p.location}</p>
            <div className={`grid ${p.pmr ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'} gap-4 mb-8`}>
              <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100"><Users size={24} className="text-blue-500 mb-2"/><span className="font-bold text-slate-900">{p.capacity}</span></div>
              <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100"><BedDouble size={24} className="text-indigo-500 mb-2"/><span className="font-bold text-slate-900">{p.beds} Ch.</span></div>
              <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100"><Bath size={24} className="text-cyan-500 mb-2"/><span className="font-bold text-slate-900">{p.bathrooms} Sdb.</span></div>
              {p.pmr && <div className="flex flex-col items-center justify-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100"><Accessibility size={24} className="text-emerald-500 mb-2"/><span className="font-bold text-emerald-900">PMR</span></div>}
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8 flex-grow relative overflow-hidden">
              <h2 className="text-xl font-bold mb-4 text-slate-900">À propos de ce logement</h2>
              <div className={`relative transition-all duration-500 ${!isDescExpanded ? 'max-h-80 overflow-hidden' : 'max-h-[5000px]'}`}>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                  {p.desc}
                </p>
                {!isDescExpanded && (p.desc.length > 300 || p.desc.split('\n').length > 6) && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
              {(p.desc.length > 300 || p.desc.split('\n').length > 6) && (
                <button 
                  onClick={() => setIsDescExpanded(!isDescExpanded)} 
                  className="mt-4 text-blue-600 font-bold flex items-center gap-1 hover:text-blue-700 transition-colors"
                >
                  {isDescExpanded ? 'Voir moins' : 'Voir plus'}
                  <ChevronDown size={18} className={`transition-transform duration-300 ${isDescExpanded ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
            <Button className="w-full py-5" onClick={() => p.bookingAction === 'contact' ? navigate('contact') : setIsBookingOpen(true)}>
              {p.bookingAction === 'contact' ? 'Contacter pour réserver' : 'Demander une réservation'}
              <ArrowRight className="ml-2" size={20}/>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderAdmin = () => {
    if (!isAdmin) {
      return (
        <div className="pt-40 pb-20 px-4 max-w-md mx-auto min-h-screen">
          <GlassContainer className="p-10 !bg-white border-slate-100 shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"><Lock size={32} /></div>
            <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Accès Privé</h1>
            <p className="text-slate-500 text-sm mb-8">Veuillez vous identifier pour gérer vos biens</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" 
                placeholder="Nom d'utilisateur" 
                value={loginData.username}
                onChange={e => setLoginData({...loginData, username: e.target.value})}
                required 
              />
              <input 
                className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" 
                type="password"
                placeholder="Mot de passe" 
                value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})}
                required 
              />
              <Button className="w-full py-4 mt-4">Se connecter</Button>
            </form>
          </GlassContainer>
        </div>
      );
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsAdminSubmitting(true);
      const imgArr = adminFormData.images.split('\n').map(s => s.trim()).filter(s => s);
      
      try {
        const payload = { 
          ...adminFormData, 
          images: imgArr, 
          beds: Number(adminFormData.beds), 
          bathrooms: Number(adminFormData.bathrooms),
          features: []
        };

        const url = editingId ? `/api/properties/${editingId}` : '/api/properties';
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save property');
        }
        
        // Refresh properties list
        const updatedResponse = await fetch('/api/properties');
        const updatedData = await updatedResponse.json();
        setProperties(updatedData);

        setEditingId(null);
        setAdminFormData({ title: '', category: 'studios' as Category, location: '', capacity: '', beds: 0, bathrooms: 0, pmr: false, desc: '', images: '', isVisible: true, bookingAction: 'iframe' });
      } catch (error: any) {
        console.error("Error saving property:", error);
        alert(error.message || "Erreur lors de la sauvegarde du bien.");
      } finally {
        setIsAdminSubmitting(false);
      }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);
      const newImages = [...(adminFormData.images.split('\n').filter(s => s.trim()))];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Upload failed');
          const data = await response.json();
          newImages.push(data.url);
        } catch (error) {
          console.error("Upload error:", error);
          alert("Erreur lors de l'upload d'une image.");
        }
      }

      setAdminFormData({ ...adminFormData, images: newImages.join('\n') });
      setIsUploading(false);
    };

    const removeImage = (index: number) => {
      const images = adminFormData.images.split('\n').filter(s => s.trim());
      images.splice(index, 1);
      setAdminFormData({ ...adminFormData, images: images.join('\n') });
    };

    const setAsFeatured = (index: number) => {
      const images = adminFormData.images.split('\n').filter(s => s.trim());
      if (index === 0) return;
      const selected = images.splice(index, 1)[0];
      images.unshift(selected);
      setAdminFormData({ ...adminFormData, images: images.join('\n') });
    };

    const openLibrary = async () => {
      setIsLibraryOpen(true);
      setIsLoadingLibrary(true);
      try {
        const response = await fetch('/api/storage/images');
        if (!response.ok) throw new Error('Failed to fetch library');
        const data = await response.json();
        setLibraryImages(data);
      } catch (error) {
        console.error("Library error:", error);
      } finally {
        setIsLoadingLibrary(false);
      }
    };

    const toggleLibraryImage = (url: string) => {
      const currentImages = adminFormData.images.split('\n').filter(s => s.trim());
      if (currentImages.includes(url)) {
        setAdminFormData({ ...adminFormData, images: currentImages.filter(img => img !== url).join('\n') });
      } else {
        setAdminFormData({ ...adminFormData, images: [...currentImages, url].join('\n') });
      }
    };

    return (
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <h1 className="text-3xl font-black flex items-center gap-3"><ShieldCheck className="text-blue-600" size={32}/> Administration</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold uppercase text-xs tracking-widest transition-colors"><LogOut size={16} /> Déconnexion</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-fit sticky top-24">
            <h2 className="font-bold text-xl mb-6">{editingId ? 'Modifier' : 'Ajouter'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Titre" value={adminFormData.title} onChange={e => setAdminFormData({...adminFormData, title: e.target.value})} required />
              <select className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" value={adminFormData.category} onChange={e => setAdminFormData({...adminFormData, category: e.target.value as Category})}>
                <option value="studios">Studios / T2</option>
                <option value="minivillas">Mini Villas</option>
                <option value="villas">Villas</option>
                <option value="appartements">Appartements</option>
              </select>
              <input className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Localisation" value={adminFormData.location} onChange={e => setAdminFormData({...adminFormData, location: e.target.value})} required />
              <div className="grid grid-cols-3 gap-3">
                <input className="p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Capacité" value={adminFormData.capacity} onChange={e => setAdminFormData({...adminFormData, capacity: e.target.value})} required />
                <input className="p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" type="number" placeholder="Ch." value={adminFormData.beds} onChange={e => setAdminFormData({...adminFormData, beds: parseInt(e.target.value) || 0})} />
                <input className="p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" type="number" placeholder="Sdb" value={adminFormData.bathrooms} onChange={e => setAdminFormData({...adminFormData, bathrooms: parseInt(e.target.value) || 0})} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 block">Images du bien</label>
                  <button 
                    type="button" 
                    onClick={openLibrary}
                    className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline"
                  >
                    Bibliothèque
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {adminFormData.images.split('\n').filter(s => s.trim()).map((img, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img src={img} className={`w-full h-full object-cover rounded-lg border ${idx === 0 ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'}`} alt="" referrerPolicy="no-referrer" />
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button" 
                          onClick={() => setAsFeatured(idx)}
                          className={`p-1 rounded-full shadow-md transition-colors ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 hover:text-blue-600'}`}
                          title={idx === 0 ? "Image en vedette" : "Mettre en vedette"}
                        >
                          <Star size={12} fill={idx === 0 ? "currentColor" : "none"} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removeImage(idx)}
                          className="bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      {idx === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-600 text-[8px] text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Vedette
                        </div>
                      )}
                    </div>
                  ))}
                  <label className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} disabled={isUploading} />
                    {isUploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div> : <Plus size={20} className="text-slate-400" />}
                    <span className="text-[10px] text-slate-400 mt-1">{isUploading ? '...' : 'Ajouter'}</span>
                  </label>
                </div>
                <textarea 
                  className="w-full p-3 bg-slate-50 rounded-xl text-[10px] outline-none focus:ring-2 focus:ring-blue-600 font-mono" 
                  placeholder="Ou collez des URLs (une par ligne)" 
                  value={adminFormData.images} 
                  onChange={e => setAdminFormData({...adminFormData, images: e.target.value})} 
                  rows={2} 
                />
              </div>

              <textarea className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Description" value={adminFormData.desc} onChange={e => setAdminFormData({...adminFormData, desc: e.target.value})} rows={4} required />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="isVisible" 
                    checked={adminFormData.isVisible} 
                    onChange={e => setAdminFormData({...adminFormData, isVisible: e.target.checked})}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <label htmlFor="isVisible" className="text-sm font-medium text-slate-700 cursor-pointer">Visible sur le site</label>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="pmr" 
                    checked={adminFormData.pmr} 
                    onChange={(e: any) => setAdminFormData({...adminFormData, pmr: e.target.checked})}
                    className="w-5 h-5 accent-indigo-600"
                  />
                  <label htmlFor="pmr" className="text-sm font-medium text-slate-700 cursor-pointer">Accès PMR / Handicapé</label>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Action du bouton réservation</label>
                  <select 
                    className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    value={adminFormData.bookingAction || 'iframe'}
                    onChange={(e: any) => setAdminFormData({...adminFormData, bookingAction: e.target.value as 'iframe' | 'contact'})}
                  >
                    <option value="iframe">Ouvrir Réservation (Iframe)</option>
                    <option value="contact">Redirect Contact</option>
                  </select>
                </div>
              </div>
              <Button className="w-full py-4" disabled={isAdminSubmitting}>{isAdminSubmitting ? 'Envoi...' : (editingId ? 'Mettre à jour' : 'Sauvegarder')}</Button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setAdminFormData({ title: '', category: 'studios' as Category, location: '', capacity: '', beds: 0, bathrooms: 0, pmr: false, desc: '', images: '', isVisible: true, bookingAction: 'iframe' }); }} className="w-full text-xs text-red-500 font-bold mt-2 uppercase tracking-widest">ANNULER</button>}
            </form>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map(p => (
              <div key={p.id} className="p-5 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={p.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"} className="w-12 h-12 object-cover rounded-xl" alt="" referrerPolicy="no-referrer" />
                  <p className="font-bold truncate text-sm text-slate-900">{p.title}</p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={async () => {
                      const updatedProperty = { ...p, isVisible: p.isVisible === false ? true : false };
                      try {
                        const response = await fetch(`/api/properties/${p.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(updatedProperty)
                        });
                        if (!response.ok) throw new Error('Failed to update visibility');
                        setProperties(properties.map(prop => prop.id === p.id ? updatedProperty : prop));
                      } catch (error) {
                        console.error("Error updating visibility:", error);
                      }
                    }} 
                    className={`p-2 rounded-lg transition-colors ${p.isVisible === false ? 'text-slate-400 hover:bg-slate-100' : 'text-emerald-600 hover:bg-emerald-50'}`}
                    title={p.isVisible === false ? "Masqué (cliquer pour afficher)" : "Visible (cliquer pour masquer)"}
                  >
                    {p.isVisible === false ? <Lock size={18} /> : <CheckCircle size={18} />}
                  </button>
                  <button onClick={() => { 
                    setEditingId(p.id!); 
                    setAdminFormData({ 
                      ...p, 
                      images: p.images?.join('\n') || '', 
                      beds: p.beds || 0, 
                      bathrooms: p.bathrooms || 0,
                      capacity: p.capacity || '',
                      isVisible: p.isVisible !== false,
                      bookingAction: p.bookingAction || 'iframe'
                    }); 
                  }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                  <button onClick={async () => { 
                    if(confirm('Supprimer ce bien ?')) {
                      try {
                        const response = await fetch(`/api/properties/${p.id}`, { method: 'DELETE' });
                        if (!response.ok) throw new Error('Failed to delete property');
                        setProperties(properties.filter(prop => prop.id !== p.id));
                      } catch (error) {
                        console.error("Error deleting property:", error);
                        alert("Erreur lors de la suppression.");
                      }
                    }
                  }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bibliothèque d'images */}
        {isLibraryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Bibliothèque d'images</h3>
                  <p className="text-sm text-slate-500">Sélectionnez les images déjà enregistrées sur Supabase</p>
                </div>
                <button onClick={() => setIsLibraryOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {isLoadingLibrary ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-slate-500 font-medium">Chargement de la bibliothèque...</p>
                  </div>
                ) : libraryImages.length === 0 ? (
                  <div className="text-center py-20">
                    <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Aucune image trouvée dans la bibliothèque.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {libraryImages.map((url, idx) => {
                      const isSelected = adminFormData.images.split('\n').filter(s => s.trim()).includes(url);
                      return (
                        <div 
                          key={idx} 
                          onClick={() => toggleLibraryImage(url)}
                          className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-4 transition-all ${isSelected ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-transparent hover:border-slate-200'}`}
                        >
                          <img src={url} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                          {isSelected && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="bg-blue-500 text-white rounded-full p-1 shadow-lg">
                                <CheckCircle size={20} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-slate-100 flex justify-end">
                <Button onClick={() => setIsLibraryOpen(false)} className="px-8">Terminer</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderConciergerie = () => (
    <div className="animate-fade-in bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776076788739-g4kq76f7xcq.jpg" 
            className="w-full h-full object-cover" 
            alt="Villa de luxe en Corse"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-widest mb-6">Expertise & Excellence</span>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
            Présentation Professionnelle <br/> <span className="text-blue-500">Conciergerie Star’s Clean</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Optimisez la gestion de vos biens locatifs avec un acteur de référence en Corse-du-Sud.
          </p>
        </div>
      </section>

      {/* Navigation Summary (Sommaire) */}
      <div className="sticky top-[76px] z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 hidden md:block overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
          {['À propos', 'Services', 'Clients', 'Tarifs', 'Contact'].map((item) => (
            <button key={item} className="hover:text-blue-600 transition-colors whitespace-nowrap">{item}</button>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto border-b border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Depuis 2021</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                À propos de nous
              </h2>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
              Fondée en 2021, la <strong>Conciergerie Star’s Clean</strong> s'est rapidement imposée comme un acteur de référence dans la gestion d’hébergements pour propriétaires. 
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Forts de plusieurs années d’expérience, nous mettons notre expertise à votre service pour optimiser la gestion de vos biens locatifs, que ce soit pour des locations saisonnières ou de longue durée. Grâces à une équipe dédiée, nous garantissons à vos hôtes une expérience de qualité, tout en maximisant votre rentabilité.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                { t: "Accueil & Check-in", icon: <Key size={20} /> },
                { t: "Ménage Professionnel", icon: <Sparkles size={20} /> },
                { t: "Gestion Réservations", icon: <Calendar size={20} /> },
                { t: "Entretien Régulier", icon: <ShieldCheck size={20} /> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-blue-600">{item.icon}</div>
                  <span className="font-bold text-slate-700 text-sm">{item.t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-100/50 rounded-[4rem] blur-2xl opacity-50" />
            <img 
              src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/qui-sommes-nous-equipe-conciergerie-airbnb-paris.jpeg" 
              className="relative rounded-[3rem] shadow-2xl border-8 border-white object-cover aspect-[4/5] lg:aspect-auto" 
              alt="Expertise Conciergerie Star's Clean"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -left-6 bg-slate-900 p-6 rounded-3xl shadow-2xl max-w-[280px] hidden md:block">
              <Quote className="text-blue-500 mb-3" size={32} />
              <p className="text-slate-100 italic text-sm leading-relaxed font-medium mb-3">
                “Nous prenons soin du moindre détail pour que vous puissiez profiter pleinement de votre temps.”
              </p>
              <p className="text-blue-400 font-black uppercase tracking-widest text-[10px]">- Conciergerie Star’s Clean</p>
            </div>
          </div>
        </div>
      </section>

      {/* Base Services Section */}
      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Nos services de base</h2>
            <p className="text-slate-500 text-lg leading-relaxed">Une gestion quotidienne rigoureuse pour assurer le bon fonctionnement de votre location.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "1. Gestion des réservations",
                desc: "Nous prenons en charge la gestion de vos calendriers sur les différentes plateformes en optimisant vos taux de remplissage.",
                icon: <TrendingUp size={32} />,
                color: "bg-blue-600"
              },
              {
                title: "2. Accueil et départ",
                desc: "Un accueil chaleureux et professionnel à chaque arrivée, suivi d’un état des lieux minutieux au départ pour garantir la sécurité de votre bien.",
                icon: <Users size={32} />,
                color: "bg-indigo-600"
              },
              {
                title: "3. Ménage professionnel",
                desc: "Service de nettoyage complet réalisé par des professionnels (Sol au plafond). Options spécifiques : Shampooing canapés & Literies.",
                icon: <Sparkles size={32} />,
                color: "bg-emerald-600"
              },
              {
                title: "4. Assistance 24/7",
                desc: "Un service client réactif pour répondre aux besoins des locataires tout au long de leur séjour afin de garantir leur satisfaction totale.",
                icon: <Phone size={32} />,
                color: "bg-slate-900"
              }
            ].map((service, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group flex flex-col items-center text-center md:items-start md:text-left">
                <div className={`w-16 h-16 ${service.color} text-white rounded-2xl flex items-center justify-center mb-8 transform group-hover:rotate-6 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3 pt-4">
            <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Exclusivité</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">Nos services premium</h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">Poussez l'excellence encore plus loin avec nos solutions d'optimisation haut de gamme.</p>
            <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 italic font-medium text-blue-900">
              "Objectif : maximiser vos revenus locatifs tout en sublimant votre offre."
            </div>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 gap-6">
            {[
              {
                title: "1. Gestion complète de l’annonce",
                items: ["Photos professionnelles", "Descriptions attractives", "Stratégies tarifaires dynamiques"],
                icon: <Camera className="text-blue-600" />
              },
              {
                title: "2. Check-in personnalisé",
                items: ["Accueil VIP avec options sur-mesure", "Panier d’accueil spécialisé", "Recommandations locales & Assistance"],
                icon: <Heart className="text-pink-600" />
              },
              {
                title: "3. Audit et optimisation du bien",
                items: ["Conseils aménagement & décoration", "Analyse des équipements", "Étude des performances gains"],
                icon: <Award className="text-amber-600" />
              }
            ].map((p, idx) => (
              <div key={idx} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-12 hover:border-blue-200 transition-colors flex gap-8">
                <div className="shrink-0 pt-2">{p.icon}</div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-6">{p.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    {p.items.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm font-bold text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Types Section */}
      <section className="py-24 px-4 bg-slate-900 text-white rounded-[4rem] mx-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Nos clients types</h2>
            <p className="text-slate-400 text-xl font-light">Une expertise adaptée à chaque profil d'investisseur.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                t: "Propriétaires Particuliers", 
                d: "Résidences principales, secondaires ou investissements locatifs. Accompagnement complet pour déléguer la gestion.",
                icon: <Home className="text-blue-400" size={40} />
              },
              { 
                t: "Investisseurs Immobiliers", 
                d: "Gestion clé en main pour plusieurs biens : Occupation maximale, entretien impeccable et gestion transparente.",
                icon: <Briefcase className="text-amber-400" size={40} />
              },
              { 
                t: "Hôtels & Résidences", 
                d: "Services de conciergerie externalisés pour offrir une expérience client haut de gamme et personnalisée.",
                icon: <Award className="text-emerald-400" size={40} />
              }
            ].map((client, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center group hover:bg-white/10 transition-all">
                <div className="mb-8 flex justify-center transform group-hover:scale-110 transition-transform">{client.icon}</div>
                <h3 className="text-2xl font-black mb-4">{client.t}</h3>
                <p className="text-slate-400 leading-relaxed text-sm lg:text-base">{client.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (Forfaits) */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-[1.1]">Nos forfaits et tarifs</h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mt-4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Plan 1 */}
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-all">
            <h3 className="text-2xl font-black text-slate-900 mb-4">Forfait Mensualisation</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-black text-blue-600">200 €</span>
              <span className="text-slate-400 font-bold">/ mois</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Gestion des réservations', 'Accueil des locataires', 'Ménage professionnel', 'Assistance 24/7'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle size={18} className="text-blue-500" /> {f}
                </li>
              ))}
            </ul>
            <div className="p-6 bg-slate-50 rounded-2xl text-xs font-bold text-slate-500 leading-relaxed border border-slate-100">
              Note : Régularisation en fin de saison à 30 % du revenu locatif.
            </div>
          </div>

          {/* Plan 2 - Featured */}
          <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative transform scale-105 border-4 border-blue-600/30">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest">Populaire</div>
            <h3 className="text-2xl font-black text-white mb-4">Forfait Saison</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-black text-blue-400">30 %</span>
              <span className="text-slate-400 font-bold">revenu net</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Tous les services de base', 'Optimisation des annonces', 'Check-in personnalisé', 'Conciergerie locataires', 'Audit du bien'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle size={18} className="text-blue-400" /> {f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 font-bold italic mb-8">Paiement : 30 % en fin de saison (septembre)</p>
            <Button className="w-full py-4 text-sm" onClick={() => navigate('contact')}>Choisir ce forfait</Button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-all">
            <h3 className="text-2xl font-black text-slate-900 mb-4">À la carte</h3>
            <div className="flex flex-col gap-2 mb-8">
              <span className="text-xl font-bold text-slate-900">Sur demande</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Possibilité de souscrire uniquement pour certains services selon vos besoins spécifiques.</p>
            <ul className="space-y-4 mb-2">
              {['Entretien avancé', 'Rénovation spécifique', 'Gestion d’annonce seule', 'Gestion de calendrier seule'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                  <Plus size={16} className="text-emerald-500" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-slate-50 rounded-[4rem] p-12 md:p-20 border border-slate-100 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-12 tracking-tight">Contactez-nous</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 w-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Phone size={24} /></div>
              <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</p>
                <p className="text-lg font-black text-slate-900">+33 6 42 65 85 98</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Compass size={24} /></div>
              <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Navigation</p>
                <p className="text-lg font-black text-slate-900">www.conciergerie-corsedusud.fr</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Mail size={24} /></div>
              <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">E-mail</p>
                <p className="text-xs font-black text-slate-900 break-all">conciergerie.prestige2a@gmail.com</p>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate('contact')} className="px-12 py-5 text-xl transition-all hover:px-16">
            Lancer mon projet
          </Button>
        </div>
      </section>
    </div>
  );

  const renderGestionSejours = () => (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1534008843454-8a7389bd1682?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover" 
            alt="Corse du Sud"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-950"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-semibold text-white mb-6 tracking-tight leading-tight">
            Gestion des séjours dans <br/> <span className="text-blue-500">l'extrême Sud de la Corse</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium">
            Star's Clean Conciergerie vous crée un séjour sur mesure en Corse-du-Sud
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              L'excellence au service de vos vacances
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Star's Clean Conciergerie est à votre service pour la gestion et l'organisation des séjours en location saisonnière dans l'extrême Sud de la Corse.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Qu'il s’agisse d’un souhait de réservation, d'une organisation de séjour ou d'une gestion de votre bien immobilier, nous vous assurons un travail soigné et méticuleux.
            </p>
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-blue-800 font-bold text-xl italic">
                "Gagnez du temps en confiant l'organisation de vos vacances à Star's Clean Conciergerie."
              </p>
            </div>
            <Button onClick={() => navigate('contact')} className="px-10">Nous confier votre séjour</Button>
          </div>
          <div className="relative">
            <img 
              src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/calanques-de-bonifacio.jpg" 
              className="rounded-[3rem] shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500" 
              alt="Vacances en Corse"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white p-3 rounded-xl"><Clock size={24}/></div>
                <div>
                  <p className="font-bold text-slate-900">Gain de temps</p>
                  <p className="text-sm text-slate-500">On s'occupe de tout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-24 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Nous organisons votre séjour selon vos envies</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Une multitude d'activités exclusives s'offrent à vous dans l'extrême Sud.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Ship className="text-blue-600" size={32} />, title: "Location de bateau", desc: "Promenade en mer et apéro sunset dans les plus belles criques." },
              { icon: <Waves className="text-cyan-500" size={32} />, title: "Plongée & Canyoning", desc: "Découvrez les fonds marins ou les rivières sauvages de l'île." },
              { icon: <Car className="text-slate-700" size={32} />, title: "Quad & Buggy", desc: "Randonnées hors des sentiers battus à travers le maquis." },
              { icon: <Plane className="text-indigo-600" size={32} />, title: "Hélicoptère", desc: "Découverte de l'île de beauté vue du ciel pour un moment inoubliable." },
              { icon: <Wine className="text-red-600" size={32} />, title: "Dégustation de vins", desc: "Visite des domaines viticoles et dégustation des meilleurs crus corses." },
              { icon: <Mountain className="text-emerald-600" size={32} />, title: "Randonnée", desc: "Parcours guidés pour découvrir les paysages à couper le souffle." },
              { icon: <Sun className="text-orange-500" size={32} />, title: "Apéro Sunset", desc: "Organisation de moments magiques face au coucher du soleil." },
              { icon: <Compass className="text-blue-800" size={32} />, title: "Sur-mesure", desc: "Toutes vos envies deviennent réalité grâce à notre réseau." }
            ].map((activity, idx) => (
              <GlassContainer key={idx} className="p-8 !bg-white border-slate-100 hover:shadow-xl transition-all group">
                <div className="mb-6 transform group-hover:scale-110 transition-transform">{activity.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{activity.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{activity.desc}</p>
              </GlassContainer>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 p-12 md:p-20 rounded-[3rem] shadow-2xl text-white">
          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Prêt pour un séjour inoubliable en Corse ?</h2>
          <p className="text-xl text-blue-100 mb-10">Contactez-nous dès aujourd'hui pour commencer à planifier vos vacances de rêve.</p>
          <Button variant="secondary" onClick={() => navigate('contact')} className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-5 text-xl mx-auto">
            Demander mon devis sur mesure
          </Button>
        </div>
      </section>
    </div>
  );

  const renderPrestations = () => (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/corse-beach/1920/1080" 
            className="w-full h-full object-cover" 
            alt="Plage Corse"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-7xl font-semibold mb-6 tracking-tight leading-tight">
            Les prestations de <br/> <span className="text-blue-200">Star's Clean Conciergerie</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-medium opacity-90">
            Prestations aux meilleurs prix dans l'extrême Sud de la Corse
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <img 
              src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/537140_QuatreTiers.ori_.jpg" 
              className="rounded-[3rem] shadow-2xl border-8 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500" 
              alt="Prestations de luxe"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Un service d'exception en Corse-du-Sud
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Star's Clean Conciergerie propose différentes prestations dans l'extrême Sud de la Corse pour rendre votre séjour inoubliable.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Louez un bateau, visitez des caves renommées ou profitez d'un moment de détente absolue. Venez découvrir des coins paradisiaques avec nos services exclusifs.
            </p>
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 font-bold">
              <Sparkles className="text-emerald-500" />
              <span>N'attendez plus, venez découvrir l'île de beauté !</span>
            </div>
            <Button onClick={() => navigate('contact')} className="px-10 py-4 text-lg">Contactez-nous maintenant</Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Nos Services Exclusifs</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Tout ce dont vous avez besoin pour des vacances parfaites.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div 
                key={service.id} 
                onClick={() => navigate('service-detail', service)}
                className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group cursor-pointer"
              >
                <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl group-hover:bg-blue-50 transition-colors">
                  {getServiceIcon(service.icon, 32, "text-blue-600")}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 capitalize">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed">{service.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  En savoir plus <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Prêt à vivre l'exceptionnel ?</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Star's Clean Conciergerie est votre partenaire de confiance pour un séjour sans contraintes dans l'extrême Sud de la Corse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={() => navigate('contact')} className="px-12 py-5 text-xl">Réserver une prestation</Button>
            <Button variant="outline" onClick={() => navigate('properties')} className="px-12 py-5 text-xl">Voir nos biens</Button>
          </div>
        </div>
      </section>
    </div>
  );

  const renderServiceDetail = () => {
    if (!selectedService) return null;
    const s = selectedService;
    return (
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto animate-fade-in">
        <button onClick={() => navigate('prestations')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors">
          <ChevronLeft size={20}/> Retour aux prestations
        </button>
        
        <div className={`grid grid-cols-1 ${s.id === 'car-rental' ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-16`}>
          <div className="space-y-8">
            <div className="p-6 bg-blue-50 w-fit rounded-3xl text-blue-600">
              {getServiceIcon(s.icon, 48)}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight capitalize">
              {s.title}
            </h1>

            {/* Mobile Image Slider - Only visible on mobile */}
            <div className="lg:hidden -mx-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-4 px-4 py-2">
              {s.images.map((img, idx) => (
                <div key={idx} className="min-w-[85vw] aspect-[4/3] snap-center overflow-hidden rounded-[2rem] shadow-lg border border-slate-100">
                  <img 
                    src={img} 
                    className="w-full h-full object-cover" 
                    alt={`${s.title} ${idx + 1}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {s.id === 'car-rental' ? (
                <div className="space-y-12">
                  {/* Vehicule 1: Jogger */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg group">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                       <div className="p-8 md:p-12 space-y-6">
                        <div className="inline-block px-4 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">Familial & Modulable</div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Dacia Jogger – Le Break SUV d'Exception</h3>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          La voiture familiale qui se plie à vos envies. Enfin de l'espace pour tous vos passagers !
                        </p>
                        <p className="text-slate-500 leading-relaxed">
                          Le véhicule Jogger se décline en plusieurs versions modulables pour accueillir de <span className="font-bold text-slate-900">2 à 7 passagers</span> sans concession pour le confort et l'habitabilité.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                           <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                              <Zap className="text-blue-600" size={20} />
                              <div>
                                 <p className="text-xs font-black text-blue-900 uppercase tracking-tighter">Polyvalence</p>
                                 <p className="text-[10px] text-blue-700">Break & SUV</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                              <Users className="text-indigo-600" size={20} />
                              <div>
                                 <p className="text-xs font-black text-indigo-900 uppercase tracking-tighter">Capacité</p>
                                 <p className="text-[10px] text-indigo-700">Jusqu'à 7 places</p>
                              </div>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                           <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase">
                              Option : Siège enfant / Réhausseur
                           </div>
                           <div className="text-right">
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dès</span>
                              <span className="text-2xl font-black text-blue-600">50 € / jour</span>
                           </div>
                        </div>
                       </div>
                       <div className="bg-slate-100 relative min-h-[350px] overflow-hidden">
                          <img 
                            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/voiture1.png" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                            alt="Dacia Jogger" 
                            referrerPolicy="no-referrer" 
                          />
                       </div>
                    </div>
                  </div>

                  {/* Vehicule 2: Sandero */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg group">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                       <div className="order-2 lg:order-1 bg-slate-50 relative min-h-[350px] overflow-hidden">
                          <img 
                            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776674063476-7y689smrzd4.jpg" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 mix-blend-multiply opacity-80" 
                            alt="Dacia Sandero" 
                            referrerPolicy="no-referrer" 
                          />
                       </div>
                       <div className="order-1 lg:order-2 p-8 md:p-12 space-y-6">
                        <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Économique & Pratique</div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Dacia Sandero 2020 – Pratique, économique et confortable</h3>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          Optez pour la location de cette Dacia Sandero de 2020, un véhicule fiable et économique, idéal pour vos déplacements en toute simplicité.
                        </p>
                        <p className="text-slate-500 leading-relaxed">
                          Parfaite pour découvrir la région en toute liberté, cette citadine polyvalente offre un excellent compromis entre confort, maniabilité et faible consommation.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                           <div className="space-y-3">
                              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> Caractéristiques</h4>
                              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                                 <li>• Modèle : Dacia Sandero (2020)</li>
                                 <li>• Véhicule économique & facile</li>
                                 <li>• Idéal trajets urbains & escapades</li>
                                 <li>• Confort 4 à 5 passagers</li>
                              </ul>
                           </div>
                           <div className="space-y-3">
                              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Plus size={16} className="text-emerald-500" /> Les +</h4>
                              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                                 <li>• Fiable et bien entretenu</li>
                                 <li>• Solution sans contrainte</li>
                                 <li>• Partenaires familles & couples</li>
                              </ul>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                           <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase">
                              Option : Siège enfant / Réhausseur
                           </div>
                           <div className="text-right">
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dès</span>
                              <span className="text-2xl font-black text-blue-600">50 € / jour</span>
                           </div>
                        </div>
                       </div>
                    </div>
                  </div>

                  {/* Availability Info */}
                  <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 opacity-5 -mr-10"><MapPin size={300} /></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                       <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg"><MapPin size={24} /></div>
                          <h3 className="text-3xl font-black tracking-tight">Disponibilité & Livraison</h3>
                        </div>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                          Le véhicule est disponible au départ et au retour de l'aéroport de <span className="text-white font-black underline decoration-blue-500 underline-offset-8">Figari</span>. Parcourez les routes corses en toute liberté dès votre descente d'avion.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                           <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
                              <CheckCircle className="text-emerald-400" size={20} />
                              <span className="font-bold text-sm">Gestion simple & rapide</span>
                           </div>
                           <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
                              <Clock className="text-blue-400" size={20} />
                              <span className="font-bold text-sm">Service Client 24/7</span>
                           </div>
                        </div>
                       </div>
                       <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-4">
                          <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Options Longue Distance</p>
                          <p className="text-slate-300 text-sm leading-relaxed">
                             Possibilité de livraison ou récupération à l'aéroport de <span className="text-white font-bold">Bastia</span> ou <span className="text-white font-bold">Ajaccio</span>.
                          </p>
                          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                             <span className="text-xs font-bold text-slate-500 italic">Supplément</span>
                             <span className="bg-white text-slate-900 px-3 py-1 rounded-lg font-black text-sm">+ 100€</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ) : s.id === 'boat-rental' ? (
                <div className="space-y-10">
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-700 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">Préparez-vous à vivre une soirée magique !</h3>
                    <p className="text-blue-50 text-lg leading-relaxed">
                      Avec notre prestataire <span className="font-bold underline decoration-blue-300 underline-offset-4">BBQ Boat</span>, naviguez et grillez en toute convivialité dans les plus belles criques de Corse.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><Compass size={24}/></div>
                      <h3 className="text-2xl font-bold text-slate-900">Découvrez le BBQ Boat</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      L’expérience BBQ Boat en Corse vous propose la location d’un <span className="font-bold text-slate-900">bateau sans permis</span> pouvant accueillir jusqu’à <span className="font-bold text-slate-900">9 personnes</span>. Naviguez en toute liberté tout en savourant de délicieuses grillades grâce à un barbecue XXL intégré.
                    </p>
                    
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                      <p className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Le forfait de location comprend :</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { text: "Le carburant", icon: <Zap size={18}/> },
                          { text: "La vaisselle", icon: <CheckCircle size={18}/> },
                          { text: "Enceinte Bluetooth", icon: <Waves size={18}/> },
                          { text: "Éclairage nocturne", icon: <Sun size={18}/> }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-slate-700">
                            <div className="text-blue-500">{item.icon}</div>
                            <span className="font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-6 text-sm text-slate-500 italic">
                        Des options avec capitaine ainsi que des équipements de cuisson Weber sont également disponibles.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><Map size={24}/></div>
                      <h3 className="text-2xl font-bold text-slate-900">Découvrez les excursions</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Idéal pour partager des moments inoubliables entre amis ou en famille. Équipé d’un barbecue à gaz ou d’une vasque à boissons XXL, ce bateau vous permet de profiter de petits-déjeuners, déjeuners, dîners ou apéritifs dans les magnifiques criques sauvages du Valincu.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-start">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0"><MapPin size={24}/></div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">Sortie à la journée avec capitaine</h4>
                          <p className="text-sm text-slate-500 mb-2">📍 Départ : Port de Propriano (Quai Saint-Erasme)</p>
                          <p className="text-slate-600 text-sm">Laissez-vous guider à travers les eaux turquoise du golfe du Valincu pour une expérience exceptionnelle.</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Sun size={120}/></div>
                        <div className="relative z-10">
                          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="text-yellow-400" size={20}/>
                            Sortie apéritive au coucher de soleil
                          </h4>
                          <p className="text-slate-300 mb-6 italic">"Imaginez-vous voguer sur des eaux azurées, en dégustant un apéritif dînatoire entre ciel et mer."</p>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Vins sélectionnés</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Charcuterie & Fromages</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Tapas variés</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Moules corses</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : s.id === 'wine-tasting' ? (
                <div className="space-y-16 py-4">
                  {/* Luxury Header/Intro */}
                  <div className="relative rounded-[3rem] overflow-hidden group min-h-[400px] flex items-center shadow-2xl">
                    <img 
                      src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776672754990-8mmsrpn0tee.png" 
                      alt="Wine Cellar" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-red-900/40 to-transparent" />
                    <div className="relative z-10 p-8 md:p-16 max-w-2xl text-white">
                      <span className="inline-block px-4 py-1.5 bg-red-600/30 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-white/20">Expérience Exclusive</span>
                      <h3 className="text-4xl md:text-5xl font-black mb-6 leading-[1.1] tracking-tighter">L'Art de la Vigne en Corse-du-Sud</h3>
                      <p className="text-red-50 text-lg md:text-xl leading-relaxed font-light opacity-90">
                        Star's Clean Conciergerie vous ouvre les portes des domaines les plus prestigieux de l'île pour une immersion sensorielle au sommet de l'excellence.
                      </p>
                    </div>
                  </div>

                  {/* Storytelling Sections */}
                  <div className="space-y-24">
                    {/* Domaine de Zuria - Now 1st */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 group">
                      <div className="w-full lg:w-1/2 relative">
                        <div className="absolute -inset-4 bg-blue-50 rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative rounded-[3rem] overflow-hidden aspect-[4/3] shadow-xl">
                          <img 
                            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/domaine.png" 
                            alt="Domaine de Zuria" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-1/2 px-4">
                        <span className="text-blue-700 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Modernité & Pureté</span>
                        <h4 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Domaine de Zuria</h4>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                          Face aux falaises de Bonifacio, le Domaine de Zuria est une ode à l'architecture contemporaine et au respect du vivant. Ce vignoble en bio-dynamie sublime la minéralité calcaire de son sol pour sculpter des blancs d'une tension cristalline et des rosés d'une élégance absolue.
                        </p>
                        <ul className="space-y-4 mb-8">
                          {['Découverte de l\'architecture bioclimatique','Ateliers sensoriels personnalisés','Expérience gastronomique & accords mets-vins'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Domaine de la Murta - Now 2nd */}
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-12 group">
                      <div className="w-full lg:w-1/2 relative">
                        <div className="absolute -inset-4 bg-red-50 rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative rounded-[3rem] overflow-hidden aspect-[4/3] shadow-xl">
                          <img 
                            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776672771400-alwisv1b0gk.png" 
                            alt="Domaine de la Murta" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-1/2 px-4">
                        <span className="text-red-700 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Héritage & Terroir</span>
                        <h4 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Domaine de la Murta</h4>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                          Niché dans la splendeur sauvage de l'Alta Rocca, le Domaine de la Murta est le gardien des traditions séculaires. Ici, les cépages endémiques sont magnifiés par un climat privilégié, offrant des vins d'une profondeur rare qui racontent l'histoire brute et généreuse du sol corse.
                        </p>
                        <ul className="space-y-4 mb-8">
                          {['Visite des vignobles en buggy','Dégustation millésimée','Secrets de vinification traditionnelle'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-600" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Summary */}
                  <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-red-600 border border-slate-100">
                          <Wine size={24} />
                        </div>
                        <h5 className="font-bold text-slate-900">Domaines Privés</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">Accès exclusif à des propriétés fermées au grand public.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-amber-500 border border-slate-100">
                          <Award size={24} />
                        </div>
                        <h5 className="font-bold text-slate-900">Expertise Sommelier</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">Accompagnement par des passionnés du terroir insulaire.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-blue-600 border border-slate-100">
                          <Sun size={24} />
                        </div>
                        <h5 className="font-bold text-slate-900">Expérience Sur Mesure</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">Itinéraires personnalisés selon vos préférences gustatives.</p>
                      </div>
                    </div>
                  </div>

                  {/* Refined Contact CTA */}
                  <div className="relative rounded-[3rem] bg-slate-900 p-8 md:p-16 text-center text-white overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-64 h-64 bg-red-600 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2" />
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                      <h4 className="text-2xl md:text-3xl font-bold mb-6">Prêt à vivre une expérience inoubliable ?</h4>
                      <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                        Que vous souhaitiez une demi-journée de découverte ou une itinérance complète, notre équipe organise chaque détail de votre aventure œnologique.
                      </p>
                      <Button onClick={() => navigate('contact')} className="h-16 px-12 bg-white text-slate-900 hover:bg-white/90 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl w-full sm:w-auto">
                        Réserver ma dégustation
                      </Button>
                    </div>
                  </div>
                </div>
              ) : s.id === 'breakfast' ? (
                <div className="space-y-10">
                  <div className="bg-gradient-to-br from-orange-400 to-amber-600 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">Un réveil gourmand en toute sérénité</h3>
                    <p className="text-orange-50 text-lg leading-relaxed">
                      Explorez notre service de livraison de petit-déjeuner, alliant <span className="font-bold">saveurs exquises</span> et <span className="font-bold">praticité</span>.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="bg-orange-100 text-orange-600 p-2 rounded-xl"><Coffee size={24}/></div>
                      <h3 className="text-2xl font-bold text-slate-900">Délices Matinaux</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Savourez des délices matinaux, avec une sélection variée de produits frais sélectionnés chez nos meilleurs artisans locaux.
                    </p>
                    <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 flex items-start gap-6">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 shrink-0">
                        <Clock className="text-orange-500" size={32} />
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Notre livraison rapide vous assure un début de journée délicieux, sans tracas. Commandez dès maintenant pour une expérience gourmande à votre porte.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><CheckCircle size={20}/></div>
                      <span className="font-bold text-slate-900">Produits frais</span>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Zap size={20}/></div>
                      <span className="font-bold text-slate-900">Livraison rapide</span>
                    </div>
                  </div>
                </div>
              ) : s.id === 'massage' ? (
                <div className="space-y-10">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">Une oasis de bien-être à domicile</h3>
                    <p className="text-pink-50 text-lg leading-relaxed">
                      Offrez-vous une parenthèse de détente absolue avec nos soins et massages personnalisés, <span className="font-bold">directement chez vous</span>.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="bg-pink-100 text-pink-600 p-2 rounded-xl"><Heart size={24}/></div>
                      <h3 className="text-2xl font-bold text-slate-900">Soin et massage à domicile</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Nos praticiens qualifiés créent une expérience relaxante, directement chez vous. Libérez le stress, revitalisez votre corps et esprit.
                    </p>
                    <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 flex items-start gap-6">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose-100 shrink-0">
                        <Sparkles className="text-pink-500" size={32} />
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Réservez votre moment de détente dès maintenant pour une parenthèse de bien-être personnalisée, sans quitter votre cocon.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <Briefcase className="text-pink-400" />
                      <h3 className="text-lg font-bold">Informations Pratiques</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="bg-pink-600/20 text-pink-400 p-2 rounded-lg shrink-0"><CheckCircle size={18}/></div>
                        <p className="text-sm text-slate-300">
                          Découvrez les cartes de visites des prestataires dans votre <span className="text-white font-bold">livret d'Accueil</span>.
                        </p>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="bg-blue-600/20 text-blue-400 p-2 rounded-lg shrink-0"><Phone size={18}/></div>
                        <p className="text-sm text-slate-300">
                          Pour toute présentation des praticiens, merci de <span className="text-white font-bold">contacter la conciergerie</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : s.id === 'airport-transfer' ? (
                <div className="space-y-10">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-10 rotate-12"><Plane size={240}/></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-4">Transport depuis l'aéroport</h3>
                      <p className="text-slate-300 text-lg leading-relaxed">
                        Pour un transport <span className="text-white font-bold">serein et sans encombre</span> depuis l'aéroport, nous vous recommandons de réserver à l'avance.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><ShieldCheck size={24}/></div>
                      <h3 className="text-2xl font-bold text-slate-900">Fiabilité & Confort</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Que vous préfériez un <span className="font-bold text-slate-900">van</span> ou un <span className="font-bold text-slate-900">taxi</span> à votre arrivée, notre équipe dédiée se charge de tout pour vous offrir une expérience de transport confortable et fiable.
                    </p>
                    
                    <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex items-start gap-6">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 shrink-0">
                        <FileText className="text-blue-600" size={32} />
                      </div>
                      <div>
                        <p className="text-slate-700 leading-relaxed mb-4">
                          Rapprochez-vous de notre conciergerie pour obtenir un <span className="font-bold text-blue-900">devis personnalisé</span> adapté à vos besoins.
                        </p>
                        <Button onClick={() => navigate('contact')} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-100">
                          Demander un devis
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><CheckCircle size={20}/></div>
                      <span className="font-bold text-slate-900">Solution sans stress</span>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Zap size={20}/></div>
                      <span className="font-bold text-slate-900">Efficacité garantie</span>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200">
                    <p className="text-slate-600 leading-relaxed text-center italic">
                      "Simplifiez votre arrivée et laissez-nous vous conduire en toute sécurité vers votre destination. Profitez d'une solution de transport efficace pour démarrer votre voyage de la meilleure manière possible."
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xl text-slate-600 leading-relaxed whitespace-pre-line">
                  {s.longDesc}
                </p>
              )}
            </div>
            <div className="pt-4">
              <Button onClick={() => navigate('contact')} className="px-10 py-5 text-xl">
                Réserver ce service
              </Button>
            </div>
          </div>
          
          {s.id !== 'car-rental' && (
            <div className="hidden lg:grid grid-cols-1 gap-6">
              {s.images.map((img, idx) => (
                <div key={idx} className="overflow-hidden rounded-[2.5rem] shadow-xl border border-slate-100 aspect-[4/3]">
                  <img 
                    src={img} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    alt={`${s.title} ${idx + 1}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContact = () => (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-semibold mb-12">Contactez-nous</h1>
      <GlassContainer className="p-8 !bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
          <div><p className="font-bold mb-2 text-slate-900">Téléphone</p><p className="text-blue-600 font-bold">+33 (0)6 42 65 85 98</p></div>
          <div><p className="font-bold mb-2 text-slate-900">Email</p><p className="text-blue-600 font-bold text-xs">conciergerie.prestige2a@gmail.com</p></div>
        </div>
        <form className="space-y-6" onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
          };

          try {
            const response = await fetch('https://formspree.io/f/mykljwzz', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to send message');
            alert('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            form.reset();
          } catch (error) {
            console.error("Contact error:", error);
            alert("Erreur lors de l'envoi du message. Veuillez réessayer par téléphone.");
          }
        }}>
          <input name="name" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Nom complet" required />
          <input name="email" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" type="email" placeholder="Email" required />
          <textarea name="message" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" rows={5} placeholder="Votre message..." required></textarea>
          <Button className="w-full">Envoyer le message</Button>
        </form>
      </GlassContainer>
    </div>
  );

  const renderFooter = () => (
    <footer className="mt-auto bg-slate-950 pt-20 pb-10 px-4 relative z-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="mb-8 cursor-pointer" onClick={() => navigate('home')}><ElegantLogo isDark={true} /></div>
            <p className="text-slate-400 max-w-sm mb-8">Professionnels spécialisés dans la gestion locative et la conciergerie dans l'extrême Sud de la Corse.</p>
            <a href="https://www.instagram.com/conciergerie_prestige2a/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-blue-600 border border-white/10 transition-all" aria-label="Suivez-nous sur Instagram"><Instagram size={22} /></a>
          </div>
          <div className="md:col-span-3">
            <h2 className="font-black text-white mb-6 uppercase text-xs tracking-widest">Navigation</h2>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={() => navigate('home')} className="hover:text-blue-400 transition-colors">Accueil</button></li>
              <li><button onClick={() => navigate('conciergerie')} className="hover:text-blue-400 transition-colors">Propriétaires</button></li>
              <li><button onClick={() => navigate('properties')} className="hover:text-blue-400 transition-colors">Nos biens</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-blue-400 transition-colors">Contact</button></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h2 className="font-black text-white mb-6 uppercase text-xs tracking-widest">Prestations</h2>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={() => navigate('sejours')} className="hover:text-blue-400 transition-colors">Gestion des séjours</button></li>
              <li><button onClick={() => navigate('prestations')} className="hover:text-blue-400 transition-colors">Prestations à la carte</button></li>
              <li><button onClick={() => navigate('admin')} className="text-[10px] text-slate-400 hover:text-blue-400 font-bold mt-4 block transition-colors">Accès Privé</button></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-slate-400 border-t border-white/5 pt-10">@ 2026 Propulsé par Bookingfast</div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-white flex flex-col selection:bg-blue-100">
      {renderNavbar()}
      <main className="flex-grow">
        {route === 'home' && renderHome()}
        {route === 'properties' && renderProperties()}
        {route === 'detail' && renderDetail()}
        {route === 'contact' && renderContact()}
        {route === 'admin' && renderAdmin()}
        {route === 'conciergerie' && renderConciergerie()}
        {route === 'sejours' && renderGestionSejours()}
        {route === 'prestations' && renderPrestations()}
        {route === 'service-detail' && renderServiceDetail()}
      </main>
      {renderFooter()}

      {/* Booking Overlay */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-fade-in flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white">
            <ElegantLogo />
            <button 
              onClick={() => setIsBookingOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-800"
              aria-label="Fermer"
            >
              <X size={32} />
            </button>
          </div>
          <div className="flex-grow relative">
            <iframe 
              src="https://conciergerie-star-s-clean.amenitiz.io/fr/booking/room#DatesGuests-BE" 
              className="w-full h-full border-none"
              title="Réservation Amenitiz"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
