import { ApiResponse } from "@/types/api";

const isServer = typeof window === "undefined";
export const API_BASE_URL = isServer ? "https://api.chranico.com" : "";
export interface StoreSettings {
  phone: string;
  whatsapp: string;
}

export async function getStoreSettings() {
  return fetchApi<StoreSettings>("/api/site/store-settings");
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    
    // Some endpoints return { status: true, data: [...] }
    // Others might return just the array [...]
    if (json && typeof json === 'object' && 'data' in json) {
      return json.data as T;
    }
    
    return json as T;
  } catch (error) {
    console.error(`Fetch error at ${endpoint}:`, error);
    throw error;
  }
  
}
