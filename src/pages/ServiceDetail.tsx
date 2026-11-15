import React from 'react';
import {
  Home, MapPin, Phone, Mail, Sparkles, ShieldCheck, Clock, ArrowRight, Key, Users, FileText,
  Briefcase, Ship, Car, Coffee, Heart, Plane, Calendar, Camera, Sun, Wine, CheckCircle,
  ChevronLeft, Quote, TrendingUp, Map, Award, Zap, Compass, Waves, Mountain, Plus,
} from 'lucide-react';
import { Button, GlassContainer } from '../components/ui';
import { Link, useRouter } from '../lib/router';
import { PATHS } from '../../shared/seo';
import type { Service } from '../types';
import { getServiceIcon } from '../components/serviceIcon';

export default function ServiceDetail({ service: s }: { service: Service }) {
  const { navigate } = useRouter();
  return (
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto animate-fade-in">
        <button onClick={() => navigate(PATHS.prestations)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors">
          <ChevronLeft size={20}/> Retour aux prestations
        </button>
        
        <div className={`grid grid-cols-1 ${(s.id === 'car-rental' || s.id === 'wine-tasting') ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-16`}>
          <div className="space-y-8">
            <div className="p-6 bg-blue-50 w-fit rounded-3xl text-blue-600">
              {getServiceIcon(s.icon, 48)}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight capitalize">
              {s.title}
            </h1>

            {/* Mobile Image Slider - Only visible on mobile */}
            <div className="lg:hidden -mx-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-4 px-4 py-2">
              {s.images.map((img, idx) => (
                <div key={idx} className="min-w-[85vw] aspect-[4/3] snap-center overflow-hidden rounded-[2rem] shadow-lg border border-slate-100">
                  <img 
                    src={img} 
                    className="w-full h-full object-cover" 
                    alt={`${s.title} ${idx + 1}`}
                    loading="lazy" decoding="async" referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {s.id === 'car-rental' ? (
                <div className="space-y-12">
                  {/* Vehicule 1: Jogger */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg group">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                       <div className="p-8 md:p-12 space-y-6">
                        <div className="inline-block px-4 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">Familial & Modulable</div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Dacia Jogger – Le Break SUV d'Exception</h3>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          La voiture familiale qui se plie à vos envies. Enfin de l'espace pour tous vos passagers !
                        </p>
                        <p className="text-slate-500 leading-relaxed">
                          Le véhicule Jogger se décline en plusieurs versions modulables pour accueillir de <span className="font-bold text-slate-900">2 à 7 passagers</span> sans concession pour le confort et l'habitabilité.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                           <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                              <Zap className="text-blue-600" size={20} />
                              <div>
                                 <p className="text-xs font-black text-blue-900 uppercase tracking-tighter">Polyvalence</p>
                                 <p className="text-[10px] text-blue-700">Break & SUV</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                              <Users className="text-indigo-600" size={20} />
                              <div>
                                 <p className="text-xs font-black text-indigo-900 uppercase tracking-tighter">Capacité</p>
                                 <p className="text-[10px] text-indigo-700">Jusqu'à 7 places</p>
                              </div>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                           <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase">
                              Option : Siège enfant / Réhausseur
                           </div>
                           <div className="text-right">
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dès</span>
                              <span className="text-2xl font-black text-blue-600">50 € / jour</span>
                           </div>
                        </div>
                       </div>
                       <div className="bg-slate-100 relative min-h-[350px] overflow-hidden">
                          <img 
                            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/voiture1.png" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                            alt="Dacia Jogger" 
                            loading="lazy" decoding="async" referrerPolicy="no-referrer" 
                          />
                       </div>
                    </div>
                  </div>

                  {/* Vehicule 2: Sandero */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg group">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                       <div className="order-2 lg:order-1 bg-slate-50 relative min-h-[350px] overflow-hidden">
                          <img 
                            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776674063476-7y689smrzd4.jpg" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 mix-blend-multiply opacity-80" 
                            alt="Dacia Sandero" 
                            loading="lazy" decoding="async" referrerPolicy="no-referrer" 
                          />
                       </div>
                       <div className="order-1 lg:order-2 p-8 md:p-12 space-y-6">
                        <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Économique & Pratique</div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Dacia Sandero 2020 – Pratique, économique et confortable</h3>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          Optez pour la location de cette Dacia Sandero de 2020, un véhicule fiable et économique, idéal pour vos déplacements en toute simplicité.
                        </p>
                        <p className="text-slate-500 leading-relaxed">
                          Parfaite pour découvrir la région en toute liberté, cette citadine polyvalente offre un excellent compromis entre confort, maniabilité et faible consommation.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                           <div className="space-y-3">
                              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> Caractéristiques</h4>
                              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                                 <li>• Modèle : Dacia Sandero (2020)</li>
                                 <li>• Véhicule économique & facile</li>
                                 <li>• Idéal trajets urbains & escapades</li>
                                 <li>• Confort 4 à 5 passagers</li>
                              </ul>
                           </div>
                           <div className="space-y-3">
                              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Plus size={16} className="text-emerald-500" /> Les +</h4>
                              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                                 <li>• Fiable et bien entretenu</li>
                                 <li>• Solution sans contrainte</li>
                                 <li>• Partenaires familles & couples</li>
                              </ul>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                           <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase">
                              Option : Siège enfant / Réhausseur
                           </div>
                           <div className="text-right">
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dès</span>
                              <span className="text-2xl font-black text-blue-600">50 € / jour</span>
                           </div>
                        </div>
                       </div>
                    </div>
                  </div>

                  {/* Availability Info */}
                  <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 opacity-5 -mr-10"><MapPin size={300} /></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                       <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg"><MapPin size={24} /></div>
                          <h3 className="text-3xl font-black tracking-tight">Disponibilité & Livraison</h3>
                        </div>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                          Le véhicule est disponible au départ et au retour de l'aéroport de <span className="text-white font-black underline decoration-blue-500 underline-offset-8">Figari</span>. Parcourez les routes corses en toute liberté dès votre descente d'avion.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                           <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
                              <CheckCircle className="text-emerald-400" size={20} />
                              <span className="font-bold text-sm">Gestion simple & rapide</span>
                           </div>
                           <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
                              <Clock className="text-blue-400" size={20} />
                              <span className="font-bold text-sm">Service Client 24/7</span>
                           </div>
                        </div>
                       </div>
                       <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-4">
                          <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Options Longue Distance</p>
                          <p className="text-slate-300 text-sm leading-relaxed">
                             Possibilité de livraison ou récupération à l'aéroport de <span className="text-white font-bold">Bastia</span> ou <span className="text-white font-bold">Ajaccio</span>.
                          </p>
                          <div className="mt-4 pt-4 border-t border-white/10">
                             <Button 
                               onClick={() => navigate(PATHS.contact)} 
                               variant="outline" 
                               className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-xs font-black transition-all"
                             >
                               Demander un devis
                             </Button>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ) : s.id === 'boat-rental' ? (
                <div className="space-y-10">
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-700 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">Préparez-vous à vivre une soirée magique !</h3>
                    <p className="text-blue-50 text-lg leading-relaxed">
                      Avec notre prestataire <span className="font-bold underline decoration-blue-300 underline-offset-4">BBQ Boat</span>, naviguez et grillez en toute convivialité dans les plus belles criques de Corse.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><Compass size={24}/></div>
                      <h3 className="text-2xl font-bold text-slate-900">Découvrez le BBQ Boat</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      L’expérience BBQ Boat en Corse vous propose la location d’un <span className="font-bold text-slate-900">bateau sans permis</span> pouvant accueillir jusqu’à <span className="font-bold text-slate-900">9 personnes</span>. Naviguez en toute liberté tout en savourant de délicieuses grillades grâce à un barbecue XXL intégré.
                    </p>
                    
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                      <p className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Le forfait de location comprend :</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { text: "Le carburant", icon: <Zap size={18}/> },
                          { text: "La vaisselle", icon: <CheckCircle size={18}/> },
                          { text: "Enceinte Bluetooth", icon: <Waves size={18}/> },
                          { text: "Éclairage nocturne", icon: <Sun size={18}/> }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-slate-700">
                            <div className="text-blue-500">{item.icon}</div>
                            <span className="font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-6 text-sm text-slate-500 italic">
                        Des options avec capitaine ainsi que des équipements de cuisson Weber sont également disponibles.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><Map size={24}/></div>
                      <h3 className="text-2xl font-bold text-slate-900">Découvrez les excursions</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Idéal pour partager des moments inoubliables entre amis ou en famille. Équipé d’un barbecue à gaz ou d’une vasque à boissons XXL, ce bateau vous permet de profiter de petits-déjeuners, déjeuners, dîners ou apéritifs dans les magnifiques criques sauvages du Valincu.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-start">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0"><MapPin size={24}/></div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">Sortie à la journée avec capitaine</h4>
                          <p className="text-sm text-slate-500 mb-2">📍 Départ : Port de Propriano (Quai Saint-Erasme)</p>
                          <p className="text-slate-600 text-sm">Laissez-vous guider à travers les eaux turquoise du golfe du Valincu pour une expérience exceptionnelle.</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Sun size={120}/></div>
                        <div className="relative z-10">
                          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="text-yellow-400" size={20}/>
                            Sortie apéritive au coucher de soleil
                          </h4>
                          <p className="text-slate-300 mb-6 italic">"Imaginez-vous voguer sur des eaux azurées, en dégustant un apéritif dînatoire entre ciel et mer."</p>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Vins sélectionnés</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Charcuterie & Fromages</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Tapas variés</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Moules corses</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : s.id === 'wine-tasting' ? (
                <div className="space-y-16 py-4">
                  {/* Luxury Header/Intro */}
                  <div className="relative rounded-[3rem] overflow-hidden group min-h-[400px] flex items-center shadow-2xl">
                    <img 
                      src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776672754990-8mmsrpn0tee.png" 
                      alt="Wine Cellar" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      loading="lazy" decoding="async" referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-red-900/40 to-transparent" />
                    <div className="relative z-10 p-8 md:p-16 max-w-2xl text-white">
                      <span className="inline-block px-4 py-1.5 bg-red-600/30 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-white/20">Expérience Exclusive</span>
                      <h3 className="text-4xl md:text-5xl font-black mb-6 leading-[1.1] tracking-tighter">L'Art de la Vigne en Corse-du-Sud</h3>
                      <p className="text-red-50 text-lg md:text-xl leading-relaxed font-light opacity-90">
                        Star's Clean Conciergerie vous ouvre les portes des domaines les plus prestigieux de l'île pour une immersion sensorielle au sommet de l'excellence.
                      </p>
                    </div>
                  </div>

                  {/* Storytelling Sections */}
                  <div className="space-y-24">
                    {/* Domaine de Zuria - Now 1st */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 group">
                      <div className="w-full lg:w-1/2 relative">
                        <div className="absolute -inset-4 bg-blue-50 rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative rounded-[3rem] overflow-hidden aspect-[4/3] shadow-xl">
                          <img 
                            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/domaine.png" 
                            alt="Domaine de Zuria" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            loading="lazy" decoding="async" referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-1/2 px-4">
                        <span className="text-blue-700 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Modernité & Pureté</span>
                        <h4 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Domaine de Zuria</h4>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                          Face aux falaises de Bonifacio, le Domaine de Zuria est une ode à l'architecture contemporaine et au respect du vivant. Ce vignoble en bio-dynamie sublime la minéralité calcaire de son sol pour sculpter des blancs d'une tension cristalline et des rosés d'une élégance absolue.
                        </p>
                        <ul className="space-y-4 mb-8">
                          {['Découverte de l\'architecture bioclimatique','Ateliers sensoriels personnalisés','Expérience gastronomique & accords mets-vins'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Domaine de la Murta - Now 2nd */}
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-12 group">
                      <div className="w-full lg:w-1/2 relative">
                        <div className="absolute -inset-4 bg-red-50 rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative rounded-[3rem] overflow-hidden aspect-[4/3] shadow-xl">
                          <img 
                            src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/properties/1776672771400-alwisv1b0gk.png" 
                            alt="Domaine de la Murta" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            loading="lazy" decoding="async" referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-1/2 px-4">
                        <span className="text-red-700 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Héritage & Terroir</span>
                        <h4 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Domaine de la Murta</h4>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                          Niché dans la splendeur sauvage de l'Alta Rocca, le Domaine de la Murta est le gardien des traditions séculaires. Ici, les cépages endémiques sont magnifiés par un climat privilégié, offrant des vins d'une profondeur rare qui racontent l'histoire brute et généreuse du sol corse.
                        </p>
                        <ul className="space-y-4 mb-8">
                          {['Visite des vignobles en buggy','Dégustation millésimée','Secrets de vinification traditionnelle'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-600" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Summary */}
                  <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-red-600 border border-slate-100">
                          <Wine size={24} />
                        </div>
                        <h5 className="font-bold text-slate-900">Domaines Privés</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">Accès exclusif à des propriétés fermées au grand public.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-amber-500 border border-slate-100">
                          <Award size={24} />
                        </div>
                        <h5 className="font-bold text-slate-900">Expertise Sommelier</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">Accompagnement par des passionnés du terroir insulaire.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-blue-600 border border-slate-100">
                          <Sun size={24} />
                        </div>
                        <h5 className="font-bold text-slate-900">Expérience Sur Mesure</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">Itinéraires personnalisés selon vos préférences gustatives.</p>
                      </div>
                    </div>
                  </div>

                  {/* Refined Contact CTA */}
                  <div className="relative rounded-[3rem] bg-slate-900 p-8 md:p-16 text-center text-white overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-64 h-64 bg-red-600 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2" />
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                      <h4 className="text-2xl md:text-3xl font-bold mb-6">Prêt à vivre une expérience inoubliable ?</h4>
                      <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                        Que vous souhaitiez une demi-journée de découverte ou une itinérance complète, notre équipe organise chaque détail de votre aventure œnologique.
                      </p>
                      <Button onClick={() => navigate(PATHS.contact)} className="h-16 px-12 bg-white text-slate-900 hover:bg-white/90 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl w-full sm:w-auto">
                        Réserver ma dégustation
                      </Button>
                    </div>
                  </div>
                </div>
              ) : s.id === 'breakfast' ? (
                <div className="space-y-10">
                  <div className="bg-gradient-to-br from-orange-400 to-amber-600 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">Un réveil gourmand en toute sérénité</h3>
                    <p className="text-orange-50 text-lg leading-relaxed">
                      Explorez notre service de livraison de petit-déjeuner, alliant <span className="font-bold">saveurs exquises</span> et <span className="font-bold">praticité</span>.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="bg-orange-100 text-orange-600 p-2 rounded-xl"><Coffee size={24}/></div>
                      <h3 className="text-2xl font-bold text-slate-900">Délices Matinaux</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Savourez des délices matinaux, avec une sélection variée de produits frais sélectionnés chez nos meilleurs artisans locaux.
                    </p>
                    <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 flex items-start gap-6">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 shrink-0">
                        <Clock className="text-orange-500" size={32} />
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Notre livraison rapide vous assure un début de journée délicieux, sans tracas. Commandez dès maintenant pour une expérience gourmande à votre porte.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><CheckCircle size={20}/></div>
                      <span className="font-bold text-slate-900">Produits frais</span>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Zap size={20}/></div>
                      <span className="font-bold text-slate-900">Livraison rapide</span>
                    </div>
                  </div>
                </div>
              ) : s.id === 'massage' ? (
                <div className="space-y-10">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">Une oasis de bien-être à domicile</h3>
                    <p className="text-pink-50 text-lg leading-relaxed">
                      Offrez-vous une parenthèse de détente absolue avec nos soins et massages personnalisés, <span className="font-bold">directement chez vous</span>.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="bg-pink-100 text-pink-600 p-2 rounded-xl"><Heart size={24}/></div>
                      <h3 className="text-2xl font-bold text-slate-900">Soin et massage à domicile</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Nos praticiens qualifiés créent une expérience relaxante, directement chez vous. Libérez le stress, revitalisez votre corps et esprit.
                    </p>
                    <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 flex items-start gap-6">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose-100 shrink-0">
                        <Sparkles className="text-pink-500" size={32} />
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Réservez votre moment de détente dès maintenant pour une parenthèse de bien-être personnalisée, sans quitter votre cocon.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <Briefcase className="text-pink-400" />
                      <h3 className="text-lg font-bold">Tarifs & Informations</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 mb-2">
                        <span className="text-slate-300 font-medium">Soin / Massage relaxant</span>
                        <div className="text-right">
                          <span className="block text-[10px] font-bold text-pink-400 uppercase tracking-widest">À partir de</span>
                          <span className="text-2xl font-black text-white">60 €</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="bg-pink-600/20 text-pink-400 p-2 rounded-lg shrink-0"><CheckCircle size={18}/></div>
                        <p className="text-sm text-slate-300">
                          Découvrez les cartes de visites des prestataires dans votre <span className="text-white font-bold">livret d'Accueil</span>.
                        </p>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="bg-blue-600/20 text-blue-400 p-2 rounded-lg shrink-0"><Phone size={18}/></div>
                        <p className="text-sm text-slate-300">
                          Pour toute présentation des praticiens, merci de <span className="text-white font-bold">contacter la conciergerie</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : s.id === 'airport-transfer' ? (
                <div className="space-y-10">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-10 rotate-12"><Plane size={240}/></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-4">Transport depuis l'aéroport</h3>
                      <p className="text-slate-300 text-lg leading-relaxed">
                        Pour un transport <span className="text-white font-bold">serein et sans encombre</span> depuis l'aéroport, nous vous recommandons de réserver à l'avance.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><ShieldCheck size={24}/></div>
                      <h3 className="text-2xl font-bold text-slate-900">Fiabilité & Confort</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Que vous préfériez un <span className="font-bold text-slate-900">van</span> ou un <span className="font-bold text-slate-900">taxi</span> à votre arrivée, notre équipe dédiée se charge de tout pour vous offrir une expérience de transport confortable et fiable.
                    </p>
                    
                    <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex items-start gap-6">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 shrink-0">
                        <FileText className="text-blue-600" size={32} />
                      </div>
                      <div>
                        <p className="text-slate-700 leading-relaxed mb-4">
                          Rapprochez-vous de notre conciergerie pour obtenir un <span className="font-bold text-blue-900">devis personnalisé</span> adapté à vos besoins.
                        </p>
                        <Button onClick={() => navigate(PATHS.contact)} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-100">
                          Demander un devis
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><CheckCircle size={20}/></div>
                      <span className="font-bold text-slate-900">Solution sans stress</span>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Zap size={20}/></div>
                      <span className="font-bold text-slate-900">Efficacité garantie</span>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200">
                    <p className="text-slate-600 leading-relaxed text-center italic">
                      "Simplifiez votre arrivée et laissez-nous vous conduire en toute sécurité vers votre destination. Profitez d'une solution de transport efficace pour démarrer votre voyage de la meilleure manière possible."
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xl text-slate-600 leading-relaxed whitespace-pre-line">
                  {s.longDesc}
                </p>
              )}
            </div>
            {s.id !== 'wine-tasting' && (
              <div className="pt-4">
                <Button onClick={() => navigate(PATHS.contact)} className="px-10 py-5 text-xl">
                  Réserver ce service
                </Button>
              </div>
            )}
          </div>
          
          {(s.id !== 'car-rental' && s.id !== 'wine-tasting') && (
            <div className="hidden lg:grid grid-cols-1 gap-6">
              {s.images.map((img, idx) => (
                <div key={idx} className="overflow-hidden rounded-[2.5rem] shadow-xl border border-slate-100 aspect-[4/3]">
                  <img 
                    src={img} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    alt={`${s.title} ${idx + 1}`}
                    loading="lazy" decoding="async" referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}
