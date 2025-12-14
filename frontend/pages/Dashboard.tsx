import React, { useEffect, useState } from 'react';
import { 
  Truck, 
  Map, 
  AlertTriangle, 
  Fuel, 
  Calendar as CalendarIcon,
  CheckCircle2,
  Wrench,
  Container
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Button } from '../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTrucks } from '../store/slices/trucksSlice';
import { fetchTrailers } from '../store/slices/trailersSlice';
import { fetchTires } from '../store/slices/tiresSlice';
import { fetchTrips } from '../store/slices/tripsSlice';
import { fetchMaintenance } from '../store/slices/maintenanceSlice';
import { fetchFuelRecords } from '../store/slices/fuelSlice';

// Mock Data for Charts
const TIRE_STATUS_DATA = [
  { name: 'Good', value: 475, color: '#10b981' }, // emerald-500
  { name: 'Warning', value: 37, color: '#f59e0b' }, // amber-500
  { name: 'Critical', value: 12, color: '#ef4444' }, // red-500
];

const TIRE_WEAR_DATA = [
  { month: 'Jan', wear: 20 },
  { month: 'Feb', wear: 22 },
  { month: 'Mar', wear: 25 },
  { month: 'Apr', wear: 28 },
  { month: 'May', wear: 35 },
  { month: 'Jun', wear: 42 },
  { month: 'Jul', wear: 45 },
  { month: 'Aug', wear: 50 },
];

const VEHICLE_TIRE_STATS = [
  { id: 'V-102', name: 'Volvo FH16', status: 92, lastCheck: '2 days ago', mechanic: 'Jean D.' },
  { id: 'V-104', name: 'Renault T', status: 45, lastCheck: 'Today', mechanic: 'Marc P.' },
  { id: 'V-105', name: 'Scania R500', status: 78, lastCheck: '1 week ago', mechanic: 'Sophie L.' },
  { id: 'V-108', name: 'DAF XF', status: 15, lastCheck: 'Urgent', mechanic: 'Pending' },
];

// Reusable Dashboard Card
const DashboardCard = ({ title, children, action, className = '' }: any) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl ${className}`}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        {title.icon && <span className="text-orange-500">{title.icon}</span>}
        <h2 className="text-lg font-semibold text-white tracking-wide">{title.text}</h2>
      </div>
      {action && action}
    </div>
    {children}
  </div>
);

// Calendar Widget Component
const CalendarWidget = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const today = new Date().getDate();
  const scheduledDays = [5, 12, 18, 25];
  const urgentDays = [10, 23];

  return (
    <div className="grid grid-cols-7 gap-2 text-center text-sm">
      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
        <div key={d} className="text-slate-500 font-medium py-2">{d}</div>
      ))}
      {days.map(day => {
        let bgClass = 'hover:bg-slate-800 text-slate-300';
        if (day === today) bgClass = 'bg-orange-500 text-white shadow-lg shadow-orange-500/30';
        else if (scheduledDays.includes(day)) bgClass = 'bg-slate-800 border border-slate-700 text-blue-400';
        else if (urgentDays.includes(day)) bgClass = 'bg-slate-800 border border-slate-700 text-red-400';

        return (
          <div key={day} className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all ${bgClass}`}>
            {day}
          </div>
        );
      })}
    </div>
  );
};

