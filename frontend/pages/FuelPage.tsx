import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Fuel, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFuelRecords, createFuelRecord, updateFuelRecord, deleteFuelRecord } from '../store/slices/fuelSlice';
import { fetchTrucks } from '../store/slices/trucksSlice';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const FuelPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const records = useAppSelector(state => state.fuel.records);
  const trucks = useAppSelector(state => state.trucks.trucks);
  const isLoading = useAppSelector(state => state.fuel.isLoading);
  const error = useAppSelector(state => state.fuel.error);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({
    truck: '',
    date: '',
    odometer: 0,
    liters: 0,
    pricePerLiter: 0,
    fullTank: true
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; recordId: string | null }>({ isOpen: false, recordId: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFuelRecords());
    dispatch(fetchTrucks());
  }, [dispatch]);

  const filteredRecords = records.filter(record => 
    (record.truck && typeof record.truck === 'object' && 
     record.truck.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, recordId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.recordId) return;
    
    const result = await dispatch(deleteFuelRecord(deleteConfirm.recordId));
    
    if (deleteFuelRecord.fulfilled.match(result)) {
      setToast({ message: 'Enregistrement supprimé avec succès', type: 'success' });
    } else {
      setToast({ message: 'Erreur lors de la suppression', type: 'error' });
    }
    
    setDeleteConfirm({ isOpen: false, recordId: null });
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      truck: record.truck?._id || record.truck,
      date: record.date ? new Date(record.date).toISOString().slice(0, 16) : '',
      odometer: record.odometer || 0,
      liters: record.liters || 0,
      pricePerLiter: record.pricePerLiter || 0,
      fullTank: record.fullTank !== undefined ? record.fullTank : true
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setFormData({
      truck: '',
      date: new Date().toISOString().slice(0, 16),
      odometer: 0,
      liters: 0,
      pricePerLiter: 0,
      fullTank: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.truck || !formData.date || !formData.odometer || !formData.liters || !formData.pricePerLiter) {
      setToast({ message: 'Veuillez remplir tous les champs requis', type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    
    const cleanData = {
      truck: formData.truck,
      date: formData.date,
      odometer: formData.odometer,
      liters: formData.liters,
      pricePerLiter: formData.pricePerLiter,
      fullTank: formData.fullTank
    };
    
    if (editingRecord) {
      const result = await dispatch(updateFuelRecord({ id: editingRecord.id, data: cleanData }));
      if (updateFuelRecord.fulfilled.match(result)) {
        setIsModalOpen(false);
        setToast({ message: 'Enregistrement modifié avec succès', type: 'success' });
      } else {
        setToast({ message: (result.payload as string) || 'Erreur lors de la modification', type: 'error' });
      }
    } else {
      const result = await dispatch(createFuelRecord(cleanData));
      if (createFuelRecord.fulfilled.match(result)) {
        setIsModalOpen(false);
        setToast({ message: 'Enregistrement créé avec succès', type: 'success' });
      } else {
        setToast({ message: (result.payload as string) || 'Erreur lors de la création', type: 'error' });
      }
    }
    
    setIsSubmitting(false);
  };

  const getTruckDisplay = (record: any) => {
    const truck = record.truck;
    if (truck && typeof truck === 'object' && truck.registrationNumber) {
      return `${truck.registrationNumber}${truck.brand ? ` - ${truck.brand}` : ''}`;
    }
    return 'N/A';
  };

  const getDriverDisplay = (record: any) => {
    const driver = record.driver;
    if (driver && typeof driver === 'object' && driver.firstName) {
      return `${driver.firstName} ${driver.lastName}`;
    }
    return 'N/A';
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
          <h1 className="text-2xl font-bold text-white">Gestion du Carburant</h1>
          <Button onClick={handleAddNew} icon={<Plus size={18} />}>
            Nouveau Plein
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
                placeholder="Rechercher par véhicule..."
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Chauffeur</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Kilométrage</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Litres</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Prix/L</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900 divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      Chargement...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      Aucun enregistrement trouvé
                    </td>
                  </tr>
                ) : filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                          <Fuel size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{getTruckDisplay(record)}</div>
                          <div className="text-xs text-slate-500">{record.fullTank ? 'Plein complet' : 'Plein partiel'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{getDriverDisplay(record)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {new Date(record.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {record.odometer.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {record.liters.toFixed(2)} L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {record.pricePerLiter.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {record.totalCost.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user?.role === UserRole.ADMIN && (
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(record)} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 p-2 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteClick(record.id)} className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
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
          title={editingRecord ? "Modifier Plein" : "Ajouter Plein"}
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Camion</label>
              <select 
                value={formData.truck} 
                onChange={(e) => setFormData({...formData, truck: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                required
                disabled={!!editingRecord}
              >
                <option value="">-- Sélectionner --</option>
                {trucks.map(truck => (
                  <option key={truck.id} value={truck.id}>
                    {truck.registrationNumber} - {truck.brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                <input 
                  type="datetime-local" 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Kilométrage</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.odometer} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) setFormData({...formData, odometer: val});
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Litres</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={formData.liters} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) setFormData({...formData, liters: val});
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Prix par litre (€)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={formData.pricePerLiter} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) setFormData({...formData, pricePerLiter: val});
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" 
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={formData.fullTank} 
                onChange={(e) => setFormData({...formData, fullTank: e.target.checked})}
                className="w-4 h-4 text-orange-500 bg-slate-800 border-slate-700 rounded focus:ring-orange-500"
              />
              <label className="ml-2 text-sm text-slate-300">Plein complet</label>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <div className="text-sm text-slate-400">Coût total estimé:</div>
              <div className="text-2xl font-bold text-white">
                {(formData.liters * formData.pricePerLiter).toFixed(2)} €
              </div>
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
          title="Supprimer l'enregistrement"
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
