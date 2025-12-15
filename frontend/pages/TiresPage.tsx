import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Circle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTires, createTire, updateTire, deleteTire } from '../store/slices/tiresSlice';
import { fetchTrucks } from '../store/slices/trucksSlice';
import { fetchTrailers } from '../store/slices/trailersSlice';

export const TiresPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const tires = useAppSelector(state => state.tires.tires);
  const trucks = useAppSelector(state => state.trucks.trucks);
  const trailers = useAppSelector(state => state.trailers.trailers);
  const isLoading = useAppSelector(state => state.tires.isLoading);
  const error = useAppSelector(state => state.tires.error);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTire, setEditingTire] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    serialNumber: '',
    brand: '',
    size: '',
    status: 'Active',
    vehicleType: '',
    vehicleId: '',
    mileageAtInstall: 0,
    wearLevel: 100
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; tireId: string | null }>({ isOpen: false, tireId: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTires());
    dispatch(fetchTrucks());
    dispatch(fetchTrailers());
  }, [dispatch]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'InStorage': return 'info';
      case 'Scrapped': return 'danger';
      default: return 'default';
    }
  };

  const getWearColor = (wearLevel: number) => {
    if (wearLevel >= 70) return 'text-green-400';
    if (wearLevel >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredTires = tires.filter(tire => 
    tire.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tire.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, tireId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.tireId) return;
    
    const result = await dispatch(deleteTire(deleteConfirm.tireId));
    if (deleteTire.fulfilled.match(result)) {
      setToast({ message: 'Pneu supprimé avec succès', type: 'success' });
    } else {
      setToast({ message: 'Erreur lors de la suppression', type: 'error' });
    }
    setDeleteConfirm({ isOpen: false, tireId: null });
  };

  const handleEdit = (tire: any) => {
    setEditingTire(tire);
    setFormData({
      serialNumber: tire.serialNumber,
      brand: tire.brand,
      size: tire.size,
      status: tire.status,
      vehicleType: tire.vehicleType || '',
      vehicleId: tire.vehicleId || '',
      mileageAtInstall: tire.mileageAtInstall,
      wearLevel: tire.wearLevel
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTire(null);
    setFormData({
      serialNumber: '',
      brand: '',
      size: '',
      status: 'Active',
      vehicleType: '',
      vehicleId: '',
      mileageAtInstall: 0,
      wearLevel: 100
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Clean data: remove empty vehicleType/vehicleId
    const cleanData = {
      ...formData,
      vehicleType: formData.vehicleType || undefined,
      vehicleId: formData.vehicleId || undefined
    };
    
    if (editingTire) {
      const result = await dispatch(updateTire({ id: editingTire.id, data: cleanData }));
      if (updateTire.fulfilled.match(result)) {
        setIsModalOpen(false);
        setToast({ message: 'Pneu modifié avec succès', type: 'success' });
      } else {
        const errorMsg = (result.payload as string) || 'Erreur lors de la modification';
        setToast({ message: errorMsg, type: 'error' });
      }
    } else {
      const result = await dispatch(createTire(cleanData));
      if (createTire.fulfilled.match(result)) {
        setIsModalOpen(false);
        setToast({ message: 'Pneu créé avec succès', type: 'success' });
      } else {
        const errorMsg = (result.payload as string) || 'Erreur lors de la création';
        setToast({ message: errorMsg, type: 'error' });
      }
    }
    
    setIsSubmitting(false);
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
        <h1 className="text-2xl font-bold text-white">Gestion des Pneus</h1>
        <Button onClick={handleAddNew} icon={<Plus size={18} />}>
          Nouveau Pneu
        </Button>
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
              placeholder="Rechercher par numéro de série ou marque..."
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
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Pneu</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Marque</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Taille</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Usure</th>
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
              ) : filteredTires.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Aucun pneu trouvé
                  </td>
                </tr>
              ) : filteredTires.map((tire) => (
                <tr key={tire.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                            <Circle size={20} />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-white">{tire.serialNumber}</div>
                            <div className="text-xs text-slate-500">ID: {tire.id.substring(0, 8).toUpperCase()}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{tire.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{tire.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-800 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${tire.wearLevel >= 70 ? 'bg-green-500' : tire.wearLevel >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${tire.wearLevel}%` }}
                        />
                      </div>
                      <span className={`text-sm font-mono ${getWearColor(tire.wearLevel)}`}>{tire.wearLevel}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(tire.status)}>{tire.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(tire)} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 p-2 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(tire.id)} className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
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
        title={editingTire ? "Modifier Pneu" : "Ajouter Pneu"}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Numéro de série</label>
                <input 
                  type="text" 
                  value={formData.serialNumber} 
                  onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                  required 
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Marque</label>
                    <input 
                      type="text" 
                      value={formData.brand} 
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                      placeholder="Ex: Michelin, Bridgestone..."
                      required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Taille</label>
                    <input 
                      type="text" 
                      value={formData.size} 
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                      placeholder="Ex: 315/80R22.5"
                      required 
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Kilométrage à l'installation</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.mileageAtInstall} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setFormData({...formData, mileageAtInstall: val});
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                      required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Niveau d'usure (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={formData.wearLevel} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 0 && val <= 100) setFormData({...formData, wearLevel: val});
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                      required 
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Statut</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                    <option value="Active">Active</option>
                    <option value="InStorage">En Stock</option>
                    <option value="Scrapped">Mis au rebut</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Type de véhicule (optionnel)</label>
                    <select 
                      value={formData.vehicleType} 
                      onChange={(e) => {
                        setFormData({...formData, vehicleType: e.target.value, vehicleId: ''});
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                        <option value="">-- Aucun --</option>
                        <option value="Truck">Camion</option>
                        <option value="Trailer">Remorque</option>
                    </select>
                </div>
                {formData.vehicleType && (
                  <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Véhicule</label>
                      <select 
                        value={formData.vehicleId} 
                        onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                          <option value="">-- Sélectionner --</option>
                          {formData.vehicleType === 'Truck' && trucks.map(truck => (
                            <option key={truck.id} value={truck.id}>
                              {truck.registrationNumber} - {truck.brand}
                            </option>
                          ))}
                          {formData.vehicleType === 'Trailer' && trailers.map(trailer => (
                            <option key={trailer.id} value={trailer.id}>
                              {trailer.registrationNumber} - {trailer.type}
                            </option>
                          ))}
                      </select>
                  </div>
                )}
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
        title="Supprimer le pneu"
        message="Êtes-vous sûr de vouloir supprimer ce pneu ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, tireId: null })}
        isLoading={isLoading}
      />
    </div>
    </>
  );
};
