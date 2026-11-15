import React, { useEffect, useState } from 'react';
import { ChevronDown, Menu, X, Instagram, Phone, Mail, MapPin, Users, BedDouble, Bath, Accessibility, Camera, ArrowRight } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { ElegantLogo, GlassContainer, Img, getCategoryLabel, FALLBACK_IMAGE } from './ui';
import { SERVICES } from '../../shared/services';
import { LOCAL_PAGES } from '../../shared/localPages';
import { PATHS, servicePath, localPath } from '../../shared/seo';
import { BUSINESS, telHref, mailHref } from '../../shared/site';
import type { Property, Category } from '../types';

const CATEGORY_LINKS: { cat: Category; label: string }[] = [
  { cat: 'studios', label: 'Studios / T2' },
  { cat: 'minivillas', label: 'Mini Villas' },
  { cat: 'villas', label: 'Villas' },
  { cat: 'appartements', label: 'Appartements' },
];

export function Navbar() {
  const { route } = useRouter();
  const [open, setOpen] = useState(false);
  const isAdmin = typeof window !== 'undefined' && !!localStorage.getItem('adminToken');

  useEffect(() => setOpen(false), [route]);

  const linkCls = (active: boolean) => `hover:text-blue-600 transition-colors ${active ? 'text-blue-600 font-bold' : ''}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center" aria-label="Navigation principale">
        <Link to="/" className="group" aria-label="Star's Clean Conciergerie – Accueil">
          <ElegantLogo />
        </Link>
        <div className="hidden lg:flex items-center gap-6 font-medium text-slate-700 text-sm">
          <Link to="/" className={linkCls(route.name === 'home')}>Accueil</Link>
          <Link to={PATHS.conciergerie} className={linkCls(route.name === 'conciergerie')}>Propriétaires</Link>
          <div className="relative group">
            <Link to={PATHS.properties} className={`flex items-center gap-1 ${linkCls(route.name === 'properties' || route.name === 'detail')}`}>
              Nos Biens <ChevronDown size={14} />
            </Link>
            <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all">
              <GlassContainer className="flex flex-col p-2 !bg-white shadow-xl border-slate-100">
                {CATEGORY_LINKS.map((c) => (
                  <Link key={c.cat} to={`${PATHS.properties}?type=${c.cat}`} className="text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-800 transition-colors">
                    {c.label}
                  </Link>
                ))}
              </GlassContainer>
            </div>
          </div>
          <Link to={PATHS.sejours} className={linkCls(route.name === 'sejours')}>Gestion séjours</Link>
          <div className="relative group">
            <Link to={PATHS.prestations} className={`flex items-center gap-1 ${linkCls(route.name === 'prestations' || route.name === 'service-detail')}`}>
              Prestations <ChevronDown size={14} />
            </Link>
            <div className="absolute top-full left-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all">
              <GlassContainer className="flex flex-col p-2 !bg-white shadow-xl border-slate-100">
                {SERVICES.map((s) => (
                  <Link key={s.id} to={servicePath(s)} className="text-left px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-800 transition-colors text-xs font-semibold capitalize">
                    {s.title}
                  </Link>
                ))}
              </GlassContainer>
            </div>
          </div>
          <Link to={PATHS.contact} className={linkCls(route.name === 'contact')}>Contact</Link>
          {isAdmin && (
            <Link to={PATHS.admin} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-colors">
              Admin
            </Link>
          )}
        </div>
        <button className="lg:hidden text-slate-800 p-2 -mr-2" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="lg:hidden absolute top-[76px] left-4 right-4 animate-fade-in-down z-50 max-h-[calc(100svh-90px)] overflow-y-auto">
          <GlassContainer className="flex flex-col p-4 gap-1 !bg-white/95 shadow-2xl">
            <Link to="/" className="font-medium p-3 hover:bg-slate-100 rounded-lg">Accueil</Link>
            <Link to={PATHS.conciergerie} className="font-medium p-3 hover:bg-slate-100 rounded-lg">Propriétaires</Link>
            <Link to={PATHS.properties} className="font-medium p-3 hover:bg-slate-100 rounded-lg">Nos Biens</Link>
            <Link to={PATHS.sejours} className="font-medium p-3 hover:bg-slate-100 rounded-lg">Gestion séjours</Link>
            <Link to={PATHS.prestations} className="font-bold p-3 hover:bg-slate-100 rounded-lg text-blue-600">Prestations</Link>
            <div className="grid grid-cols-1 gap-1 pl-4">
              {SERVICES.map((s) => (
                <Link key={s.id} to={servicePath(s)} className="text-sm p-2 hover:bg-slate-50 rounded-lg text-slate-600 capitalize">
                  • {s.title}
                </Link>
              ))}
            </div>
            <Link to={PATHS.contact} className="font-medium p-3 hover:bg-slate-100 rounded-lg">Contact</Link>
            <a href={telHref} className="mt-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 text-white font-bold">
              <Phone size={18} /> {BUSINESS.phoneDisplay}
            </a>
            {isAdmin && <Link to={PATHS.admin} className="font-bold p-3 text-blue-600 hover:bg-blue-50 rounded-lg">Admin</Link>}
          </GlassContainer>
        </div>
      )}
    </header>
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
                <li key={s.id}><Link to={servicePath(s)} className="hover:text-blue-400 transition-colors capitalize">{s.title}</Link></li>
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
