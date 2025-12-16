import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Computer, Route, TrendingDown, CheckCircle } from 'lucide-react';

const Slide2 = () => {
  return (
    <div className="h-full bg-white text-slate-800 p-12 flex flex-col">
      <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <h1 className="text-5xl font-bold text-blue-600">Vue d'Ensemble du Projet</h1>
      </div>

      <div className="flex flex-1 gap-12">
        {/* Left Column: Objectives */}
        <div className="flex-1 space-y-8">
          <h2 className="text-3xl font-semibold text-blue-600 flex items-center gap-3">
            <Rocket className="text-emerald-500" size={36} /> Objectif Principal
          </h2>
          
          <div className="space-y-6">
            {[
              { icon: Computer, text: "Digitaliser la gestion complète d'une flotte", highlight: "Digitaliser" },
              { icon: Route, text: "Optimiser les opérations logistiques", highlight: "Optimiser" },
              { icon: TrendingDown, text: "Réduire les coûts et améliorer l'efficacité", highlight: "Réduire" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="flex items-center bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all"
              >
                <div className="bg-blue-600 text-white p-3 rounded-full mr-5">
                  <item.icon size={24} />
                </div>
                <div className="text-xl">
                  <span className="font-bold text-blue-700">{item.highlight}</span> {item.text.replace(item.highlight, '')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Problems Solved */}
        <div className="flex-1 space-y-8">
           <h2 className="text-3xl font-semibold text-blue-600 flex items-center gap-3">
            <CheckCircle className="text-emerald-500" size={36} /> Problématiques Résolues
          </h2>

          <div className="grid gap-4">
            {[
              "Suivi en temps réel des véhicules",
              "Gestion automatisée du carburant",
              "Planification optimisée des trajets",
              "Maintenance préventive",
              "Contrôle des coûts"
            ].map((text, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.5 }}
                className="flex items-center p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle className="text-emerald-500 mr-4" size={24} />
                <span className="text-xl font-medium">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide2;
