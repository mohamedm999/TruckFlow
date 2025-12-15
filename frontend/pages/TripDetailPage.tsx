import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Truck as TruckIcon, User, FileText, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Toast } from '../components/ui/Toast';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTrips, updateTrip } from '../store/slices/tripsSlice';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { api } from '../services/api';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const trips = useAppSelector(state => state.trips.trips);
  const trip = trips.find(t => t.id === id);

  const [status, setStatus] = useState('');
  const [mileageStart, setMileageStart] = useState(0);
  const [mileageEnd, setMileageEnd] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!trips.length) {
      dispatch(fetchTrips());
    }
  }, [dispatch, trips.length]);

  useEffect(() => {
    if (trip) {
      setStatus(trip.status);
      setMileageStart(trip.mileageStart || 0);
      setMileageEnd(trip.mileageEnd || 0);
    }
  }, [trip]);

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Trajet non trouvé</p>
        <Button onClick={() => navigate('/trips')} className="mt-4">
          Retour aux trajets
        </Button>
      </div>
    );
  }

  const handleUpdateStatus = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await api.updateTripStatus(id, { status, mileageEnd: status === 'Completed' ? mileageEnd : undefined });
      await dispatch(fetchTrips());
      setToast({ message: 'Statut mis à jour avec succès', type: 'success' });
    } catch (error: any) {
      setToast({ message: error.message || 'Erreur lors de la mise à jour', type: 'error' });
    }
    setIsSubmitting(false);
  };

  const handleUpdateMileage = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await api.updateTripMileage(id, { mileageStart, mileageEnd });
      await dispatch(fetchTrips());
      setToast({ message: 'Kilométrage mis à jour avec succès', type: 'success' });
    } catch (error: any) {
      setToast({ message: error.message || 'Erreur lors de la mise à jour', type: 'error' });
    }
    setIsSubmitting(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Planned': return 'info';
      case 'InProgress': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getTruckDisplay = () => {
    const truck = trip.truckId;
    if (truck && typeof truck === 'object' && truck.registrationNumber) {
      return `${truck.registrationNumber} - ${truck.brand} ${truck.model}`;
    }
    return 'N/A';
  };

  const getChauffeurDisplay = () => {
    const chauffeur = trip.chauffeurId;
    if (chauffeur && typeof chauffeur === 'object' && chauffeur.firstName) {
      return `${chauffeur.firstName} ${chauffeur.lastName}`;
    }
    return 'N/A';
  };

  const isChauffeur = user?.role === UserRole.CHAUFFEUR;
  const isOwnTrip = trip.chauffeurId && typeof trip.chauffeurId === 'object' 
    ? (trip.chauffeurId as any).id === user?.id 
    : trip.chauffeurId === user?.id;

  const canEdit = isChauffeur && isOwnTrip;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/trips')} icon={<ArrowLeft size={18} />}>
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-white">Détails du Trajet</h1>
        </div>

        {/* Trip Info Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{trip.tripId}</h2>
              <Badge variant={getStatusVariant(trip.status)}>{trip.status}</Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Départ prévu</p>
              <p className="text-white">{trip.plannedDeparture ? new Date(trip.plannedDeparture).toLocaleDateString('fr-FR') : 'Non défini'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-green-500 mt-1" size={20} />
                <div>
                  <p className="text-sm text-slate-400">Origine</p>
                  <p className="text-white font-medium">{trip.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-red-500 mt-1" size={20} />
                <div>
                  <p className="text-sm text-slate-400">Destination</p>
                  <p className="text-white font-medium">{trip.destination}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TruckIcon className="text-orange-500 mt-1" size={20} />
                <div>
                  <p className="text-sm text-slate-400">Camion</p>
                  <p className="text-white font-medium">{getTruckDisplay()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="text-blue-500 mt-1" size={20} />
                <div>
                  <p className="text-sm text-slate-400">Chauffeur</p>
                  <p className="text-white font-medium">{getChauffeurDisplay()}</p>
                </div>
              </div>
            </div>
          </div>

          {trip.plannedDeparture && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <Clock className="text-slate-400" size={20} />
                <div>
                  <p className="text-sm text-slate-400">Départ prévu</p>
                  <p className="text-white">{new Date(trip.plannedDeparture).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            </div>
          )}

          {trip.notes && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <FileText className="text-slate-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-slate-400 mb-1">Notes</p>
                  <p className="text-white">{trip.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Update Status Card - Only for chauffeurs on their own trips */}
        {canEdit && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Mettre à jour le statut</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Statut</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option value="Planned">Planifié</option>
                  <option value="InProgress">En cours</option>
                  <option value="Completed">Complété</option>
                </select>
              </div>

              {status === 'Completed' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Kilométrage final</label>
                  <input
                    type="number"
                    min="0"
                    value={mileageEnd}
                    onChange={(e) => setMileageEnd(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Kilométrage à l'arrivée"
                  />
                </div>
              )}

              <Button
                onClick={handleUpdateStatus}
                disabled={isSubmitting}
                icon={<Save size={18} />}
                className="w-full"
              >
                {isSubmitting ? 'Mise à jour...' : 'Mettre à jour le statut'}
              </Button>
            </div>
          </div>
        )}

        {/* Update Mileage Card - Only for chauffeurs on their own trips */}
        {canEdit && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Mettre à jour le kilométrage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Kilométrage départ</label>
                <input
                  type="number"
                  min="0"
                  value={mileageStart}
                  onChange={(e) => setMileageStart(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Kilométrage arrivée</label>
                <input
                  type="number"
                  min="0"
                  value={mileageEnd}
                  onChange={(e) => setMileageEnd(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            {mileageStart > 0 && mileageEnd > 0 && (
              <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-400">Distance parcourue</p>
                <p className="text-2xl font-bold text-white">{(mileageEnd - mileageStart).toLocaleString()} km</p>
              </div>
            )}
            <Button
              onClick={handleUpdateMileage}
              disabled={isSubmitting}
              icon={<Save size={18} />}
              className="w-full mt-4"
            >
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour le kilométrage'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
