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
}

export const api = new ApiService();
