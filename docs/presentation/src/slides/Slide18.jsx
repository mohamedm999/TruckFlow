import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ClipboardCheck, TrendingUp, CheckCircle, PiggyBank, Gauge, Wrench, ShieldCheck } from 'lucide-react';

const Slide18 = () => {
    return (
        <div className="h-full bg-slate-50 text-slate-800 p-8 flex flex-col">
            <div className="border-b-4 border-blue-600 pb-3 mb-6">
                <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
                    Conclusion - Application Full-Stack Complète
                </h1>
                <p className="text-lg text-emerald-600 mt-1 font-semibold">✅ Backend + Frontend Fonctionnels</p>
            </div>

            <div className="flex gap-8">
                <div className="flex-1 flex flex-col justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 relative overflow-hidden">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
                                <ClipboardCheck size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-blue-600">Réalisations Techniques</h2>
                        </div>
                        <ul className="space-y-3 relative z-10">
                            {[
                                "Backend complet : API REST + Base de données",
                                "Frontend React : Interface utilisateur moderne",
                                "Redux Store : Gestion d'état centralisée",
                                "9 entités métier : Intégration complète",
                                "Sécurité production : JWT + Middleware",
                                "Tests automatisés : 95%+ couverture",
                                "Docker : Containerisation complète"
                            ].map((text, idx) => (
                                <motion.li 
                                    key={idx}
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center text-sm text-slate-700 bg-emerald-50 p-2 rounded-lg border-l-4 border-emerald-500 hover:bg-emerald-100 transition-colors"
                                >
                                    <CheckCircle className="text-emerald-500 mr-3 shrink-0" size={20} />
                                    {text}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-600 mb-4">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
                                <TrendingUp size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-blue-600">Impact Métier Réalisé</h2>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.2 }} className="p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm bg-emerald-50">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="font-bold text-slate-700 text-sm">Économies carburant</span>
                                    <span className="text-xl font-bold text-emerald-600">18%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[18%]"></div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.4 }} className="p-3 rounded-lg border-l-4 border-blue-500 shadow-sm bg-blue-50">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="font-bold text-slate-700 text-sm">Efficacité planning</span>
                                    <span className="text-xl font-bold text-blue-600">30%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full w-[30%]"></div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.6 }} className="p-3 rounded-lg border-l-4 border-orange-500 shadow-sm bg-orange-50">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="font-bold text-slate-700 text-sm">Réduction pannes</span>
                                    <span className="text-xl font-bold text-orange-600">25%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-orange-500 h-full w-[25%]"></div>
                                </div>
                            </motion.div>
                            
                            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.8 }} className="p-3 rounded-lg border-l-4 border-slate-500 shadow-sm bg-slate-50">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="font-bold text-slate-700 text-sm">Traçabilité</span>
                                    <span className="text-xl font-bold text-slate-600">100%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-slate-500 h-full w-full"></div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <div className="bg-emerald-50 border-l-4 border-emerald-500 p-2 rounded-lg flex items-center shadow-sm">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white mr-2">
                                <CheckCircle size={16} />
                            </div>
                            <div>
                                <div className="text-emerald-700 font-bold text-base">Fonctionnel</div>
                                <div className="text-xs text-slate-700">Application prête déploiement</div>
                            </div>
                         </div>
                         <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded-lg flex items-center shadow-sm">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
                                <TrendingUp size={16} />
                            </div>
                            <div>
                                <div className="text-blue-700 font-bold text-base">Intuitif</div>
                                <div className="text-xs text-slate-700">Dashboards Admin/Chauffeur</div>
                            </div>
                         </div>
                         <div className="bg-orange-50 border-l-4 border-orange-500 p-2 rounded-lg flex items-center shadow-sm">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white mr-2">
                                <Wrench size={16} />
                            </div>
                            <div>
                                <div className="text-orange-700 font-bold text-base">Complet</div>
                                <div className="text-xs text-slate-700">Gestion Camions/Voyages/Carburant</div>
                            </div>
                         </div>
                         <div className="bg-slate-50 border-l-4 border-slate-500 p-2 rounded-lg flex items-center shadow-sm">
                            <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white mr-2">
                                <ShieldCheck size={16} />
                            </div>
                            <div>
                                <div className="text-slate-700 font-bold text-base">Sécurisé</div>
                                <div className="text-xs text-slate-700">Authentification multi-niveaux</div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slide18;
