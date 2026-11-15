import React, { useEffect, useState } from 'react';
import { Accessibility, ArrowRight, Bath, BedDouble, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, MapPin, Users, X } from 'lucide-react';
import { Button, ElegantLogo, FALLBACK_IMAGE, Img, getCategoryLabel } from '../components/ui';
import { Link, useRouter } from '../lib/router';
import { PATHS } from '../../shared/seo';
import { BUSINESS } from '../../shared/site';
import type { Property } from '../types';

export default function PropertyDetail({ property: p }: { property: Property }) {
  const { navigate } = useRouter();
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const images = p.images?.length > 0 ? p.images : [FALLBACK_IMAGE];
  const longDesc = (p.desc || '').length > 300 || (p.desc || '').split('\n').length > 6;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  useEffect(() => {
    setIndex(0);
    setExpanded(false);
  }, [p.id]);

  // Fermeture de la réservation avec Échap + blocage du défilement en arrière-plan
  useEffect(() => {
    if (!bookingOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setBookingOpen(false);
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [bookingOpen]);

  // Navigation clavier dans la galerie
  useEffect(() => {
    if (images.length < 2 || bookingOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  // Glisser du doigt sur mobile
  const [touchX, setTouchX] = useState<number | null>(null);

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <nav aria-label="Fil d'Ariane" className="mb-8 text-sm text-slate-500 flex items-center gap-2 flex-wrap">
        <Link to={PATHS.properties} className="flex items-center gap-1 hover:text-blue-600 font-medium transition-colors">
          <ChevronLeft size={18} /> Nos locations
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[60vw]">{p.title}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl shadow-2xl relative group bg-slate-100">
            <div
              className="h-[340px] sm:h-[400px] md:h-[600px] relative"
              onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchX === null) return;
                const dx = e.changedTouches[0].clientX - touchX;
                if (Math.abs(dx) > 40) (dx > 0 ? prev : next)();
                setTouchX(null);
              }}
            >
              <Img priority src={images[index]} className="w-full h-full object-cover" alt={`${p.title} – photo ${index + 1}`} width={1200} height={900} />
              {images.length > 1 && (
                <>
                  <button onClick={prev} aria-label="Photo précédente" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={next} aria-label="Photo suivante" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all">
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/60 text-white text-xs font-bold">
                    {index + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button key={i} onClick={() => setIndex(i)} aria-label={`Afficher la photo ${i + 1}`} className="shrink-0">
                  <Img src={img} width={96} height={80} className={`w-24 h-20 object-cover rounded-xl border-2 transition-all ${i === index ? 'border-blue-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">{getCategoryLabel(p.category)}</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">{p.title}</h1>
          <p className="text-slate-500 flex items-center gap-2 mb-8 text-lg">
            <MapPin size={22} className="text-blue-600" /> {p.location}
          </p>
          <div className={`grid ${p.pmr ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'} gap-4 mb-8`}>
            <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center"><Users size={24} className="text-blue-500 mb-2" /><span className="font-bold text-slate-900">{p.capacity}</span></div>
            <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100"><BedDouble size={24} className="text-indigo-500 mb-2" /><span className="font-bold text-slate-900">{p.beds} chambre{p.beds > 1 ? 's' : ''}</span></div>
            <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100"><Bath size={24} className="text-cyan-500 mb-2" /><span className="font-bold text-slate-900">{p.bathrooms} sdb.</span></div>
            {p.pmr && <div className="flex flex-col items-center justify-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100"><Accessibility size={24} className="text-emerald-500 mb-2" /><span className="font-bold text-emerald-900">PMR</span></div>}
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8 flex-grow relative overflow-hidden">
            <h2 className="text-xl font-bold mb-4 text-slate-900">À propos de ce logement</h2>
            <div className={`relative transition-all duration-500 ${!expanded ? 'max-h-80 overflow-hidden' : 'max-h-[5000px]'}`}>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">{p.desc}</p>
              {!expanded && longDesc && <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />}
            </div>
            {longDesc && (
              <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="mt-4 text-blue-600 font-bold flex items-center gap-1 hover:text-blue-700 transition-colors">
                {expanded ? 'Voir moins' : 'Voir plus'}
                <ChevronDown size={18} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
              </button>
            )}
            {p.features?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold mb-4 text-slate-900">Équipements</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-slate-700"><CheckCircle size={18} className="text-blue-500 shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button
            className="w-full py-5"
            onClick={() => (p.bookingAction === 'contact' ? navigate(`${PATHS.contact}?bien=${encodeURIComponent(p.title)}`) : setBookingOpen(true))}
          >
            {p.bookingAction === 'contact' ? 'Contacter pour réserver' : 'Vérifier les disponibilités'}
            <ArrowRight className="ml-2" size={20} />
          </Button>
          <p className="text-center text-sm text-slate-500 mt-4">
            Une question ? Appelez-nous au <a href={`tel:${BUSINESS.phone}`} className="font-bold text-blue-600">{BUSINESS.phoneDisplay}</a>
          </p>
        </div>
      </div>

      {bookingOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-fade-in flex flex-col" role="dialog" aria-modal="true" aria-label="Réservation">
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white">
            <ElegantLogo />
            <button onClick={() => setBookingOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-800" aria-label="Fermer">
              <X size={32} />
            </button>
          </div>
          <div className="flex-grow relative">
            <iframe src={BUSINESS.bookingUrl} className="w-full h-full border-none" title="Réservation en ligne" />
          </div>
        </div>
      )}
    </div>
  );
}
