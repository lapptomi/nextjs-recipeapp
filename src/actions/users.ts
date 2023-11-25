"use server";

import * as bcrypt from "bcryptjs";

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
  
export const findById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id  },
      include: { 
        recipes: {
          include: {
            author: true
          }
        }
      }
    });
    return user;
  } catch (error) {
    throw new Error(error as any);
  }
};
  
export const create = async (user: NewUser) => {
  try {
    const validatedUser = UserSchema.parse(user);
    const hashedPassword = await bcrypt.hash(validatedUser.password, 10);

    const createdUser = await prisma.user.create({
      data: {
        ...validatedUser,
        password: hashedPassword,
      }
    });
    return createdUser;
  } catch (error) {
    throw new Error(error as any);
  }
};
  
export const deleteById = async (id: number) => {
  try {
    const deletedUser = await prisma.user.delete({ where: { id } });
    return deletedUser;
  } catch (error) {
    throw new Error(error as any);
  }
};