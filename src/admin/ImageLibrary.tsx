import React, { useEffect, useState } from 'react';
import { CheckCircle2, ImageIcon, Loader2, X } from 'lucide-react';
import { api, AuthError } from './api';
import { useEscape, useToast } from './ui';

export function ImageLibrary({ selected, onToggle, onClose, onAuthError }: { selected: string[]; onToggle: (url: string) => void; onClose: () => void; onAuthError: () => void }) {
  const toast = useToast();
  const [images, setImages] = useState<string[] | null>(null);
  const [limit, setLimit] = useState(60);
  useEscape(onClose);

  useEffect(() => {
    api
      .library()
      .then(setImages)
      .catch((e) => {
        if (e instanceof AuthError) onAuthError();
        toast(e.message, 'error');
        setImages([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const added = images ? images.filter((i) => selected.includes(i)).length : 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="library-title" className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h3 id="library-title" className="text-xl font-bold text-slate-900">Bibliothèque de photos</h3>
            <p className="text-sm text-slate-500">Cliquez sur une photo déjà envoyée pour l’ajouter ou la retirer de ce bien.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full" aria-label="Fermer">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {images === null ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
              <Loader2 size={36} className="animate-spin text-blue-600" /> Chargement…
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" /> Aucune photo dans la bibliothèque.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {images.slice(0, limit).map((url) => {
                  const on = selected.includes(url);
                  return (
                    <button
                      key={url}
                      type="button"
                      onClick={() => onToggle(url)}
                      aria-pressed={on}
                      className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all ${on ? 'border-blue-500' : 'border-transparent hover:border-slate-200'}`}
                    >
                      <img src={url} className="w-full h-full object-cover" alt="" loading="lazy" referrerPolicy="no-referrer" />
                      {on && (
                        <span className="absolute inset-0 bg-blue-500/25 flex items-center justify-center">
                          <CheckCircle2 size={28} className="text-white drop-shadow" fill="#3b82f6" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {images.length > limit && (
                <div className="text-center mt-6">
                  <button onClick={() => setLimit((l) => l + 60)} className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700">
                    Afficher plus ({images.length - limit} restantes)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="p-5 border-t border-slate-100 flex items-center justify-between gap-4">
          <span className="text-sm text-slate-500">{added} photo(s) de la bibliothèque sur ce bien</span>
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white">Terminé</button>
        </div>
      </div>
    </div>
  );
}
