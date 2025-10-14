

// Adjust this BASE_URL for your environment if needed
// If testing on Android emulator use 10.0.2.2 to access the host machine
//let DEFAULT_BASE_URL = 'http://localhost:2000';
// 

import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

let DEFAULT_BASE_URL = "https://bustrac-backend.onrender.com";

export const BASE_URL = DEFAULT_BASE_URL;



// Platform.select({
//   android: 'http://10.0.2.2:2000',
//   ios: 'http://localhost:2000',
//   default: 'http://localhost:2000',
// });

//192.168.1.31



export type AuthResponse = {
  token: string;
  driver: {
    _id: string;
    name: string;
    email: string;
    city: string;
    activeBus?: string;
    createdAt: string;
    __v?: number;
  };
};

export type Bus = {
  _id: string;
  busNumber: string;
  image?: string;
  city: string;
  totalSeats: number;
  status?: string;
};

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem('driver_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

async function getJSON<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg = (data as any)?.message || `Request failed with status ${res.status}`;
    throw { response: { data: { message: msg }, status: res.status } };
  }
  return data as T;
}

async function postJSON<T>(path: string, body: any): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error('Invalid JSON response');
  }
  if (!res.ok) {
    const msg = data?.message || `Request failed with status ${res.status}`;
    throw { response: { data: { message: msg }, status: res.status } };
  }
  return data as T;
}

// Public endpoints (no auth required)
async function postJSONPublic<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error('Invalid JSON response');
  }
  if (!res.ok) {
    const msg = data?.message || `Request failed with status ${res.status}`;
    throw { response: { data: { message: msg }, status: res.status } };
  }
  return data as T;
}

export async function signupDriver(input: { name: string; email: string; password: string; city: string }) {
  return postJSONPublic<AuthResponse>('/auth/signup', input);
}

export async function loginDriver(input: { email: string; password: string }) {
  return postJSONPublic<AuthResponse>('/auth/login', input);
}

// Buses
export async function getCities() {
  return getJSON<{ cities: string[] }>('/buses/cities');
}

export async function getBuses(city?: string) {
  const q = city ? `?city=${encodeURIComponent(city)}` : '';
  return getJSON<{ buses: Bus[] }>(`/buses${q}`);
}

// Assign a bus to a driver (and vice versa)
export async function assignBusToDriver(input: { busId: string; driverId: string }) {
  return postJSON<{ message: string; bus: any; driver: any }>(`/buses/assign`, input);
}

export async function createTrip(input: {
  busId: string;
  driverId: string;
  source: string;
  destination: string;
  sourceCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
}) {
  return postJSON<{ message: string; trip: any }>(`/trips/create`, input);
}
