import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Monitor, Server, Database, Code } from 'lucide-react';

const Slide1 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-cover bg-center text-white relative">
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div 
        className="absolute inset-0 z-[-1]" 
        style={{ backgroundImage: "url('https://sfile.chatglm.cn/images-ppt/dfdb842dd90f.jpg')" }} 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-4xl px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-blue-500">TruckFlow</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-emerald-400">
          Application Web Full-Stack Complète
        </h2>
        <p className="text-xl mb-10 text-green-300 font-medium">
           Système de Gestion de Flotte Fonctionnel
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-lg">
          <span className="bg-blue-600/30 px-6 py-2 rounded-lg backdrop-blur-sm border border-blue-500/30 flex items-center gap-2">
            <Monitor size={20} /> React + Redux
          </span>
          <span className="bg-green-600/30 px-6 py-2 rounded-lg backdrop-blur-sm border border-green-500/30 flex items-center gap-2">
            <Server size={20} /> Node.js + Express
          </span>
          <span className="bg-slate-600/30 px-6 py-2 rounded-lg backdrop-blur-sm border border-slate-500/30 flex items-center gap-2">
            <Database size={20} /> MongoDB
          </span>
          <span className="bg-purple-600/30 px-6 py-2 rounded-lg backdrop-blur-sm border border-purple-500/30 flex items-center gap-2">
            <Code size={20} /> Docker
          </span>
        </div>

        <div className="text-gray-400 mt-8 flex justify-center gap-8">
          <p className="flex items-center gap-2">mohamed moukhtari</p>
          <p className="flex items-center gap-2">{new Date().toLocaleDateString()}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Slide1;
