import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";

import type { Session} from "next-auth";

export const getSession = async (): Promise<Session | null> => {
  const session = await getServerSession(options);
  return session;
};