import { configureStore } from '@reduxjs/toolkit';
import trucksReducer from './slices/trucksSlice';
import tripsReducer from './slices/tripsSlice';
import trailersReducer from './slices/trailersSlice';

export const store = configureStore({
  reducer: {
    trucks: trucksReducer,
    trips: tripsReducer,
    trailers: trailersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
