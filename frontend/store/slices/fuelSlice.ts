import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface FuelRecord {
  id: string;
  truck: any;
  driver: any;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  fullTank: boolean;
}

interface FuelState {
  records: FuelRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FuelState = {
  records: [],
  isLoading: false,
  error: null,
};

export const fetchFuelRecords = createAsyncThunk('fuel/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.getFuelRecords();
    const records = (response.data || []).map((record: any) => {
      const mapped = {
        ...record,
        id: record._id || record.id
      };
      if (record.truck && typeof record.truck === 'object') {
        mapped.truck = { ...record.truck, id: record.truck._id || record.truck.id };
      }
      if (record.driver && typeof record.driver === 'object') {
        mapped.driver = { ...record.driver, id: record.driver._id || record.driver.id };
      }
      return mapped;
    });
    return records;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createFuelRecord = createAsyncThunk('fuel/create', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.createFuelRecord(data);
    const record = response.data;
    const mapped = {
      ...record,
      id: record._id || record.id
    };
    if (record.truck && typeof record.truck === 'object') {
      mapped.truck = { ...record.truck, id: record.truck._id || record.truck.id };
    }
    if (record.driver && typeof record.driver === 'object') {
      mapped.driver = { ...record.driver, id: record.driver._id || record.driver.id };
    }
    return mapped;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateFuelRecord = createAsyncThunk('fuel/update', async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await api.updateFuelRecord(id, data);
    const record = response.data;
    const mapped = {
      ...record,
      id: record._id || record.id
    };
    if (record.truck && typeof record.truck === 'object') {
      mapped.truck = { ...record.truck, id: record.truck._id || record.truck.id };
    }
    if (record.driver && typeof record.driver === 'object') {
      mapped.driver = { ...record.driver, id: record.driver._id || record.driver.id };
    }
    return mapped;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteFuelRecord = createAsyncThunk('fuel/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.deleteFuelRecord(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const fuelSlice = createSlice({
  name: 'fuel',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFuelRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFuelRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchFuelRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createFuelRecord.fulfilled, (state, action) => {
        state.records = [...state.records, action.payload];
      })
      .addCase(createFuelRecord.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateFuelRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      .addCase(updateFuelRecord.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteFuelRecord.fulfilled, (state, action) => {
        state.records = state.records.filter(r => r.id !== action.payload);
      })
      .addCase(deleteFuelRecord.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = fuelSlice.actions;
export default fuelSlice.reducer;
