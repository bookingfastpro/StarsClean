import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { parseRoute, type Route } from '../../shared/seo';

interface RouterValue {
  path: string;
  search: URLSearchParams;
  route: Route;
  navigate: (to: string, opts?: { replace?: boolean; keepScroll?: boolean }) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

const readLocation = () => ({ path: window.location.pathname, search: window.location.search });

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [loc, setLoc] = useState(readLocation);

  useEffect(() => {
    const onPop = () => setLoc(readLocation());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback<RouterValue['navigate']>((to, opts = {}) => {
    const url = new URL(to, window.location.origin);
    const changed = url.pathname + url.search !== window.location.pathname + window.location.search;
    if (changed) {
      if (opts.replace) window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      else window.history.pushState(null, '', url.pathname + url.search + url.hash);
      setLoc(readLocation());
    }
    if (url.hash) {
      requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }));
    } else if (!opts.keepScroll) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const value = useMemo<RouterValue>(
    () => ({ path: loc.path, search: new URLSearchParams(loc.search), route: parseRoute(loc.path), navigate }),
    [loc, navigate],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter doit être utilisé dans <RouterProvider>');
  return ctx;
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };

/** Lien interne : vrai <a href> (indexable par Google) avec navigation sans rechargement. */
export function Link({ to, onClick, target, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      target={target}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || target === '_blank' || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
