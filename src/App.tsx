import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, MapPin, BedDouble, Phone, Mail, Instagram, 
  ChevronDown, Menu, X, Plus, Trash2, Image as ImageIcon, Sparkles, 
  ShieldCheck, Clock, ArrowRight, Key, Users, Bath, Accessibility, Edit2,
  Briefcase, Ship, Car, Coffee, Heart, Plane, Calendar, Camera, Sun, Wine, Bell, Umbrella, CheckCircle,
  ChevronLeft, ChevronRight, Star, Quote, TrendingUp, Map, Award, Zap, Lock, LogOut
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
  const baseStyle = "px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-lg shadow-xl";
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
      src="https://cdn.discordapp.com/attachments/1034881615635173376/1485017071333937233/logo-en-cours-stars-clean-conciergerie-V5-blanc.png?ex=69c0556c&is=69bf03ec&hm=319270b6503e96197afca618f22597f29f63a08224561c4968d39b79b6912aab&" 
      alt="Logo Star's Clean" 
      className={`h-10 md:h-12 object-contain ${!isDark ? 'brightness-0 opacity-90' : ''}`}
      referrerPolicy="no-referrer"
    />
    <div className="flex flex-col leading-none hidden sm:flex">
      <span className={`text-sm md:text-base font-medium tracking-[0.25em] uppercase ${!isDark ? 'text-slate-900' : 'text-white'}`}>Star's Clean</span>
      <span className={`text-[10px] md:text-[11px] font-light tracking-[0.4em] uppercase mt-1 ${!isDark ? 'text-slate-500' : 'text-slate-300'}`}>Conciergerie</span>
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
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Utiliser les données réelles
  const displayProperties = useMemo(() => {
    return properties;
  }, [properties]);

  // État du formulaire Admin
  const [adminFormData, setAdminFormData] = useState({
    title: '', category: 'studios' as Category, location: '', capacity: '', beds: '', bathrooms: '', pmr: false, desc: '', images: ''
  });
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);
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
        <button className="lg:hidden text-slate-800" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 w-full h-full animate-slow-pan opacity-70" style={{ backgroundImage: "url('https://www.sothebysrealty-france.com/datas/biens/images/19442/19442_01-2023-05-17-1427.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80"></div>
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center pt-20 flex flex-col items-center">
          <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 backdrop-blur-md font-semibold text-sm mb-8 animate-slide-up shadow-lg"><Award size={18} /> Conciergerie d'excellence</span>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] animate-slide-up drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] tracking-tighter">Conciergerie, gestion locative <br/> en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#8F6F3D] to-[#634E26] filter drop-shadow-sm font-black">Corse-du-Sud</span></h1>
          <div className="max-w-3xl mx-auto mb-10 space-y-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <p className="text-xl md:text-2xl text-slate-100 drop-shadow-lg font-medium leading-relaxed">Star's Clean Conciergerie est une entreprise spécialisée dans la gestion des séjours dans l'extrême Sud de la Corse.</p>
            <p className="text-lg text-slate-300 drop-shadow-md font-normal leading-relaxed">Professionnels de l'immobilier avec 4 ans d'expérience dans le domaine, nous vous assurons la réussite de tous vos projets.</p>
            <p className="text-base text-[#A87952] uppercase tracking-[0.2em] font-bold mt-6">Particuliers • Professionnels</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="gold" onClick={() => navigate('properties')} className="px-10">Découvrir nos biens <ArrowRight size={22} className="ml-1" /></Button>
            <Button variant="secondary" onClick={() => navigate('contact')} className="px-10">Nous contacter</Button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-50 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}><ChevronDown size={32} className="text-white" /></div>
      </section>

      {/* Biens à la une */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Nos Biens à la une</h2>
          <p className="text-slate-500 text-lg">Découvrez une sélection de nos plus beaux logements en gestion.</p>
        </div>
        {loading ? <div className="h-40 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{displayProperties.slice(0, 6).map(p => <PropertyCard key={p.id} property={p} />)}</div>
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
      <section className="py-20 px-4 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Avis de nos clients</h2>
        <p className="text-slate-500 mb-12">La satisfaction de nos propriétaires et voyageurs est notre priorité.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {GOOGLE_REVIEWS.map(r => (
            <GlassContainer key={r.id} className="p-8 text-left !bg-white border-slate-100 shadow-sm">
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />)}</div>
              <p className="text-slate-700 italic mb-6 leading-relaxed">"{r.text}"</p>
              <div className="flex items-center gap-3"><img src={r.avatar} className="w-10 h-10 rounded-full border border-slate-100" alt="" referrerPolicy="no-referrer" /><div><p className="font-bold text-sm">{r.author}</p><p className="text-xs text-slate-400">{r.date}</p></div></div>
            </GlassContainer>
          ))}
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
        setAdminFormData({ title: '', category: 'studios', location: '', capacity: '', beds: '', bathrooms: '', pmr: false, desc: '', images: '' });
      } catch (error) {
        console.error("Error saving property:", error);
        alert("Erreur lors de la sauvegarde du bien.");
      } finally {
        setIsAdminSubmitting(false);
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
              <div className="grid grid-cols-2 gap-3">
                <input className="p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" type="number" placeholder="Ch." value={adminFormData.beds} onChange={e => setAdminFormData({...adminFormData, beds: e.target.value})} />
                <input className="p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" type="number" placeholder="Sdb" value={adminFormData.bathrooms} onChange={e => setAdminFormData({...adminFormData, bathrooms: e.target.value})} />
              </div>
              <textarea className="w-full p-3 bg-slate-50 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600" placeholder="Images (ligne par ligne)" value={adminFormData.images} onChange={e => setAdminFormData({...adminFormData, images: e.target.value})} rows={4} />
              <textarea className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Description" value={adminFormData.desc} onChange={e => setAdminFormData({...adminFormData, desc: e.target.value})} rows={4} required />
              <Button className="w-full py-4" disabled={isAdminSubmitting}>{isAdminSubmitting ? 'Envoi...' : (editingId ? 'Mettre à jour' : 'Sauvegarder')}</Button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setAdminFormData({ title: '', category: 'studios', location: '', capacity: '', beds: '', bathrooms: '', pmr: false, desc: '', images: '' }); }} className="w-full text-xs text-red-500 font-bold mt-2 uppercase tracking-widest">ANNULER</button>}
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
                  <button onClick={() => { setEditingId(p.id!); setAdminFormData({ ...p, images: p.images?.join('\n') || '', beds: String(p.beds), bathrooms: String(p.bathrooms) }); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
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
      </div>
    );
  };

  const renderConciergerie = () => (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16"><h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Conciergerie & Gestion Locative</h1><p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">Libérez-vous des contraintes et profitez sereinement de vos revenus locatifs.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
        <div className="space-y-8">
           <h2 className="text-3xl font-bold text-slate-900">Une offre clé en main</h2>
           <div className="grid gap-6">
              {[{t:"Annonces Multi-plateformes", d:"Airbnb, Booking, Abritel..."}, {t:"Ménage & Blanchisserie", d:"Nettoyage professionnel systématique."}, {t:"Maintenance", d:"Contrôle rigoureux après chaque voyageur."}, {t:"Accueil", d:"Remise des clés et bons plans."}].map((item, idx) => (
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
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Organisation de Séjours</h1>
      <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-16">Nous créons l'exceptionnel sur-mesure pour vos vacances.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {["Bateau", "Voiture", "Hélicoptère", "Terroir", "Aventures", "Assistance"].map((t, idx) => (
          <div key={idx} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:-translate-y-2 transition-all"><h3 className="text-xl font-bold mb-3">{t} Sur-Mesure</h3><p className="text-slate-400 text-sm">Service exclusif disponible sur demande.</p></div>
        ))}
      </div>
    </div>
  );

  const renderPrestations = () => (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-black text-center mb-16 tracking-tight">Nos Prestations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[{t: "Petit-Déjeuner", d: "Livraison à domicile dès 8h."}, {t: "Bien-être", d: "Massages relaxants à domicile."}, {t: "Chauffeur", d: "Transferts aéroport Figari."}, {t: "Ménage", d: "Service quotidien ou milieu de séjour."}].map((item, idx) => (
          <div key={idx} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-6"><div className="p-4 bg-blue-50 text-blue-600 rounded-full"><Sparkles/></div><div><h3 className="text-xl font-bold mb-2">{item.t}</h3><p className="text-slate-500 text-sm">{item.d}</p></div></div>
        ))}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-black mb-12">Contactez-nous</h1>
      <GlassContainer className="p-8 !bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
          <div><p className="font-bold mb-2 text-slate-900">Téléphone</p><p className="text-blue-600 font-bold">+33 (0)6 42 65 85 98</p></div>
          <div><p className="font-bold mb-2 text-slate-900">Email</p><p className="text-blue-600 font-bold text-xs">conciergerie.prestige2a@gmail.com</p></div>
        </div>
        <form className="space-y-6" onSubmit={e => {e.preventDefault(); alert('Message envoyé !');}}>
          <input className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Nom complet" required />
          <input className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" type="email" placeholder="Email" required />
          <textarea className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" rows={5} placeholder="Votre message..." required></textarea>
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
            <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-blue-600 border border-white/10 transition-all"><Instagram size={22} /></a>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-black text-white mb-6 uppercase text-xs tracking-widest">Navigation</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={() => navigate('home')} className="hover:text-blue-400 transition-colors">Accueil</button></li>
              <li><button onClick={() => navigate('conciergerie')} className="hover:text-blue-400 transition-colors">Conciergerie</button></li>
              <li><button onClick={() => navigate('properties')} className="hover:text-blue-400 transition-colors">Nos biens</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-blue-400 transition-colors">Contact</button></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="font-black text-white mb-6 uppercase text-xs tracking-widest">Prestations</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={() => navigate('sejours')} className="hover:text-blue-400 transition-colors">Gestion des séjours</button></li>
              <li><button onClick={() => navigate('prestations')} className="hover:text-blue-400 transition-colors">Prestations à la carte</button></li>
              <li><button onClick={() => navigate('admin')} className="text-[10px] text-slate-600 hover:text-blue-400 font-bold mt-4 block transition-colors">Accès Privé</button></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-slate-600 border-t border-white/5 pt-10">&copy; {new Date().getFullYear()} Star's Clean Conciergerie.</div>
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
