import React, { useRef, useState } from 'react';
import { ArrowRight, Award, ChevronDown, Map, MapPin, ShieldCheck, Star, TrendingUp, Key, Sparkles, Calendar, Phone } from 'lucide-react';
import { Button, Img, buttonClass } from '../components/ui';
import { FaqSection, PropertyCard } from '../components/Layout';
import { Link, useRouter } from '../lib/router';
import { useData } from '../lib/data';
import { GOOGLE_REVIEWS } from '../data/reviews';
import { HOME_FAQ, LOCAL_PAGES } from '../../shared/localPages';
import { PATHS, propertyPath, localPath } from '../../shared/seo';
import { BUSINESS } from '../../shared/site';

function useSliderIndex() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const child = el.firstElementChild as HTMLElement | null;
    const w = child ? child.offsetWidth + 24 : el.offsetWidth;
    setIndex(Math.round(el.scrollLeft / w));
  };
  return { ref, index, onScroll };
}

const Dots = ({ count, active }: { count: number; active: number }) => (
  <div className="flex md:hidden flex-col items-center gap-3 mt-6" aria-hidden="true">
    <div className="flex justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${active === i ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'}`} />
      ))}
    </div>
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
      {Math.min(active + 1, count)} / {count}
    </span>
  </div>
);

