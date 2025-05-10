import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequiredRole } from 'src/common/decorators/roles.decorator';
import { Role } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @RequiredRole(Role.ADMIN)
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @RequiredRole(Role.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Data retrieved successfully',
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Data retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @RequiredRole(Role.ADMIN)
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Updated',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RequiredRole(Role.ADMIN)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
