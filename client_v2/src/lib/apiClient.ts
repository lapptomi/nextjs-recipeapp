import { API_URL } from "../constants";
import { getStoredAuth, removeStoredAuth } from "./storage";

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const auth = getStoredAuth();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(auth?.token && { Authorization: `Bearer ${auth.token}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    removeStoredAuth();
    window.location.href = "/auth/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export const apiClient = {
  get: (path: string) => fetchWithAuth(path),
  post: (path: string, body: unknown) =>
    fetchWithAuth(path, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  postFormData: (path: string, body: FormData) =>
    fetchWithAuth(path, { method: "POST", body }),
  put: (path: string, body: unknown) =>
    fetchWithAuth(path, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  delete: (path: string) => fetchWithAuth(path, { method: "DELETE" }),
};
