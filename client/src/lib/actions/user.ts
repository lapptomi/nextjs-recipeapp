"use server";

import { apiClient } from "../apiClient";

import type { NewUser, UpdateUserRequest, User } from "@/types";

const endpoint = "/users";

export const createUser = async (data: NewUser) => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await apiClient.get<User>(`${endpoint}/${id}`);
  return response.data;
};

export const followUser = async (id: number) => {
  const response = await apiClient.post<void>(`${endpoint}/follow/${id}`);
  return response.data;
};

export const deleteUser = async () => {
  const response = await apiClient.delete<void>(`${endpoint}/me`);
  return response.data;
};

export const updateUser = async (data: UpdateUserRequest) => {
  const response = await apiClient.put<void>(`${endpoint}/me`, data);
  return response.data;
};

export const fetchUserFollowers = async (id: number) => {
  const response = await apiClient.get<User[]>(`${endpoint}/${id}/followers`);
  return response.data;
};

export const fetchUserFollowing = async (id: number) => {
  const response = await apiClient.get<User[]>(`${endpoint}/${id}/following`);
  return response.data;
};

export const unfollowUser = async (id: number) => {
  const response = await apiClient.delete<void>(`${endpoint}/${id}/followers`);
  return response.data;
};
