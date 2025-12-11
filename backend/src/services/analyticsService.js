import Trip from '../models/Trip.js';
import FuelRecord from '../models/FuelRecord.js';
import Truck from '../models/Truck.js';

export const getAverageTripDistance = async () => {
  const trips = await Trip.find({ 
    status: 'Completed', 
    mileageStart: { $exists: true }, 
    mileageEnd: { $exists: true } 
  });
  
  if (trips.length === 0) return 0;
  
  const distances = trips.map(t => t.mileageEnd - t.mileageStart);
  return distances.reduce((a, b) => a + b, 0) / distances.length;
};

export const getTripFuelEfficiency = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip || !trip.mileageStart || !trip.mileageEnd) return 0;
  
  const fuelRecords = await FuelRecord.find({ truck: trip.truckId });
  if (fuelRecords.length === 0) return 0;
  
  const totalFuel = fuelRecords.reduce((sum, r) => sum + r.liters, 0);
  const distance = trip.mileageEnd - trip.mileageStart;
  
  return distance > 0 ? (totalFuel / distance) * 100 : 0;
};

export const getChauffeurPerformance = async (chauffeurId) => {
  const trips = await Trip.find({ chauffeurId, status: 'Completed' });
  
  const totalDistance = trips.reduce((sum, t) => {
    if (t.mileageEnd && t.mileageStart) {
      return sum + (t.mileageEnd - t.mileageStart);
    }
    return sum;
  }, 0);
  
  return {
    totalTrips: trips.length,
    totalDistance,
    completedTrips: trips.length
  };
};

export const getFleetStatistics = async () => {
  const [totalTrips, activeTrips, completedTrips, totalFuelRecords, totalTrucks, activeTrucks] = await Promise.all([
    Trip.countDocuments(),
    Trip.countDocuments({ status: { $in: ['Planned', 'InProgress'] } }),
    Trip.countDocuments({ status: 'Completed' }),
    FuelRecord.find(),
    Truck.countDocuments(),
    Truck.countDocuments({ status: 'Active' })
  ]);
  
  const totalFuelCost = totalFuelRecords.reduce((sum, r) => sum + (r.liters * r.pricePerLiter), 0);
  
  return {
    totalTrips,
    activeTrips,
    completedTrips,
    totalTrucks,
    activeTrucks,
    totalFuelCost: Math.round(totalFuelCost * 100) / 100
  };
};
