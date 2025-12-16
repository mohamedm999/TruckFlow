import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Truck, CheckCircle, Clock, MapPin, ArrowRight, FileText, Activity } from 'lucide-react';

const Step = ({ title, icon: Icon, color, isLast, delay }) => (
  <div className="flex items-center flex-1">
    <motion.div 
       initial={{ scale: 0 }}
       whileInView={{ scale: 1 }}
       transition={{ type: "spring", delay }}
       className={`relative z-10 w-16 h-16 rounded-full bg-${color}-100 flex items-center justify-center border-4 border-white shadow-lg`}
    >
      <Icon className={`text-${color}-600`} size={32} />
    </motion.div>
    {!isLast && (
      <motion.div 
         initial={{ scaleX: 0 }}
         whileInView={{ scaleX: 1 }}
         transition={{ delay: delay + 0.2, duration: 0.5 }}
         className="h-2 bg-slate-200 flex-1 mx-2 rounded-full origin-left"
      />
    )}
  </div>
);

const Section = ({ title, items, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-500 flex-1"
    >
        <h3 className="text-xl font-bold text-blue-800 mb-6 border-b pb-2">{title}</h3>
        <ul className="space-y-4">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-start">
                    <CheckCircle className="text-emerald-500 mr-3 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-700">{item}</span>
                </li>
            ))}
        </ul>
    </motion.div>
)

const Slide7 = () => {
    // Note: Tailwind dynamic classes like bg-blue-100 might need to be safelisted or used fully.
    // Using style objects or full class names for safety in dynamic components.
  return (
    <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
      <div className="border-b-4 border-blue-600 pb-4 mb-10">
        <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-3">
          <MapPin /> Gestion des Voyages
        </h1>
      </div>

      {/* Workflow Visualization */}
      <div className="mb-14 px-10">
          <div className="flex justify-between items-center mb-4">
             <div className="text-center w-16 font-bold text-blue-600">Planifié</div>
             <div className="text-center w-16 font-bold text-emerald-600">En Cours</div>
             <div className="text-center w-16 font-bold text-slate-600">Terminé</div>
          </div>
          <div className="flex items-center">
             <Step title="Planifié" icon={Calendar} color="blue" delay={0.2} />
             <Step title="En cours" icon={Truck} color="emerald" delay={0.4} />
             <Step title="Terminé" icon={CheckCircle} color="slate" isLast={true} delay={0.6} />
          </div>
      </div>

      <div className="flex gap-8 flex-grow">
          <Section 
            title="Planification & Ressources" 
            delay={0.7}
            items={[
                "Assignation intelligente (Camion + Remorque + Chauffeur)",
                "Détéction automatique des conflits de disponibilité",
                "Calcul prévisionnel des itinéraires et délais"
            ]}
          />
           <Section 
            title="Suivi & Exécution" 
            delay={0.8}
            items={[
                "Mise à jour des statuts en temps réel",
                "Suivi kilométrique (Départ / Arrivée)",
                "Génération automatique des rapports PDF"
            ]}
          />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
             <div className="text-3xl font-bold text-emerald-600 mb-1">+30%</div>
             <div className="text-sm text-emerald-800">Efficacité Planning</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
             <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
             <div className="text-sm text-blue-800">Traçabilité</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
             <div className="text-3xl font-bold text-orange-600 mb-1">-15%</div>
             <div className="text-sm text-orange-800">Temps de gestion</div>
          </div>
      </div>
    </div>
  );
};

export default Slide7;
