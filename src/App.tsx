import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Home, MapPin, BedDouble, Phone, Mail, Instagram, 
  ChevronDown, Menu, X, Plus, Trash2, Image as ImageIcon, Sparkles, 
  ShieldCheck, Clock, ArrowRight, Key, Users, Bath, Accessibility, Edit2,
  Briefcase, Ship, Car, Coffee, Heart, Plane, Calendar, Camera, Sun, Wine, Bell, Umbrella, CheckCircle,
  ChevronLeft, ChevronRight, Star, Quote, TrendingUp, Map, Award, Zap, Lock, LogOut, Compass, Waves, Mountain
} from 'lucide-react';
import { Property, Review, Category } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';

// --- DONNÉES DE DÉPART (Gérées via properties.json sur le serveur) ---

// --- AVIS GOOGLE ---
const GOOGLE_REVIEWS: Review[] = [
  { id: 1, author: "Sophie M.", date: "Il y a 2 semaines", rating: 5, text: "Superbe expérience avec Star's Clean ! La villa était dans un état impeccable à notre arrivée. L'équipe est aux petits soins.", avatar: "https://ui-avatars.com/api/?name=Sophie+M&background=0D8ABC&color=fff" },
  { id: 2, author: "Jean-Marc L.", date: "Il y a 1 mois", rating: 5, text: "Je confie la gestion de ma location saisonnière à Star's Clean depuis un an. C'est une tranquillité d'esprit totale.", avatar: "https://ui-avatars.com/api/?name=Jean-Marc+L&background=1D4ED8&color=fff" },
  { id: 3, author: "Claire D.", date: "Il y a 2 mois", rating: 5, text: "Nous avons fait appel à eux pour l'organisation de notre séjour : location de bateau, réservation de restaurants. Parfait !", avatar: "https://ui-avatars.com/api/?name=Claire+D&background=4338CA&color=fff" }
];

