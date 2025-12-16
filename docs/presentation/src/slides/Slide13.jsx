import React from 'react';
import { motion } from 'framer-motion';
import { Server, Shield, Users, Truck, Map, Droplet, FileJson, Activity, Lock, Book } from 'lucide-react';

const EndpointItem = ({ method, path, desc, delay }) => {
    const getMethodColor = (m) => {
        switch(m) {
            case 'GET': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'POST': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PUT': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex items-center p-2 bg-white rounded-lg shadow-sm border border-slate-100 font-mono text-xs"
        >
            <span className={`px-2 py-1 rounded text-xs font-bold mr-2 border ${getMethodColor(method)} w-14 text-center`}>{method}</span>
            <span className="text-slate-600 flex-grow font-semibold text-xs">{path}</span>
            <span className="text-slate-400 italic text-xs">{desc}</span>
        </motion.div>
    );
}

const Slide13 = () => {
    return (
        <div className="h-full bg-slate-50 text-slate-800 p-8 flex flex-col">
            <div className="border-b-4 border-blue-600 pb-3 mb-6">
                <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
                    <Server /> API RESTful
                </h1>
            </div>

            <div className="flex gap-8">
                <div className="flex-1 flex flex-col">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                           <Activity className="text-blue-500"/> Endpoints Principaux
                        </h2>
                        <div className="space-y-2">
                            <EndpointItem method="GET" path="/api/trucks" desc="Liste des camions" delay={0.1} />
                            <EndpointItem method="POST" path="/api/trips" desc="Créer un voyage" delay={0.2} />
                            <EndpointItem method="PUT" path="/api/fuel/:id" desc="Mise à jour conso" delay={0.3} />
                            <EndpointItem method="DELETE" path="/api/users/:id" desc="Retirer utilisateur" delay={0.4} />
                            <div className="border-t border-slate-100 my-3 pt-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resources</h3>
                                <div className="grid grid-cols-2 gap-1">
                                     <div className="flex items-center gap-1 text-slate-600 bg-slate-50 p-1.5 rounded text-xs"><Users size={14}/> Users</div>
                                     <div className="flex items-center gap-1 text-slate-600 bg-slate-50 p-1.5 rounded text-xs"><Truck size={14}/> Trucks</div>
                                     <div className="flex items-center gap-1 text-slate-600 bg-slate-50 p-1.5 rounded text-xs"><Map size={14}/> Trips</div>
                                     <div className="flex items-center gap-1 text-slate-600 bg-slate-50 p-1.5 rounded text-xs"><Droplet size={14}/> Fuel</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500 mb-4">
                        <h2 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                            <Shield /> Standards & Sécurité
                        </h2>
                        <ul className="space-y-2">
                            {[
                                { text: "Codes HTTP Standardisés (200, 201, 400, 404, 500)", icon: FileJson },
                                { text: "Réponses JSON uniformes { success, data, error }", icon: Activity },
                                { text: "Documentation OpenAPI / Swagger", icon: Book },
                                { text: "Validation des entrées (Zod/Joi)", icon: Lock }
                            ].map((item, idx) => (
                                <motion.li 
                                    key={idx}
                                    initial={{ x: 20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + (idx * 0.1) }}
                                    className="flex items-center text-slate-700 bg-white/60 p-2 rounded-lg text-sm"
                                >
                                    <item.icon className="text-blue-500 mr-2" size={16} />
                                    {item.text}
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-slate-800 text-slate-200 p-4 rounded-xl font-mono text-xs shadow-xl"
                    >
                        <div className="text-slate-400 mb-1 text-xs">// Exemple de Réponse JSON</div>
                        <pre className="text-emerald-400">
{`{
  "success": true,
  "data": {
    "id": "trk_123",
    "status": "available",
    "odometer": 154200
  }
}`}
                        </pre>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Slide13;
