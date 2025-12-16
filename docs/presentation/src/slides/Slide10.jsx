import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Truck, Droplet, Settings, Info, Check, Clock } from 'lucide-react';

const NotificationRow = ({ title, msg, time, type, isUnread, delay }) => {
  const getIcon = () => {
    switch(type) {
        case 'trip': return <Truck className="text-blue-500" size={20} />;
        case 'fuel': return <Droplet className="text-orange-500" size={20} />;
        case 'system': return <Settings className="text-slate-500" size={20} />;
        case 'security': return <Shield className="text-red-500" size={20} />;
        default: return <Bell className="text-blue-500" size={20} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex items-start p-4 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors ${isUnread ? 'border-l-4 border-l-blue-500' : ''}`}
    >
      <div className="bg-slate-100 p-2 rounded-full mr-4">
         {getIcon()}
      </div>
      <div className="flex-grow">
          <div className="flex justify-between items-start">
             <h4 className={`text-sm ${isUnread ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{title}</h4>
             <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> {time}</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{msg}</p>
      </div>
    </motion.div>
  );
};

const Slide10 = () => {
  return (
    <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
      <div className="border-b-4 border-blue-600 pb-4 mb-8">
        <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-3">
          <Bell /> Système de Notifications
        </h1>
      </div>

      <div className="flex gap-12 h-full">
         <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-700 mb-6">Types d'Alertes</h2>
            <div className="space-y-4">
               {[
                   { icon: Truck, color: "blue", title: "TripAssigned", desc: "Nouvelle mission assignée" },
                   { icon: Check, color: "emerald", title: "TripCompleted", desc: "Mission terminée avec succès" },
                   { icon: Settings, color: "orange", title: "MaintenanceDue", desc: "Maintenance véhicule requise" },
                   { icon: Droplet, color: "red", title: "FuelAlert", desc: "Consommation anormale détectée" },
               ].map((item, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ delay: idx * 0.1 }}
                     className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100"
                   >
                       <div className={`mr-4 p-3 bg-${item.color}-50 text-${item.color}-600 rounded-full`}>
                           <item.icon size={24} />
                       </div>
                       <div>
                           <div className="font-bold text-slate-800">{item.title}</div>
                           <div className="text-sm text-slate-500">{item.desc}</div>
                       </div>
                   </motion.div>
               ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-600">95%</div>
                    <div className="text-xs text-emerald-800">Taux lecture</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">-30%</div>
                    <div className="text-xs text-blue-800">Temps réaction</div>
                </div>
            </div>
         </div>

         <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col max-h-[500px]">
             <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
                <span>Centre de Notifications</span>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">2 Nouveaux</span>
             </div>
             <div className="overflow-y-auto flex-grow">
                 <NotificationRow 
                    isUnread={true} 
                    type="trip" 
                    title="Nouvelle mission assignée" 
                    msg="Transport Paris - Lyon (Camion #A12)" 
                    time="2 min" 
                    delay={0.5} 
                 />
                 <NotificationRow 
                    isUnread={true} 
                    type="fuel" 
                    title="Alerte Carburant" 
                    msg="Surconsommation détectée sur Volvo FH" 
                    time="15 min" 
                    delay={0.6} 
                 />
                 <NotificationRow 
                    type="system" 
                    title="Mise à jour système" 
                    msg="Maintenance serveur prévue ce soir" 
                    time="2h" 
                    delay={0.7} 
                 />
                 <NotificationRow 
                    type="trip" 
                    title="Mission terminée" 
                    msg="Livraison Marseille effectuée" 
                    time="Hier" 
                    delay={0.8} 
                 />
             </div>
         </div>
      </div>
    </div>
  );
};

export default Slide10;
