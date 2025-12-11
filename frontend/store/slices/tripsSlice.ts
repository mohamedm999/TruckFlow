import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { Trip } from '../../types';

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
    return response.data || [];
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchTrip = createAsyncThunk('trips/fetchOne', async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.getTrip(id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createTrip = createAsyncThunk('trips/create', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.createTrip(data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateTrip = createAsyncThunk('trips/update', async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await api.updateTrip(id, data);
    return response.data;
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
    clearSelectedTrip: (state) => {
      state.selectedTrip = null;
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
      .addCase(fetchTrip.fulfilled, (state, action) => {
        state.selectedTrip = action.payload;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.trips.push(action.payload);
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        const index = state.trips.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter(t => t.id !== action.payload);
      });
  },
});

export const { clearError, clearSelectedTrip } = tripsSlice.actions;
export default tripsSlice.reducer;
