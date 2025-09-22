import { Platform } from 'react-native';

// Adjust this BASE_URL for your environment if needed
// If testing on Android emulator use 10.0.2.2 to access the host machine
const DEFAULT_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:2000',
  ios: 'http://localhost:2000',
  default: 'http://localhost:2000',
});

export const BASE_URL = DEFAULT_BASE_URL!;

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

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg = (data as any)?.message || `Request failed with status ${res.status}`;
    throw { response: { data: { message: msg }, status: res.status } };
  }
  return data as T;
}

async function postJSON<T>(path: string, body: any): Promise<T> {
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
  return postJSON<AuthResponse>('/auth/signup', input);
}

export async function loginDriver(input: { email: string; password: string }) {
  return postJSON<AuthResponse>('/auth/login', input);
}

// Buses
export async function getCities() {
  return getJSON<{ cities: string[] }>('/buses/cities');
}

export async function getBuses(city?: string) {
  const q = city ? `?city=${encodeURIComponent(city)}` : '';
  return getJSON<{ buses: Bus[] }>(`/buses${q}`);
}
