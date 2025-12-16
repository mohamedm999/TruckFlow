import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';

const Slide20 = () => {
    return (
        <div className="h-full bg-slate-900 text-white relative overflow-hidden flex flex-col items-center justify-center p-12">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-blue-900/20"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10 mb-16"
            >
                <h1 className="text-6xl font-bold text-blue-500 mb-8">
                    Merci pour votre attention
                </h1>
                <h2 className="text-4xl text-emerald-500 font-normal">
                    Questions et discussions
                </h2>
            </motion.div>
            
            <div className="flex gap-10 z-10 mt-8">
                <motion.div 
                    whileHover={{ translateY: -10 }}
                    className="flex flex-col items-center p-8 rounded-2xl bg-white/90 text-slate-800 w-64 shadow-xl transition-all"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white mb-4">
                        <Mail size={30} />
                    </div>
                    <div className="text-xl font-bold text-blue-600 mb-1">Contact</div>
                    <div className="text-slate-500 break-all text-center">votre.email@example.com</div>
                </motion.div>
                
                <motion.div 
                    whileHover={{ translateY: -10 }}
                    className="flex flex-col items-center p-8 rounded-2xl bg-white/90 text-slate-800 w-64 shadow-xl transition-all"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white mb-4">
                        <Github size={30} />
                    </div>
                    <div className="text-xl font-bold text-blue-600 mb-1">GitHub</div>
                     <div className="text-slate-500 break-all text-center">github.com/truckflow</div>
                </motion.div>
                
                <motion.div 
                    whileHover={{ translateY: -10 }}
                    className="flex flex-col items-center p-8 rounded-2xl bg-white/90 text-slate-800 w-64 shadow-xl transition-all"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white mb-4">
                        <Linkedin size={30} />
                    </div>
                    <div className="text-xl font-bold text-blue-600 mb-1">LinkedIn</div>
                     <div className="text-slate-500 break-all text-center">linkedin.com/in/votreprofil</div>
                </motion.div>
            </div>
        </div>
    );
};

export default Slide20;
