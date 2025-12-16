import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Layers, Server, Database, Shield, CheckSquare, FileText, Layout, ArrowDown } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
const TechItem = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors mb-3"
  >
    <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-3 shrink-0">
      <Icon size={20} />
    </div>
    <div>
      <div className="text-base font-bold text-blue-600">{title}</div>
      <div className="text-xs text-slate-500">{desc}</div>
    </div>
  </motion.div>
);

// eslint-disable-next-line no-unused-vars
const MvcBlock = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring" }}
    className="w-full bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-lg text-center hover:-translate-y-1 transition-transform"
  >
    <Icon className="mx-auto text-emerald-500 mb-1" size={24} />
    <div className="font-bold text-emerald-700 text-sm">{title}</div>
    <div className="text-xs text-emerald-600">{desc}</div>
  </motion.div>
);

const Arrow = ({ delay }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ delay }}
    className="py-1"
  >
    <ArrowDown className="mx-auto text-slate-300" />
  </motion.div>
);

const Slide3 = () => {
  return (
    <div className="h-full bg-slate-50 text-slate-800 p-8 flex flex-col">
       <div className="border-b-4 border-blue-600 pb-3 mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Architecture Full-Stack</h1>
        <p className="text-lg text-emerald-600 mt-1 font-semibold">✅ Backend + Frontend Complets</p>
      </div>

      <div className="flex gap-8">
        {/* Left Col: Stack */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <Layers /> Stack Complet
          </h2>
          <div className="space-y-2">
             <TechItem icon={Layout} title="Frontend" desc="React + Redux + Vite" delay={0.2} />
             <TechItem icon={Server} title="Backend" desc="Node.js + Express.js + MongoDB" delay={0.3} />
            <TechItem icon={Shield} title="Authentification" desc="JWT (Access + Refresh Tokens)" delay={0.4} />
            <TechItem icon={Shield} title="Sécurité" desc="Bcrypt, Rate Limiting, CORS" delay={0.5} />
            <TechItem icon={CheckSquare} title="Tests" desc="Jest avec couverture complète" delay={0.6} />
            <TechItem icon={FileText} title="Déploiement" desc="Docker + Docker Compose" delay={0.7} />
          </div>
        </div>

        {/* Right Col: MVC Diagram */}
        <div className="flex-1 flex flex-col items-center justify-start pt-4">
          <h2 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
            <Layout /> Architecture Complète
          </h2>
          
          <div className="w-2/3">
             <MvcBlock icon={Layout} title="Frontend React" desc="Redux Store + UI Components" delay={0.8} />
             <Arrow delay={0.9}/>
             <MvcBlock icon={Database} title="Backend MVC" desc="9 entités + Controllers" delay={1.0} />
             <Arrow delay={1.1}/>
             <MvcBlock icon={Shield} title="Middleware" desc="Auth + Validation" delay={1.2} />
             <Arrow delay={1.3}/>
             <MvcBlock icon={Layers} title="Services" desc="Business Logic + API" delay={1.4} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide3;
