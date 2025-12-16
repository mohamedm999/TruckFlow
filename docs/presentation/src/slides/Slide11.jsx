import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Code, Shield, Layers, PieChart, Activity, Bug } from 'lucide-react';

const StatDonut = ({ percentage, color, label, delay }) => (
  <motion.div 
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ delay, type: "spring" }}
    className="flex flex-col items-center"
  >
     <div className="relative w-32 h-32 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full text-slate-200">
           <path 
             d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
             fill="none"
             stroke="currentColor"
             strokeWidth="3"
           />
           <motion.path 
             initial={{ pathLength: 0 }}
             whileInView={{ pathLength: percentage / 100 }}
             transition={{ duration: 1.5, delay: delay + 0.5, ease: "easeOut" }}
             d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
             fill="none"
             stroke={color}
             strokeWidth="3"
             strokeDasharray="100, 100"
           />
        </svg>
        <div className="absolute font-bold text-2xl text-slate-700">{percentage}%</div>
     </div>
     <div className="mt-2 font-medium text-slate-600">{label}</div>
  </motion.div>
);

const Slide11 = () => {
  return (
    <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
      <div className="border-b-4 border-emerald-500 pb-4 mb-8">
        <h1 className="text-4xl font-bold text-emerald-600 flex items-center gap-3">
          <CheckSquare /> Qualité & Tests
        </h1>
      </div>

      <div className="flex gap-12 h-full">
         <div className="flex-1 flex flex-col">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 flex-grow">
                 <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                     <Code className="text-blue-500" /> Stratégie de Test
                 </h2>
                 <div className="space-y-4">
                    {[
                        { icon: Activity, title: "Tests Unitaires (Jest)", desc: "Validation des fonctions isolées" },
                        { icon: Layers, title: "Tests d'Intégration", desc: "Vérification des flux API & DB" },
                        { icon: Shield, title: "Sécurité & Validation", desc: "Middlewares et intégrité données" },
                        { icon: Bug, title: "Gestion d'Erreurs", desc: "Standards ApiError uniformisés" }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <div className="p-2 bg-white rounded shadow-sm mr-4 text-emerald-600">
                                <item.icon size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800">{item.title}</div>
                                <div className="text-sm text-slate-500">{item.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                 </div>
             </div>
         </div>

         <div className="flex-1 flex flex-col">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6">
                 <h2 className="text-xl font-bold text-slate-700 mb-8 flex items-center gap-2">
                     <PieChart className="text-blue-500" /> Métriques Qualité
                 </h2>
                 
                 <div className="flex justify-around">
                     <StatDonut percentage={95} color="#10b981" label="Couverture Code" delay={0.2} />
                     <StatDonut percentage={100} color="#3b82f6" label="Tests Critiques" delay={0.4} />
                 </div>
             </div>

             <div className="flex gap-4">
                 <div className="flex-1 bg-emerald-100 text-emerald-800 p-6 rounded-xl text-center">
                     <div className="font-bold text-lg mb-1">Stabilité</div>
                     <div className="text-xs">Zero régression critique</div>
                 </div>
                  <div className="flex-1 bg-blue-100 text-blue-800 p-6 rounded-xl text-center">
                     <div className="font-bold text-lg mb-1">Performance</div>
                     <div className="text-xs">Temps réponse &lt; 200ms</div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Slide11;
