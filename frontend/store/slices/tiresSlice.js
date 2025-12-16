import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const initialState = {
  tires: [],
  selectedTire: null,
  isLoading: false,
  error: null,
};

export const fetchTires = createAsyncThunk('tires/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.getTires();
    const tires = (response.data || []).map((tire) => ({
      id: tire._id,
      serialNumber: tire.serialNumber,
      brand: tire.brand,
      size: tire.size,
      status: tire.status,
      vehicleType: tire.vehicleType,
      vehicleId: tire.vehicleId,
      mileageAtInstall: tire.mileageAtInstall,
      wearLevel: tire.wearLevel
    }));
    return tires;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createTire = createAsyncThunk('tires/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.createTire(data);
    const tire = response.data;
    return {
      id: tire._id,
      serialNumber: tire.serialNumber,
      brand: tire.brand,
      size: tire.size,
      status: tire.status,
      vehicleType: tire.vehicleType,
      vehicleId: tire.vehicleId,
      mileageAtInstall: tire.mileageAtInstall,
      wearLevel: tire.wearLevel
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateTire = createAsyncThunk('tires/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.updateTire(id, data);
    const tire = response.data;
    return {
      id: tire._id,
      serialNumber: tire.serialNumber,
      brand: tire.brand,
      size: tire.size,
      status: tire.status,
      vehicleType: tire.vehicleType,
      vehicleId: tire.vehicleId,
      mileageAtInstall: tire.mileageAtInstall,
      wearLevel: tire.wearLevel
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteTire = createAsyncThunk('tires/delete', async (id, { rejectWithValue }) => {
  try {
    await api.deleteTire(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const tiresSlice = createSlice({
  name: 'tires',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTires.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTires.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tires = action.payload;
      })
      .addCase(fetchTires.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createTire.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTire.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tires = [...state.tires, action.payload];
      })
      .addCase(createTire.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateTire.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTire.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tires.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tires[index] = action.payload;
        }
      })
      .addCase(updateTire.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteTire.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTire.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tires = state.tires.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTire.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = tiresSlice.actions;
export default tiresSlice.reducer;
