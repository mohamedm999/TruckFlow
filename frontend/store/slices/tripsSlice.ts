import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface Trip {
  id: string;
  tripId: string;
  truckId: any;
  trailerId?: any;
  chauffeurId: any;
  origin: string;
  destination: string;
  status: string;
  plannedDeparture?: string;
  actualDeparture?: string;
  actualArrival?: string;
  mileageStart?: number;
  mileageEnd?: number;
  notes?: string;
}

interface TripsState {
  trips: Trip[];
  selectedTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TripsState = {
  trips: [],
  selectedTrip: null,
  isLoading: false,
  error: null,
};

export const fetchTrips = createAsyncThunk('trips/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.getTrips();
    console.log('Fetched trips from API:', response.data);
    const trips = (response.data || []).map((trip: any) => {
      const mapped = {
        ...trip,
        id: trip._id || trip.id
      };
      // Preserve populated objects
      if (trip.truckId && typeof trip.truckId === 'object') {
        mapped.truckId = { ...trip.truckId, id: trip.truckId._id || trip.truckId.id };
      }
      if (trip.trailerId && typeof trip.trailerId === 'object') {
        mapped.trailerId = { ...trip.trailerId, id: trip.trailerId._id || trip.trailerId.id };
      }
      if (trip.chauffeurId && typeof trip.chauffeurId === 'object') {
        mapped.chauffeurId = { ...trip.chauffeurId, id: trip.chauffeurId._id || trip.chauffeurId.id };
      }
      return mapped;
    });
    return trips;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createTrip = createAsyncThunk('trips/create', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.createTrip(data);
    console.log('Created trip response:', response.data);
    const trip = response.data;
    const mapped = {
      ...trip,
      id: trip._id || trip.id
    };
    // Preserve populated objects
    if (trip.truckId && typeof trip.truckId === 'object') {
      mapped.truckId = { ...trip.truckId, id: trip.truckId._id || trip.truckId.id };
    }
    if (trip.trailerId && typeof trip.trailerId === 'object') {
      mapped.trailerId = { ...trip.trailerId, id: trip.trailerId._id || trip.trailerId.id };
    }
    if (trip.chauffeurId && typeof trip.chauffeurId === 'object') {
      mapped.chauffeurId = { ...trip.chauffeurId, id: trip.chauffeurId._id || trip.chauffeurId.id };
    }
    return mapped;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateTrip = createAsyncThunk('trips/update', async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await api.updateTrip(id, data);
    const trip = response.data;
    const mapped = {
      ...trip,
      id: trip._id || trip.id
    };
    // Preserve populated objects
    if (trip.truckId && typeof trip.truckId === 'object') {
      mapped.truckId = { ...trip.truckId, id: trip.truckId._id || trip.truckId.id };
    }
    if (trip.trailerId && typeof trip.trailerId === 'object') {
      mapped.trailerId = { ...trip.trailerId, id: trip.trailerId._id || trip.trailerId.id };
    }
    if (trip.chauffeurId && typeof trip.chauffeurId === 'object') {
      mapped.chauffeurId = { ...trip.chauffeurId, id: trip.chauffeurId._id || trip.chauffeurId.id };
    }
    return mapped;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteTrip = createAsyncThunk('trips/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.deleteTrip(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createTrip.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trips = [...state.trips, action.payload];
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTrip.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.trips.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
      })
      .addCase(updateTrip.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTrip.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trips = state.trips.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = tripsSlice.actions;
export default tripsSlice.reducer;
