import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth-service';
import { UserEntity } from 'src/back-end/core/db/entities/user-entity';

@Controller('user/auth')
export class UserController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @ApiResponse({ status: 200, description: 'User successfuly registered' })
  @ApiOperation({ description: 'User registration' })
  async registerUser(dto: UserEntity) {
    return this.authService.registerUser(dto);
  }
}
