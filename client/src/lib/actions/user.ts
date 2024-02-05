"use server";

import axios from "axios";

import config from "../config";

import type { NewUser } from "@/types";

export const createUser = async (data: NewUser) => {
  const response = await axios.post(`${config.BASE_URL}/api/users`, data);
  return response.data;
};