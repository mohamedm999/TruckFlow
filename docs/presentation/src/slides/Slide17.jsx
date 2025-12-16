import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Zap, Shield, CheckSquare, FileText, Cpu, PiggyBank, History, Gavel, Code } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, desc, color }) => (
    <div className={`flex items-start p-3 rounded-lg bg-${color}-50 border-l-4 border-${color}-500 hover:translate-x-1 transition-transform`}>
        <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600 mr-4 flex-shrink-0`}>
            <Icon size={20} />
        </div>
        <div>
            <div className={`font-bold text-${color}-700 text-lg`}>{title}</div>
            <div className="text-slate-600">{desc}</div>
        </div>
    </div>
);

const StatBox = ({ value, label, delay }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100 hover:shadow-md transition-shadow flex-1"
    >
        <div className="text-3xl font-bold text-emerald-500 mb-1">{value}</div>
        <div className="text-sm text-slate-500 font-medium">{label}</div>
    </motion.div>
);

const Slide17 = () => {
    return (
        <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
            <div className="border-b-4 border-blue-600 pb-4 mb-8">
                <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-3">
                    Avantages Concurrentiels
                </h1>
            </div>

            <div className="flex gap-8 mb-8 flex-grow">
                {/* Tech Advantages */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 flex flex-col">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <Code size={24} />
                         </div>
                         Innovation Technique
                    </h2>
                    <div className="space-y-4 flex-grow">
                         <FeatureItem icon={Cpu} title="Architecture moderne et scalable" desc="Base solide pour évolutions futures" color="blue" />
                         <FeatureItem icon={Shield} title="Sécurité de niveau entreprise" desc="Protection complète des données" color="blue" />
                         <FeatureItem icon={CheckSquare} title="Tests automatisés complets" desc="95%+ de couverture de code" color="blue" />
                         <FeatureItem icon={FileText} title="Documentation technique exhaustive" desc="Facilite maintenance et évolutions" color="blue" />
                    </div>
                </div>

                {/* Business Advantages */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500 flex flex-col">
                    <h2 className="text-2xl font-bold text-emerald-600 mb-6 flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                            <TrendingUp size={24} />
                         </div>
                         Valeur Métier
                    </h2>
                     <div className="space-y-4 flex-grow">
                         <FeatureItem icon={PiggyBank} title="Réduction des coûts opérationnels" desc="15-20% d'économies sur les dépenses" color="emerald" />
                         <FeatureItem icon={Zap} title="Amélioration de l'efficacité" desc="30% d'optimisation des processus" color="emerald" />
                         <FeatureItem icon={History} title="Traçabilité complète" desc="Historique détaillé de toutes les opérations" color="emerald" />
                         <FeatureItem icon={Gavel} title="Conformité réglementaire" desc="Respect des normes du secteur" color="emerald" />
                    </div>
                </div>
            </div>

            <div className="flex gap-6 justify-between mt-auto">
                <StatBox value="-18%" label="Coûts carburant" delay={0.5} />
                <StatBox value="+30%" label="Efficacité planning" delay={0.6} />
                <StatBox value="-25%" label="Pannes imprévues" delay={0.7} />
            </div>
        </div>
    );
};

export default Slide17;
