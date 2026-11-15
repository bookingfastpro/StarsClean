import React, { useState } from 'react';
import { CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { Button, GlassContainer } from '../components/ui';
import { useRouter } from '../lib/router';
import { BUSINESS, telHref, mailHref } from '../../shared/site';

const FORMSPREE_URL = 'https://formspree.io/f/mykljwzz';

export default function Contact() {
  const { search } = useRouter();
  const bien = search.get('bien');
  const sujet = search.get('sujet');
  const defaultMessage = bien
    ? `Bonjour, je souhaite réserver le logement « ${bien} ». Dates souhaitées : …, nombre de voyageurs : …`
    : sujet === 'proprietaire'
      ? 'Bonjour, je suis propriétaire d’un bien en Corse-du-Sud et souhaite une estimation de revenus. Adresse / commune : …, type de bien : …'
      : '';
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get('_gotcha')) return; // anti-spam
    setStatus('sending');
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          message: fd.get('message'),
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      form.reset();
      setStatus('sent');
    } catch (error) {
      console.error('Contact error:', error);
      setStatus('error');
    }
  };

  const input = 'w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 border border-transparent';

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-semibold mb-4">Contactez-nous</h1>
      <p className="text-slate-500 mb-12 max-w-2xl mx-auto">
        Gestion de votre bien, réservation d'un séjour ou d'une prestation en Corse-du-Sud : notre équipe vous répond dans les plus brefs délais.
      </p>
      <GlassContainer className="p-6 md:p-8 !bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
          <a href={telHref} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors">
            <Phone className="text-blue-600 shrink-0" />
            <div><p className="font-bold text-slate-900 text-sm">Téléphone</p><p className="text-blue-600 font-bold">{BUSINESS.phoneDisplay}</p></div>
          </a>
          <a href={mailHref} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors min-w-0">
            <Mail className="text-blue-600 shrink-0" />
            <div className="min-w-0"><p className="font-bold text-slate-900 text-sm">E-mail</p><p className="text-blue-600 font-bold text-xs break-all">{BUSINESS.email}</p></div>
          </a>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50">
            <MapPin className="text-blue-600 shrink-0" />
            <div><p className="font-bold text-slate-900 text-sm">Zone</p><p className="text-slate-600 text-sm">Bonifacio, Porto-Vecchio, Corse-du-Sud</p></div>
          </div>
        </div>

        {status === 'sent' ? (
          <div className="py-12 flex flex-col items-center gap-4" role="status">
            <CheckCircle size={56} className="text-emerald-500" />
            <p className="text-2xl font-bold text-slate-900">Message envoyé !</p>
            <p className="text-slate-500">Merci, nous vous répondrons dans les plus brefs délais.</p>
            <button onClick={() => setStatus('idle')} className="text-blue-600 font-bold hover:underline">Envoyer un autre message</button>
          </div>
        ) : (
          <form className="space-y-4 text-left" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-700 mb-1 block">Nom complet *</span>
                <input name="name" autoComplete="name" className={input} required />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700 mb-1 block">E-mail *</span>
                <input name="email" type="email" autoComplete="email" className={input} required />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-bold text-slate-700 mb-1 block">Téléphone</span>
              <input name="phone" type="tel" autoComplete="tel" className={input} />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700 mb-1 block">Votre message *</span>
              <textarea name="message" className={input} rows={5} defaultValue={defaultMessage} key={defaultMessage} required></textarea>
            </label>
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {status === 'error' && (
              <p className="text-red-600 text-sm font-medium" role="alert">
                L'envoi a échoué. Réessayez ou appelez-nous au {BUSINESS.phoneDisplay}.
              </p>
            )}
            <Button className="w-full" disabled={status === 'sending'}>
              {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
            </Button>
          </form>
        )}
      </GlassContainer>
    </div>
  );
}
