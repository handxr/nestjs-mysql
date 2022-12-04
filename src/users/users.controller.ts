import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':userId')
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getUser(userId);
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.usersService.createUser(newUser);
  }

  @Patch(':userId')
  updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() user: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, user);
  }

  @Delete(':userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.deleteUser(userId);
  }

  @Post(':userId/profile')
  createProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() profile: CreateProfileDto,
  ) {
    return this.usersService.createProfile(userId, profile);
  }
}
