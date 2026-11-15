import React from 'react';
import { PropertyCard } from '../components/Layout';
import { getCategoryLabel } from '../components/ui';
import { Link, useRouter } from '../lib/router';
import { useData } from '../lib/data';
import { PATHS, propertyPath } from '../../shared/seo';
import type { Category } from '../types';

const CATS: Category[] = ['all', 'studios', 'minivillas', 'villas', 'appartements'];

export default function Properties() {
  const { search, navigate } = useRouter();
  const { properties, loading, slugFor } = useData();
  const typeParam = search.get('type') as Category | null;
  const active: Category = typeParam && CATS.includes(typeParam) ? typeParam : 'all';
  const filtered = active === 'all' ? properties : properties.filter((p) => p.category === active);

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Locations de vacances en Corse-du-Sud</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Villas, mini-villas et appartements gérés par Star's Clean Conciergerie à Bonifacio, Porto-Vecchio et dans l'extrême Sud de la Corse
          {!loading && <> — {filtered.length} bien{filtered.length > 1 ? 's' : ''}</>}.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12" role="tablist" aria-label="Type de logement">
        {CATS.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            onClick={() => navigate(cat === 'all' ? PATHS.properties : `${PATHS.properties}?type=${cat}`, { replace: true, keepScroll: true })}
            className={`px-6 py-2 rounded-full font-bold transition-all ${active === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="mb-4">Aucun bien dans cette catégorie pour le moment.</p>
          <Link to={PATHS.contact} className="text-blue-600 font-bold hover:underline">Contactez-nous pour une recherche personnalisée</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} to={propertyPath(slugFor(p))} headingLevel="h2" />
          ))}
        </div>
      )}
    </div>
  );
}
