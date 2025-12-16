import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Server, Database, Shield, Globe, Lock, Cpu } from 'lucide-react';

const Layer = ({ icon: Icon, title, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring" }}
        className={`bg-${color}-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-center gap-3 font-bold w-full max-w-md mx-auto mb-4 border-2 border-white/20`}
    >
        <Icon /> {title}
    </motion.div>
);

const SecurityItem = ({ title, icon: Icon, delay }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm"
    >
        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
            <Icon size={18} />
        </div>
        <span className="font-semibold text-slate-700">{title}</span>
    </motion.div>
);

const Slide14 = () => {
    return (
        <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
            <div className="border-b-4 border-emerald-500 pb-4 mb-6">
                <h1 className="text-4xl font-bold text-emerald-600 flex items-center gap-3">
                    <Cloud /> Déploiement & Infra
                </h1>
            </div>

            <div className="flex gap-10 h-full">
                {/* Architecture Stack */}
                <div className="flex-1 flex flex-col justify-center bg-slate-100 rounded-2xl p-8 border border-slate-200">
                    <h2 className="text-center text-slate-500 font-bold mb-8 uppercase tracking-widest text-sm">Stack Architecture</h2>
                    
                    <Layer icon={Globe} title="Load Balancer (Nginx)" color="blue" delay={0.1} />
                    
                    <div className="flex justify-center gap-4 mb-4">
                        <motion.div 
                             initial={{ opacity: 0, y: -10 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.2 }}
                             className="bg-emerald-500 text-white p-3 rounded-lg shadow w-24 text-center font-bold text-sm"
                        >App 1</motion.div>
                        <motion.div 
                             initial={{ opacity: 0, y: -10 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.3 }}
                             className="bg-emerald-500 text-white p-3 rounded-lg shadow w-24 text-center font-bold text-sm"
                        >App 2</motion.div>
                        <motion.div 
                             initial={{ opacity: 0, y: -10 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.4 }}
                             className="bg-emerald-500 text-white p-3 rounded-lg shadow w-24 text-center font-bold text-sm"
                        >App N</motion.div>
                    </div>

                    <Layer icon={Database} title="MongoDB Cluster" color="orange" delay={0.5} />
                </div>

                <div className="flex-1 flex flex-col gap-6">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <Shield className="text-blue-500"/> Sécurité Production
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <SecurityItem title="HTTPS / TLS Obligatoire" icon={Lock} delay={0.6} />
                            <SecurityItem title="Rate Limiting & DDoS Shield" icon={Shield} delay={0.7} />
                            <SecurityItem title="Logs Centralisés (Winston)" icon={Cloud} delay={0.8} />
                            <SecurityItem title="Sanitization des Entrées" icon={Shield} delay={0.9} />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                             <div className="text-3xl font-bold text-blue-600">99.9%</div>
                             <div className="text-sm text-blue-800">Uptime SLA</div>
                         </div>
                         <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
                             <div className="text-3xl font-bold text-emerald-600">&lt;200ms</div>
                             <div className="text-sm text-emerald-800">Latence API</div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Slide14;
