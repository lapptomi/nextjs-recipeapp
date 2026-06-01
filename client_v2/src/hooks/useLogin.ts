import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { apiClient } from "../lib/apiClient";
import { setStoredAuth } from "../lib/storage";
import { useAuth } from "../contexts/AuthContext";
import type { AuthResponse, AuthUser, LoginCredentials } from "../types/auth";

export function useLogin() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials): Promise<AuthResponse> =>
      apiClient.post("/auth/login", credentials),
    onSuccess: async (data) => {
      setStoredAuth(data);
      const user: AuthUser = await apiClient.get("/auth/me");
      setUser(user);
      navigate({ to: "/" });
    },
  });
}
