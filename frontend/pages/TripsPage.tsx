import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, MapPin, Loader2, FileDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTrips, createTrip, updateTrip, deleteTrip } from '../store/slices/tripsSlice';
import { fetchTrucks } from '../store/slices/trucksSlice';
import { fetchTrailers } from '../store/slices/trailersSlice';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const TripsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const trips = useAppSelector(state => state.trips.trips);
  const trucks = useAppSelector(state => state.trucks.trucks);
  const trailers = useAppSelector(state => state.trailers.trailers);
  const isLoading = useAppSelector(state => state.trips.isLoading);
  const error = useAppSelector(state => state.trips.error);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    tripId: '',
    truckId: '',
    trailerId: '',
    chauffeurId: '',
    origin: '',
    destination: '',
    plannedDeparture: '',
    mileageStart: 0,
    notes: ''
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; tripId: string | null }>({ isOpen: false, tripId: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTrips());
    dispatch(fetchTrucks());
    dispatch(fetchTrailers());
    if (user?.role === UserRole.ADMIN) {
      loadUsers();
    }
  }, [dispatch, user?.role]);

  const loadUsers = async () => {
    try {
      const response = await api.getUsers();
      const userData = response.data || [];
      setUsers(userData);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
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

  // Filter trips based on user role
  const userTrips = user?.role === UserRole.CHAUFFEUR 
    ? trips.filter(trip => {
        const chauffeurId = trip.chauffeurId && typeof trip.chauffeurId === 'object' 
          ? (trip.chauffeurId as any).id || (trip.chauffeurId as any)._id 
          : trip.chauffeurId;
        return chauffeurId === user?.id;
      })
    : trips;

  const filteredTrips = userTrips.filter(trip => 
    trip.tripId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    console.log('Delete clicked for trip ID:', id);
    setDeleteConfirm({ isOpen: true, tripId: id });
  };

  const handleDeleteConfirm = async () => {
    console.log('Delete confirm clicked, tripId:', deleteConfirm.tripId);
    if (!deleteConfirm.tripId) {
      console.error('No tripId to delete');
      return;
    }
    
    console.log('Dispatching deleteTrip for:', deleteConfirm.tripId);
    const result = await dispatch(deleteTrip(deleteConfirm.tripId));
    console.log('Delete result:', result);
    
    if (deleteTrip.fulfilled.match(result)) {
      setToast({ message: 'Trajet supprimé avec succès', type: 'success' });
    } else {
      setToast({ message: 'Erreur lors de la suppression', type: 'error' });
    }
    
    setDeleteConfirm({ isOpen: false, tripId: null });
  };

  const handleEdit = (trip: any) => {
    setEditingTrip(trip);
    setFormData({
      tripId: trip.tripId,
      truckId: trip.truckId?._id || trip.truckId,
      trailerId: trip.trailerId?._id || trip.trailerId || '',
      chauffeurId: trip.chauffeurId?._id || trip.chauffeurId,
      origin: trip.origin,
      destination: trip.destination,
      plannedDeparture: trip.plannedDeparture ? new Date(trip.plannedDeparture).toISOString().slice(0, 16) : '',
      mileageStart: trip.mileageStart || 0,
      notes: trip.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTrip(null);
    const initialData = {
      tripId: '',
      truckId: '',
      trailerId: '',
      chauffeurId: '',
      origin: '',
      destination: '',
      plannedDeparture: '',
      mileageStart: 0,
      notes: ''
    };
    setFormData(initialData);
    setIsModalOpen(true);
    
    // Reset form after extension interference
    setTimeout(() => {
      setFormData((prev: any) => ({
        ...prev,
        chauffeurId: prev.chauffeurId || ''
      }));
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMIT DEBUG ===');
    console.log('Full formData:', JSON.stringify(formData, null, 2));
    console.log('chauffeurId value:', formData.chauffeurId);
    console.log('chauffeurId type:', typeof formData.chauffeurId);
    console.log('chauffeurId length:', formData.chauffeurId?.length);
    console.log('Is valid ObjectId?', /^[0-9a-fA-F]{24}$/.test(formData.chauffeurId));
    
    // Validate required fields
    if (!formData.tripId) {
      setToast({ message: 'ID du trajet est requis', type: 'error' });
      return;
    }
    if (!formData.truckId) {
      setToast({ message: 'Veuillez sélectionner un camion', type: 'error' });
      return;
    }
    if (!formData.chauffeurId) {
      console.log('chauffeurId is empty/undefined');
      setToast({ message: 'Veuillez sélectionner un chauffeur', type: 'error' });
      return;
    }
    if (!formData.origin) {
      setToast({ message: 'Origine est requise', type: 'error' });
      return;
    }
    if (!formData.destination) {
      setToast({ message: 'Destination est requise', type: 'error' });
      return;
    }
    
    // Validate MongoDB ObjectId format (24 hex characters)
    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
    
    if (!isValidObjectId(formData.truckId)) {
      setToast({ message: 'ID camion invalide', type: 'error' });
      console.error('Invalid truckId:', formData.truckId);
      return;
    }
    
    if (!isValidObjectId(formData.chauffeurId)) {
      setToast({ message: 'ID chauffeur invalide', type: 'error' });
      console.error('Invalid chauffeurId:', formData.chauffeurId);
      return;
    }
    
    if (formData.trailerId && !isValidObjectId(formData.trailerId)) {
      setToast({ message: 'ID remorque invalide', type: 'error' });
      console.error('Invalid trailerId:', formData.trailerId);
      return;
    }
    
    setIsSubmitting(true);
    
    const cleanData = {
      ...formData,
      trailerId: formData.trailerId || null,
      plannedDeparture: formData.plannedDeparture || undefined,
      notes: formData.notes || undefined
    };
    
    console.log('Submitting trip data:', cleanData);
    
    if (editingTrip) {
      const result = await dispatch(updateTrip({ id: editingTrip.id, data: cleanData }));
      if (updateTrip.fulfilled.match(result)) {
        setIsModalOpen(false);
        setToast({ message: 'Trajet modifié avec succès', type: 'success' });
      } else {
        const errorMsg = (result.payload as string) || 'Erreur lors de la modification';
        setToast({ message: errorMsg, type: 'error' });
      }
    } else {
      const result = await dispatch(createTrip(cleanData));
      if (createTrip.fulfilled.match(result)) {
        setIsModalOpen(false);
        setToast({ message: 'Trajet créé avec succès', type: 'success' });
      } else {
        const errorMsg = (result.payload as string) || 'Erreur lors de la création';
        setToast({ message: errorMsg, type: 'error' });
      }
    }
    
    setIsSubmitting(false);
  };

  const getTruckDisplay = (trip: any) => {
    const truck = trip.truckId;
    if (truck && typeof truck === 'object' && truck.registrationNumber) {
      return `${truck.registrationNumber} - ${truck.brand} ${truck.model}`;
    }
    return 'N/A';
  };

  const getChauffeurDisplay = (trip: any) => {
    const chauffeur = trip.chauffeurId;
    if (chauffeur && typeof chauffeur === 'object' && chauffeur.firstName) {
      return `${chauffeur.firstName} ${chauffeur.lastName}`;
    }
    return 'N/A';
  };

  const handleDownloadPDF = async (tripId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${(api as any).getAccessToken()}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trip-${tripId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setToast({ message: 'PDF téléchargé avec succès', type: 'success' });
    } catch (error) {
      console.error('PDF download error:', error);
      setToast({ message: 'Erreur lors du téléchargement du PDF', type: 'error' });
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">
          {user?.role === UserRole.CHAUFFEUR ? 'Mes Trajets' : 'Gestion des Trajets'}
        </h1>
        {user?.role === UserRole.ADMIN && (
          <Button onClick={handleAddNew} icon={<Plus size={18} />}>
            Nouveau Trajet
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par ID, origine ou destination..."
              className="pl-10 pr-4 py-2.5 w-full bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" icon={<Filter size={18} />}>
            Filtres
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Trajet</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Camion</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Chauffeur</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Itinéraire</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Chargement...
                  </td>
                </tr>
              ) : filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Aucun trajet trouvé
                  </td>
                </tr>
              ) : filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                            <MapPin size={20} />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-white">{trip.tripId}</div>
                            <div className="text-xs text-slate-500">
                              {trip.plannedDeparture ? new Date(trip.plannedDeparture).toLocaleDateString('fr-FR') : 'Non planifié'}
                            </div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{getTruckDisplay(trip)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{getChauffeurDisplay(trip)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">
                      <div className="flex items-center gap-1">
                        <span className="text-green-400">●</span> {trip.origin}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-red-400">●</span> {trip.destination}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(trip.status)}>{trip.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user?.role === UserRole.CHAUFFEUR && (
                        <button onClick={() => navigate(`/trips/${trip.id}`)} className="text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 p-2 rounded-lg transition-colors" title="Voir détails">
                          <Eye size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDownloadPDF(trip.id)} className="text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 p-2 rounded-lg transition-colors" title="Télécharger PDF">
                        <FileDown size={16} />
                      </button>
                      {user?.role === UserRole.ADMIN && (
                        <>
                          <button onClick={() => handleEdit(trip)} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 p-2 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteClick(trip.id)} className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTrip ? "Modifier Trajet" : "Ajouter Trajet"}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">ID du trajet</label>
                <input 
                  type="text" 
                  value={formData.tripId} 
                  onChange={(e) => setFormData({...formData, tripId: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none uppercase" 
                  placeholder="Ex: TRP001"
                  required 
                  disabled={!!editingTrip}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Camion</label>
                    <select 
                      value={formData.truckId} 
                      onChange={(e) => setFormData({...formData, truckId: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      required
                    >
                        <option value="">-- Sélectionner --</option>
                        {trucks.map(truck => (
                          <option key={truck.id} value={truck.id}>{truck.registrationNumber} - {truck.brand}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Remorque (optionnel)</label>
                    <select 
                      value={formData.trailerId} 
                      onChange={(e) => setFormData({...formData, trailerId: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                        <option value="">-- Aucune --</option>
                        {trailers.map(trailer => (
                          <option key={trailer.id} value={trailer.id}>{trailer.registrationNumber}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Chauffeur</label>
                <select 
                  value={formData.chauffeurId || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    console.log('Chauffeur selected:', val);
                    
                    // Check if it's a valid ObjectId
                    if (/^[0-9a-fA-F]{24}$/.test(val)) {
                      // Normal case: valid ObjectId
                      setFormData((prev: any) => ({...prev, chauffeurId: val}));
                    } else {
                      // Extension interference: find user by name
                      const matchedUser = users.find(u => 
                        val.includes(u.firstName) && val.includes(u.lastName)
                      );
                      if (matchedUser?._id) {
                        console.log('Using matched user _id:', matchedUser._id);
                        setFormData((prev: any) => ({...prev, chauffeurId: matchedUser._id}));
                      } else {
                        console.error('Could not find user for:', val);
                        setFormData((prev: any) => ({...prev, chauffeurId: val}));
                      }
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  required
                >
                    <option value="">-- Sélectionner --</option>
                    {users.filter(u => u.role === 'chauffeur' || u.role === 'admin').map((user, index) => (
                      <option key={user.id || index} value={user.id}>
                        {user.firstName} {user.lastName} ({user.role})
                      </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Origine</label>
                    <input 
                      type="text" 
                      value={formData.origin} 
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                      placeholder="Ex: Paris"
                      required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Destination</label>
                    <input 
                      type="text" 
                      value={formData.destination} 
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                      placeholder="Ex: Lyon"
                      required 
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Départ prévu</label>
                    <input 
                      type="datetime-local" 
                      value={formData.plannedDeparture} 
                      onChange={(e) => setFormData({...formData, plannedDeparture: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Kilométrage départ</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.mileageStart} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setFormData({...formData, mileageStart: val});
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Notes (optionnel)</label>
                <textarea 
                  value={formData.notes} 
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                  rows={3}
                  placeholder="Informations supplémentaires..."
                />
            </div>
            <div className="mt-6 flex space-x-3">
                <Button type="button" variant="outline" className="flex-1 justify-center" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Annuler</Button>
                <Button type="submit" className="flex-1 justify-center" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : 'Sauvegarder'}
                </Button>
            </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Supprimer le trajet"
        message="Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, tripId: null })}
        isLoading={isLoading}
      />
    </div>
    </>
  );
};
