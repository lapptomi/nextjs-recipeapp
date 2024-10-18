import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { DecodedJwtTokenDto } from './dto/decoded-jwt-token.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  /*
    Middleware for checking if the user is authenticated and if is,
    set the token to the Express.Request object (@Request() request)
    so we can use it in the controllers (req.token).
    This middleware is triggered when we use the @UseGuards(AuthGuard) in the rest endpoints
  */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      request['token'] = this.jwtService.decode(token) as DecodedJwtTokenDto;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
