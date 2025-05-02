import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  signup(@Body() userRequest: CreateUserDto) {
    return this.usersService.createUser(userRequest);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() userRequest: UpdateUserDto) {
    return this.usersService.updateUser(id, userRequest);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserProfileById(id);
  }
}
