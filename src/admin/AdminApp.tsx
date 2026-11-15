import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Accessibility, Bath, BedDouble, Calendar, Camera, Copy, ExternalLink, Eye, EyeOff, Home, ImageOff, Loader2, Lock, LogOut,
  MapPin, MessageSquare, Pencil, Plus, Search, Trash2, Users, LayoutGrid, List,
} from 'lucide-react';
import type { Category, Property } from '../types';
import { api, AuthError, getToken, setToken } from './api';
import { ConfirmProvider, ToastProvider, inputCls, useConfirm, useToast } from './ui';
import { PropertyEditor, emptyDraft, toDraft, type Draft } from './PropertyEditor';
import { ElegantLogo } from '../components/ui';
import { Link } from '../lib/router';
import { buildPropertySlugs, propertyPath, CATEGORY_LABELS } from '../../shared/seo';
import { useData } from '../lib/data';

export default function AdminApp() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AdminRoot />
      </ConfirmProvider>
    </ToastProvider>
  );
}

function AdminRoot() {
  const [authed, setAuthed] = useState<boolean | null>(getToken() ? null : false);

  useEffect(() => {
    if (authed !== null) return;
    api
      .checkSession()
      .then(() => setAuthed(true))
      .catch(() => {
        setToken(null);
        setAuthed(false);
      });
  }, [authed]);

  if (authed === null)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </div>
    );
  return authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <Login onSuccess={() => setAuthed(true)} />;
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.login(username, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Connexion impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8"><ElegantLogo isDark /></div>
        <form onSubmit={submit} className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl space-y-5">
          <div className="text-center mb-2">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock size={26} /></div>
            <h1 className="text-2xl font-black text-slate-900">Gestion des biens</h1>
            <p className="text-slate-500 text-sm mt-1">Connectez-vous pour gérer vos annonces</p>
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 mb-1.5 block">Identifiant</span>
            <input className={inputCls()} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus required />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 mb-1.5 block">Mot de passe</span>
            <div className="relative">
              <input className={`${inputCls()} pr-12`} type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700" aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          {error && <p className="text-sm text-red-600 font-medium bg-red-50 rounded-xl px-4 py-3" role="alert">{error}</p>}
          <button disabled={loading} className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 size={18} className="animate-spin" />} Se connecter
          </button>
          <Link to="/" className="block text-center text-sm text-slate-500 hover:text-blue-600">← Retour au site</Link>
        </form>
      </div>
    </div>
  );
}

