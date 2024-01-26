// src/types/express/index.d.ts

import { DecodedJwtTokenDto } from 'src/auth/dto/decoded-jwt-token.dto';

// to make the file a module and avoid the TypeScript error

declare global {
  namespace Express {
    export interface Request {
      token: DecodedJwtTokenDto;
    }
  }
}
