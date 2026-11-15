import React from 'react';
import {
  Home, MapPin, Phone, Mail, Sparkles, ShieldCheck, Clock, ArrowRight, Key, Users, FileText,
  Briefcase, Ship, Car, Coffee, Heart, Plane, Calendar, Camera, Sun, Wine, CheckCircle,
  ChevronLeft, Quote, TrendingUp, Map, Award, Zap, Compass, Waves, Mountain, Plus,
} from 'lucide-react';
import { Button, GlassContainer } from '../components/ui';
import { Link, useRouter } from '../lib/router';
import { PATHS } from '../../shared/seo';

export default function Conciergerie() {
  const { navigate } = useRouter();
  return (
    <div className="animate-fade-in bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776076788739-g4kq76f7xcq.jpg" 
            className="w-full h-full object-cover" 
            alt="Villa de luxe en Corse"
            loading="lazy" decoding="async" referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-widest mb-6">Expertise & Excellence</span>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
            Gestion locative en Corse-du-Sud <br/> <span className="text-blue-500">pour les propriétaires</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Conciergerie Star’s Clean : optimisez la gestion de vos biens locatifs à Bonifacio, Porto-Vecchio et dans tout l’extrême Sud de la Corse.
          </p>
        </div>
      </section>

      {/* Navigation Summary (Sommaire) */}
      <div className="sticky top-[76px] z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 hidden md:block overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
          {[
            ['À propos', 'a-propos'],
            ['Services', 'services'],
            ['Clients', 'clients'],
            ['Tarifs', 'tarifs'],
            ['Contact', 'contact-proprietaires'],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} className="hover:text-blue-600 transition-colors whitespace-nowrap">{label}</a>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section id="a-propos" className="scroll-mt-40 py-24 px-4 max-w-7xl mx-auto border-b border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Depuis 2021</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                À propos de nous
              </h2>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
              Fondée en 2021, la <strong>Conciergerie Star’s Clean</strong> s'est rapidement imposée comme un acteur de référence dans la gestion d’hébergements pour propriétaires. 
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Forts de plusieurs années d’expérience, nous mettons notre expertise à votre service pour optimiser la gestion de vos biens locatifs, que ce soit pour des locations saisonnières ou de longue durée. Grâce à une équipe dédiée, nous garantissons à vos hôtes une expérience de qualité, tout en maximisant votre rentabilité.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nous intervenons notamment en tant que <Link to="/conciergerie-bonifacio" className="text-blue-600 font-semibold hover:underline">conciergerie à Bonifacio</Link> et <Link to="/conciergerie-porto-vecchio" className="text-blue-600 font-semibold hover:underline">conciergerie à Porto-Vecchio</Link>, ainsi qu’à Figari, Pianottoli-Caldarello, Sotta et Lecci.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                { t: "Accueil & Check-in", icon: <Key size={20} /> },
                { t: "Ménage Professionnel", icon: <Sparkles size={20} /> },
                { t: "Gestion des Réservations", icon: <Calendar size={20} /> },
                { t: "Entretien Régulier", icon: <ShieldCheck size={20} /> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-blue-600">{item.icon}</div>
                  <span className="font-bold text-slate-700 text-sm">{item.t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-100/50 rounded-[4rem] blur-2xl opacity-50" />
            <img 
              src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776702830928-iaob3fpycmb.jpg" 
              className="relative rounded-[3rem] shadow-2xl border-8 border-white object-cover aspect-[4/5] lg:aspect-auto" 
              alt="Expertise Conciergerie Star's Clean"
              loading="lazy" decoding="async" referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -left-6 bg-slate-900 p-6 rounded-3xl shadow-2xl max-w-[280px] hidden md:block">
              <Quote className="text-blue-500 mb-3" size={32} />
              <p className="text-slate-100 italic text-sm leading-relaxed font-medium mb-3">
                “Nous prenons soin du moindre détail pour que vous puissiez profiter pleinement de votre temps.”
              </p>
              <p className="text-blue-400 font-black uppercase tracking-widest text-[10px]">- Conciergerie Star’s Clean</p>
            </div>
          </div>
        </div>
      </section>

      {/* Base Services Section */}
      <section id="services" className="scroll-mt-40 py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Nos services de base</h2>
            <p className="text-slate-500 text-lg leading-relaxed">Une gestion quotidienne rigoureuse pour assurer le bon fonctionnement de votre location.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "1. Gestion des réservations",
                desc: "Nous prenons en charge la gestion de vos calendriers sur les différentes plateformes en optimisant vos taux de remplissage.",
                icon: <TrendingUp size={32} />,
                color: "bg-blue-600"
              },
              {
                title: "2. Accueil et départ",
                desc: "Un accueil chaleureux et professionnel à chaque arrivée, suivi d’un état des lieux minutieux au départ pour garantir la sécurité de votre bien.",
                icon: <Users size={32} />,
                color: "bg-indigo-600"
              },
              {
                title: "3. Ménage professionnel",
                desc: "Service de nettoyage complet réalisé par des professionnels (Sol au plafond). Options spécifiques : Shampooing canapés & Literies.",
                icon: <Sparkles size={32} />,
                color: "bg-emerald-600"
              },
              {
                title: "4. Assistance 24/7",
                desc: "Un service client réactif pour répondre aux besoins des locataires tout au long de leur séjour afin de garantir leur satisfaction totale.",
                icon: <Phone size={32} />,
                color: "bg-slate-900"
              }
            ].map((service, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group flex flex-col items-center text-center md:items-start md:text-left">
                <div className={`w-16 h-16 ${service.color} text-white rounded-2xl flex items-center justify-center mb-8 transform group-hover:rotate-6 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3 pt-4">
            <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Exclusivité</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">Nos services premium</h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">Poussez l'excellence encore plus loin avec nos solutions d'optimisation haut de gamme.</p>
            <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 italic font-medium text-blue-900">
              "Objectif : maximiser vos revenus locatifs tout en sublimant votre offre."
            </div>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 gap-6">
            {[
              {
                title: "1. Gestion complète de l’annonce",
                items: ["Photos professionnelles", "Descriptions attractives", "Stratégies tarifaires dynamiques"],
                icon: <Camera className="text-blue-600" />
              },
              {
                title: "2. Check-in personnalisé",
                items: ["Accueil VIP avec options sur-mesure", "Panier d’accueil spécialisé", "Recommandations locales & Assistance"],
                icon: <Heart className="text-pink-600" />
              },
              {
                title: "3. Audit et optimisation du bien",
                items: ["Conseils aménagement & décoration", "Analyse des équipements", "Étude des performances gains"],
                icon: <Award className="text-amber-600" />
              }
            ].map((p, idx) => (
              <div key={idx} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-12 hover:border-blue-200 transition-colors flex gap-8">
                <div className="shrink-0 pt-2">{p.icon}</div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-6">{p.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    {p.items.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm font-bold text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Types Section */}
      <section id="clients" className="scroll-mt-40 py-24 px-4 bg-slate-900 text-white rounded-[4rem] mx-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Nos clients types</h2>
            <p className="text-slate-400 text-xl font-light">Une expertise adaptée à chaque profil d'investisseur.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                t: "Propriétaires Particuliers", 
                d: "Résidences principales, secondaires ou investissements locatifs. Accompagnement complet pour déléguer la gestion.",
                icon: <Home className="text-blue-400" size={40} />
              },
              { 
                t: "Investisseurs Immobiliers", 
                d: "Gestion clé en main pour plusieurs biens : Occupation maximale, entretien impeccable et gestion transparente.",
                icon: <Briefcase className="text-amber-400" size={40} />
              },
              { 
                t: "Hôtels & Résidences", 
                d: "Services de conciergerie externalisés pour offrir une expérience client haut de gamme et personnalisée.",
                icon: <Award className="text-emerald-400" size={40} />
              }
            ].map((client, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center group hover:bg-white/10 transition-all">
                <div className="mb-8 flex justify-center transform group-hover:scale-110 transition-transform">{client.icon}</div>
                <h3 className="text-2xl font-black mb-4">{client.t}</h3>
                <p className="text-slate-400 leading-relaxed text-sm lg:text-base">{client.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (Forfaits) */}
      <section id="tarifs" className="scroll-mt-40 py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-[1.1]">Nos forfaits et tarifs</h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mt-4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Plan 1 */}
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-all">
            <h3 className="text-2xl font-black text-slate-900 mb-4">Forfait Mensualisation</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-black text-blue-600">200 €</span>
              <span className="text-slate-400 font-bold">/ mois</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Gestion des réservations', 'Accueil des locataires', 'Ménage professionnel', 'Assistance 24/7'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle size={18} className="text-blue-500" /> {f}
                </li>
              ))}
            </ul>
            <div className="p-6 bg-slate-50 rounded-2xl text-xs font-bold text-slate-500 leading-relaxed border border-slate-100">
              Note : Régularisation en fin de saison à 30 % du revenu locatif.
            </div>
          </div>

          {/* Plan 2 - Featured */}
          <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative transform scale-105 border-4 border-blue-600/30">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest">Populaire</div>
            <h3 className="text-2xl font-black text-white mb-4">Forfait Saison</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-black text-blue-400">30 %</span>
              <span className="text-slate-400 font-bold">revenu net</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Tous les services de base', 'Optimisation des annonces', 'Check-in personnalisé', 'Conciergerie locataires', 'Audit du bien'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle size={18} className="text-blue-400" /> {f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 font-bold italic mb-8">Paiement : 30 % en fin de saison (septembre)</p>
            <Button className="w-full py-4 text-sm" onClick={() => navigate(PATHS.contact)}>Choisir ce forfait</Button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-all">
            <h3 className="text-2xl font-black text-slate-900 mb-4">À la carte</h3>
            <div className="flex flex-col gap-2 mb-8">
              <span className="text-xl font-bold text-slate-900">Sur demande</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Possibilité de souscrire uniquement pour certains services selon vos besoins spécifiques.</p>
            <ul className="space-y-4 mb-2">
              {['Entretien avancé', 'Rénovation spécifique', 'Gestion d’annonce seule', 'Gestion de calendrier seule'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                  <Plus size={16} className="text-emerald-500" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-proprietaires" className="scroll-mt-40 py-24 px-4">
        <div className="max-w-5xl mx-auto bg-slate-50 rounded-[4rem] p-12 md:p-20 border border-slate-100 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-12 tracking-tight">Contactez-nous</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 w-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Phone size={24} /></div>
              <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</p>
                <a href="tel:+33642658598" className="text-lg font-black text-slate-900 hover:text-blue-600">+33 6 42 65 85 98</a>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Compass size={24} /></div>
              <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Zone</p>
                <p className="text-lg font-black text-slate-900">Bonifacio · Porto-Vecchio · Figari</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Mail size={24} /></div>
              <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">E-mail</p>
                <a href="mailto:conciergerie.prestige2a@gmail.com" className="text-xs font-black text-slate-900 break-all hover:text-blue-600">conciergerie.prestige2a@gmail.com</a>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate(PATHS.contact)} className="px-12 py-5 text-xl transition-all hover:px-16">
            Lancer mon projet
          </Button>
        </div>
      </section>
    </div>
  );
}
