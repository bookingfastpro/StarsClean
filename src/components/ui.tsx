import React from 'react';
import { BUSINESS } from '../../shared/site';
import { CATEGORY_LABELS } from '../../shared/seo';
import type { Category } from '../types';

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80';

export const getCategoryLabel = (cat: Category) => CATEGORY_LABELS[cat] || cat;

export const GlassContainer = ({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div onClick={onClick} className={`bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-lg rounded-2xl ${className}`}>
    {children}
  </div>
);

type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'danger' | 'outline' | 'light' | 'outlineLight';

const BASE_BTN =
  'px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-base md:text-lg shadow-xl disabled:opacity-60 disabled:hover:translate-y-0';
const BTN_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/40',
  secondary: 'bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/30',
  gold: 'bg-gradient-to-br from-[#A87952] via-[#825A3C] to-[#5E3F29] text-white border border-[#A87952]/40 shadow-stone-900/20 hover:shadow-[#825A3C]/40',
  danger: 'bg-red-500/90 text-white hover:bg-red-600',
  outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-none',
  light: 'bg-white text-blue-700 hover:bg-blue-50 shadow-slate-950/20',
  outlineLight: 'bg-transparent border-2 border-white/40 text-white hover:bg-white hover:text-slate-900 shadow-none',
};

export const buttonClass = (variant: ButtonVariant = 'primary', className = '') => `${BASE_BTN} ${BTN_VARIANTS[variant]} ${className}`;

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) => (
  <button className={buttonClass(variant, className)} {...props}>
    {children}
  </button>
);

export const ElegantLogo = ({ isDark = false }) => (
  <div className="flex items-center gap-4">
    <img
      src={BUSINESS.logo}
      alt="Logo Star's Clean Conciergerie"
      width={48}
      height={48}
      className={`h-10 md:h-12 w-auto object-contain ${!isDark ? 'brightness-0 opacity-90' : ''}`}
      referrerPolicy="no-referrer"
    />
    <div className="flex flex-col leading-none">
      <span className={`text-xs sm:text-sm md:text-base font-semibold tracking-[0.18em] sm:tracking-[0.25em] uppercase ${!isDark ? 'text-slate-900' : 'text-white'}`}>
        Star's Clean
      </span>
      <span className={`text-[9px] sm:text-[10px] md:text-[11px] font-normal tracking-[0.3em] sm:tracking-[0.4em] uppercase mt-0.5 sm:mt-1 ${!isDark ? 'text-slate-500' : 'text-slate-300'}`}>
        Conciergerie
      </span>
    </div>
  </div>
);

/** Image optimisée : chargement différé par défaut, décodage asynchrone. */
export const Img = ({
  priority,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
  <img
    loading={priority ? 'eager' : 'lazy'}
    decoding={priority ? 'sync' : 'async'}
    fetchPriority={priority ? 'high' : 'auto'}
    referrerPolicy="no-referrer"
    {...props}
  />
);
