import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer, Navbar } from './components/Layout';
import { buttonClass } from './components/ui';
import { DataProvider, useData } from './lib/data';
import { Link, RouterProvider, useRouter } from './lib/router';
import { useSeo } from './lib/seo';
import { findLocalPage, findPropertyBySlug, findService, PATHS } from '../shared/seo';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import LocalPage from './pages/LocalPage';

// Pages chargées à la demande : la page d'accueil reste légère.
const Conciergerie = lazy(() => import('./pages/Conciergerie'));
const Sejours = lazy(() => import('./pages/Sejours'));
const Prestations = lazy(() => import('./pages/Prestations'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
);

function NotFound() {
  return (
    <div className="pt-40 pb-24 px-4 max-w-2xl mx-auto text-center min-h-[70vh]">
      <p className="text-blue-600 font-black text-6xl mb-4">404</p>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Page introuvable</h1>
      <p className="text-slate-500 mb-10">Cette page n'existe pas ou le bien n'est plus disponible à la location.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/" className={buttonClass('primary')}>Retour à l'accueil</Link>
        <Link to={PATHS.properties} className={buttonClass('outline')}>Voir nos locations</Link>
      </div>
    </div>
  );
}

function Pages() {
  const { route, path } = useRouter();
  const { properties, loading } = useData();
  useSeo(route, properties, path);

  if (route.name === 'admin') return <AdminApp />;

  let page: React.ReactNode;
  switch (route.name) {
    case 'home':
      page = <Home />;
      break;
    case 'properties':
      page = <Properties />;
      break;
    case 'detail': {
      const p = findPropertyBySlug(properties, route.param || '');
      page = p ? <PropertyDetail property={p} /> : loading ? <PageLoader /> : <NotFound />;
      break;
    }
    case 'conciergerie':
      page = <Conciergerie />;
      break;
    case 'sejours':
      page = <Sejours />;
      break;
    case 'prestations':
      page = <Prestations />;
      break;
    case 'service-detail': {
      const s = findService(route.param || '');
      page = s ? <ServiceDetail service={s} /> : <NotFound />;
      break;
    }
    case 'local': {
      const l = findLocalPage(route.param || '');
      page = l ? <LocalPage page={l} /> : <NotFound />;
      break;
    }
    case 'contact':
      page = <Contact />;
      break;
    default:
      page = <NotFound />;
  }

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-white flex flex-col selection:bg-blue-100">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] bg-blue-600 text-white px-4 py-2 rounded-lg">
        Aller au contenu
      </a>
      <Navbar />
      <main id="contenu" className="flex-grow">
        <Suspense fallback={<PageLoader />}>{page}</Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider>
        <DataProvider>
          <Suspense fallback={<PageLoader />}>
            <Pages />
          </Suspense>
        </DataProvider>
      </RouterProvider>
    </ErrorBoundary>
  );
}
