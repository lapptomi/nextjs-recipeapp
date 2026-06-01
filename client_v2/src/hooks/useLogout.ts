import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { removeStoredAuth } from "../lib/storage";

export function useLogout() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return () => {
    removeStoredAuth();
    setUser(null);
    navigate({ to: "/" });
  };
}
