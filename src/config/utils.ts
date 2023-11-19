
import { UserSchema } from "@/types";

import type { NewUser} from "@/types";

export const parseNewUser = (user: NewUser): NewUser => {
  const parsedUser = UserSchema.parse(user);
  return parsedUser;
};