import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Accessibility, ArrowLeft, ArrowRight, Bath, BedDouble, Building2, Calendar, Camera, CheckCircle2, Eye, EyeOff, GripVertical,
  Home, ImagePlus, Images, Link2, Loader2, MapPin, MessageSquare, Plus, Star, Trash2, UploadCloud, Users, X,
} from 'lucide-react';
import type { Category, Property } from '../types';
import { api, AuthError } from './api';
import { Field, Stepper, Toggle, inputCls, useConfirm, useEscape, useToast } from './ui';
import { ImageLibrary } from './ImageLibrary';

export type Draft = Omit<Property, 'id' | 'created_at'>;

export const emptyDraft = (): Draft => ({
  title: '',
  category: 'villas',
  location: '',
  capacity: '',
  beds: 1,
  bathrooms: 1,
  pmr: false,
  desc: '',
  images: [],
  features: [],
  isVisible: true,
  bookingAction: 'iframe',
});

export const toDraft = (p: Property): Draft => ({
  title: p.title || '',
  category: (p.category as Category) || 'villas',
  location: p.location || '',
  capacity: p.capacity || '',
  beds: Number(p.beds) || 0,
  bathrooms: Number(p.bathrooms) || 0,
  pmr: !!p.pmr,
  desc: p.desc || '',
  images: [...(p.images || [])],
  features: [...(p.features || [])],
  isVisible: p.isVisible !== false,
  bookingAction: p.bookingAction || 'iframe',
});

const CATEGORY_OPTIONS: { value: Exclude<Category, 'all'>; label: string; icon: React.ReactNode }[] = [
  { value: 'villas', label: 'Villa', icon: <Home size={20} /> },
  { value: 'minivillas', label: 'Mini villa', icon: <Home size={18} /> },
  { value: 'appartements', label: 'Appartement', icon: <Building2 size={20} /> },
  { value: 'studios', label: 'Studio / T2', icon: <Building2 size={18} /> },
];

const LOCATION_SUGGESTIONS = ['Bonifacio', 'Porto-Vecchio', 'Figari', 'Pianottoli-Caldarello', 'Sotta', 'Lecci', 'Zonza', 'Propriano', 'Corse du Sud'];

const FEATURE_SUGGESTIONS = [
  'Piscine', 'Vue mer', 'Climatisation', 'Wifi', 'Parking', 'Terrasse', 'Jardin', 'Barbecue', 'Lave-vaisselle',
  'Machine à laver', 'Télévision', 'Plage à pied', 'Ascenseur', 'Garage fermé', 'Lit bébé', 'Animaux acceptés',
];

const CAPACITY_PRESETS = ['2 personnes', '4 personnes', '4 à 6 personnes', '6 personnes', '8 personnes', '10 personnes'];

interface Props {
  initial: Draft;
  editingId: string | null;
  onClose: () => void;
  onSaved: (p: Property, isNew: boolean) => void;
  onAuthError: () => void;
}

type UploadItem = { id: number; name: string; preview: string; done: boolean; error?: boolean };

