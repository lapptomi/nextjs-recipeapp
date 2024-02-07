"use server";

import axios from "axios";

import { NEXT_APP_API_URL } from "../constants";

import type { NewUser } from "@/types";

export const createUser = async (data: NewUser) => {
  const response = await axios.post(`${NEXT_APP_API_URL}/api/users`, data);
  return response.data;
};