// Tire Donut Chart Component
const TireDonut = ({ percentage, label, color }: any) => {
  const data = [
    { value: percentage, color: color },
    { value: 100 - percentage, color: '#1e293b' }
  ];

  return (
    <div className="relative flex flex-col items-center">
      <div className="h-24 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={32}
              outerRadius={42}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
      <span className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const trucks = useAppSelector(state => state.trucks.trucks);
  const trailers = useAppSelector(state => state.trailers.trailers);
  const tires = useAppSelector(state => state.tires.tires);
  const trips = useAppSelector(state => state.trips.trips);
  const maintenance = useAppSelector(state => state.maintenance.records);
  const fuelRecords = useAppSelector(state => state.fuel.records);

  useEffect(() => {
    dispatch(fetchTrucks());
    dispatch(fetchTrailers());
    dispatch(fetchTires());
    dispatch(fetchTrips());
    dispatch(fetchMaintenance());
    dispatch(fetchFuelRecords());
  }, [dispatch]);

  // Calculate stats
  const activeTrucks = trucks.filter((t: any) => t.status === 'Active').length;
  const activeTrips = trips.filter(t => t.status === 'InProgress' || t.status === 'Planned').length;
  const upcomingMaintenance = maintenance.filter(m => !m.completedDate && new Date(m.scheduledDate) > new Date()).slice(0, 3);
  const totalFuelCost = fuelRecords.reduce((sum, r) => sum + r.totalCost, 0);
  
  // Tire stats
  const goodTires = tires.filter(t => t.wearLevel >= 70).length;
  const warningTires = tires.filter(t => t.wearLevel >= 30 && t.wearLevel < 70).length;
  const criticalTires = tires.filter(t => t.wearLevel < 30).length;

  const TIRE_STATUS_DATA = [
    { name: 'Good', value: goodTires, color: '#10b981' },
    { name: 'Warning', value: warningTires, color: '#f59e0b' },
    { name: 'Critical', value: criticalTires, color: '#ef4444' },
  ];

  // Fuel trend data (last 8 months)
  const fuelTrendData = Array.from({ length: 8 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (7 - i));
    const monthName = month.toLocaleDateString('fr-FR', { month: 'short' });
    const monthRecords = fuelRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getMonth() === month.getMonth() && recordDate.getFullYear() === month.getFullYear();
    });
    const totalLiters = monthRecords.reduce((sum, r) => sum + r.liters, 0);
    return { month: monthName, liters: Math.round(totalLiters) };
  });

  return (
    <div className="space-y-6">
      
      {/* Top Row: Calendar & Tire Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Widget */}
        <div className="lg:col-span-5">
            <DashboardCard 
                title={{ text: "Calendrier de Maintenance", icon: <CalendarIcon size={20} /> }}
                action={<Button variant="outline" className="text-xs px-3 py-1.5">Voir Tout</Button>}
                className="h-full"
            >
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <p className="text-sm text-slate-400">Interventions à venir</p>
                        <p className="text-3xl font-bold text-white mt-1">{upcomingMaintenance.length}</p>
                    </div>
                    <div className="flex space-x-2 text-xs">
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-400 mr-1"></span> Prévu</span>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-400 mr-1"></span> Urgent</span>
                    </div>
                </div>
                <CalendarWidget />
            </DashboardCard>
        </div>

        {/* Tire Visual Widget */}
        <div className="lg:col-span-7">
            <DashboardCard 
                title={{ text: "Gestion des Pneus", icon: <CheckCircle2 size={20} /> }}
                className="h-full relative overflow-hidden"
            >
                <div className="flex flex-col md:flex-row items-center justify-around h-full py-4 relative z-10">
                    <TireDonut percentage={92} label="Avant Gauche" color="#10b981" />
                    
                    {/* Simplified Truck Graphic */}
                    <div className="hidden md:block w-64 h-32 relative opacity-80 mx-4">
                         <Truck size={120} className="text-slate-700 w-full h-full absolute top-0 left-0" strokeWidth={0.5} />
                    </div>

                    <TireDonut percentage={45} label="Arrière Droit" color="#f59e0b" />
                    <TireDonut percentage={88} label="Remorque" color="#3b82f6" />
                </div>
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-0"></div>
            </DashboardCard>
        </div>
      </div>

      {/* Middle Row: Interventions & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Interventions List */}
        <DashboardCard 
            title={{ text: "Interventions à Venir", icon: <AlertTriangle size={20} /> }}
            action={<span className="text-xs text-slate-500 cursor-pointer hover:text-white transition-colors">Tout Afficher</span>}
        >
            <div className="space-y-4">
                {upcomingMaintenance.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">Aucune maintenance à venir</p>
                ) : upcomingMaintenance.map((item) => {
                    const isOverdue = new Date(item.scheduledDate) < new Date();
                    const vehicleName = item.vehicleId && typeof item.vehicleId === 'object' ? item.vehicleId.registrationNumber : 'N/A';
                    return (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg ${isOverdue ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                    <Wrench size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{item.type}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{vehicleName} • {new Date(item.scheduledDate).toLocaleDateString('fr-FR')}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                 <span className="text-sm font-bold text-slate-300">{item.cost.toFixed(2)} €</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </DashboardCard>

        {/* Tire Status Table */}
        <DashboardCard 
            title={{ text: "État des Pneus par Véhicule", icon: <Truck size={20} /> }}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-slate-500 border-b border-slate-800">
                            <th className="pb-3 font-medium">Véhicule</th>
                            <th className="pb-3 font-medium">Santé</th>
                            <th className="pb-3 font-medium text-right">Dernier Check</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {VEHICLE_TIRE_STATS.map((v) => (
                            <tr key={v.id} className="group hover:bg-slate-800/30 transition-colors">
                                <td className="py-3 pr-4">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${v.status < 30 ? 'bg-red-500' : v.status < 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                        <span className="font-medium text-slate-300 group-hover:text-white">{v.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 pr-4 w-1/3">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${v.status < 30 ? 'bg-red-500' : v.status < 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${v.status}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-slate-500 w-8 text-right">{v.status}%</span>
                                    </div>
                                </td>
                                <td className="py-3 text-right text-slate-400">{v.lastCheck}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
      </div>

      {/* Bottom Row: Stats Cards + Chart */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Camions Actifs</p>
              <p className="text-3xl font-bold text-white mt-2">{activeTrucks}</p>
              <p className="text-xs text-slate-500 mt-1">sur {trucks.length} total</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Truck size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Trajets Actifs</p>
              <p className="text-3xl font-bold text-white mt-2">{activeTrips}</p>
              <p className="text-xs text-slate-500 mt-1">en cours/planifiés</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Map size={24} className="text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Remorques</p>
              <p className="text-3xl font-bold text-white mt-2">{trailers.length}</p>
              <p className="text-xs text-slate-500 mt-1">total</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Container size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Coût Carburant</p>
              <p className="text-3xl font-bold text-white mt-2">{totalFuelCost.toFixed(0)} €</p>
              <p className="text-xs text-slate-500 mt-1">total</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Fuel size={24} className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Large Chart */}
      <DashboardCard title={{ text: "Consommation de Carburant", icon: <Fuel size={20} /> }}>
         <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelTrendData}>
                <defs>
                  <linearGradient id="colorWear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="liters" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorWear)" />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </DashboardCard>
    </div>
  );
};