export function PropertyEditor({ initial, editingId, onClose, onSaved, onAuthError }: Props) {
  const toast = useToast();
  const confirm = useConfirm();
  const [draft, setDraft] = useState<Draft>(initial);
  const [saving, setSaving] = useState(false);
  const [tried, setTried] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial), [draft, initial]);
  const uploading = uploads.some((u) => !u.done);

  const errors = {
    title: !draft.title.trim() ? 'Donnez un titre à votre bien' : undefined,
    location: !draft.location.trim() ? 'Indiquez la commune' : undefined,
    capacity: !draft.capacity.trim() ? 'Indiquez la capacité (ex : 4 personnes)' : undefined,
    desc: !draft.desc.trim() ? 'Ajoutez une description' : undefined,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  // Blocage du défilement de la page en arrière-plan
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const requestClose = async () => {
    if (uploading) {
      toast('Patientez, des photos sont en cours d’envoi…', 'info');
      return;
    }
    if (!dirty || (await confirm({ title: 'Quitter sans enregistrer ?', message: 'Vos modifications seront perdues.', confirmLabel: 'Quitter', danger: true }))) onClose();
  };
  useEscape(requestClose, !libraryOpen);

  // Ctrl/Cmd + S pour enregistrer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  // Alerte si on ferme l'onglet avec des modifications non enregistrées
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const save = async (publish?: boolean) => {
    if (saving) return;
    setTried(true);
    if (hasErrors) {
      toast('Certains champs obligatoires sont vides.', 'error');
      bodyRef.current?.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (uploading) {
      toast('Patientez jusqu’à la fin de l’envoi des photos.', 'info');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...draft, ...(publish !== undefined ? { isVisible: publish } : {}) };
      const saved = editingId ? await api.update(editingId, payload) : await api.create(payload);
      onSaved(saved, !editingId);
    } catch (e: any) {
      if (e instanceof AuthError) onAuthError();
      toast(e.message || 'Erreur lors de l’enregistrement', 'error');
    } finally {
      setSaving(false);
    }
  };

  // --- Photos --------------------------------------------------------------
  const addFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) {
      toast('Sélectionnez des fichiers image (JPG, PNG, WebP).', 'error');
      return;
    }
    const items = list.map((f, i) => ({ id: Date.now() + i, name: f.name, preview: URL.createObjectURL(f), done: false }));
    setUploads((u) => [...u, ...items]);
    let failed = 0;
    // Envoi par lots de 3 pour aller vite sans saturer la connexion
    const queue = list.map((file, i) => ({ file, item: items[i] }));
    const worker = async () => {
      while (queue.length) {
        const { file, item } = queue.shift()!;
        try {
          const url = await api.upload(file);
          setDraft((d) => ({ ...d, images: [...d.images, url] }));
          setUploads((u) => u.filter((x) => x.id !== item.id));
          URL.revokeObjectURL(item.preview);
        } catch (e) {
          failed++;
          if (e instanceof AuthError) onAuthError();
          setUploads((u) => u.map((x) => (x.id === item.id ? { ...x, done: true, error: true } : x)));
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    if (failed) toast(`${failed} photo(s) n’ont pas pu être envoyées.`, 'error');
    else toast(list.length > 1 ? `${list.length} photos ajoutées` : 'Photo ajoutée');
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= draft.images.length || from === to) return;
    const imgs = [...draft.images];
    const [m] = imgs.splice(from, 1);
    imgs.splice(to, 0, m);
    set('images', imgs);
  };

  const removeImage = (i: number) => {
    const removed = draft.images[i];
    set('images', draft.images.filter((_, idx) => idx !== i));
    toast('Photo retirée', 'info', {
      label: 'Annuler',
      onClick: () => setDraft((d) => {
        const imgs = [...d.images];
        imgs.splice(i, 0, removed);
        return { ...d, images: imgs };
      }),
    });
  };

  const addUrl = () => {
    const urls = urlInput.split(/[\s,]+/).map((s) => s.trim()).filter((s) => /^https?:\/\//.test(s));
    if (!urls.length) {
      toast('Collez une adresse commençant par https://', 'error');
      return;
    }
    set('images', [...draft.images, ...urls.filter((u) => !draft.images.includes(u))]);
    setUrlInput('');
  };

  // --- Équipements ---------------------------------------------------------
  const addFeature = (f: string) => {
    const v = f.trim();
    if (!v || draft.features.some((x) => x.toLowerCase() === v.toLowerCase())) return;
    set('features', [...draft.features, v]);
  };

  const err = (k: keyof typeof errors) => (tried ? errors[k] : undefined);
  const cover = draft.images[0];

  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-slate-950/50 backdrop-blur-sm animate-fade-in" onMouseDown={(e) => e.target === e.currentTarget && requestClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="editor-title" className="w-full max-w-6xl h-full bg-slate-50 flex flex-col shadow-2xl">
        {/* En-tête */}
        <div className="flex items-center gap-3 px-4 md:px-8 py-4 bg-white border-b border-slate-200">
          <button onClick={requestClose} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600" aria-label="Fermer">
            <X size={22} />
          </button>
          <div className="min-w-0 flex-1">
            <h2 id="editor-title" className="text-lg md:text-xl font-bold text-slate-900 truncate">
              {editingId ? draft.title || 'Modifier le bien' : 'Nouveau bien'}
            </h2>
            <p className="text-xs text-slate-500">
              {dirty ? <span className="text-amber-600 font-semibold">● Modifications non enregistrées</span> : 'Aucune modification'}
              <span className="hidden md:inline"> · Ctrl+S pour enregistrer</span>
            </p>
          </div>
        </div>

        <div ref={bodyRef} className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-3 space-y-6">
              {/* 1. Informations */}
              <section className="bg-white rounded-3xl border border-slate-200 p-5 md:p-7 space-y-5">
                <SectionTitle n={1} title="Informations principales" />
                <Field label="Titre de l’annonce *" error={err('title')} hint="Ex : « Villa avec piscine et vue mer à Bonifacio ». Un titre clair aide aussi Google." counter={{ value: draft.title.length, max: 70 }}>
                  <input className={inputCls(!!err('title'))} aria-invalid={!!err('title')} value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="Villa avec piscine à Bonifacio" autoFocus={!editingId} />
                </Field>
                <div>
                  <span className="text-sm font-semibold text-slate-700 mb-1.5 block">Type de logement</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORY_OPTIONS.map((c) => (
                      <button
                        type="button"
                        key={c.value}
                        onClick={() => set('category', c.value)}
                        aria-pressed={draft.category === c.value}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-sm font-semibold transition-all ${draft.category === c.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {c.icon}
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Field label="Commune / localisation *" error={err('location')}>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className={`${inputCls(!!err('location'))} pl-11`} aria-invalid={!!err('location')} list="location-suggestions" value={draft.location} onChange={(e) => set('location', e.target.value)} placeholder="Bonifacio" />
                    <datalist id="location-suggestions">
                      {LOCATION_SUGGESTIONS.map((l) => <option key={l} value={l} />)}
                    </datalist>
                  </div>
                </Field>
                <div className="flex flex-wrap gap-2 -mt-2">
                  {LOCATION_SUGGESTIONS.slice(0, 5).map((l) => (
                    <button key={l} type="button" onClick={() => set('location', l)} className={`px-3 py-1 rounded-full text-xs font-semibold border ${draft.location === l ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:border-blue-400'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </section>

              {/* 2. Capacité */}
              <section className="bg-white rounded-3xl border border-slate-200 p-5 md:p-7 space-y-5">
                <SectionTitle n={2} title="Capacité & confort" />
                <Field label="Nombre de voyageurs *" error={err('capacity')}>
                  <div className="relative">
                    <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className={`${inputCls(!!err('capacity'))} pl-11`} aria-invalid={!!err('capacity')} value={draft.capacity} onChange={(e) => set('capacity', e.target.value)} placeholder="4 à 6 personnes" />
                  </div>
                </Field>
                <div className="flex flex-wrap gap-2 -mt-2">
                  {CAPACITY_PRESETS.map((c) => (
                    <button key={c} type="button" onClick={() => set('capacity', c)} className={`px-3 py-1 rounded-full text-xs font-semibold border ${draft.capacity === c ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:border-blue-400'}`}>
                      {c}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Stepper label="Chambres" value={draft.beds} onChange={(v) => set('beds', v)} />
                  <Stepper label="Salles de bain" value={draft.bathrooms} onChange={(v) => set('bathrooms', v)} />
                </div>
                <Toggle id="pmr" checked={draft.pmr} onChange={(v) => set('pmr', v)} label="Accessible PMR" description="Logement adapté aux personnes à mobilité réduite" />
              </section>

              {/* 3. Photos */}
              <section className="bg-white rounded-3xl border border-slate-200 p-5 md:p-7 space-y-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <SectionTitle n={3} title={`Photos (${draft.images.length})`} />
                  <button type="button" onClick={() => setLibraryOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold">
                    <Images size={16} /> Bibliothèque
                  </button>
                </div>

                <div
                  onDragOver={(e) => {
                    if (dragIndex !== null) return;
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    if (dragIndex !== null) return;
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                >
                  <UploadCloud size={36} className={dragOver ? 'text-blue-600' : 'text-slate-400'} />
                  <p className="font-bold text-slate-700">Glissez vos photos ici <span className="font-normal text-slate-500">ou cliquez pour choisir</span></p>
                  <p className="text-xs text-slate-500">Plusieurs photos à la fois possible · elles sont automatiquement optimisées pour le web</p>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = '';
                  }} />
                </div>

                {(draft.images.length > 0 || uploads.length > 0) && (
                  <>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <GripVertical size={14} /> Faites glisser les photos pour changer l’ordre. La première est la photo de couverture.
                    </p>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {draft.images.map((img, i) => (
                        <li
                          key={img + i}
                          draggable
                          onDragStart={(e) => {
                            setDragIndex(i);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (dragIndex !== null && dragIndex !== i) {
                              moveImage(dragIndex, i);
                              setDragIndex(i);
                            }
                          }}
                          onDragEnd={() => setDragIndex(null)}
                          className={`relative group aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 cursor-grab active:cursor-grabbing ring-offset-2 transition-all ${i === 0 ? 'ring-4 ring-blue-500' : ''} ${dragIndex === i ? 'opacity-40 scale-95' : ''}`}
                        >
                          <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover pointer-events-none" loading="lazy" referrerPolicy="no-referrer" />
                          {i === 0 && (
                            <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow">
                              <Star size={10} fill="currentColor" /> Couverture
                            </span>
                          )}
                          <span className="absolute top-2 right-2 bg-slate-900/60 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">{i + 1}</span>
                          <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between gap-1 bg-gradient-to-t from-slate-900/80 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                              <IconBtn label="Déplacer à gauche" onClick={() => moveImage(i, i - 1)} disabled={i === 0}><ArrowLeft size={14} /></IconBtn>
                              <IconBtn label="Déplacer à droite" onClick={() => moveImage(i, i + 1)} disabled={i === draft.images.length - 1}><ArrowRight size={14} /></IconBtn>
                            </div>
                            <div className="flex gap-1">
                              {i !== 0 && <IconBtn label="Définir comme couverture" onClick={() => moveImage(i, 0)}><Star size={14} /></IconBtn>}
                              <IconBtn label="Retirer la photo" onClick={() => removeImage(i)} danger><Trash2 size={14} /></IconBtn>
                            </div>
                          </div>
                        </li>
                      ))}
                      {uploads.map((u) => (
                        <li key={u.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                          <img src={u.preview} alt="" className="w-full h-full object-cover opacity-50" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs font-bold">
                            {u.error ? (
                              <>
                                <span className="text-red-600 bg-white/90 px-2 py-1 rounded">Échec de l’envoi</span>
                                <button type="button" onClick={() => setUploads((x) => x.filter((y) => y.id !== u.id))} className="text-slate-700 bg-white/90 px-2 py-1 rounded hover:bg-white">Retirer</button>
                              </>
                            ) : (
                              <span className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full text-slate-700"><Loader2 size={14} className="animate-spin" /> Envoi…</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-2 list-none">
                    <Link2 size={14} /> Ajouter une photo par son adresse (URL)
                  </summary>
                  <div className="flex gap-2 mt-3">
                    <input className={inputCls()} value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())} placeholder="https://…" />
                    <button type="button" onClick={addUrl} className="px-4 rounded-xl bg-slate-900 text-white font-bold text-sm shrink-0">Ajouter</button>
                  </div>
                </details>
              </section>

              {/* 4. Description */}
              <section className="bg-white rounded-3xl border border-slate-200 p-5 md:p-7 space-y-5">
                <SectionTitle n={4} title="Description & équipements" />
                <Field label="Description *" error={err('desc')} hint="Décrivez le logement, la vue, la proximité des plages, les points forts… Les retours à la ligne sont conservés." counter={{ value: draft.desc.length, max: 2000 }}>
                  <textarea className={`${inputCls(!!err('desc'))} min-h-[180px] leading-relaxed`} aria-invalid={!!err('desc')} value={draft.desc} onChange={(e) => set('desc', e.target.value)} rows={8} placeholder="Villa neuve de 120 m² avec piscine privée, à 5 minutes des plages de Santa Manza…" />
                </Field>
                <div>
                  <span className="text-sm font-semibold text-slate-700 mb-1.5 block">Équipements</span>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {draft.features.map((f) => (
                      <span key={f} className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-blue-600 text-white text-sm font-semibold">
                        {f}
                        <button type="button" onClick={() => set('features', draft.features.filter((x) => x !== f))} className="p-0.5 rounded-full hover:bg-white/20" aria-label={`Retirer ${f}`}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    {draft.features.length === 0 && <span className="text-sm text-slate-400">Aucun équipement ajouté</span>}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className={inputCls()}
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          addFeature(featureInput);
                          setFeatureInput('');
                        }
                      }}
                      placeholder="Ajouter un équipement puis Entrée"
                    />
                    <button type="button" onClick={() => (addFeature(featureInput), setFeatureInput(''))} className="px-4 rounded-xl bg-slate-900 text-white shrink-0" aria-label="Ajouter l’équipement">
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {FEATURE_SUGGESTIONS.filter((f) => !draft.features.includes(f)).map((f) => (
                      <button key={f} type="button" onClick={() => addFeature(f)} className="px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600">
                        + {f}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* 5. Publication */}
              <section className="bg-white rounded-3xl border border-slate-200 p-5 md:p-7 space-y-5">
                <SectionTitle n={5} title="Publication & réservation" />
                <Toggle id="visible" checked={!!draft.isVisible} onChange={(v) => set('isVisible', v)} label={draft.isVisible ? 'En ligne sur le site' : 'Masqué du site'} description={draft.isVisible ? 'Les visiteurs voient ce bien' : 'Seul vous le voyez dans ce panneau'} />
                <div>
                  <span className="text-sm font-semibold text-slate-700 mb-1.5 block">Bouton de réservation</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { v: 'iframe' as const, icon: <Calendar size={20} />, t: 'Réservation en ligne', d: 'Ouvre le moteur Amenitiz (disponibilités et paiement)' },
                      { v: 'contact' as const, icon: <MessageSquare size={20} />, t: 'Demande par formulaire', d: 'Redirige vers le formulaire de contact pré-rempli' },
                    ].map((o) => (
                      <button
                        type="button"
                        key={o.v}
                        onClick={() => set('bookingAction', o.v)}
                        aria-pressed={draft.bookingAction === o.v}
                        className={`text-left p-4 rounded-2xl border-2 transition-all ${draft.bookingAction === o.v ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <span className={`flex items-center gap-2 font-bold mb-1 ${draft.bookingAction === o.v ? 'text-blue-700' : 'text-slate-800'}`}>{o.icon} {o.t}</span>
                        <span className="text-xs text-slate-500">{o.d}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Aperçu */}
            <aside className="lg:col-span-2">
              <div className="lg:sticky lg:top-0 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Eye size={14} /> Aperçu sur le site</p>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                  <div className="relative h-52 bg-slate-100 flex items-center justify-center">
                    {cover ? (
                      <img src={cover} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center gap-2 text-sm"><ImagePlus size={32} /> Aucune photo</div>
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 text-slate-900 text-[10px] font-bold uppercase rounded-full">
                      {CATEGORY_OPTIONS.find((c) => c.value === draft.category)?.label}
                    </span>
                    {draft.images.length > 1 && (
                      <span className="absolute bottom-3 right-3 px-2 py-1 bg-slate-900/60 text-white text-xs rounded-md flex items-center gap-1"><Camera size={12} />{draft.images.length}</span>
                    )}
                    {!draft.isVisible && (
                      <span className="absolute inset-0 bg-slate-900/50 flex items-center justify-center text-white font-bold gap-2"><EyeOff size={18} /> Masqué</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{draft.title || 'Titre du bien'}</h3>
                    <p className="flex items-center gap-1.5 text-slate-500 text-sm mb-3"><MapPin size={14} className="text-blue-500" /> {draft.location || 'Localisation'}</p>
                    <div className="flex flex-wrap gap-3 text-slate-700 text-sm mb-3">
                      <span className="flex items-center gap-1"><Users size={14} className="text-blue-500" /> {draft.capacity || '–'}</span>
                      <span className="flex items-center gap-1"><BedDouble size={14} className="text-indigo-500" /> {draft.beds} ch.</span>
                      <span className="flex items-center gap-1"><Bath size={14} className="text-cyan-500" /> {draft.bathrooms} sdb.</span>
                      {draft.pmr && <span className="flex items-center gap-1"><Accessibility size={14} className="text-emerald-500" /> PMR</span>}
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-3">{draft.desc || 'La description apparaîtra ici.'}</p>
                  </div>
                </div>
                <Checklist draft={draft} />
              </div>
            </aside>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="px-4 md:px-8 py-4 bg-white border-t border-slate-200 flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-end">
          <button onClick={requestClose} className="px-5 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100">Annuler</button>
          {!editingId && draft.isVisible && (
            <button onClick={() => save(false)} disabled={saving} className="px-5 py-3 rounded-xl font-bold border-2 border-slate-200 text-slate-700 hover:border-slate-300 disabled:opacity-50">
              Enregistrer en brouillon
            </button>
          )}
          <button onClick={() => save()} disabled={saving || uploading} className="px-6 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            {saving ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : draft.isVisible ? 'Publier le bien' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {libraryOpen && (
        <ImageLibrary
          selected={draft.images}
          onClose={() => setLibraryOpen(false)}
          onToggle={(url) => set('images', draft.images.includes(url) ? draft.images.filter((x) => x !== url) : [...draft.images, url])}
          onAuthError={onAuthError}
        />
      )}
    </div>
  );
}

function SectionTitle({ n, title }: { n: number; title: string }) {
  return (
    <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">{n}</span>
      {title}
    </h3>
  );
}

function IconBtn({ children, label, onClick, disabled, danger }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-7 h-7 rounded-full flex items-center justify-center shadow transition-colors disabled:opacity-30 ${danger ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-slate-700 hover:text-blue-600'}`}
    >
      {children}
    </button>
  );
}

/** Petite liste de contrôle « qualité de l'annonce ». */
function Checklist({ draft }: { draft: Draft }) {
  const items = [
    { ok: draft.title.trim().length >= 15, t: 'Titre descriptif (15 caractères min.)' },
    { ok: draft.images.length >= 5, t: `Au moins 5 photos (${draft.images.length})` },
    { ok: draft.desc.trim().length >= 300, t: 'Description détaillée (300 caractères min.)' },
    { ok: draft.features.length >= 3, t: 'Au moins 3 équipements' },
    { ok: !!draft.location.trim(), t: 'Commune renseignée' },
  ];
  const score = items.filter((i) => i.ok).length;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-slate-900 text-sm">Qualité de l’annonce</p>
        <span className={`text-sm font-black ${score === items.length ? 'text-emerald-600' : 'text-amber-600'}`}>{score}/{items.length}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 mb-4 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${score === items.length ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(score / items.length) * 100}%` }} />
      </div>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.t} className={`flex items-center gap-2 text-sm ${i.ok ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
            <CheckCircle2 size={16} className={i.ok ? 'text-emerald-500' : 'text-slate-300'} />
            {i.t}
          </li>
        ))}
      </ul>
    </div>
  );
}
