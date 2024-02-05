import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { User } from 'src/users/entities/user.entity';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { Request as ExpressRequest } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() credentials: LoginDto): Promise<JwtTokenDto> {
    return this.authService.login(credentials);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  findUserByToken(@Request() request: ExpressRequest): Promise<User> {
    return this.authService.getLoggedUser(request.token);
  }
}