type Filter = 'all' | 'visible' | 'hidden';

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const toast = useToast();
  const confirm = useConfirm();
  const { reload: reloadPublic } = useData();
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<'grid' | 'list'>(() => (localStorage.getItem('adminView') as 'grid' | 'list') || 'grid');
  const [editor, setEditor] = useState<{ draft: Draft; id: string | null } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const handleAuthError = useCallback(() => {
    setToken(null);
    toast('Votre session a expiré, reconnectez-vous.', 'error');
    onLogout();
  }, [onLogout, toast]);

  const load = useCallback(async () => {
    try {
      setProperties(await api.list());
    } catch (e: any) {
      if (e instanceof AuthError) return handleAuthError();
      toast(e.message || 'Impossible de charger les biens', 'error');
      setProperties([]);
    }
  }, [handleAuthError, toast]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    try {
      localStorage.setItem('adminView', view);
    } catch {
      /* ignore */
    }
  }, [view]);

  const slugs = useMemo(() => buildPropertySlugs(properties || []), [properties]);

  const stats = useMemo(() => {
    const list = properties || [];
    return {
      total: list.length,
      visible: list.filter((p) => p.isVisible !== false).length,
      hidden: list.filter((p) => p.isVisible === false).length,
      noPhoto: list.filter((p) => !p.images?.length).length,
    };
  }, [properties]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (properties || []).filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (filter === 'visible' && p.isVisible === false) return false;
      if (filter === 'hidden' && p.isVisible !== false) return false;
      if (q && !`${p.title} ${p.location} ${p.desc}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [properties, query, category, filter]);

  const afterChange = () => {
    reloadPublic();
  };

  const toggleVisibility = async (p: Property) => {
    const next = p.isVisible === false;
    setBusy(p.id!);
    setProperties((list) => list!.map((x) => (x.id === p.id ? { ...x, isVisible: next } : x)));
    try {
      await api.update(p.id!, { isVisible: next });
      toast(next ? `« ${p.title} » est en ligne` : `« ${p.title} » est masqué du site`);
      afterChange();
    } catch (e: any) {
      setProperties((list) => list!.map((x) => (x.id === p.id ? { ...x, isVisible: !next } : x)));
      if (e instanceof AuthError) return handleAuthError();
      toast(e.message, 'error');
    } finally {
      setBusy(null);
    }
  };

  const remove = async (p: Property) => {
    const ok = await confirm({
      title: 'Supprimer ce bien ?',
      message: `« ${p.title} » sera définitivement supprimé du site. Astuce : vous pouvez plutôt le masquer pour le garder de côté.`,
      confirmLabel: 'Supprimer définitivement',
      danger: true,
    });
    if (!ok) return;
    setBusy(p.id!);
    try {
      await api.remove(p.id!);
      setProperties((list) => list!.filter((x) => x.id !== p.id));
      toast('Bien supprimé');
      afterChange();
    } catch (e: any) {
      if (e instanceof AuthError) return handleAuthError();
      toast(e.message, 'error');
    } finally {
      setBusy(null);
    }
  };

  const duplicate = (p: Property) => {
    setEditor({ draft: { ...toDraft(p), title: `${p.title} (copie)`, isVisible: false }, id: null });
  };

  const logout = () => {
    setToken(null);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barre supérieure */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0" aria-label="Voir le site"><ElegantLogo /></Link>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">
              <ExternalLink size={16} /> Voir le site
            </Link>
            <button onClick={logout} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600">
              <LogOut size={16} /> <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Mes biens</h1>
            <p className="text-slate-500 mt-1">Ajoutez, modifiez et publiez vos logements en quelques clics.</p>
          </div>
          <button onClick={() => setEditor({ draft: emptyDraft(), id: null })} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5">
            <Plus size={20} /> Ajouter un bien
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          <StatCard label="Biens au total" value={stats.total} icon={<Home size={20} />} color="bg-blue-50 text-blue-600" onClick={() => setFilter('all')} active={filter === 'all'} />
          <StatCard label="En ligne" value={stats.visible} icon={<Eye size={20} />} color="bg-emerald-50 text-emerald-600" onClick={() => setFilter('visible')} active={filter === 'visible'} />
          <StatCard label="Masqués" value={stats.hidden} icon={<EyeOff size={20} />} color="bg-slate-100 text-slate-600" onClick={() => setFilter('hidden')} active={filter === 'hidden'} />
          <StatCard label="Sans photo" value={stats.noPhoto} icon={<ImageOff size={20} />} color={stats.noPhoto ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'} />
        </div>

        {/* Barre d'outils */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 mb-6 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className={`${inputCls()} pl-11 !bg-slate-50 !border-transparent`} placeholder="Rechercher par nom, commune…" value={query} onChange={(e) => setQuery(e.target.value)} type="search" />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {(['all', 'villas', 'minivillas', 'appartements', 'studios'] as Category[]).map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${category === c ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex bg-slate-50 rounded-xl p-1">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`} aria-label="Vue en grille"><LayoutGrid size={18} /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`} aria-label="Vue en liste"><List size={18} /></button>
          </div>
        </div>

        {/* Liste des biens */}
        {properties === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => <div key={i} className="h-80 rounded-3xl bg-white border border-slate-200 animate-pulse" />)}
          </div>
        ) : properties.length === 0 ? (
          <EmptyState onAdd={() => setEditor({ draft: emptyDraft(), id: null })} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-white rounded-3xl border border-slate-200">
            Aucun bien ne correspond à votre recherche.{' '}
            <button className="text-blue-600 font-bold hover:underline" onClick={() => { setQuery(''); setCategory('all'); setFilter('all'); }}>Réinitialiser les filtres</button>
          </div>
        ) : (
          <ul className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-3'}>
            {filtered.map((p) => (
              <PropertyRow
                key={p.id}
                p={p}
                view={view}
                busy={busy === p.id}
                href={propertyPath(slugs.get(String(p.id)) || '')}
                onEdit={() => setEditor({ draft: toDraft(p), id: p.id! })}
                onToggle={() => toggleVisibility(p)}
                onDuplicate={() => duplicate(p)}
                onDelete={() => remove(p)}
              />
            ))}
          </ul>
        )}
      </main>

      {editor && (
        <PropertyEditor
          key={editor.id || 'new'}
          initial={editor.draft}
          editingId={editor.id}
          onClose={() => setEditor(null)}
          onAuthError={handleAuthError}
          onSaved={(saved, isNew) => {
            setEditor(null);
            setProperties((list) => (isNew ? [saved, ...(list || [])] : (list || []).map((x) => (x.id === saved.id ? saved : x))));
            toast(isNew ? (saved.isVisible === false ? 'Bien enregistré (masqué)' : 'Bien publié sur le site 🎉') : 'Modifications enregistrées');
            afterChange();
          }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, onClick, active }: { label: string; value: number; icon: React.ReactNode; color: string; onClick?: () => void; active?: boolean }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} className={`text-left bg-white rounded-2xl border p-4 md:p-5 flex items-center gap-4 transition-all ${active ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200'} ${onClick ? 'hover:border-slate-300' : ''}`}>
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</span>
      <span>
        <span className="block text-2xl md:text-3xl font-black text-slate-900 leading-none tabular-nums">{value}</span>
        <span className="block text-xs md:text-sm text-slate-500 mt-1">{label}</span>
      </span>
    </Tag>
  );
}

