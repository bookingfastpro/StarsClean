import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, Minus, Plus, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Notifications (toasts)
// ---------------------------------------------------------------------------
type ToastKind = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
  action?: { label: string; onClick: () => void };
}

const ToastContext = createContext<(text: string, kind?: ToastKind, action?: Toast['action']) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: ToastKind = 'success', action?: Toast['action']) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), action ? 7000 : 4000);
  }, []);
  const icons = {
    success: <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />,
    error: <AlertTriangle size={20} className="text-red-500 shrink-0" />,
    info: <Info size={20} className="text-blue-500 shrink-0" />,
  };
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-md" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-center gap-3 bg-white border border-slate-200 shadow-2xl rounded-2xl px-4 py-3 animate-fade-in-down">
            {icons[t.kind]}
            <p className="text-sm font-medium text-slate-800 flex-1">{t.text}</p>
            {t.action && (
              <button
                onClick={() => {
                  t.action!.onClick();
                  setToasts((x) => x.filter((y) => y.id !== t.id));
                }}
                className="text-sm font-bold text-blue-600 hover:underline shrink-0"
              >
                {t.action.label}
              </button>
            )}
            <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="text-slate-400 hover:text-slate-700" aria-label="Fermer">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// ---------------------------------------------------------------------------
// Boîte de confirmation
// ---------------------------------------------------------------------------
interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

const ConfirmContext = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const confirm = useCallback((o: ConfirmOptions) => new Promise<boolean>((resolve) => setState({ ...o, resolve })), []);
  const close = (v: boolean) => {
    state?.resolve(v);
    setState(null);
  };
  useEffect(() => {
    if (!state) return;
    // Phase de capture : Échap ferme la boîte sans fermer aussi le panneau situé dessous.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close(false);
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  });
  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in" onClick={() => close(false)}>
          <div role="alertdialog" aria-modal="true" className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${state.danger ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{state.title}</h3>
            <p className="text-slate-500 mb-8">{state.message}</p>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button onClick={() => close(false)} className="px-5 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100">
                Annuler
              </button>
              <button
                autoFocus
                onClick={() => close(true)}
                className={`px-5 py-3 rounded-xl font-bold text-white ${state.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {state.confirmLabel || 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);

// ---------------------------------------------------------------------------
// Champs
// ---------------------------------------------------------------------------
export function Toggle({ checked, onChange, label, description, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; id: string }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300 transition-colors">
      <span>
        <span className="block font-semibold text-slate-800">{label}</span>
        {description && <span className="block text-sm text-slate-500 mt-0.5">{description}</span>}
      </span>
      <span className="relative shrink-0">
        <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="block w-12 h-7 rounded-full bg-slate-300 peer-checked:bg-emerald-500 transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-blue-500/30" />
        <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function Stepper({ value, onChange, label, min = 0, max = 50 }: { value: number; onChange: (v: number) => void; label: string; min?: number; max?: number }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <span className="block text-sm font-semibold text-slate-600 mb-3">{label}</span>
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30" aria-label={`Diminuer ${label}`}>
          <Minus size={18} />
        </button>
        <span className="text-2xl font-black text-slate-900 tabular-nums w-10 text-center" aria-live="polite">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30" aria-label={`Augmenter ${label}`}>
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

export function Field({ label, hint, error, children, counter }: { label: string; hint?: string; error?: string; children: React.ReactNode; counter?: { value: number; max: number } }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        {counter && (
          <span className={`text-xs tabular-nums ${counter.value > counter.max ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
            {counter.value}/{counter.max}
          </span>
        )}
      </span>
      {children}
      {error ? <span className="block text-sm text-red-600 mt-1.5 font-medium">{error}</span> : hint ? <span className="block text-xs text-slate-500 mt-1.5">{hint}</span> : null}
    </label>
  );
}

export const inputCls = (error?: boolean) =>
  `w-full px-4 py-3 bg-white rounded-xl border outline-none transition-all focus:ring-4 ${error ? 'border-red-400 focus:ring-red-500/15' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/15'}`;

/** Ferme un panneau avec Échap. */
export function useEscape(handler: () => void, active = true) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && ref.current();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);
}
