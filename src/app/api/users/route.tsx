import * as bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

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

export const GET = async () => {
  try {
    const users = await getUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting user: ${error}` }, 
      { status: 400 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = UserSchema.parse(body);
    const hashedPassword = await bcrypt.hash(user.password, 10);
  
    const createdUser = await prisma.user.create({
      data: { ...user, password: hashedPassword }
    });

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error creating user: ${error}` }, 
      { status: 400 }
    );
  }
};

export const DELETE = async () => {
  try {
    // Allow DELETE only in test environment
    if (process.env.APP_ENV === "test") {
      await prisma.user.deleteMany();
    } else {
      return NextResponse.json(
        { error: "Error deleting user: DELETE not allowed" }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json({ status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error deleting user: ${error}` }, 
      { status: 400 }
    );
  }
};