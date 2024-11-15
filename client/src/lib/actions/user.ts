"use server";

import axios from "axios";

import { API_URL } from "../constants";

import type { NewUser } from "@/types";

export const createUser = async (data: NewUser) => {
  const response = await axios.post(`${API_URL}/users`, data);
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};
