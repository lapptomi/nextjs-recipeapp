"use server";

import axios from "axios";

import { API_URL } from "../constants";

import type { NewUser, User } from "@/types";

export const createUser = async (data: NewUser) => {
  const response = await axios.post<User>(`${API_URL}/users`, data);
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await axios.get<User>(`${API_URL}/users/${id}`);
  return response.data;
};
