import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart2, Activity, PieChart, DollarSign, Clock, Truck } from 'lucide-react';

const KPICard = ({ label, value, icon: Icon, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`bg-white p-6 rounded-xl shadow-sm border-t-4 border-${color}-500 hover:shadow-lg transition-shadow`}
    >
        <div className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600 mb-4`}>
            <Icon size={24} />
        </div>
        <div className={`text-3xl font-bold text-${color}-600 mb-1`}>{value}</div>
        <div className="text-slate-500 font-medium">{label}</div>
    </motion.div>
);

const Slide15 = () => {
    return (
        <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
            <div className="border-b-4 border-blue-600 pb-4 mb-8">
                <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-3">
                    <Activity /> Métriques & KPIs
                </h1>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-12">
                 <KPICard label="Voyages / Mois" value="342" icon={Truck} color="blue" delay={0.1} />
                 <KPICard label="Coût Carburant" value="€847" icon={DollarSign} color="red" delay={0.2} />
                 <KPICard label="Taux Utilisation" value="87%" icon={Activity} color="emerald" delay={0.3} />
                 <KPICard label="Temps Maintenance" value="4.2h" icon={Clock} color="orange" delay={0.4} />
            </div>

            <div className="flex gap-8 h-full">
                <div className="flex-[2] bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" /> Evolution Performance
                    </h3>
                    
                    {/* Placeholder for Chart */}
                    <div className="flex-grow bg-slate-50 rounded-lg flex items-end justify-between p-4 px-8 pb-0 gap-4 overflow-hidden relative">
                         <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                             Simulated Chart Area
                         </div>
                         {[40, 65, 50, 80, 70, 95, 85].map((h, i) => (
                             <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                whileInView={{ height: `${h}%` }}
                                transition={{ delay: 0.5 + (i * 0.1), type: "spring" }}
                                className="w-full bg-blue-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                             />
                         ))}
                    </div>
                </div>

                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <PieChart className="text-purple-500" /> Rapports
                    </h3>
                    <ul className="space-y-4">
                        {[
                            "Rapports PDF Automatisés",
                            "Analyse de rentabilité",
                            "Tendances consommation",
                            "Audit sécurité flotte"
                        ].map((item, idx) => (
                            <motion.li 
                                key={idx}
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 + (idx * 0.1) }}
                                className="flex items-center text-slate-600 bg-slate-50 p-3 rounded-lg"
                            >
                                <BarChart2 size={18} className="text-purple-500 mr-3" />
                                {item}
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Slide15;
