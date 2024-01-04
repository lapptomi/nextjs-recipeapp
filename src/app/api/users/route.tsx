import { NextResponse } from "next/server";

import userService from "../_services/userService";

import type { NextRequest} from "next/server";

export const GET = async () => {
  try {
    const users = await userService.getAll();
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
    const createdUser = await userService.create(req);
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
    await userService.deleteAll();
    return NextResponse.json({ status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error deleting user: ${error}` }, 
      { status: 400 }
    );
  }
};