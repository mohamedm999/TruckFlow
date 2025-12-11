import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');

  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Email ou mot de passe invalide.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
             <Truck className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">TruckFlow</h2>
          <p className="mt-2 text-sm text-slate-400">
            Système de Gestion de Flotte Intelligent
          </p>
        </div>

        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-2xl border border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-sm font-medium text-red-400">{error}</span>
              </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                        type="email"
                        required
                        className="block w-full pl-10 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent p-2.5 transition-all"
                        placeholder="admin@truckflow.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Mot de passe</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                        type="password"
                        required
                        className="block w-full pl-10 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent p-2.5 transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full flex justify-center items-center py-3 text-base !bg-orange-600 hover:!bg-orange-700 !shadow-lg shadow-orange-500/20"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Connexion...' : 'Se Connecter'}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs text-center text-slate-500 mb-2">Comptes de Démonstration</p>
            <div className="flex justify-between text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-center w-1/2 border-r border-slate-800">
                    <span className="block font-semibold text-orange-500">Admin</span>
                    admin@truckflow.com
                </div>
                <div className="text-center w-1/2">
                    <span className="block font-semibold text-blue-500">Chauffeur</span>
                    driver@truckflow.com
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};