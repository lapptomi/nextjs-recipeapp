import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { DecodedJwtTokenDto } from './dto/decoded-jwt-token.dto';
import * as bcrypt from 'bcrypt';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login({ email, password }: LoginDto): Promise<JwtTokenDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      throw new UnauthorizedException("Passwords don't match");
    }

    return {
      token: this.jwtService.sign({ id: user.id }),
      userId: user.id,
      email: user.email,
      username: user.username,
    };
  }

  async getLoggedUser(token: DecodedJwtTokenDto): Promise<User> {
    const user = await this.userService.findById(token.id);
    return user;
  }
}
