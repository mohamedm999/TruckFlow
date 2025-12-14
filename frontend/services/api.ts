const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiService {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor() {
    this.baseURL = API_URL;
    // Token stored in memory only (more secure)
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    // No localStorage - token only in memory
  }

  getAccessToken() {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        // Dispatch 401 event for global logout
        if (response.status === 401) {
          window.dispatchEvent(new Event('unauthorized'));
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data?.accessToken) {
      this.setAccessToken(response.data.accessToken);
    }
    
    return response;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.setAccessToken(null);
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  async refreshToken() {
    const response = await this.request<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
    });
    
    if (response.data?.accessToken) {
      this.setAccessToken(response.data.accessToken);
    }
    
    return response;
  }

  // Trucks
  async getTrucks() {
    return this.request<any[]>('/trucks');
  }

  async getTruck(id: string) {
    return this.request<any>(`/trucks/${id}`);
  }

  async createTruck(data: any) {
    return this.request<any>('/trucks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTruck(id: string, data: any) {
    return this.request<any>(`/trucks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTruck(id: string) {
    return this.request<any>(`/trucks/${id}`, {
      method: 'DELETE',
    });
  }

  // Tires
  async getTires() {
    return this.request<any[]>('/tires');
  }

  async getTire(id: string) {
    return this.request<any>(`/tires/${id}`);
  }

  async createTire(data: any) {
    return this.request<any>('/tires', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTire(id: string, data: any) {
    return this.request<any>(`/tires/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTire(id: string) {
    return this.request<any>(`/tires/${id}`, {
      method: 'DELETE',
    });
  }

  // Trailers
  async getTrailers() {
    return this.request<any[]>('/trailers');
  }

  async getTrailer(id: string) {
    return this.request<any>(`/trailers/${id}`);
  }

  async createTrailer(data: any) {
    return this.request<any>('/trailers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTrailer(id: string, data: any) {
    return this.request<any>(`/trailers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTrailer(id: string) {
    return this.request<any>(`/trailers/${id}`, {
      method: 'DELETE',
    });
  }

  // Trips
  async getTrips() {
    return this.request<any[]>('/trips');
  }

  async getTrip(id: string) {
    return this.request<any>(`/trips/${id}`);
  }

  async createTrip(data: any) {
    return this.request<any>('/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTrip(id: string, data: any) {
    return this.request<any>(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTrip(id: string) {
    return this.request<any>(`/trips/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async getUser(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async createUser(data: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Maintenance
  async getMaintenance() {
    return this.request<any[]>('/maintenance');
  }

  async getMaintenanceRecord(id: string) {
    return this.request<any>(`/maintenance/${id}`);
  }

  async createMaintenance(data: any) {
    return this.request<any>('/maintenance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMaintenance(id: string, data: any) {
    return this.request<any>(`/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMaintenance(id: string) {
    return this.request<any>(`/maintenance/${id}`, {
      method: 'DELETE',
    });
  }

  // Fuel
  async getFuelRecords() {
    return this.request<any[]>('/fuel');
  }

  async getFuelRecord(id: string) {
    return this.request<any>(`/fuel/${id}`);
  }

  async createFuelRecord(data: any) {
    return this.request<any>('/fuel', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFuelRecord(id: string, data: any) {
    return this.request<any>(`/fuel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFuelRecord(id: string) {
    return this.request<any>(`/fuel/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications() {
    return this.request<any[]>('/notifications');
  }

  async markNotificationAsRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request<any>('/notifications/read-all', {
      method: 'PUT',
    });
  }
}

export const api = new ApiService();
