import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Auth } from 'src/guards/auth.decorator';
import { AuthenticatedRequest } from 'src/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  signup(@Body() userRequest: CreateUserDto) {
    return this.usersService.createUser(userRequest);
  }

  @Auth()
  @Put()
  updateUser(
    @Req() req: AuthenticatedRequest,
    @Body() userRequest: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user.uid, userRequest);
  }

  @Auth()
  @Get('/me')
  findMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.getMyProfile(req.user.uid);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserProfileById(id);
  }

  @Auth()
  @Delete()
  deleteAccount(@Req() req: AuthenticatedRequest) {
    return this.usersService.deleteUserAccount(req.user.uid);
  }
}