export default function Home() {
  const { navigate } = useRouter();
  const { properties, loading, slugFor } = useData();
  const featured = properties.slice(0, 6);
  const slider = useSliderIndex();
  const reviews = useSliderIndex();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center justify-center px-4 pt-24 pb-12 md:py-0 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
          <Img
            priority
            src={BUSINESS.heroImage}
            alt=""
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover animate-slow-pan opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80"></div>
          <div className="absolute inset-0 bg-slate-950/20"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 backdrop-blur-md font-semibold text-xs md:text-sm mb-4 md:mb-8 animate-slide-up shadow-lg">
            <Award size={18} /> Conciergerie d'excellence en Corse
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-semibold text-white mb-4 md:mb-8 leading-[1.2] md:leading-[1.1] animate-slide-up drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] tracking-tighter">
            Conciergerie & gestion locative <br className="hidden sm:block" /> en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-semibold">Corse-du-Sud</span>
          </h1>
          <div className="max-w-3xl mx-auto mb-6 md:mb-10 space-y-2 md:space-y-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <p className="text-base md:text-2xl text-slate-100 drop-shadow-lg font-medium leading-relaxed">
              Star's Clean Conciergerie gère vos locations saisonnières et vos séjours à Bonifacio, Porto-Vecchio et dans tout l'extrême Sud de la Corse.
            </p>
            <p className="text-sm md:text-lg text-slate-300 drop-shadow-md font-normal leading-relaxed">
              Professionnels de l'immobilier avec 5 ans d'expérience dans le domaine, nous vous assurons la réussite de tous vos projets.
            </p>
            <p className="text-xs md:text-base text-blue-400 uppercase tracking-[0.2em] font-bold mt-4 md:mt-6">Particuliers • Professionnels</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 animate-slide-up w-full max-w-xs sm:max-w-none" style={{ animationDelay: '0.3s' }}>
            <Link to={PATHS.properties} className={buttonClass('primary', 'px-8 md:px-10 w-full sm:w-auto')}>
              Découvrir nos biens <ArrowRight size={22} className="ml-1" />
            </Link>
            <Link to={PATHS.conciergerie} className={buttonClass('secondary', 'px-8 md:px-10 w-full sm:w-auto')}>
              Je suis propriétaire
            </Link>
          </div>
        </div>
        <button
          className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-50"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          aria-label="Défiler vers le contenu"
        >
          <ChevronDown size={32} className="text-white" />
        </button>
      </section>

      {/* Biens à la une */}
      <section className="py-20 px-4 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Nos locations de vacances à la une</h2>
          <p className="text-slate-500 text-lg">Villas, mini-villas et appartements en gestion à Bonifacio, Porto-Vecchio et alentours.</p>
        </div>
        {loading ? (
          <div className="h-40 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : (
          <div className="relative">
            <div
              ref={slider.ref}
              onScroll={slider.onScroll}
              className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0"
            >
              {featured.map((p) => (
                <div key={p.id} className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center">
                  <PropertyCard property={p} to={propertyPath(slugFor(p))} />
                </div>
              ))}
            </div>
            <Dots count={featured.length} active={slider.index} />
          </div>
        )}
        <div className="mt-12 flex justify-center w-full">
          <Link to={PATHS.properties} className={buttonClass('primary')}>
            Voir tout notre catalogue ({properties.length})
          </Link>
        </div>
      </section>

      {/* Conciergerie Corse-du-Sud : zones */}
      <section className="py-20 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Votre conciergerie en Corse</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">Une conciergerie locale, de Bonifacio à Porto-Vecchio</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Depuis 2021, Star's Clean accompagne les propriétaires de résidences secondaires et d'investissements locatifs dans l'extrême Sud de la Corse. Notre équipe, basée en Corse-du-Sud, prend en charge toute la gestion de votre location saisonnière : annonces, réservations, accueil des voyageurs, ménage, linge et assistance.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { t: 'Accueil & check-in', icon: <Key size={20} /> },
                { t: 'Ménage professionnel', icon: <Sparkles size={20} /> },
                { t: 'Gestion des réservations', icon: <Calendar size={20} /> },
                { t: 'Assistance 24/7', icon: <Phone size={20} /> },
              ].map((item) => (
                <div key={item.t} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100">
                  <div className="text-blue-600">{item.icon}</div>
                  <span className="font-bold text-slate-700 text-sm">{item.t}</span>
                </div>
              ))}
            </div>
            <Link to={PATHS.conciergerie} className={buttonClass('primary', 'w-full sm:w-auto')}>
              Nos forfaits propriétaires <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LOCAL_PAGES.map((l) => (
              <Link key={l.slug} to={localPath(l)} className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-xl">
                <Img src={l.image} alt={`Conciergerie à ${l.city}`} width={600} height={750} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-widest text-blue-300 font-bold mb-1">Conciergerie</p>
                  <h3 className="text-2xl font-bold flex items-center gap-2">{l.city} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></h3>
                </div>
              </Link>
            ))}
            <div className="sm:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 flex flex-wrap items-center gap-2 text-sm">
              <MapPin size={16} className="text-blue-600" />
              <span className="font-bold text-slate-700 mr-1">Également :</span>
              {BUSINESS.areaServed.filter((c) => !LOCAL_PAGES.some((l) => l.city === c)).map((c) => (
                <span key={c} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-slate-600">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-32 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block py-1 px-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-[0.3em] mb-6">L'Excellence au Sommet</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
              Pourquoi choisir <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Star's Clean</span> ?
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-xl leading-relaxed">
              Nous redéfinissons les standards de la conciergerie de luxe en Corse-du-Sud, alliant <span className="text-white font-bold">performance financière</span> et{' '}
              <span className="text-white font-bold">préservation d'exception</span>.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp size={32} />, title: 'Rentabilité Optimisée', desc: 'Stratégie de Yield Management avancée pour maximiser vos revenus selon les flux touristiques.', accent: 'from-blue-500 to-blue-700' },
              { icon: <ShieldCheck size={32} />, title: 'Sérénité Absolue', desc: 'Une gestion 360° incluant assurances, cautions et maintenance préventive rigoureuse.', accent: 'from-indigo-500 to-indigo-700' },
              { icon: <Map size={32} />, title: 'Ancrage Local', desc: 'Une connaissance intime du territoire pour offrir des expériences authentiques et exclusives.', accent: 'from-slate-700 to-slate-900' },
              { icon: <Award size={32} />, title: 'Standard Hôtelier', desc: 'Un service de gouvernance méticuleux et des prestations de luxe pour une satisfaction totale.', accent: 'from-amber-500 to-amber-700' },
            ].map((f) => (
              <div key={f.title} className="relative group">
                <div className="h-full p-10 bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 hover:border-blue-500/50 transition-all duration-500 flex flex-col">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.accent} flex items-center justify-center text-white mb-8 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>{f.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm flex-grow">{f.desc}</p>
                  <div className="mt-8 h-1 w-12 bg-blue-600 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avis */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center overflow-hidden">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Avis de nos clients</h2>
        <p className="text-slate-500 mb-12">La satisfaction de nos propriétaires et voyageurs est notre priorité.</p>
        <div className="relative">
          <div
            ref={reviews.ref}
            onScroll={reviews.onScroll}
            className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0"
          >
            {GOOGLE_REVIEWS.map((r) => (
              <figure key={r.id} className="min-w-[85vw] sm:min-w-[350px] md:min-w-0 snap-center">
                <div className="p-8 text-left h-full bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col">
                  <div className="flex gap-1 mb-4" aria-label={`${r.rating} étoiles sur 5`}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />)}
                  </div>
                  <blockquote className="text-slate-700 italic mb-6 leading-relaxed flex-grow">"{r.text}"</blockquote>
                  <figcaption className="flex items-center gap-3 mt-auto">
                    <Img src={r.avatar} className="w-10 h-10 rounded-full border border-slate-100" width={40} height={40} alt="" />
                    <div>
                      <p className="font-bold text-sm">{r.author}</p>
                      <p className="text-xs text-slate-500">{r.date}</p>
                    </div>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
          <Dots count={GOOGLE_REVIEWS.length} active={reviews.index} />
        </div>
        <div className="mt-12">
          <a href={BUSINESS.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full font-bold hover:shadow-md transition-all">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5 h-5" width={20} height={20} alt="" loading="lazy" /> Voir nos avis Google
          </a>
        </div>
      </section>

      <FaqSection title="Questions fréquentes sur notre conciergerie en Corse-du-Sud" items={HOME_FAQ} />

      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 p-10 md:p-16 rounded-[3rem] shadow-2xl text-white text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">Vous êtes propriétaire en Corse-du-Sud ?</h2>
          <p className="text-lg text-blue-100 mb-8">Recevez une estimation gratuite des revenus de votre bien et une proposition de gestion sur mesure.</p>
          <Button variant="secondary" onClick={() => navigate(`${PATHS.contact}?sujet=proprietaire`)} className="bg-white !text-blue-700 hover:bg-blue-50 mx-auto">
            Demander mon estimation gratuite
          </Button>
        </div>
      </section>
    </div>
  );
}
