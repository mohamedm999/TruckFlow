import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, LogIn, Map, Fuel, FileText, Code, Server, Database, Bell, CheckSquare, Play, Terminal } from 'lucide-react';

const DemoItem = ({ icon: Icon, text, delay }) => (
    <motion.div 
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay }}
        className="flex items-center p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 hover:bg-emerald-100 transition-colors"
    >
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
            <Icon size={16} />
        </div>
        <div className="text-base text-slate-700">{text}</div>
    </motion.div>
);

const TechItem = ({ icon: Icon, text, delay }) => (
    <motion.div 
        initial={{ x: 20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay }}
        className="flex items-center p-2 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-100 transition-colors"
    >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
            <Icon size={16} />
        </div>
        <div className="text-sm text-slate-700">{text}</div>
    </motion.div>
);

const Slide19 = () => {
    return (
        <div className="h-full bg-slate-50 text-slate-800 p-8 flex flex-col">
            <div className="border-b-4 border-blue-600 pb-3 mb-6">
                <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
                    Questions & Démonstration
                </h1>
            </div>

            <div className="flex gap-8">
                <div className="flex-1 flex flex-col">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                         <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
                                <PlayCircle size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-blue-600">Démonstration Live</h2>
                        </div>
                        
                        <div className="space-y-3 relative z-10">
                             <DemoItem icon={LogIn} text="Authentification et autorisation" delay={0.1} />
                             <DemoItem icon={Map} text="Création et gestion des voyages" delay={0.2} />
                             <DemoItem icon={Fuel} text="Suivi carburant en temps réel" delay={0.3} />
                             <DemoItem icon={FileText} text="Génération de rapports PDF" delay={0.4} />
                        </div>
                        
                        <div className="mt-4 flex items-center justify-center">
                             <div className="w-full h-24 bg-blue-50 border-l-4 border-blue-500 rounded-lg flex items-center justify-center text-center p-4">
                                <div>
                                    <div className="flex justify-center mb-1"><PlayCircle size={32} className="text-blue-500" /></div>
                                    <div className="text-slate-500 text-sm">Interface de démonstration de TruckFlow</div>
                                </div>
                             </div>
                        </div>

                        <div className="mt-4 text-center relative z-10">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center mx-auto gap-2 text-base"
                            >
                                <Play size={20} /> Lancer la démo
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                     <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
                                <Code size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-blue-600">Technologies Présentées</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 relative z-10 mb-4">
                             <TechItem icon={Server} text="API REST en action" delay={0.5} />
                             <TechItem icon={Database} text="Base de données MongoDB" delay={0.6} />
                             <TechItem icon={Bell} text="Système de notifications" delay={0.7} />
                             <TechItem icon={CheckSquare} text="Tests automatisés" delay={0.8} />
                        </div>

                         <div className="space-y-3">
                             <div className="w-full h-20 bg-blue-50 border-l-4 border-blue-500 rounded-lg flex items-center justify-center text-center p-3">
                                <div>
                                    <div className="flex justify-center mb-1"><Terminal size={24} className="text-blue-500" /></div>
                                    <div className="text-slate-500 text-xs">Exemple de code de l'API TruckFlow</div>
                                </div>
                             </div>
                             <div className="w-full h-20 bg-blue-50 border-l-4 border-blue-500 rounded-lg flex items-center justify-center text-center p-3">
                                <div>
                                    <div className="flex justify-center mb-1"><Database size={24} className="text-blue-500" /></div>
                                    <div className="text-slate-500 text-xs">Requête MongoDB pour les données de flotte</div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slide19;
