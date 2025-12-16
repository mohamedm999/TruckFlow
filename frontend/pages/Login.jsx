import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden bg-slate-950 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto shadow-lg bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-orange-500/20">
             <Truck className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">TruckFlow</h2>
          <p className="mt-2 text-sm text-slate-400">
            Système de Gestion de Flotte Intelligent
          </p>
        </div>

        <div className="px-6 py-8 border shadow-2xl bg-slate-900 rounded-2xl border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {error && (
              <div className="flex items-center p-4 border rounded-lg bg-red-500/10 border-red-500/20">
                <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
                <span className="text-sm font-medium text-red-400">{error}</span>
              </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="w-5 h-5 text-slate-500" />
                        </div>
                        <input
                        type="email"
                        required
                        className="block w-full pl-10 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent p-2.5 transition-all disabled:opacity-50"
                        placeholder="admin@truckflow.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">Mot de passe</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="w-5 h-5 text-slate-500" />
                        </div>
                        <input
                        type="password"
                        required
                        className="block w-full pl-10 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent p-2.5 transition-all disabled:opacity-50"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full flex justify-center items-center py-3 text-base !bg-orange-600 hover:!bg-orange-700 !shadow-lg shadow-orange-500/20"
                disabled={isLoading}
            >
                {isLoading ? 'Connexion...' : 'Se Connecter'}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
          
          <div className="pt-6 mt-8 border-t border-slate-800">
            <p className="mb-2 text-xs text-center text-slate-500">Comptes de Démonstration</p>
            <div className="flex justify-between p-3 text-xs border rounded-lg text-slate-400 bg-slate-950 border-slate-800">
                <div className="w-1/2 text-center border-r border-slate-800">
                    <span className="block font-semibold text-orange-500">Admin</span>
                    admin@truckflow.com
                </div>
                <div className="w-1/2 text-center">
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
