const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
    this.accessToken = null;
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
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

  async login(email, password) {
    const response = await this.request('/auth/login', {
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
    return this.request('/auth/me');
  }

  async refreshToken() {
    const response = await this.request('/auth/refresh', {
      method: 'POST',
    });
    
    if (response.data?.accessToken) {
      this.setAccessToken(response.data.accessToken);
    }
    
    return response;
  }

  // Trucks
  async getTrucks() {
    return this.request('/trucks');
  }

  async getTruck(id) {
    return this.request(`/trucks/${id}`);
  }

  async createTruck(data) {
    return this.request('/trucks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTruck(id, data) {
    return this.request(`/trucks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTruck(id) {
    return this.request(`/trucks/${id}`, {
      method: 'DELETE',
    });
  }

  // Tires
  async getTires() {
    return this.request('/tires');
  }

  async getTire(id) {
    return this.request(`/tires/${id}`);
  }

  async createTire(data) {
    return this.request('/tires', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTire(id, data) {
    return this.request(`/tires/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTire(id) {
    return this.request(`/tires/${id}`, {
      method: 'DELETE',
    });
  }

  // Trailers
  async getTrailers() {
    return this.request('/trailers');
  }

  async getTrailer(id) {
    return this.request(`/trailers/${id}`);
  }

  async createTrailer(data) {
    return this.request('/trailers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTrailer(id, data) {
    return this.request(`/trailers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTrailer(id) {
    return this.request(`/trailers/${id}`, {
      method: 'DELETE',
    });
  }

  // Trips
  async getTrips() {
    return this.request('/trips');
  }

  async getTrip(id) {
    return this.request(`/trips/${id}`);
  }

  async createTrip(data) {
    return this.request('/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTrip(id, data) {
    return this.request(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTrip(id) {
    return this.request(`/trips/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTripStatus(id, data) {
    return this.request(`/trips/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateTripMileage(id, data) {
    return this.request(`/trips/${id}/mileage`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(data) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Maintenance
  async getMaintenance() {
    return this.request('/maintenance');
  }

  async getMaintenanceRecord(id) {
    return this.request(`/maintenance/${id}`);
  }

  async createMaintenance(data) {
    return this.request('/maintenance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMaintenance(id, data) {
    return this.request(`/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMaintenance(id) {
    return this.request(`/maintenance/${id}`, {
      method: 'DELETE',
    });
  }

  // Fuel
  async getFuelRecords() {
    return this.request('/fuel');
  }

  async getFuelRecord(id) {
    return this.request(`/fuel/${id}`);
  }

  async createFuelRecord(data) {
    return this.request('/fuel', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFuelRecord(id, data) {
    return this.request(`/fuel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFuelRecord(id) {
    return this.request(`/fuel/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }
}

export const api = new ApiService();
