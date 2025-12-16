import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const initialState = {
  records: [],
  isLoading: false,
  error: null,
};

export const fetchMaintenance = createAsyncThunk('maintenance/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.getMaintenance();
    const records = (response.data || []).map((record) => {
      const mapped = {
        ...record,
        id: record._id || record.id
      };
      if (record.vehicleId && typeof record.vehicleId === 'object') {
        mapped.vehicleId = { ...record.vehicleId, id: record.vehicleId._id || record.vehicleId.id };
      }
      return mapped;
    });
    return records;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createMaintenance = createAsyncThunk('maintenance/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.createMaintenance(data);
    const record = response.data;
    const mapped = {
      ...record,
      id: record._id || record.id
    };
    if (record.vehicleId && typeof record.vehicleId === 'object') {
      mapped.vehicleId = { ...record.vehicleId, id: record.vehicleId._id || record.vehicleId.id };
    }
    return mapped;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateMaintenance = createAsyncThunk('maintenance/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.updateMaintenance(id, data);
    const record = response.data;
    const mapped = {
      ...record,
      id: record._id || record.id
    };
    if (record.vehicleId && typeof record.vehicleId === 'object') {
      mapped.vehicleId = { ...record.vehicleId, id: record.vehicleId._id || record.vehicleId.id };
    }
    return mapped;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteMaintenance = createAsyncThunk('maintenance/delete', async (id, { rejectWithValue }) => {
  try {
    await api.deleteMaintenance(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMaintenance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchMaintenance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.records = [...state.records, action.payload];
      })
      .addCase(createMaintenance.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        const index = state.records.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      .addCase(updateMaintenance.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.records = state.records.filter(r => r.id !== action.payload);
      })
      .addCase(deleteMaintenance.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
