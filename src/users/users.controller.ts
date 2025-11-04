import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  register(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }

  @Get()
  getAll() {
    return this.usersService.findAll();
  }
}
