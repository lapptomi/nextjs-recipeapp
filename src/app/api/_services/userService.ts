/* eslint-disable import/no-anonymous-default-export */
import * as bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { UserSchema } from "@/types";

import type { Prisma } from "@prisma/client";
import type { NextRequest} from "next/server";

const getUsers = async () => {
  const users = await prisma.user.findMany({
    include: { 
      recipes: {
        include: {
          author: true
        }
      }
    }
  });

  return users;
};

export type AllUsersWithRelations = Prisma.PromiseReturnType<typeof getUsers>;

export default {
  async getAll() {
    const users = await getUsers();
    return users;
  },

  async create (req: NextRequest) {
    const body = await req.json();
    const user = UserSchema.parse(body);
    const hashedPassword = await bcrypt.hash(user.password, 10);
  
    const createdUser = await prisma.user.create({
      data: { ...user, password: hashedPassword }
    });

    return createdUser;
  },

  async deleteAll() {
    // Allow DELETE only in test environment
    if (process.env.APP_ENV === "test") {
      await prisma.user.deleteMany();
    } else {
      throw new Error("Not allowed");
    }
  },
};