// --- COMPOSANTS RÉUTILISABLES ---
const GlassContainer = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void, key?: string | number }) => (
  <div onClick={onClick} className={`bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-lg rounded-2xl ${className}`}>{children}</div>
);

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
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
    title: '', category: 'studios' as Category, location: '', capacity: '', beds: '', bathrooms: '', pmr: false, desc: '', images: '', isVisible: true
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

  const navigate = (newRoute: string, property: Property | null = null) => {
    setRoute(newRoute);
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <button onClick={() => navigate('conciergerie')} className={`hover:text-blue-600 transition-colors ${route === 'conciergerie' ? 'text-blue-600 font-bold' : ''}`}>Conciergerie</button>
          <div className="relative group">
            <button onClick={() => navigate('properties')} className="flex items-center gap-1 hover:text-blue-600 font-medium transition-colors">Nos Biens <ChevronDown size={14}/></button>
            <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <GlassContainer className="flex flex-col p-2 !bg-white shadow-xl border-slate-100">
                <button onClick={() => { setActiveCategory('studios'); navigate('properties'); }} className="text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-800 transition-colors">Studios / T2</button>
                <button onClick={() => { setActiveCategory('minivillas'); navigate('properties'); }} className="text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-800 transition-colors">Mini Villas</button>
                <button onClick={() => { setActiveCategory('villas'); navigate('properties'); }} className="text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-800 transition-colors">Villas</button>
              </GlassContainer>
            </div>
          </div>
          <button onClick={() => navigate('sejours')} className={`hover:text-blue-600 transition-colors ${route === 'sejours' ? 'text-blue-600 font-bold' : ''}`}>Gestion séjours</button>
          <button onClick={() => navigate('prestations')} className={`hover:text-blue-600 transition-colors ${route === 'prestations' ? 'text-blue-600 font-bold' : ''}`}>Prestations</button>
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
            <button onClick={() => navigate('conciergerie')} className="text-left font-medium p-2 hover:bg-slate-100 rounded-lg">Conciergerie</button>
            <button onClick={() => navigate('properties')} className="text-left font-medium p-2 hover:bg-slate-100 rounded-lg">Nos Biens</button>
            <button onClick={() => navigate('sejours')} className="text-left font-medium p-2 hover:bg-slate-100 rounded-lg">Gestion séjours</button>
            <button onClick={() => navigate('prestations')} className="text-left font-medium p-2 hover:bg-slate-100 rounded-lg">Prestations</button>
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
          <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold uppercase rounded-full shadow-sm">{property.category}</span></div>
          {property.images?.length > 1 && <div className="absolute bottom-4 right-4 px-2 py-1 bg-slate-900/60 text-white text-xs rounded-md flex items-center gap-1"><Camera size={12} />{property.images.length}</div>}
        </div>
        <div className={`p-6 flex flex-col flex-grow overflow-hidden ${isList ? 'md:p-8 md:w-7/12' : ''}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{property.title}</h3>
          <div className="flex items-center gap-2 text-slate-500 mb-4 text-sm shrink-0"><MapPin size={16} className="text-blue-500" /><span>{property.location}</span></div>
          <div className="flex flex-wrap items-center gap-4 mb-4 text-slate-700 text-sm shrink-0">
            <div className="flex items-center gap-1"><Users size={16} className="text-blue-500" /><span>{property.capacity}</span></div>
            <div className="flex items-center gap-1"><BedDouble size={16} className="text-indigo-500" /><span>{property.beds} Ch.</span></div>
            <div className="flex items-center gap-1"><Bath size={16} className="text-cyan-500" /><span>{property.bathrooms} Sdb.</span></div>
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
          <div className="absolute inset-0 w-full h-full animate-slow-pan opacity-70" style={{ backgroundImage: "url('https://www.sothebysrealty-france.com/datas/biens/images/19442/19442_01-2023-05-17-1427.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
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

      {/* Pourquoi nous choisir */}
      <section className="py-24 px-4 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Pourquoi choisir Star's Clean ?</h2><p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">Nous maximisons votre rentabilité tout en protégeant la valeur de votre patrimoine immobilier.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <TrendingUp className="text-blue-600" size={32} />, title: "Rentabilité", desc: "Ajustement dynamique des tarifs selon la saisonnalité." },
              { icon: <ShieldCheck className="text-emerald-600" size={32} />, title: "Sérénité Totale", desc: "Gestion des contrats, cautions et entretiens complets." },
              { icon: <Map className="text-indigo-600" size={32} />, title: "Expertise Locale", desc: "Parfaite connaissance de Porto-Vecchio et du Sud Corse." },
              { icon: <Award className="text-orange-500" size={32} />, title: "Qualité Premium", desc: "Ménage hôtelier méticuleux et prestations de luxe." }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                <div className="mb-6 transform group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
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

        <div className="mt-12"><a href="https://share.google/pYtB9A5Wx0rAZWp1c" target="_blank" className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full font-bold hover:shadow-md transition-all"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5" alt="" referrerPolicy="no-referrer" /> Voir les 48 avis Google</a></div>
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
          {['all', 'studios', 'minivillas', 'villas'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as Category)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat === 'all' ? 'Tous' : cat === 'studios' ? 'Studios / T2' : cat === 'minivillas' ? 'Mini Villas' : 'Villas'}
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
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">{p.category}</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">{p.title}</h1>
            <p className="text-slate-500 flex items-center gap-2 mb-8 text-lg"><MapPin size={22} className="text-blue-600" /> {p.location}</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100"><Users size={24} className="text-blue-500 mb-2"/><span className="font-bold text-slate-900">{p.capacity}</span></div>
              <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100"><BedDouble size={24} className="text-indigo-500 mb-2"/><span className="font-bold text-slate-900">{p.beds} Ch.</span></div>
              <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100"><Bath size={24} className="text-cyan-500 mb-2"/><span className="font-bold text-slate-900">{p.bathrooms} Sdb.</span></div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8 flex-grow"><h2 className="text-xl font-bold mb-4 text-slate-900">À propos de ce logement</h2><p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">{p.desc}</p></div>
            <Button className="w-full py-5" onClick={() => setIsBookingOpen(true)}>Demander une réservation <ArrowRight className="ml-2" size={20}/></Button>
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

        if (!response.ok) throw new Error('Failed to save property');
        
        // Refresh properties list
        const updatedResponse = await fetch('/api/properties');
        const updatedData = await updatedResponse.json();
        setProperties(updatedData);

        setEditingId(null);
        setAdminFormData({ title: '', category: 'studios', location: '', capacity: '', beds: '', bathrooms: '', pmr: false, desc: '', images: '', isVisible: true });
      } catch (error) {
        console.error("Error saving property:", error);
        alert("Erreur lors de la sauvegarde du bien.");
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
              </select>
              <input className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Localisation" value={adminFormData.location} onChange={e => setAdminFormData({...adminFormData, location: e.target.value})} required />
              <div className="grid grid-cols-3 gap-3">
                <input className="p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Capacité" value={adminFormData.capacity} onChange={e => setAdminFormData({...adminFormData, capacity: e.target.value})} required />
                <input className="p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" type="number" placeholder="Ch." value={adminFormData.beds} onChange={e => setAdminFormData({...adminFormData, beds: e.target.value})} />
                <input className="p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" type="number" placeholder="Sdb" value={adminFormData.bathrooms} onChange={e => setAdminFormData({...adminFormData, bathrooms: e.target.value})} />
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
                    onChange={e => setAdminFormData({...adminFormData, pmr: e.target.checked})}
                    className="w-5 h-5 accent-indigo-600"
                  />
                  <label htmlFor="pmr" className="text-sm font-medium text-slate-700 cursor-pointer">Accès PMR / Handicapé</label>
                </div>
              </div>
              <Button className="w-full py-4" disabled={isAdminSubmitting}>{isAdminSubmitting ? 'Envoi...' : (editingId ? 'Mettre à jour' : 'Sauvegarder')}</Button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setAdminFormData({ title: '', category: 'studios', location: '', capacity: '', beds: '', bathrooms: '', pmr: false, desc: '', images: '', isVisible: true }); }} className="w-full text-xs text-red-500 font-bold mt-2 uppercase tracking-widest">ANNULER</button>}
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
                  <button onClick={() => { setEditingId(p.id!); setAdminFormData({ ...p, images: p.images?.join('\n') || '', beds: String(p.beds), bathrooms: String(p.bathrooms), isVisible: p.isVisible !== false }); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
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
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16"><h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">Conciergerie & Gestion Locative</h1><p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">Libérez-vous des contraintes et profitez sereinement de vos revenus locatifs.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
        <div className="space-y-8">
           <h2 className="text-3xl font-bold text-slate-900">Une offre clé en main</h2>
           <div className="grid gap-6">
              {[{t:"Annonce multi plateforme : 80% de la clientèle passe en directe", d:"Et le reste sur Airbnb, Booking, Abritel..."}, {t:"Ménage & Blanchisserie", d:"Nettoyage professionnel systématique."}, {t:"Maintenance", d:"Contrôle rigoureux après chaque voyageur."}, {t:"Accueil", d:"Remise des clés et bons plans."}].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100"><CheckCircle className="text-emerald-500 shrink-0" size={24} /><div><h3 className="font-bold text-slate-900 mb-1">{item.t}</h3><p className="text-sm text-slate-500">{item.d}</p></div></div>
              ))}
           </div>
        </div>
        <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000" className="rounded-[3rem] shadow-2xl border-8 border-white" alt="" referrerPolicy="no-referrer" />
      </div>
      <div className="text-center"><Button onClick={() => navigate('contact')} className="px-12 py-5">Obtenir un devis personnalisé</Button></div>
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
              src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80" 
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
              src="https://picsum.photos/seed/luxury-service/1000/800" 
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
            {[
              { icon: <Car className="text-blue-600" size={32} />, title: "Location de voitures", desc: "Une large gamme de véhicules pour parcourir les routes corses en toute liberté." },
              { icon: <Ship className="text-cyan-600" size={32} />, title: "Location de bateau", desc: "Explorez les criques inaccessibles et profitez d'une journée en mer exceptionnelle." },
              { icon: <Wine className="text-red-600" size={32} />, title: "Visite des caves", desc: "Dégustation des meilleurs crus locaux et découverte du terroir corse." },
              { icon: <Coffee className="text-orange-600" size={32} />, title: "Petit déjeuner", desc: "Livraison de viennoiseries fraîches et produits locaux directement à votre porte." },
              { icon: <Heart className="text-pink-600" size={32} />, title: "Soin & Massage", desc: "Un moment de détente absolue avec nos praticiens qualifiés à domicile." },
              { icon: <Plane className="text-indigo-600" size={32} />, title: "Transport Aéroport", desc: "Transferts privés depuis et vers l'aéroport de Figari en toute sérénité." }
            ].map((service, idx) => (
              <div key={idx} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl group-hover:bg-blue-50 transition-colors">{service.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed">{service.desc}</p>
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
            const response = await fetch('/api/contact', {
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
            <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-blue-600 border border-white/10 transition-all" aria-label="Suivez-nous sur Instagram"><Instagram size={22} /></a>
          </div>
          <div className="md:col-span-3">
            <h2 className="font-black text-white mb-6 uppercase text-xs tracking-widest">Navigation</h2>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={() => navigate('home')} className="hover:text-blue-400 transition-colors">Accueil</button></li>
              <li><button onClick={() => navigate('conciergerie')} className="hover:text-blue-400 transition-colors">Conciergerie</button></li>
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
