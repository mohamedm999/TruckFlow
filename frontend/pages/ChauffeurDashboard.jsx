import React, { useEffect } from 'react';
import { Map, CheckCircle, Clock, AlertCircle, Fuel, TrendingUp, Plus, Truck as TruckIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTrips } from '../store/slices/tripsSlice';
import { fetchNotifications } from '../store/slices/notificationsSlice';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const ChauffeurDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const trips = useAppSelector(state => state.trips.trips);
  const notifications = useAppSelector(state => state.notifications.notifications);

  useEffect(() => {
    dispatch(fetchTrips());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const myTrips = trips.filter(trip => {
    const chauffeurId = trip.chauffeurId && typeof trip.chauffeurId === 'object' 
      ? trip.chauffeurId.id || trip.chauffeurId._id 
      : trip.chauffeurId;
    return chauffeurId === user?.id;
  });

  const activeTrips = myTrips.filter(t => t.status === 'InProgress' || t.status === 'Planned');
  const completedTrips = myTrips.filter(t => t.status === 'Completed');
  const totalDistance = completedTrips.reduce((sum, t) => {
    if (t.mileageEnd && t.mileageStart) {
      return sum + (t.mileageEnd - t.mileageStart);
    }
    return sum;
  }, 0);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned': return 'bg-blue-500';
      case 'InProgress': return 'bg-orange-500';
      case 'Completed': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Planned': return 'info';
      case 'InProgress': return 'warning';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bienvenue, {user?.firstName}!</h1>
            <p className="text-orange-100">Voici un aperçu de vos trajets et activités</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/fuel')}
              className="bg-white text-orange-600 hover:bg-orange-50 flex items-center gap-2"
            >
              <Plus size={18} />
              Ajouter Carburant
            </Button>
            <Button 
              onClick={() => navigate('/trips')}
              variant="outline"
              className="border-white text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Map size={18} />
              Mes Trajets
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Trajets Actifs</p>
              <p className="text-3xl font-bold text-white mt-2">{activeTrips.length}</p>
              <p className="text-xs text-slate-500 mt-1">en cours/planifiés</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Map size={24} className="text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Trajets Complétés</p>
              <p className="text-3xl font-bold text-white mt-2">{completedTrips.length}</p>
              <p className="text-xs text-slate-500 mt-1">total</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Distance Totale</p>
              <p className="text-3xl font-bold text-white mt-2">{totalDistance.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">kilomètres</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Notifications</p>
              <p className="text-3xl font-bold text-white mt-2">{unreadNotifications}</p>
              <p className="text-xs text-slate-500 mt-1">non lues</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <AlertCircle size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => navigate('/trips')} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-orange-500 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
              <Map size={24} className="text-orange-500" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Gérer mes trajets</p>
              <p className="text-sm text-slate-400">Voir et mettre à jour</p>
            </div>
          </div>
        </button>

        <button onClick={() => navigate('/fuel')} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-green-500 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
              <Fuel size={24} className="text-green-500" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Ajouter carburant</p>
              <p className="text-sm text-slate-400">Enregistrer un plein</p>
            </div>
          </div>
        </button>

        <button onClick={() => navigate('/trucks')} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <TruckIcon size={24} className="text-blue-500" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Voir la flotte</p>
              <p className="text-sm text-slate-400">Camions et remorques</p>
            </div>
          </div>
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Map size={24} className="text-orange-500" />
            Mes Trajets Actifs
          </h2>
          <Button onClick={() => navigate('/trips')} variant="outline">Voir tous</Button>
        </div>
        <div className="p-6">
          {activeTrips.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">Aucun trajet actif pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTrips.map((trip) => {
                const truck = trip.truckId && typeof trip.truckId === 'object' 
                  ? `${trip.truckId.registrationNumber} - ${trip.truckId.brand}` 
                  : 'N/A';
                
                return (
                  <div key={trip.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{trip.tripId}</h3>
                          <Badge variant={getStatusVariant(trip.status)}>{trip.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-400">Camion: {truck}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(trip.status)}`}></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Origine</p>
                        <p className="text-sm text-white font-medium flex items-center gap-1">
                          <span className="text-green-400">●</span> {trip.origin}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Destination</p>
                        <p className="text-sm text-white font-medium flex items-center gap-1">
                          <span className="text-red-400">●</span> {trip.destination}
                        </p>
                      </div>
                    </div>

                    {trip.plannedDeparture && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock size={16} />
                        <span>Départ prévu: {new Date(trip.plannedDeparture).toLocaleString('fr-FR')}</span>
                      </div>
                    )}

                    {trip.notes && (
                      <div className="mt-4 p-3 bg-slate-900 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Notes</p>
                        <p className="text-sm text-slate-300">{trip.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle size={24} className="text-green-500" />
            Trajets Récents Complétés
          </h2>
        </div>
        <div className="overflow-x-auto">
          {completedTrips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Aucun trajet complété</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Trajet</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Itinéraire</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Distance</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900 divide-y divide-slate-800">
                {completedTrips.slice(0, 5).map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{trip.tripId}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{trip.origin} → {trip.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {trip.mileageEnd && trip.mileageStart ? `${(trip.mileageEnd - trip.mileageStart).toLocaleString()} km` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {trip.actualArrival ? new Date(trip.actualArrival).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
