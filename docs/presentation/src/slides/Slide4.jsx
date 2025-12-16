import React from 'react';
import { motion } from 'framer-motion';
import { Database, User, Truck, Map, Droplet, PenTool, Disc, Bell, Shield, Link, ArrowRight } from 'lucide-react';

const EntityCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    className="bg-blue-50/50 p-4 rounded-xl border-l-4 border-blue-500 hover:shadow-lg transition-all flex flex-col"
  >
    <div className="flex items-center mb-2">
      <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-blue-700">{title}</h3>
    </div>
    <p className="text-sm text-slate-600 leading-snug">{desc}</p>
  </motion.div>
);

const RelationItem = ({ from, to, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100 mb-3"
  >
    <Link className="text-emerald-500 mr-3" size={18} />
    <div className="flex-grow">
      <div className="font-bold text-emerald-800 flex items-center gap-2">
        {from} <ArrowRight size={14} /> {to}
      </div>
      <div className="text-xs text-emerald-700">{desc}</div>
    </div>
  </motion.div>
);

const Slide4 = () => {
  return (
    <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
      <div className="border-b-4 border-blue-600 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-3">
          <Database /> Modèle de Données (UML)
        </h1>
      </div>

      <div className="flex gap-8 h-full">
        <div className="flex-[2] flex flex-col">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Entités Principales</h2>
          <div className="grid grid-cols-3 gap-4">
            <EntityCard icon={User} title="User" desc="Admin & Chauffeurs" delay={0.1} />
            <EntityCard icon={Truck} title="Truck" desc="Véhicules Moteurs" delay={0.15} />
            <EntityCard icon={Map} title="Trip" desc="Voyages & Missions" delay={0.2} />
            
            <EntityCard icon={Droplet} title="FuelRecord" desc="Suivi Carburant" delay={0.25} />
            <EntityCard icon={PenTool} title="Maintenance" desc="Entretiens & Réparations" delay={0.3} />
            <EntityCard icon={Disc} title="Tire" desc="Gestion Pneumatique" delay={0.35} />
            
            <EntityCard icon={Bell} title="Notification" desc="Système d'Alertes" delay={0.4} />
            <EntityCard icon={Shield} title="Auth" desc="Sécurité & Tokens" delay={0.45} />
            {/* Placeholder for grid balance if needed */}
          </div>

          <div className="mt-8 flex-grow bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden relative group">
             {/* Simulating the Diagram Image with a placeholder or actual image if available online */}
             <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-100">
                <img 
                    src="https://sfile.chatglm.cn/images-ppt/e1025c73d3a6.png" 
                    alt="UML Diagram" 
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white p-6 rounded-2xl shadow-sm h-fit">
          <h2 className="text-xl font-bold text-slate-700 mb-6">Relations Clés</h2>
          <RelationItem from="User" to="Trip (1:N)" desc="Un chauffeur, plusieurs voyages" delay={0.5} />
          <RelationItem from="Truck" to="Trip (1:N)" desc="Un camion, plusieurs missions" delay={0.6} />
          <RelationItem from="Trip" to="FuelRecord (1:N)" desc="Suivi carburant par voyage" delay={0.7} />
          <RelationItem from="Truck" to="Maintenance (1:N)" desc="Historique complet" delay={0.8} />
          <RelationItem from="Truck" to="Tire (1:N)" desc="Configuration des pneus" delay={0.9} />
        </div>
      </div>
    </div>
  );
};

export default Slide4;
