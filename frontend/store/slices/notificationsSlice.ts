import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface Notification {
  id: string;
  userId: string;
  type: 'TripAssigned' | 'TripCompleted' | 'MaintenanceDue' | 'FuelAlert' | 'System';
  message: string;
  isRead: boolean;
  relatedEntity?: {
    entityType: string;
    entityId: string;
  };
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.getNotifications();
    const notifications = (response.data || []).map((n: any) => ({
      ...n,
      id: n._id || n.id
    }));
    return notifications;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.markNotificationAsRead(id);
    return { ...response.data, id: response.data._id || response.data.id };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const markAllAsRead = createAsyncThunk('notifications/markAllAsRead', async (_, { rejectWithValue }) => {
  try {
    await api.markAllNotificationsAsRead();
    return true;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n: Notification) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      });
  },
});

export const { clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
