import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Truck as TruckIcon } from 'lucide-react';
import { MOCK_TRUCKS } from '../constants';
import { Truck, TruckStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const TrucksPage: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>(MOCK_TRUCKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);

  const getStatusVariant = (status: TruckStatus) => {
    switch (status) {
      case TruckStatus.AVAILABLE: return 'success';
      case TruckStatus.IN_USE: return 'info';
      case TruckStatus.MAINTENANCE: return 'warning';
      case TruckStatus.OUT_OF_SERVICE: return 'danger';
      default: return 'default';
    }
  };

  const filteredTrucks = trucks.filter(truck => 
    truck.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this truck?')) {
      setTrucks(trucks.filter(t => t.id !== id));
    }
  };

  const handleEdit = (truck: Truck) => {
    setEditingTruck(truck);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTruck(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Gestion de Flotte</h1>
        <Button onClick={handleAddNew} icon={<Plus size={18} />}>
          Nouveau Camion
        </Button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par plaque ou marque..."
              className="pl-10 pr-4 py-2.5 w-full bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" icon={<Filter size={18} />}>
            Filtres
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Véhicule</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Modèle</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Année</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Kilométrage</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800">
              {filteredTrucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                            <TruckIcon size={20} />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-white">{truck.registrationNumber}</div>
                            <div className="text-xs text-slate-500">ID: {truck.id.toUpperCase()}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{truck.brand} <span className="text-slate-500">{truck.model}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{truck.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-300">{truck.mileage.toLocaleString()} km</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(truck.status)}>{truck.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(truck)} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 p-2 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(truck.id)} className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg transition-colors">
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
        title={editingTruck ? "Modifier Véhicule" : "Ajouter Véhicule"}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Immatriculation</label>
                <input type="text" defaultValue={editingTruck?.registrationNumber} className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Marque</label>
                    <input type="text" defaultValue={editingTruck?.brand} className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Modèle</label>
                    <input type="text" defaultValue={editingTruck?.model} className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Statut</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg text-white p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
                    {Object.values(TruckStatus).map(status => (
                        <option key={status} value={status} selected={editingTruck?.status === status}>{status}</option>
                    ))}
                </select>
            </div>
            <div className="mt-6 flex space-x-3">
                <Button type="button" variant="outline" className="flex-1 justify-center" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button type="submit" className="flex-1 justify-center">Sauvegarder</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};