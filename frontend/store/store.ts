import { configureStore } from '@reduxjs/toolkit';
import trucksReducer from './slices/trucksSlice';
import tripsReducer from './slices/tripsSlice';
import trailersReducer from './slices/trailersSlice';
import tiresReducer from './slices/tiresSlice';
import maintenanceReducer from './slices/maintenanceSlice';

export const store = configureStore({
  reducer: {
    trucks: trucksReducer,
    trips: tripsReducer,
    trailers: trailersReducer,
    tires: tiresReducer,
    maintenance: maintenanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
