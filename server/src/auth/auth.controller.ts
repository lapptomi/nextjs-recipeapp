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

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  findUserByToken(@Request() request) {
    return this.authService.decodeJwtToken(request.token);
  }
}
