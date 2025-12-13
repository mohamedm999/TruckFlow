import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { Truck } from '../../types';

interface TrucksState {
  trucks: Truck[];
  selectedTruck: Truck | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TrucksState = {
  trucks: [],
  selectedTruck: null,
  isLoading: false,
  error: null,
};

export const fetchTrucks = createAsyncThunk('trucks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.getTrucks();
    const trucks = (response.data || []).map((truck: any) => ({
      id: truck._id,
      registrationNumber: truck.registrationNumber,
      brand: truck.brand,
      model: truck.model,
      year: truck.year,
      mileage: truck.currentOdometer,
      status: truck.status
    }));
    return trucks;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchTruck = createAsyncThunk('trucks/fetchOne', async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.getTruck(id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createTruck = createAsyncThunk('trucks/create', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.createTruck(data);
    const truck = response.data;
    return {
      id: truck._id,
      registrationNumber: truck.registrationNumber,
      brand: truck.brand,
      model: truck.model,
      year: truck.year,
      mileage: truck.currentOdometer,
      status: truck.status
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateTruck = createAsyncThunk('trucks/update', async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await api.updateTruck(id, data);
    const truck = response.data;
    return {
      id: truck._id,
      registrationNumber: truck.registrationNumber,
      brand: truck.brand,
      model: truck.model,
      year: truck.year,
      mileage: truck.currentOdometer,
      status: truck.status
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteTruck = createAsyncThunk('trucks/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.deleteTruck(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const trucksSlice = createSlice({
  name: 'trucks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTruck: (state) => {
      state.selectedTruck = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrucks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrucks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trucks = action.payload;
      })
      .addCase(fetchTrucks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTruck.fulfilled, (state, action) => {
        state.selectedTruck = action.payload;
      })
      .addCase(createTruck.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTruck.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trucks = [...state.trucks, action.payload];
      })
      .addCase(createTruck.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTruck.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTruck.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.trucks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.trucks[index] = action.payload;
        }
      })
      .addCase(updateTruck.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTruck.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTruck.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trucks = state.trucks.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTruck.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedTruck } = trucksSlice.actions;
export default trucksSlice.reducer;
