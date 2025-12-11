import { Truck, TruckStatus, User, UserRole, Trip, TripStatus, MaintenanceRecord, Trailer } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'admin@truckflow.com',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    avatarUrl: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: 'u2',
    email: 'driver@truckflow.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.CHAUFFEUR,
    avatarUrl: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: 'u3',
    email: 'mike@truckflow.com',
    firstName: 'Mike',
    lastName: 'Smith',
    role: UserRole.CHAUFFEUR,
    avatarUrl: 'https://picsum.photos/200/200?random=3'
  }
];

export const MOCK_TRUCKS: Truck[] = [
  { id: 't1', registrationNumber: 'TX-123-AB', brand: 'Volvo', model: 'FH16', year: 2021, mileage: 125000, status: TruckStatus.AVAILABLE },
  { id: 't2', registrationNumber: 'TX-456-CD', brand: 'Scania', model: 'R500', year: 2022, mileage: 85000, status: TruckStatus.IN_USE },
  { id: 't3', registrationNumber: 'TX-789-EF', brand: 'Mercedes', model: 'Actros', year: 2020, mileage: 210000, status: TruckStatus.MAINTENANCE },
  { id: 't4', registrationNumber: 'TX-321-ZZ', brand: 'Volvo', model: 'FH', year: 2023, mileage: 45000, status: TruckStatus.AVAILABLE },
  { id: 't5', registrationNumber: 'TX-999-QQ', brand: 'DAF', model: 'XF', year: 2019, mileage: 340000, status: TruckStatus.IN_USE },
];

export const MOCK_TRAILERS: Trailer[] = [
  { id: 'tr1', registrationNumber: 'TL-101-AA', type: 'Refrigerated', capacity: '33 Pallets', status: 'Available' },
  { id: 'tr2', registrationNumber: 'TL-202-BB', type: 'Curtainsider', capacity: '34 Pallets', status: 'In Use' },
  { id: 'tr3', registrationNumber: 'TL-303-CC', type: 'Flatbed', capacity: '25 Tons', status: 'Maintenance' },
];

export const MOCK_TRIPS: Trip[] = [
  { id: 'trip1', truckId: 't2', trailerId: 'tr2', chauffeurId: 'u2', origin: 'New York, NY', destination: 'Chicago, IL', status: TripStatus.IN_PROGRESS, startDate: '2025-12-08T08:00:00', distance: 790 },
  { id: 'trip2', truckId: 't5', trailerId: 'tr1', chauffeurId: 'u3', origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', status: TripStatus.IN_PROGRESS, startDate: '2025-12-09T06:30:00', distance: 372 },
  { id: 'trip3', truckId: 't1', trailerId: 'tr3', chauffeurId: 'u2', origin: 'Houston, TX', destination: 'Dallas, TX', status: TripStatus.COMPLETED, startDate: '2025-12-05T09:00:00', endDate: '2025-12-05T14:00:00', distance: 240 },
  { id: 'trip4', truckId: 't4', chauffeurId: 'u3', origin: 'Miami, FL', destination: 'Orlando, FL', status: TripStatus.PLANNED, startDate: '2025-12-12T10:00:00', distance: 230 },
];

export const MOCK_MAINTENANCE: MaintenanceRecord[] = [
  { id: 'm1', vehicleId: 't3', vehicleType: 'Truck', description: 'Engine Oil Change', date: '2025-12-10', cost: 450, status: 'Scheduled' },
  { id: 'm2', vehicleId: 'tr3', vehicleType: 'Trailer', description: 'Brake Inspection', date: '2025-12-11', cost: 200, status: 'Scheduled' },
  { id: 'm3', vehicleId: 't1', vehicleType: 'Truck', description: 'Tire Rotation', date: '2025-11-20', cost: 150, status: 'Completed' },
];
