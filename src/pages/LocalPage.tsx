import React from 'react';
import { ArrowRight, CheckCircle, MapPin, Phone } from 'lucide-react';
import { Img, buttonClass } from '../components/ui';
import { FaqSection, PropertyCard } from '../components/Layout';
import { Link } from '../lib/router';
import { useData } from '../lib/data';
import { LOCAL_PAGES, type LocalPage as LocalPageData } from '../../shared/localPages';
import { PATHS, propertyPath, servicePath, localPath } from '../../shared/seo';
import { SERVICES } from '../../shared/services';
import { BUSINESS, telHref } from '../../shared/site';

export default function LocalPage({ page }: { page: LocalPageData }) {
  const { properties, slugFor } = useData();
  const local = properties.filter((p) => page.propertyMatch.some((m) => p.location.toLowerCase().includes(m)));
  const others = LOCAL_PAGES.filter((l) => l.slug !== page.slug);

  return (
    <div className="animate-fade-in">
      <section className="pt-32 pb-20 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Img priority src={page.image} alt="" width={1920} height={1080} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <nav aria-label="Fil d'Ariane" className="text-xs text-slate-400 mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link> / <span className="text-slate-300">Conciergerie {page.city}</span>
          </nav>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">{page.h1}</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed mb-10">{page.tagline}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`${PATHS.contact}?sujet=proprietaire`} className={buttonClass('primary')}>
              Estimation gratuite <ArrowRight size={20} />
            </Link>
            <a href={telHref} className={buttonClass('secondary')}>
              <Phone size={20} /> {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-4xl mx-auto space-y-6">
        {page.intro.map((t, i) => (
          <p key={i} className="text-lg md:text-xl text-slate-600 leading-relaxed">{t}</p>
        ))}
      </section>

      <section className="py-20 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-12 tracking-tight text-center">{page.zonesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {page.zones.map((z) => (
              <div key={z.name} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <MapPin className="text-blue-600 mb-4" size={28} />
                <h3 className="text-xl font-bold text-slate-900 mb-3">{z.name}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{z.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-12 tracking-tight text-center">{page.whyTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {page.why.map((w) => (
            <div key={w.title} className="flex gap-5 p-8 rounded-[2rem] border-2 border-slate-100 hover:border-blue-200 transition-colors">
              <CheckCircle className="text-blue-600 shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{w.title}</h3>
                <p className="text-slate-600 leading-relaxed">{w.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to={PATHS.conciergerie} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
            Découvrir nos services et forfaits propriétaires <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {local.length > 0 && (
        <section className="py-20 px-4 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight text-center">Nos locations à {page.city}</h2>
            <p className="text-slate-500 text-center mb-12">Des logements gérés par notre conciergerie et prêts à vous accueillir.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {local.slice(0, 6).map((p) => (
                <PropertyCard key={p.id} property={p} to={propertyPath(slugFor(p))} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 tracking-tight text-center">Les prestations pour vos voyageurs à {page.city}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {SERVICES.map((s) => (
            <Link key={s.id} to={servicePath(s)} className="px-5 py-3 bg-white border border-slate-200 rounded-full font-bold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors capitalize">
              {s.title}
            </Link>
          ))}
        </div>
      </section>

      <FaqSection title={`Questions fréquentes – conciergerie à ${page.city}`} items={page.faq} />

      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 p-10 md:p-16 rounded-[3rem] shadow-2xl text-white text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">Confiez votre bien à notre conciergerie à {page.city}</h2>
          <p className="text-lg text-blue-100 mb-8">Étude gratuite et sans engagement de votre location saisonnière.</p>
          <Link to={`${PATHS.contact}?sujet=proprietaire`} className={buttonClass('secondary', 'bg-white !text-blue-700 hover:bg-blue-50 mx-auto w-fit')}>
            Être rappelé
          </Link>
          {others.length > 0 && (
            <p className="mt-8 text-sm text-blue-100">
              Nous sommes aussi votre{' '}
              {others.map((o, i) => (
                <React.Fragment key={o.slug}>
                  {i > 0 && ', '}
                  <Link to={localPath(o)} className="underline font-bold">conciergerie à {o.city}</Link>
                </React.Fragment>
              ))}{' '}
              et dans toute la <Link to="/" className="underline font-bold">Corse-du-Sud</Link>.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