function PropertyRow({ p, view, busy, href, onEdit, onToggle, onDuplicate, onDelete }: {
  p: Property; view: 'grid' | 'list'; busy: boolean; href: string;
  onEdit: () => void; onToggle: () => void; onDuplicate: () => void; onDelete: () => void;
}) {
  const visible = p.isVisible !== false;
  const cover = p.images?.[0];
  const isList = view === 'list';

  return (
    <li className={`group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all flex ${isList ? 'flex-row items-stretch' : 'flex-col'} ${!visible ? 'opacity-80' : ''}`}>
      <button onClick={onEdit} className={`relative bg-slate-100 shrink-0 overflow-hidden ${isList ? 'w-40 md:w-56' : 'h-48'}`} aria-label={`Modifier ${p.title}`}>
        {cover ? (
          <img src={cover} alt="" loading="lazy" referrerPolicy="no-referrer" className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!visible ? 'grayscale' : ''}`} />
        ) : (
          <span className="w-full h-full flex flex-col items-center justify-center gap-1 text-amber-600 text-xs font-bold"><ImageOff size={28} /> Ajouter des photos</span>
        )}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow ${visible ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${visible ? 'bg-white' : 'bg-slate-400'}`} />
          {visible ? 'En ligne' : 'Masqué'}
        </span>
        {p.images?.length > 0 && (
          <span className="absolute bottom-3 right-3 px-2 py-1 bg-slate-900/60 text-white text-xs rounded-md flex items-center gap-1"><Camera size={12} />{p.images.length}</span>
        )}
      </button>

      <div className="p-5 flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
          {CATEGORY_LABELS[p.category]}
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 text-slate-400 normal-case tracking-normal font-semibold">
            {p.bookingAction === 'contact' ? <><MessageSquare size={12} /> Formulaire</> : <><Calendar size={12} /> Résa en ligne</>}
          </span>
        </div>
        <button onClick={onEdit} className="text-left font-bold text-slate-900 text-lg leading-snug line-clamp-2 hover:text-blue-600">{p.title}</button>
        <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1"><MapPin size={14} /> {p.location}</p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600 mt-3">
          <span className="flex items-center gap-1"><Users size={14} /> {p.capacity}</span>
          <span className="flex items-center gap-1"><BedDouble size={14} /> {p.beds}</span>
          <span className="flex items-center gap-1"><Bath size={14} /> {p.bathrooms}</span>
          {p.pmr && <span className="flex items-center gap-1 text-emerald-600"><Accessibility size={14} /> PMR</span>}
        </div>

        <div className="mt-auto pt-4 flex items-center gap-2">
          <button onClick={onEdit} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-blue-600 transition-colors">
            <Pencil size={15} /> Modifier
          </button>
          <button
            onClick={onToggle}
            disabled={busy}
            title={visible ? 'Masquer du site' : 'Mettre en ligne'}
            aria-label={visible ? 'Masquer du site' : 'Mettre en ligne'}
            className={`p-2.5 rounded-xl border transition-colors disabled:opacity-50 ${visible ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          {visible && (
            <a href={href} target="_blank" rel="noopener" title="Voir sur le site" aria-label="Voir sur le site" className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
              <ExternalLink size={18} />
            </a>
          )}
          <button onClick={onDuplicate} title="Dupliquer" aria-label="Dupliquer" className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
            <Copy size={18} />
          </button>
          <button onClick={onDelete} disabled={busy} title="Supprimer" aria-label="Supprimer" className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </li>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-20 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-300">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5"><Home size={30} /></div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Aucun bien pour le moment</h2>
      <p className="text-slate-500 mb-6">Ajoutez votre premier logement : il apparaîtra immédiatement sur le site.</p>
      <button onClick={onAdd} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white">
        <Plus size={18} /> Ajouter un bien
      </button>
    </div>
  );
}
