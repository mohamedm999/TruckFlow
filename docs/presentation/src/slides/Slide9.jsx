import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, ClipboardList, PenTool, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const MaintenanceType = ({ title, icon: Icon, color, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`flex-1 p-4 bg-${color}-50 rounded-xl border-l-4 border-${color}-500 text-center hover:-translate-y-1 transition-transform duration-300`}
  >
    <div className={`w-12 h-12 mx-auto bg-${color}-100 text-${color}-600 rounded-full flex items-center justify-center mb-3`}>
       <Icon size={24} />
    </div>
    <h3 className={`font-bold text-${color}-700 mb-1`}>{title}</h3>
    <p className="text-sm text-slate-600">{desc}</p>
  </motion.div>
);

const CalendarDay = ({ day, isHeader, isToday, isMaintenance }) => {
  let classes = "flex items-center justify-center h-10 rounded-md text-sm ";
  if (isHeader) classes += "font-bold text-blue-600 bg-blue-50";
  else if (isToday) classes += "bg-emerald-100 text-emerald-700 font-bold border border-emerald-300";
  else if (isMaintenance) classes += "bg-orange-100 text-orange-700 font-bold border border-orange-300";
  else classes += "bg-slate-50 text-slate-500";

  return <div className={classes}>{day}</div>;
};

const Slide9 = () => {
  return (
    <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
      <div className="border-b-4 border-orange-500 pb-4 mb-8">
        <h1 className="text-4xl font-bold text-orange-600 flex items-center gap-3">
          <Wrench /> Maintenance Préventive
        </h1>
      </div>

      <div className="flex gap-10 h-full">
        {/* Left: Planning */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 flex-grow">
             <div className="flex items-center gap-3 mb-6 text-blue-700 font-bold text-xl">
               <Calendar /> Planification Intelligente
             </div>

             <div className="grid grid-cols-7 gap-2 mb-6 text-center">
               {['L','M','M','J','V','S','D'].map(d => <CalendarDay key={d} day={d} isHeader />)}
               {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                 <CalendarDay 
                    key={day} 
                    day={day} 
                    isToday={day === 25} 
                    isMaintenance={[15, 28].includes(day)}
                 />
               ))}
             </div>

             <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                   <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div> Maintenance prévue
                   <div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded ml-4"></div> Aujourd'hui
                </div>
             </div>
          </div>
        </div>

        {/* Right: Types & features */}
        <div className="flex-1 flex flex-col gap-6">
           <div className="flex gap-4">
              <MaintenanceType title="Préventive" icon={Calendar} color="emerald" desc="Programmée (Km/Temps)" delay={0.2} />
              <MaintenanceType title="Corrective" icon={AlertTriangle} color="orange" desc="Réparation urgente" delay={0.3} />
              <MaintenanceType title="Historique" icon={ClipboardList} color="blue" desc="Suivi complet" delay={0.4} />
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-grow">
              <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                 <PenTool className="text-blue-500"/> Gestion Automatisée
              </h3>
              <ul className="space-y-4">
                {[
                  "Maintenance polymorphe (Camions + Remorques)",
                  "Programmation basée sur le kilométrage réel",
                  "Alertes automatiques avant échéance",
                  "Suivi précis des coûts et pièces"
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="flex items-start text-slate-600"
                  >
                    <CheckCircle size={18} className="text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Slide9;
