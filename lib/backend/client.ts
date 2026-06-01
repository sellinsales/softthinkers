import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL =
  (Constants.expoConfig?.extra?.backendApiBaseUrl as string | undefined)
  ?? 'https://lingohunt.softthinkers.com/api';

const TOKEN_KEY = 'lingohunt_api_token';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
  body?: unknown;
  auth?: boolean;
}

export async function saveApiToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getApiToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearApiToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getApiToken();
    if (!token) {
      throw new Error('Missing API token.');
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) as { ok?: boolean; data?: T; error?: string } : {};

  if (!response.ok || payload.ok === false) {
    throw new Error(payload.error ?? `Request failed: ${response.status}`);
  }

  return payload.data as T;
}

export { API_BASE_URL };
