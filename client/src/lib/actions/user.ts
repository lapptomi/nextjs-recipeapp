"use server";

import { apiClient } from "../apiClient";

import type { NewUser, UpdateUserRequest } from "@/types";

export const createUser = async (data: NewUser) => {
  const response = await apiClient.post("/users", data);
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const deleteUser = async () => {
  const response = await apiClient.delete(`/users/me`);
  return response.data;
};

export const updateUser = async (data: UpdateUserRequest) => {
  const response = await apiClient.put(`/users/me`, data);
  return response.data;
};
