import { configureStore } from '@reduxjs/toolkit';
import trucksReducer from './slices/trucksSlice';
import tripsReducer from './slices/tripsSlice';
import trailersReducer from './slices/trailersSlice';
import tiresReducer from './slices/tiresSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import fuelReducer from './slices/fuelSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    trucks: trucksReducer,
    trips: tripsReducer,
    trailers: trailersReducer,
    tires: tiresReducer,
    maintenance: maintenanceReducer,
    fuel: fuelReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
