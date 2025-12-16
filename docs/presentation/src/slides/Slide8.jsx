import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, TrendingDown, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

const StatBar = ({ label, value, color, delay }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm font-semibold text-slate-600 mb-1">
      <span>{label}</span>
      <span>{value}L/100km</span>
    </div>
    <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${(value/40)*100}%` }}
        transition={{ delay, duration: 1, type: "spring" }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, children, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-4 hover:border-blue-300 transition-colors"
  >
    <div className="flex items-center gap-3 mb-3 text-blue-600 font-bold text-lg">
      <Icon /> {title}
    </div>
    <div className="text-slate-600 space-y-2 text-sm">
      {children}
    </div>
  </motion.div>
);

const Slide8 = () => {
  return (
    <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
      <div className="border-b-4 border-orange-500 pb-4 mb-8">
        <h1 className="text-4xl font-bold text-orange-600 flex items-center gap-3">
          <Droplet /> Gestion du Carburant
        </h1>
      </div>

      <div className="flex gap-12 h-full">
        {/* Left: Features */}
        <div className="flex-1">
          <FeatureCard icon={DollarSign} title="Suivi Automatisé" delay={0.1}>
            <p>• Enregistrement précis des pleins</p>
            <p>• Calcul automatique des coûts par litre</p>
            <p>• Corrélation avec le kilométrage réel</p>
          </FeatureCard>

          <FeatureCard icon={TrendingDown} title="Optimisation" delay={0.2}>
            <p>• Historique détaillé par véhicule</p>
            <p>• Analyse des tendances de consommation</p>
            <p>• Identification des véhicules énergivores</p>
          </FeatureCard>

          <FeatureCard icon={AlertTriangle} title="Alertes" delay={0.3}>
            <p>• Détection des anomalies de consommation</p>
            <p>• Rappels d'entretien si surconsommation</p>
          </FeatureCard>
        </div>

        {/* Right: Charts & Stats */}
        <div className="flex-1 flex flex-col">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-grow mb-6">
              <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                 <TrendingUp size={20} className="text-emerald-500" /> Consommation (L/100km)
              </h3>
              
              <div className="space-y-6">
                 <StatBar label="Volvo FH16 (Standard)" value={28} color="bg-emerald-500" delay={0.4} />
                 <StatBar label="Scania R450 (Eco)" value={25} color="bg-emerald-400" delay={0.5} />
                 <StatBar label="Mercedes Actros (Interne)" value={32} color="bg-orange-400" delay={0.6} />
                 <StatBar label="Renault T (Ancien)" value={35} color="bg-red-400" delay={0.7} />
              </div>
           </div>

           <div className="flex gap-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex-1 bg-emerald-600 text-white p-4 rounded-xl text-center shadow-lg"
              >
                 <div className="text-2xl font-bold">-18%</div>
                 <div className="text-xs opacity-80">Coûts Carburant</div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex-1 bg-blue-600 text-white p-4 rounded-xl text-center shadow-lg"
              >
                 <div className="text-2xl font-bold">+12%</div>
                 <div className="text-xs opacity-80">Efficacité</div>
              </motion.div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Slide8;
