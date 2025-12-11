import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import { Plus, Search, MapPin, Calendar, Truck, User, ArrowRight, Download, Clock } from 'lucide-react';
import { MOCK_TRIPS, MOCK_TRUCKS, MOCK_USERS, MOCK_TRAILERS } from '../constants';
import { Trip, TripStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';

export const TripsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  
  let displayTrips = MOCK_TRIPS;
  if (user?.role === 'chauffeur') {
    displayTrips = displayTrips.filter(t => t.chauffeurId === user.id);
  }

  const getStatusVariant = (status: TripStatus) => {
    switch (status) {
      case TripStatus.COMPLETED: return 'success';
      case TripStatus.IN_PROGRESS: return 'info';
      case TripStatus.PLANNED: return 'warning';
      case TripStatus.CANCELLED: return 'danger';
      default: return 'default';
    }
  };

  const getTruckReg = (id: string) => MOCK_TRUCKS.find(t => t.id === id)?.registrationNumber || 'Inconnu';
  const getDriver = (id: string) => MOCK_USERS.find(u => u.id === id);
  const getTrailer = (id?: string) => id ? MOCK_TRAILERS.find(t => t.id === id) : null;

  const handleDownloadPdf = (trip: Trip) => {
    const doc = new jsPDF();
    const driver = getDriver(trip.chauffeurId);
    const truck = MOCK_TRUCKS.find(t => t.id === trip.truckId);
    const trailer = getTrailer(trip.trailerId);

    // Header Background
    doc.setFillColor(234, 88, 12); // Orange-600
    doc.rect(0, 0, 210, 30, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("TruckFlow", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Rapport de Mission", 160, 20);

    // Trip Info Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`Trajet #${trip.id.toUpperCase()}`, 14, 50);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 56);

    // Status Badge Simulation
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(160, 42, 35, 10, 2, 2, 'FD');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(trip.status, 165, 48);

    // Details Grid
    let y = 75;
    
    // Route
    doc.setFontSize(14);
    doc.setTextColor(234, 88, 12); // Orange
    doc.setFont("helvetica", "bold");
    doc.text("Itinéraire", 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Départ:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(trip.origin, 50, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Arrivée:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(trip.destination, 50, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Distance:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${trip.distance} km`, 50, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Date Début:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(trip.startDate).toLocaleString(), 50, y);
    
    y += 20;

    // Logistics
    doc.setFontSize(14);
    doc.setTextColor(234, 88, 12);
    doc.setFont("helvetica", "bold");
    doc.text("Logistique & Véhicule", 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    doc.setFont("helvetica", "bold");
    doc.text("Chauffeur:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(driver ? `${driver.firstName} ${driver.lastName}` : 'N/A', 50, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Camion:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(truck ? `${truck.brand} ${truck.model} (${truck.registrationNumber})` : 'N/A', 50, y);
    y += 8;

    if (trailer) {
      doc.setFont("helvetica", "bold");
      doc.text("Remorque:", 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${trailer.type} (${trailer.registrationNumber})`, 50, y);
      y += 8;
    }

    // Footer
    doc.setDrawColor(234, 88, 12);
    doc.line(14, 280, 196, 280);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("TruckFlow Fleet Management System", 14, 285);

    doc.save(`Rapport_Trajet_${trip.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">
          {user?.role === 'chauffeur' ? 'Mes Trajets' : 'Gestion des Trajets'}
        </h1>
        {user?.role === 'admin' && (
          <Button icon={<Plus size={18} />}>Nouveau Trajet</Button>
        )}
      </div>

      <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 shadow-sm max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher destination..."
            className="pl-10 pr-4 py-2 w-full bg-slate-950/50 border-none rounded-lg text-slate-200 focus:ring-2 focus:ring-orange-500 placeholder-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Trip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayTrips.map((trip) => {
            const driver = getDriver(trip.chauffeurId);
            return (
                <div key={trip.id} className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-700 hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-5 border-b border-slate-800 bg-slate-900/50">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-mono text-slate-500">#{trip.id.toUpperCase()}</span>
                            <Badge variant={getStatusVariant(trip.status)}>{trip.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-3 mt-3">
                            {driver?.avatarUrl ? (
                                <img src={driver.avatarUrl} alt="Driver" className="w-10 h-10 rounded-full border-2 border-slate-700" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700">
                                    <User size={16} className="text-slate-400" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-white">{driver?.firstName} {driver?.lastName}</p>
                                <p className="text-xs text-slate-500">Chauffeur</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Route Graphic */}
                    <div className="p-5 relative flex-1">
                        {/* Connecting Line */}
                        <div className="absolute top-8 bottom-12 left-[29px] w-0.5 bg-slate-700 group-hover:bg-slate-600 transition-colors"></div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-start space-x-4">
                                <div className="w-5 h-5 rounded-full border-4 border-blue-500 bg-slate-900 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Origine</p>
                                    <p className="font-semibold text-slate-200 text-lg">{trip.origin}</p>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(trip.startDate).toLocaleDateString()} • 08:00</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-5 h-5 rounded-full border-4 border-orange-500 bg-slate-900 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Destination</p>
                                    <p className="font-semibold text-slate-200 text-lg">{trip.destination}</p>
                                    <p className="text-xs text-slate-500 mt-1">{trip.endDate ? new Date(trip.endDate).toLocaleDateString() : '--'} • --:--</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="bg-slate-950/50 px-5 py-4 border-t border-slate-800 flex justify-between items-center">
                        <div className="flex items-center space-x-2 text-slate-400">
                            <Truck size={16} />
                            <span className="text-sm font-medium text-slate-300">{getTruckReg(trip.truckId)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                             <span className="text-sm font-bold text-white">{trip.distance} km</span>
                             <Button 
                                size="sm" 
                                variant="outline" 
                                className="ml-2 !p-2 !h-8 w-8 !rounded-full flex items-center justify-center hover:!bg-orange-500 hover:!text-white hover:border-orange-500"
                                onClick={() => setSelectedTrip(trip)}
                                title="Voir détails"
                             >
                                <ArrowRight size={14} />
                             </Button>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      {/* Trip Detail Modal */}
      <Modal
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        title="Détails du Trajet"
      >
        {selectedTrip && (
            <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                {selectedTrip.destination}
                            </h3>
                            <p className="text-slate-400 text-sm">Depuis {selectedTrip.origin}</p>
                        </div>
                        <Badge variant={getStatusVariant(selectedTrip.status)}>{selectedTrip.status}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div className="bg-slate-900 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1 flex items-center"><Calendar size={12} className="mr-1"/> Départ</p>
                            <p className="text-slate-200 font-medium">{new Date(selectedTrip.startDate).toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1 flex items-center"><Truck size={12} className="mr-1"/> Distance</p>
                            <p className="text-slate-200 font-medium">{selectedTrip.distance} km</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Ressources Assignées</h4>
                    
                    <div className="flex items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-3">
                             <User size={20} className="text-slate-400"/>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Chauffeur</p>
                            <p className="text-sm text-white font-medium">
                                {getDriver(selectedTrip.chauffeurId)?.firstName} {getDriver(selectedTrip.chauffeurId)?.lastName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-3">
                             <Truck size={20} className="text-slate-400"/>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Camion</p>
                            <p className="text-sm text-white font-medium">
                                {getTruckReg(selectedTrip.truckId)}
                            </p>
                        </div>
                    </div>

                    {selectedTrip.trailerId && (
                        <div className="flex items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-3">
                                <Truck size={20} className="text-slate-400"/>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Remorque</p>
                                <p className="text-sm text-white font-medium">
                                    {getTrailer(selectedTrip.trailerId)?.registrationNumber} ({getTrailer(selectedTrip.trailerId)?.type})
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4 mt-2 border-t border-slate-700">
                    <Button 
                        onClick={() => handleDownloadPdf(selectedTrip)} 
                        className="w-full flex items-center justify-center"
                    >
                        <Download className="mr-2 h-5 w-5" />
                        Télécharger le Rapport (PDF)
                    </Button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};