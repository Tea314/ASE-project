import type { User } from '../types';
import { safeStorage } from '../utils/safeStorage';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:8000/api/v1';

export interface LoginResponse {
  id: number;
  email: string;
  role: string;
  full_name: string;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(errorData.detail || 'An unknown error occurred');
    }

    const data: LoginResponse = await response.json();

    // Adapt the API response to the User type
    const user: User = {
      id: data.id.toString(),
      full_name: data.full_name,
      email: data.email,
      // Adapt role to fit existing 'admin' | 'employee' type
      role: data.role.toLowerCase() === 'student' ? 'student' : 'lecturer',
      department: 'Unknown', // API doesn't provide department, default value
    };

    return user;
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/signout`, { // Assuming a logout endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
      // Even if the backend call fails, we clear the frontend state
    } finally {
      safeStorage.removeItem('user');
    }
  },

  async signup(
    email: string,
    password: string,
    fullName: string,
    role: 'student' | 'lecturer'
  ): Promise<{ email: string; role: string; full_name: string }> {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        role,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Signup failed' }));
      throw new Error(errorData.detail || 'An unknown error occurred');
    }

    return response.json();
  },

  // async getUserClaims(): Promise<User> {
  //   try {
  //     await fetch(`${API_BASE_URL}/`, { // Assuming a logout endpoint
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //     });
  //   } catch (error) {
  //     console.error('Cannot request profile failed:', error);
  //     // Even if the backend call fails, we clear the frontend state
  //   } finally {
  //     safeStorage.removeItem('user');
  //   }
  // },
};

