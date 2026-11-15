import React, { useEffect, useState } from 'react';
import { ChevronDown, Menu, X, Instagram, Phone, Mail, MapPin, Users, BedDouble, Bath, Accessibility, Camera, ArrowRight } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { ElegantLogo, Img, getCategoryLabel, FALLBACK_IMAGE } from './ui';
import { getServiceIcon } from './serviceIcon';
import { SERVICES } from '../../shared/services';
import { LOCAL_PAGES } from '../../shared/localPages';
import { PATHS, servicePath, localPath } from '../../shared/seo';
import { BUSINESS, telHref, mailHref } from '../../shared/site';
import type { Property, Category } from '../types';

const CATEGORY_LINKS: { cat: Category; label: string; desc: string }[] = [
  { cat: 'villas', label: 'Villas', desc: 'Avec piscine, vue mer' },
  { cat: 'minivillas', label: 'Mini villas', desc: 'Idéales pour 4 à 6 personnes' },
  { cat: 'appartements', label: 'Appartements', desc: 'Au cœur des villes et ports' },
  { cat: 'studios', label: 'Studios / T2', desc: 'Pour 2 à 3 voyageurs' },
];

type NavItem = { label: string; to: string; active: boolean; menu?: 'biens' | 'prestations' };

function DesktopDropdown({ kind }: { kind: 'biens' | 'prestations' }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-200">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-900/10 p-2 w-72">
        {kind === 'biens' ? (
          <>
            {CATEGORY_LINKS.map((c) => (
              <Link key={c.cat} to={`${PATHS.properties}?type=${c.cat}`} className="flex flex-col px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-sm font-semibold text-slate-900">{c.label}</span>
                <span className="text-xs text-slate-500">{c.desc}</span>
              </Link>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2">
              <Link to={PATHS.properties} className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50">
                Voir toutes les locations <ArrowRight size={16} />
              </Link>
            </div>
          </>
        ) : (
          <>
            {SERVICES.map((s) => (
              <Link key={s.id} to={servicePath(s)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group/item">
                <span className="w-9 h-9 rounded-lg bg-slate-50 group-hover/item:bg-blue-50 flex items-center justify-center shrink-0 transition-colors">
                  {getServiceIcon(s.icon, 18, 'text-blue-600')}
                </span>
                <span className="text-sm font-semibold text-slate-800">{s.title}</span>
              </Link>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2">
              <Link to={PATHS.prestations} className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50">
                Toutes les prestations <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function Navbar() {
  const { route } = useRouter();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = typeof window !== 'undefined' && !!localStorage.getItem('adminToken');

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [route]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu mobile : blocage du défilement + fermeture avec Échap
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const items: NavItem[] = [
    { label: 'Accueil', to: '/', active: route.name === 'home' },
    { label: 'Propriétaires', to: PATHS.conciergerie, active: route.name === 'conciergerie' || route.name === 'local' },
    { label: 'Nos biens', to: PATHS.properties, active: route.name === 'properties' || route.name === 'detail', menu: 'biens' },
    { label: 'Séjours', to: PATHS.sejours, active: route.name === 'sejours' },
    { label: 'Prestations', to: PATHS.prestations, active: route.name === 'prestations' || route.name === 'service-detail', menu: 'prestations' },
  ];

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${open ? 'bg-white border-b border-slate-100' : scrolled ? 'bg-white/95 backdrop-blur-lg shadow-[0_1px_0_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(15,23,42,0.15)]' : 'bg-white border-b border-slate-100'}`}>
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-[72px] flex justify-between items-center gap-6" aria-label="Navigation principale">
        <Link to="/" className="shrink-0" aria-label="Star's Clean Conciergerie – Accueil">
          <ElegantLogo />
        </Link>

        <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {items.map((it) => (
            <li key={it.to} className={it.menu ? 'relative group' : 'relative'}>
              <Link
                to={it.to}
                aria-current={it.active ? 'page' : undefined}
                className={`relative flex items-center gap-1 px-2.5 xl:px-3.5 py-2 rounded-full text-[15px] font-medium whitespace-nowrap transition-colors ${it.active ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                {it.label}
                {it.menu && <ChevronDown size={15} className="text-slate-400 transition-transform group-hover:rotate-180" />}
                {it.active && <span className="absolute left-2.5 right-2.5 xl:left-3.5 xl:right-3.5 -bottom-[3px] h-[2px] rounded-full bg-blue-600" />}
              </Link>
              {it.menu && <DesktopDropdown kind={it.menu} />}
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {isAdmin && (
            <Link to={PATHS.admin} className="px-3 py-2 rounded-full text-sm font-semibold text-slate-500 hover:text-blue-600 hover:bg-slate-50">
              Admin
            </Link>
          )}
          <a href={telHref} className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50" aria-label={`Appeler le ${BUSINESS.phoneDisplay}`}>
            <Phone size={16} className="text-blue-600" />
            <span className="hidden xl:inline tabular-nums">{BUSINESS.phoneDisplay}</span>
          </a>
          <Link
            to={PATHS.contact}
            aria-current={route.name === 'contact' ? 'page' : undefined}
            className="px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap bg-slate-900 text-white hover:bg-blue-600 transition-colors"
          >
            Nous contacter
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-1">
          <a href={telHref} className="w-11 h-11 rounded-full flex items-center justify-center text-blue-600 hover:bg-slate-100" aria-label={`Appeler le ${BUSINESS.phoneDisplay}`}>
            <Phone size={20} />
          </a>
          <button className="w-11 h-11 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 -mr-2" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </header>

      {/* En dehors du <header> : son backdrop-filter limiterait la taille d'un panneau « fixed ». */}
      {open && (
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-40 bg-white border-t border-slate-100 overflow-y-auto animate-menu-in">
          <ul className="px-4 py-4 flex flex-col">
            {items.map((it) => (
              <li key={it.to} className="border-b border-slate-100">
                {it.menu === 'prestations' ? (
                  <>
                    <button onClick={() => setServicesOpen(!servicesOpen)} aria-expanded={servicesOpen} className={`w-full flex items-center justify-between py-4 text-lg font-semibold ${it.active ? 'text-blue-600' : 'text-slate-900'}`}>
                      {it.label}
                      <ChevronDown size={20} className={`text-slate-400 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {servicesOpen && (
                      <div className="pb-3 grid grid-cols-1 gap-1">
                        {SERVICES.map((s) => (
                          <Link key={s.id} to={servicePath(s)} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium">
                            <span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">{getServiceIcon(s.icon, 18, 'text-blue-600')}</span>
                            {s.title}
                          </Link>
                        ))}
                        <Link to={PATHS.prestations} className="px-2 py-2.5 text-sm font-semibold text-blue-600">Toutes les prestations →</Link>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={it.to} className={`flex items-center justify-between py-4 text-lg font-semibold ${it.active ? 'text-blue-600' : 'text-slate-900'}`}>
                    {it.label}
                    <ArrowRight size={18} className="text-slate-300" />
                  </Link>
                )}
              </li>
            ))}
            {isAdmin && (
              <li className="border-b border-slate-100">
                <Link to={PATHS.admin} className="flex py-4 text-lg font-semibold text-slate-500">Admin</Link>
              </li>
            )}
          </ul>
          <div className="px-4 pb-8 pt-2 grid grid-cols-1 gap-3">
            <Link to={PATHS.contact} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white font-semibold">
              <Mail size={18} /> Nous contacter
            </Link>
            <a href={telHref} className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-slate-200 text-slate-900 font-semibold">
              <Phone size={18} className="text-blue-600" /> {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 pt-20 pb-10 px-4 relative z-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <Link to="/" className="mb-8 inline-block" aria-label="Accueil">
              <ElegantLogo isDark={true} />
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">
              Conciergerie et gestion locative en Corse-du-Sud : Bonifacio, Porto-Vecchio, Figari et tout l'extrême Sud de la Corse.
            </p>
            <ul className="space-y-3 text-sm text-slate-400 mb-8">
              <li>
                <a href={telHref} className="flex items-center gap-2 hover:text-blue-400"><Phone size={16} /> {BUSINESS.phoneDisplay}</a>
              </li>
              <li>
                <a href={mailHref} className="flex items-center gap-2 hover:text-blue-400 break-all"><Mail size={16} /> {BUSINESS.email}</a>
              </li>
              <li className="flex items-center gap-2"><MapPin size={16} /> Corse-du-Sud (2A)</li>
            </ul>
            <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-blue-600 border border-white/10 transition-all" aria-label="Suivez-nous sur Instagram">
              <Instagram size={22} />
            </a>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-black text-white mb-6 uppercase text-xs tracking-widest">Navigation</h2>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Accueil</Link></li>
              <li><Link to={PATHS.conciergerie} className="hover:text-blue-400 transition-colors">Propriétaires</Link></li>
              <li><Link to={PATHS.properties} className="hover:text-blue-400 transition-colors">Nos locations</Link></li>
              <li><Link to={PATHS.sejours} className="hover:text-blue-400 transition-colors">Gestion des séjours</Link></li>
              <li><Link to={PATHS.contact} className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h2 className="font-black text-white mb-6 uppercase text-xs tracking-widest">Prestations</h2>
            <ul className="space-y-4 text-sm text-slate-400">
              {SERVICES.map((s) => (
                <li key={s.id}><Link to={servicePath(s)} className="hover:text-blue-400 transition-colors">{s.title}</Link></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <h2 className="font-black text-white mb-6 uppercase text-xs tracking-widest">Nos conciergeries</h2>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Conciergerie Corse-du-Sud</Link></li>
              {LOCAL_PAGES.map((l) => (
                <li key={l.slug}><Link to={localPath(l)} className="hover:text-blue-400 transition-colors">Conciergerie {l.city}</Link></li>
              ))}
              <li><Link to={PATHS.admin} className="text-[11px] text-slate-500 hover:text-blue-400 font-bold mt-4 block transition-colors" rel="nofollow">Accès privé</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 border-t border-white/5 pt-10">
          © {new Date().getFullYear()} {BUSINESS.name} – Conciergerie en Corse-du-Sud · Propulsé par Bookingfast
        </div>
      </div>
    </footer>
  );
}

export function PropertyCard({ property, to, headingLevel = 'h3' }: { property: Property; to: string; headingLevel?: 'h2' | 'h3' }) {
  const coverImage = property.images?.[0] || FALLBACK_IMAGE;
  const Heading = headingLevel;
  return (
    <Link
      to={to}
      className="overflow-hidden group flex flex-col h-full bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-lg rounded-2xl hover:border-slate-300 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
    >
      <div className="relative overflow-hidden shrink-0 h-64 bg-slate-100">
        <Img src={coverImage} width={800} height={512} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`${property.title} – ${property.location}`} />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold uppercase rounded-full shadow-sm">{getCategoryLabel(property.category)}</span>
        </div>
        {property.images?.length > 1 && (
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-slate-900/60 text-white text-xs rounded-md flex items-center gap-1">
            <Camera size={12} />
            {property.images.length}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow overflow-hidden">
        <Heading className="text-xl font-bold text-slate-900 mb-2 truncate">{property.title}</Heading>
        <div className="flex items-center gap-2 text-slate-500 mb-4 text-sm shrink-0">
          <MapPin size={16} className="text-blue-500" />
          <span>{property.location}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-4 text-slate-700 text-sm shrink-0">
          <div className="flex items-center gap-1"><Users size={16} className="text-blue-500" /><span>{property.capacity}</span></div>
          <div className="flex items-center gap-1"><BedDouble size={16} className="text-indigo-500" /><span>{property.beds} ch.</span></div>
          <div className="flex items-center gap-1"><Bath size={16} className="text-cyan-500" /><span>{property.bathrooms} sdb.</span></div>
          {property.pmr && (
            <div className="flex items-center gap-1" title="Accès PMR"><Accessibility size={16} className="text-emerald-500" /><span>PMR</span></div>
          )}
        </div>
        <p className="text-slate-600 text-sm mb-6 line-clamp-2">{property.desc}</p>
        <div className="mt-auto pt-4 border-t border-slate-200/60 flex items-center justify-between text-blue-600 font-semibold group-hover:text-indigo-600 shrink-0">
          <span>Voir les détails</span>
          <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export function FaqSection({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto" aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 tracking-tight text-center">{title}</h2>
      <div className="space-y-4">
        {items.map((f, i) => (
          <details key={i} className="group bg-white rounded-2xl border border-slate-200 p-6 open:shadow-md transition-shadow">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-slate-900 text-lg">
              <h3>{f.q}</h3>
              <ChevronDown className="shrink-0 text-blue-600 transition-transform group-open:rotate-180" size={20} />
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
