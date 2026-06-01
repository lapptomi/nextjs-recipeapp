import { AUTH_STORAGE_KEY } from "../constants";
import type { AuthResponse } from "../types/auth";

export function getStoredAuth(): AuthResponse | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setStoredAuth(auth: AuthResponse): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function removeStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
