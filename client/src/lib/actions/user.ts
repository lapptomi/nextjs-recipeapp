"use server";

import axios from "axios";

import { API_URL } from "../constants";
import { getSession } from "./auth";

import type { NewUser, UpdateUserRequest } from "@/types";

export const createUser = async (data: NewUser) => {
  const response = await axios.post(`${API_URL}/users`, data);
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};

export const deleteUser = async () => {
  const session = await getSession();
  const response = await axios.delete(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${session?.user.jwt}`,
    },
  });
  return response.data;
};

export const updateUser = async (data: UpdateUserRequest) => {
  const session = await getSession();
  const response = await axios.put(`${API_URL}/users/me`, data, {
    headers: {
      Authorization: `Bearer ${session?.user.jwt}`,
    },
  });
  return response.data;
};
