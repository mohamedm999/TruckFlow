import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Box, Disc, Info, Activity, RefreshCw, CheckCircle, PenTool, PowerOff, List, TrendingDown, GitMerge } from 'lucide-react';

const VehicleCard = ({ title, icon: Icon, features, image, status, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex-1 bg-white p-6 rounded-2xl shadow-lg border-t-4 border-blue-600 hover:-translate-y-2 transition-transform duration-300 flex flex-col"
  >
    <div className="flex items-center mb-6">
      <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
    </div>

    <div className="space-y-4 mb-6 flex-grow">
      {features.map((feat, idx) => (
        <div key={idx} className="flex items-start text-slate-600">
          <feat.icon size={20} className="text-emerald-500 mr-3 mt-1 flex-shrink-0" />
          <span><strong className="text-blue-600">{feat.bold}</strong> {feat.text}</span>
        </div>
      ))}
    </div>

    {status && (
       <div className="flex gap-2 mb-4">
         <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1"><CheckCircle size={14}/> Actif</span>
         <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold flex items-center gap-1"><PenTool size={14}/> Maint.</span>
         <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold flex items-center gap-1"><PowerOff size={14}/> HS</span>
       </div>
    )}

    {image && (
      <div className="h-40 rounded-lg overflow-hidden mt-auto">
        <img src={image} alt={title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
      </div>
    )}
  </motion.div>
);

const Slide6 = () => {
  return (
    <div className="h-full bg-slate-50 text-slate-800 p-12 flex flex-col">
       <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <h1 className="text-5xl font-bold text-blue-600">Gestion des Véhicules</h1>
      </div>

      <div className="flex gap-8 h-full pb-8">
        <VehicleCard 
          title="Camions (Trucks)" 
          icon={Truck}
          delay={0.2}
          image="https://sfile.chatglm.cn/images-ppt/fa9a7ccc288e.jpg"
          status={true}
          features={[
            { icon: Info, bold: "Informations:", text: "Marque, modèle, année" },
            { icon: Activity, bold: "Suivi:", text: "Kilométrage temps réel" },
            { icon: RefreshCw, bold: "Auto:", text: "Mise à jour compteur" }
          ]}
        />
        
        <VehicleCard 
          title="Remorques (Trailers)" 
          icon={Box}
          delay={0.4}
           image="https://sfile.chatglm.cn/images-ppt/b905e5b8582e.jpg"
          features={[
            { icon: List, bold: "Types:", text: "Capacités variables" },
            { icon: GitMerge, bold: "Assignation:", text: "Flexible aux voyages" },
            { icon: PenTool, bold: "Maint.:", text: "Indépendante" }
          ]}
        />

        <VehicleCard 
          title="Pneus (Tires)" 
          icon={Disc}
          delay={0.6}
          features={[
            { icon: List, bold: "Inventaire:", text: "Numéros de série" },
            { icon: TrendingDown, bold: "Usure:", text: "Suivi 0-100%" },
            { icon: GitMerge, bold: "Poly:", text: "Camion/Remorque" }
          ]}
        />
      </div>
    </div>
  );
};

export default Slide6;
