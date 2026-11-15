import React from 'react';
import {
  Home, MapPin, Phone, Mail, Sparkles, ShieldCheck, Clock, ArrowRight, Key, Users, FileText,
  Briefcase, Ship, Car, Coffee, Heart, Plane, Calendar, Camera, Sun, Wine, CheckCircle,
  ChevronLeft, Quote, TrendingUp, Map, Award, Zap, Compass, Waves, Mountain, Plus,
} from 'lucide-react';
import { Button, GlassContainer } from '../components/ui';
import { Link, useRouter } from '../lib/router';
import { PATHS } from '../../shared/seo';
import { SERVICES } from '../../shared/services';
import { servicePath } from '../../shared/seo';
import { getServiceIcon } from '../components/serviceIcon';

export default function Prestations() {
  const { navigate } = useRouter();
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/calanques-de-bonifacio.jpg" 
            className="w-full h-full object-cover" 
            alt=""
            loading="lazy" decoding="async" referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-7xl font-semibold mb-6 tracking-tight leading-tight">
            Les prestations de <br/> <span className="text-blue-200">Star's Clean Conciergerie</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-medium opacity-90">
            Prestations aux meilleurs prix dans l'extrême Sud de la Corse
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <img 
              src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/537140_QuatreTiers.ori_.jpg" 
              className="rounded-[3rem] shadow-2xl border-8 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500" 
              alt="Prestations de luxe"
              loading="lazy" decoding="async" referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Un service d'exception en Corse-du-Sud
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Star's Clean Conciergerie propose différentes prestations dans l'extrême Sud de la Corse pour rendre votre séjour inoubliable.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Louez un bateau, visitez des caves renommées ou profitez d'un moment de détente absolue. Venez découvrir des coins paradisiaques avec nos services exclusifs.
            </p>
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 font-bold">
              <Sparkles className="text-emerald-500" />
              <span>N'attendez plus, venez découvrir l'île de beauté !</span>
            </div>
            <Button onClick={() => navigate(PATHS.contact)} className="px-10 py-4 text-lg">Contactez-nous maintenant</Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Nos Services Exclusifs</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Tout ce dont vous avez besoin pour des vacances parfaites.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <Link
                key={service.id}
                to={servicePath(service)}
                className="block p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
              >
                <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl group-hover:bg-blue-50 transition-colors">
                  {getServiceIcon(service.icon, 32, "text-blue-600")}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 capitalize">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed">{service.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold text-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  En savoir plus <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Prêt à vivre l'exceptionnel ?</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Star's Clean Conciergerie est votre partenaire de confiance pour un séjour sans contraintes dans l'extrême Sud de la Corse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={() => navigate(PATHS.contact)} className="px-12 py-5 text-xl">Réserver une prestation</Button>
            <Button variant="outline" onClick={() => navigate(PATHS.properties)} className="px-12 py-5 text-xl">Voir nos biens</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
