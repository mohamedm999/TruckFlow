import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { MapPin, Zap, Smartphone, LayoutDashboard, Rocket, Puzzle, Calendar, ArrowRight, Monitor, Code, TabletSmartphone, Brain, Route } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
const RoadmapCard = ({ phase, title, date, features, color, delay, icon: Icon }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`flex-1 bg-white p-4 rounded-xl shadow-sm border-t-6 border-${color}-500 flex flex-col hover:shadow-xl transition-shadow`}
    >
        <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className={`text-lg font-bold text-${color}-600`}>{phase}</h3>
                    <div className="text-slate-700 font-bold text-base">{title}</div>
                </div>
             </div>
             <div className="flex items-center text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg text-sm">
                <Calendar size={14} className="mr-1"/> {date}
             </div>
        </div>

        <ul className="space-y-3 grow">
            {features.map((feat, idx) => (
                <li key={idx} className="flex items-start">
                    <div className={`p-1.5 bg-${color}-50 rounded-lg mr-3 text-${color}-600`}>
                        <feat.icon size={16} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-700 text-sm">{feat.title}</div>
                        <div className="text-xs text-slate-500">{feat.desc}</div>
                    </div>
                </li>
            ))}
        </ul>
        
        <div className={`mt-4 pt-3 border-t border-slate-100 text-${color}-600 font-bold flex items-center justify-end text-xs`}>
            En savoir plus <ArrowRight size={14} className="ml-1" />
        </div>
    </motion.div>
);

const Slide16 = () => {
    return (
        <div className="h-full bg-slate-50 text-slate-800 p-8 flex flex-col">
            <div className="border-b-4 border-blue-600 pb-3 mb-6">
                <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
                    Application Complète Réalisée
                </h1>
                <p className="text-lg text-emerald-600 mt-1 font-semibold">✅ Full-Stack Fonctionnel</p>
            </div>

            <div className="flex gap-6">
                <RoadmapCard 
                    phase="✅ Phase 1"
                    title="Backend Complet"
                    date="Terminé"
                    color="emerald"
                    delay={0.1}
                    icon={Code}
                    features={[
                        { title: "API REST complète", desc: "9 entités métier avec CRUD", icon: Code },
                        { title: "Authentification JWT", desc: "Sécurité dual-token robuste", icon: Smartphone },
                        { title: "Tests automatisés", desc: "95%+ couverture avec Jest", icon: LayoutDashboard },
                        { title: "Documentation", desc: "UML + API + Technique", icon: Smartphone }
                    ]}
                />

                <RoadmapCard 
                    phase="✅ Phase 2"
                    title="Frontend React Complet"
                    date="Terminé"
                    color="blue"
                    delay={0.2}
                    icon={Monitor}
                    features={[
                        { title: "Interface React moderne", desc: "Redux + Vite + Components UI", icon: Code },
                        { title: "Dashboards interactifs", desc: "Admin + Chauffeur spécialisés", icon: LayoutDashboard },
                        { title: "Pages complètes", desc: "Login, CRUD, Gestion complète", icon: Smartphone },
                        { title: "Docker Ready", desc: "Containerisation complète", icon: Rocket }
                    ]}
                />

                <RoadmapCard 
                    phase="🚀 Phase 3"
                    title="Fonctionnalités Futures"
                    date="Roadmap"
                    color="purple"
                    delay={0.3}
                    icon={Rocket}
                    features={[
                        { title: "Géolocalisation GPS", desc: "Suivi temps réel véhicules", icon: MapPin },
                        { title: "Optimisation routes IA", desc: "Algorithmes intelligents", icon: Route },
                        { title: "Application mobile", desc: "React Native / Flutter", icon: TabletSmartphone },
                        { title: "Intégrations ERP", desc: "Systèmes tiers", icon: Puzzle }
                    ]}
                />
            </div>
        </div>
    );
};

export default Slide16;
