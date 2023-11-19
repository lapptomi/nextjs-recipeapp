"use server";

import { prisma } from "../config/db";
import { UserSchema } from "../types";

import type { NewUser} from "../types";
import type { User } from "@prisma/client";

export const getAll = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany({
      include: { recipes: true }
    });
    return users;
  } catch (error) {
    throw new Error(error as any);
  }
};
  
export const findById = async (id: number): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    throw new Error(error as any);
  }
};
  
export const create = async (newUser: NewUser): Promise<User | null> => {
  try {
    const validatedUser = UserSchema.parse(newUser);
    const createdUser = await prisma.user.create({ data: validatedUser });
    return createdUser;
  } catch (error) {
    throw new Error(error as any);
  }
};
  
export const deleteById = async (id: number): Promise<User | null> => {
  try {
    const deletedUser = await prisma.user.delete({ where: { id } });
    return deletedUser;
  } catch (error) {
    throw new Error(error as any);
  }
};