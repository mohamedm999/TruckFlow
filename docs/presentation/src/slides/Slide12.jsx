import React from 'react';
import { motion } from 'framer-motion';
import { LayoutList, GitBranch, Lightbulb, Zap, TrendingUp, Cpu, Ban, Calculator, ShieldCheck, PlusSquare, ClipboardCheck, UserPlus, Play, RefreshCw, FileText, History, LayoutDashboard, Clock, Users, Search } from 'lucide-react';

const FlowStep = ({ title, icon: Icon, delay }) => (
    <motion.div 
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ delay, type: "spring" }}
      className="flex flex-col items-center z-10"
    >
       <div className="w-16 h-16 rounded-full bg-white border-4 border-blue-500 text-blue-600 flex items-center justify-center shadow-md mb-2">
          <Icon size={28} />
       </div>
       <div className="font-bold text-slate-700">{title}</div>
    </motion.div>
)

const Slide12 = () => {
  return (
    <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
      <div className="border-b-4 border-blue-600 pb-4 mb-8">
        <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-3">
          Fonctionnalités Métier
        </h1>
      </div>

      <div className="flex gap-10 h-full">
         <div className="flex-1 flex flex-col justify-center">
             <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600 mb-8">
                <h3 className="font-bold text-blue-600 mb-4 text-xl flex items-center gap-2">
                    <LayoutList size={24} /> Règles Automatisées
                </h3>
                <ul className="space-y-4 text-slate-700">
                   <li className="flex items-start gap-4">
                        <div className="bg-blue-100 p-2 rounded text-blue-600"><Ban size={20} /></div>
                        <div>
                            <span className="font-bold text-blue-600">Prévention des conflits</span>
                            <div className="text-sm">Un camion = un voyage/jour</div>
                        </div>
                   </li>
                   <li className="flex items-start gap-4">
                        <div className="bg-blue-100 p-2 rounded text-blue-600"><Calculator size={20} /></div>
                        <div>
                            <span className="font-bold text-blue-600">Calculs automatiques</span>
                            <div className="text-sm">Coûts carburant, kilométrage</div>
                        </div>
                   </li>
                   <li className="flex items-start gap-4">
                        <div className="bg-blue-100 p-2 rounded text-blue-600"><ShieldCheck size={20} /></div>
                        <div>
                            <span className="font-bold text-blue-600">Validation des données</span>
                            <div className="text-sm">Contrôles d'intégrité</div>
                        </div>
                   </li>
                </ul>
             </div>

             {/* Workflow Diagram */}
             <div className="relative flex justify-between items-center px-4 mt-auto">
                <div className="absolute top-8 left-0 w-full h-1 bg-slate-200 z-0"></div>
                <FlowStep title="Création" icon={PlusSquare} delay={0.1} />
                <FlowStep title="Validation" icon={ClipboardCheck} delay={0.2} />
                <FlowStep title="Assignation" icon={UserPlus} delay={0.3} />
                <FlowStep title="Exécution" icon={Play} delay={0.4} />
             </div>
         </div>

         <div className="flex-1 flex flex-col">
             <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500 mb-6 flex-grow">
                 <h2 className="text-xl font-bold text-emerald-600 mb-6 flex items-center gap-2">
                     <Cpu className="text-emerald-500"/> Optimisations
                 </h2>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                        { title: "Mise à jour automatique", desc: "des compteurs", icon: RefreshCw },
                        { title: "Génération de rapports", desc: "PDF", icon: FileText },
                        { title: "Historique complet", desc: "des opérations", icon: History },
                        { title: "Tableaux de bord", desc: "en temps réel", icon: LayoutDashboard }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-emerald-50 p-3 rounded-lg border-l-2 border-emerald-500 flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full text-emerald-600 shadow-sm">
                                <item.icon size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-emerald-800 text-sm">{item.title}</div>
                                <div className="text-xs text-emerald-600">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>

             <div className="flex gap-4">
                 <div className="flex-1 bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                     <div className="text-2xl font-bold text-blue-600 mb-1">-30%</div>
                     <div className="text-xs text-slate-500 font-bold">Temps de planification</div>
                 </div>
                 <div className="flex-1 bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
                     <div className="text-2xl font-bold text-emerald-600 mb-1">+25%</div>
                     <div className="text-xs text-slate-500 font-bold">Utilisation des ressources</div>
                 </div>
                 <div className="flex-1 bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
                     <div className="text-2xl font-bold text-slate-600 mb-1">100%</div>
                     <div className="text-xs text-slate-500 font-bold">Traçabilité</div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Slide12;
