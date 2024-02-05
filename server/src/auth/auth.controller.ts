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

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() credentials: LoginDto): Promise<{ token: string }> {
    return this.authService.login(credentials);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  findUserByToken(@Request() request): Promise<User> {
    return this.authService.getLoggedUser(request.token);
  }
}
