import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Monitor, Database, Layout, Settings } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ icon: Icon, title, desc, items, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500 hover:shadow-xl transition-shadow"
  >
    <div className="flex items-center mb-2">
      <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-2">
        <Icon size={16} />
      </div>
      <h3 className="text-lg font-bold text-blue-600">{title}</h3>
    </div>
    <p className="text-gray-600 mb-2 text-sm">{desc}</p>
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="flex items-center text-xs text-gray-700">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

const Slide5 = () => {
  return (
    <div className="h-full bg-linear-to-br from-blue-50 to-indigo-100 text-slate-800 p-8">
      <div className="border-b-4 border-blue-600 pb-3 mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Architecture Frontend React</h1>
        <p className="text-lg text-emerald-600 mt-1 font-semibold">✅ Interface Utilisateur Complète</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FeatureCard 
          icon={Monitor}
          title="Interface Utilisateur"
          desc="React 18 avec hooks modernes et composants réutilisables"
          items={[
            "React 18 avec hooks modernes",
            "Redux Toolkit pour gestion d'état", 
            "Vite pour build rapide et HMR",
            "Composants UI réutilisables"
          ]}
          delay={0.2}
        />

        <FeatureCard 
          icon={Layout}
          title="Pages Implémentées"
          desc="Interface complète pour toutes les fonctionnalités métier"
          items={[
            "Login - Authentification sécurisée",
            "Dashboard Admin - Vue d'ensemble",
            "Dashboard Chauffeur - Interface terrain", 
            "Gestion Camions/Voyages - CRUD",
            "Suivi Carburant - Temps réel",
            "Maintenance & Notifications"
          ]}
          delay={0.4}
        />

        <FeatureCard 
          icon={Database}
          title="Redux Store Architecture"
          desc="Gestion d'état centralisée avec Redux Toolkit"
          items={[
            "Slices spécialisés par entité métier",
            "API intégrée avec RTK Query",
            "État centralisé pour toute l'application",
            "Middleware pour gestion des erreurs"
          ]}
          delay={0.6}
        />

        <FeatureCard 
          icon={Settings}
          title="Composants & Services"
          desc="Architecture modulaire et réutilisable"
          items={[
            "Button, Modal, Toast - UI Components",
            "AuthContext - Gestion authentification",
            "API Service - Communication backend",
            "Layout - Structure responsive"
          ]}
          delay={0.8}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-4 bg-emerald-100 border border-emerald-300 rounded-lg p-3 text-center col-span-full"
      >
        <p className="text-emerald-700 font-semibold text-base">
          🚀 Frontend React Complet et Fonctionnel avec Redux Store
        </p>
      </motion.div>
    </div>
  );
};

export default Slide5;