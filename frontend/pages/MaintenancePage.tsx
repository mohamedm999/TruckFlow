import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Wrench, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMaintenance, createMaintenance, updateMaintenance, deleteMaintenance } from '../store/slices/maintenanceSlice';
import { fetchTrucks } from '../store/slices/trucksSlice';
import { fetchTrailers } from '../store/slices/trailersSlice';

export const MaintenancePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const records = useAppSelector(state => state.maintenance.records);
  const trucks = useAppSelector(state => state.trucks.trucks);
  const trailers = useAppSelector(state => state.trailers.trailers);
  const isLoading = useAppSelector(state => state.maintenance.isLoading);
  const error = useAppSelector(state => state.maintenance.error);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({
    vehicleType: 'Truck',
    vehicleId: '',
    type: '',
    scheduledDate: '',
    completedDate: '',
    cost: 0,
    notes: ''
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; recordId: string | null }>({ isOpen: false, recordId: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMaintenance());
    dispatch(fetchTrucks());
    dispatch(fetchTrailers());
  }, [dispatch]);

  const filteredRecords = records.filter(record => 
    record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.vehicleId && typeof record.vehicleId === 'object' && 
     record.vehicleId.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, recordId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.recordId) return;
    
    const result = await dispatch(deleteMaintenance(deleteConfirm.recordId));
    
    if (deleteMaintenance.fulfilled.match(result)) {
      setToast({ message: 'Maintenance supprimée avec succès', type: 'success' });
    } else {
      setToast({ message: 'Erreur lors de la suppression', type: 'error' });
    }
    
    setDeleteConfirm({ isOpen: false, recordId: null });
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      vehicleType: record.vehicleType,
      vehicleId: record.vehicleId?._id || record.vehicleId,
      type: record.type,
      scheduledDate: record.scheduledDate ? new Date(record.scheduledDate).toISOString().slice(0, 16) : '',
      completedDate: record.completedDate ? new Date(record.completedDate).toISOString().slice(0, 16) : '',
      cost: record.cost || 0,
      notes: record.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setFormData({
      vehicleType: 'Truck',
      vehicleId: '',
      type: '',
      scheduledDate: '',
      completedDate: '',
      cost: 0,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleId || !formData.type || !formData.scheduledDate) {
      setToast({ message: 'Veuillez remplir tous les champs requis', type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    
    const cleanData = {
      vehicleType: formData.vehicleType,
      vehicleId: formData.vehicleId,
      type: formData.type,
      scheduledDate: formData.scheduledDate,
      completedDate: formData.completedDate || undefined,
      cost: formData.cost,
      notes: formData.notes || undefined
    };
    
    if (editingRecord) {
      const result = await dispatch(updateMaintenance({ id: editingRecord.id, data: cleanData }));
      if (updateMaintenance.fulfilled.match(result)) {
        setIsModalOpen(false);
        setToast({ message: 'Maintenance modifiée avec succès', type: 'success' });
      } else {
        setToast({ message: (result.payload as string) || 'Erreur lors de la modification', type: 'error' });
      }
    } else {
      const result = await dispatch(createMaintenance(cleanData));
      if (createMaintenance.fulfilled.match(result)) {
        setIsModalOpen(false);
        setToast({ message: 'Maintenance créée avec succès', type: 'success' });
      } else {
        setToast({ message: (result.payload as string) || 'Erreur lors de la création', type: 'error' });
      }
    }
    
    setIsSubmitting(false);
  };

  const getVehicleDisplay = (record: any) => {
    const vehicle = record.vehicleId;
    if (vehicle && typeof vehicle === 'object' && vehicle.registrationNumber) {
      return `${vehicle.registrationNumber}${vehicle.brand ? ` - ${vehicle.brand}` : ''}`;
    }
    return 'N/A';
  };

  const getStatusBadge = (record: any) => {
    if (record.completedDate) {
      return <Badge variant="success">Complété</Badge>;
    }
    const scheduled = new Date(record.scheduledDate);
    const now = new Date();
    if (scheduled < now) {
      return <Badge variant="danger">En retard</Badge>;
    }
    return <Badge variant="warning">Planifié</Badge>;
  };

  const vehicles = formData.vehicleType === 'Truck' ? trucks : trailers;

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
          <h1 className="text-2xl font-bold text-white">Gestion de la Maintenance</h1>
          <Button onClick={handleAddNew} icon={<Plus size={18} />}>
            Nouvelle Maintenance
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
                placeholder="Rechercher par type ou véhicule..."
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Véhicule</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date prévue</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date complétée</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Coût</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900 divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      Chargement...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      Aucune maintenance trouvée
                    </td>
                  </tr>
                ) : filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                          <Wrench size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{getVehicleDisplay(record)}</div>
                          <div className="text-xs text-slate-500">{record.vehicleType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {new Date(record.scheduledDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {record.completedDate ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircle size={16} />
                          {new Date(record.completedDate).toLocaleDateString('fr-FR')}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {record.cost.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(record)} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 p-2 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteClick(record.id)} className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg transition-colors">
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
          title={editingRecord ? "Modifier Maintenance" : "Ajouter Maintenance"}
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Type de véhicule</label>
                <select 
                  value={formData.vehicleType} 
                  onChange={(e) => setFormData({...formData, vehicleType: e.target.value, vehicleId: ''})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  disabled={!!editingRecord}
                >
                  <option value="Truck">Camion</option>
                  <option value="Trailer">Remorque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Véhicule</label>
                <select 
                  value={formData.vehicleId} 
                  onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  required
                  disabled={!!editingRecord}
                >
                  <option value="">-- Sélectionner --</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type de maintenance</label>
              <input 
                type="text" 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                placeholder="Ex: Vidange, Révision, Réparation..."
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date prévue</label>
                <input 
                  type="datetime-local" 
                  value={formData.scheduledDate} 
                  onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date complétée (optionnel)</label>
                <input 
                  type="datetime-local" 
                  value={formData.completedDate} 
                  onChange={(e) => setFormData({...formData, completedDate: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Coût (€)</label>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={formData.cost} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setFormData({...formData, cost: val});
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Notes (optionnel)</label>
              <textarea 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                rows={3}
                placeholder="Détails supplémentaires..."
              />
            </div>
            <div className="mt-6 flex space-x-3">
              <Button type="button" variant="outline" className="flex-1 justify-center" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                Annuler
              </Button>
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
          title="Supprimer la maintenance"
          message="Êtes-vous sûr de vouloir supprimer cet enregistrement ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ isOpen: false, recordId: null })}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
