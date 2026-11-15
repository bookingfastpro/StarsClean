import React from 'react';
import {
  Home, MapPin, Phone, Mail, Sparkles, ShieldCheck, Clock, ArrowRight, Key, Users, FileText,
  Briefcase, Ship, Car, Coffee, Heart, Plane, Calendar, Camera, Sun, Wine, CheckCircle,
  ChevronLeft, Quote, TrendingUp, Map, Award, Zap, Compass, Waves, Mountain, Plus,
} from 'lucide-react';
import { Button, GlassContainer } from '../components/ui';
import { Link, useRouter } from '../lib/router';
import { PATHS } from '../../shared/seo';

export default function Sejours() {
  const { navigate } = useRouter();
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/calanques-de-bonifacio.jpg"
            className="w-full h-full object-cover" 
            alt=""
            fetchPriority="high" referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-950"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-semibold text-white mb-6 tracking-tight leading-tight">
            Gestion des séjours dans <br/> <span className="text-blue-500">l'extrême Sud de la Corse</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium">
            Star's Clean Conciergerie vous crée un séjour sur mesure en Corse-du-Sud
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              L'excellence au service de vos vacances
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Star's Clean Conciergerie est à votre service pour la gestion et l'organisation des séjours en location saisonnière dans l'extrême Sud de la Corse.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Qu'il s’agisse d’un souhait de réservation, d'une organisation de séjour ou d'une gestion de votre bien immobilier, nous vous assurons un travail soigné et méticuleux.
            </p>
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-blue-800 font-bold text-xl italic">
                "Gagnez du temps en confiant l'organisation de vos vacances à Star's Clean Conciergerie."
              </p>
            </div>
            <Button onClick={() => navigate(PATHS.contact)} className="px-10">Nous confier votre séjour</Button>
          </div>
          <div className="relative">
            <img 
              src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/calanques-de-bonifacio.jpg" 
              className="rounded-[3rem] shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500" 
              alt="Les falaises et calanques de Bonifacio en Corse-du-Sud"
              loading="lazy" decoding="async" referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white p-3 rounded-xl"><Clock size={24}/></div>
                <div>
                  <p className="font-bold text-slate-900">Gain de temps</p>
                  <p className="text-sm text-slate-500">On s'occupe de tout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-24 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Nous organisons votre séjour selon vos envies</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Une multitude d'activités exclusives s'offrent à vous dans l'extrême Sud.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Ship className="text-blue-600" size={32} />, title: "Location de bateau", desc: "Promenade en mer et apéro sunset dans les plus belles criques." },
              { icon: <Waves className="text-cyan-500" size={32} />, title: "Plongée & Canyoning", desc: "Découvrez les fonds marins ou les rivières sauvages de l'île." },
              { icon: <Car className="text-slate-700" size={32} />, title: "Quad & Buggy", desc: "Randonnées hors des sentiers battus à travers le maquis." },
              { icon: <Plane className="text-indigo-600" size={32} />, title: "Hélicoptère", desc: "Découverte de l'île de beauté vue du ciel pour un moment inoubliable." },
              { icon: <Wine className="text-red-600" size={32} />, title: "Dégustation de vins", desc: "Visite des domaines viticoles et dégustation des meilleurs crus corses." },
              { icon: <Mountain className="text-emerald-600" size={32} />, title: "Randonnée", desc: "Parcours guidés pour découvrir les paysages à couper le souffle." },
              { icon: <Sun className="text-orange-500" size={32} />, title: "Apéro Sunset", desc: "Organisation de moments magiques face au coucher du soleil." },
              { icon: <Compass className="text-blue-800" size={32} />, title: "Sur-mesure", desc: "Toutes vos envies deviennent réalité grâce à notre réseau." }
            ].map((activity, idx) => (
              <GlassContainer key={idx} className="p-8 !bg-white border-slate-100 hover:shadow-xl transition-all group">
                <div className="mb-6 transform group-hover:scale-110 transition-transform">{activity.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{activity.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{activity.desc}</p>
              </GlassContainer>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 p-12 md:p-20 rounded-[3rem] shadow-2xl text-white">
          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Prêt pour un séjour inoubliable en Corse ?</h2>
          <p className="text-xl text-blue-100 mb-10">Contactez-nous dès aujourd'hui pour commencer à planifier vos vacances de rêve.</p>
          <Button variant="light" onClick={() => navigate(PATHS.contact)} className="px-12 py-5 text-xl mx-auto">
            Demander mon devis sur mesure
          </Button>
        </div>
      </section>
    </div>
  );
}
