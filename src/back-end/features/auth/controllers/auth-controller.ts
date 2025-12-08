import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth-service';
import { UserLoginDto } from '../dto/login.dto';
import { UserDto } from '../dto/user.dto';
import { Auth } from 'src/back-end/core/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @ApiResponse({ status: 200, description: 'User successfuly registered' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'User registration' })
  async registerUser(@Body() dto: UserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'User successfuly logged in' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'User login' })
  async loginUser(@Body() dto: UserLoginDto) {
    return await this.authService.loginUser(dto);
  }
  @Auth()
  @Get('info')
  @ApiResponse({ status: 200, description: 'User info successfully obtained' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'Get single user info' })
  async getUserInfo(@Req() req) {
    const userId: number = req.user.id;
    return await this.authService.getSingleUserInfo(userId);
  }
  @Auth()
  @Get('info/all-users')
  @ApiResponse({ status: 200, description: 'User info successfully obtained' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'Get all users info' })
  async getAllUsersInfo() {
    return await this.authService.getAllUsersInfo();
  }
}
