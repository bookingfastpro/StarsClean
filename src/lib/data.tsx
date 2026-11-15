import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Property } from '../types';
import { buildPropertySlugs } from '../../shared/seo';

declare global {
  interface Window {
    __INITIAL_PROPERTIES__?: Property[];
  }
}

interface DataValue {
  /** Biens visibles publiquement. */
  properties: Property[];
  loading: boolean;
  slugFor: (p: Property) => string;
  reload: () => Promise<void>;
}

const DataContext = createContext<DataValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Les biens sont injectés directement dans le HTML par le serveur : aucun délai de chargement.
  const initial = typeof window !== 'undefined' ? window.__INITIAL_PROPERTIES__ : undefined;
  const [properties, setProperties] = useState<Property[]>(initial || []);
  const [loading, setLoading] = useState(!initial);

  const reload = useCallback(async () => {
    try {
      const res = await fetch('/api/properties', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch properties');
      setProperties(await res.json());
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initial) reload();
  }, [initial, reload]);

  const slugs = useMemo(() => buildPropertySlugs(properties), [properties]);
  const slugFor = useCallback((p: Property) => slugs.get(String(p.id)) || String(p.id), [slugs]);

  const value = useMemo(() => ({ properties, loading, slugFor, reload }), [properties, loading, slugFor, reload]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData doit être utilisé dans <DataProvider>');
  return ctx;
}
