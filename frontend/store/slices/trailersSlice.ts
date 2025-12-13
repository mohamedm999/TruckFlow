import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface Trailer {
  id: string;
  registrationNumber: string;
  type: string;
  capacity: number;
  status: string;
}

interface TrailersState {
  trailers: Trailer[];
  selectedTrailer: Trailer | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TrailersState = {
  trailers: [],
  selectedTrailer: null,
  isLoading: false,
  error: null,
};

export const fetchTrailers = createAsyncThunk('trailers/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.getTrailers();
    const trailers = (response.data || []).map((trailer: any) => ({
      id: trailer._id,
      registrationNumber: trailer.registrationNumber,
      type: trailer.type,
      capacity: trailer.capacity,
      status: trailer.status
    }));
    return trailers;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createTrailer = createAsyncThunk('trailers/create', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.createTrailer(data);
    const trailer = response.data;
    return {
      id: trailer._id,
      registrationNumber: trailer.registrationNumber,
      type: trailer.type,
      capacity: trailer.capacity,
      status: trailer.status
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateTrailer = createAsyncThunk('trailers/update', async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await api.updateTrailer(id, data);
    const trailer = response.data;
    return {
      id: trailer._id,
      registrationNumber: trailer.registrationNumber,
      type: trailer.type,
      capacity: trailer.capacity,
      status: trailer.status
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteTrailer = createAsyncThunk('trailers/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.deleteTrailer(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const trailersSlice = createSlice({
  name: 'trailers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrailers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrailers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trailers = action.payload;
      })
      .addCase(fetchTrailers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createTrailer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTrailer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trailers = [...state.trailers, action.payload];
      })
      .addCase(createTrailer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTrailer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTrailer.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.trailers.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.trailers[index] = action.payload;
        }
      })
      .addCase(updateTrailer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTrailer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTrailer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trailers = state.trailers.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTrailer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = trailersSlice.actions;
export default trailersSlice.reducer;
