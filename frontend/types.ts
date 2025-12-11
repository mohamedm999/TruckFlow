export enum UserRole {
  ADMIN = 'admin',
  CHAUFFEUR = 'chauffeur'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
}

export enum TruckStatus {
  AVAILABLE = 'Available',
  IN_USE = 'In Use',
  MAINTENANCE = 'Maintenance',
  OUT_OF_SERVICE = 'Out of Service'
}

export interface Truck {
  id: string;
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  status: TruckStatus;
}

export interface Trailer {
  id: string;
  registrationNumber: string;
  type: string;
  capacity: string;
  status: 'Available' | 'In Use' | 'Maintenance';
}

export enum TripStatus {
  PLANNED = 'Planned',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface Trip {
  id: string;
  truckId: string;
  trailerId?: string;
  chauffeurId: string;
  origin: string;
  destination: string;
  status: TripStatus;
  startDate: string;
  endDate?: string;
  distance?: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleType: 'Truck' | 'Trailer';
  description: string;
  date: string;
  cost: number;
  status: 'Scheduled' | 'Completed' | 'Overdue';
}

export interface FuelRecord {
  id: string;
  truckId: string;
  date: string;
  liters: number;
  cost: number;
  mileage: number;
}
