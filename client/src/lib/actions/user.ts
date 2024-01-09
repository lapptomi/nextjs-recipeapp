"use server";

import axios from "axios";

import { BASE_URL } from "../constants";

import type { NewUser } from "@/types";


export const createUser = async (data: NewUser) => {
  const response = await axios.post(`${BASE_URL}/api/users`, data);
  return response.data;
};