// src/types/express/index.d.ts

import { DecodedJwtTokenDto } from 'src/auth/dto/decoded-jwt-token.dto';

declare global {
  namespace Express {
    export interface Request {
      token: DecodedJwtTokenDto;
    }
  }
}
