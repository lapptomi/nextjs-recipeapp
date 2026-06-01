import { redirect } from "@tanstack/react-router";
import { getStoredAuth } from "./storage";

export function requireAuth() {
  if (!getStoredAuth()) {
    throw redirect({ to: "/auth/login" });
  }
}
