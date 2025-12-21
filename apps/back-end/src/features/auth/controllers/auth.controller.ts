import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Session,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { GenerateCodeDto } from '../dto/generate-code.dto';
import { LoginDto } from '../dto/login.dto';
import type { Request } from 'express';
import { SessionEmail } from 'src/core/decorators/session.decorator';
import { Auth } from 'src/core/decorators/auth.decorator';
import { RoleEnum } from 'src/core/db/enums/role.enum';
import { UserDto } from '../dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}
  @Post('generate/code')
  @ApiResponse({ status: 201, description: 'Code was sent to email' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'Generate user code' })
  async generateCode(@Body() dto: GenerateCodeDto, @Req() req: Request) {
    return await this.authService.generateCode(dto, req);
  }
  @Post('login')
  @ApiResponse({ status: 201, description: 'User succesfully loged in' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'Log in user' })
  async loginUser(@Body() dto: LoginDto, @Req() req: Request) {
    return await this.authService.login(dto, req);
  }
  @Auth()
  @Get('info')
  @ApiResponse({ status: 200, description: 'User info successfully obtained' })
  @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  @ApiOperation({ summary: 'Get single user info' })
  async getUserInfo(@Req() req: Request) {
    const email = (req as any).user.email;
    return await this.authService.getSingleUserInfo(req);
  }
  // @Auth()
  // @Get('info/all-users')
  // @ApiResponse({ status: 200, description: 'User info successfully obtained' })
  // @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  // @ApiOperation({ summary: 'Get all users info' })
  // async getAllUsersInfo() {
  //   return await this.authService.getAllUsersInfo();
  // }
  // @Auth([RoleEnum.ADMIN])
  // @Patch(':id/change')
  // @ApiResponse({ status: 200, description: 'User info successfully changed' })
  // @ApiResponse({ status: 400, description: 'Inaccurate request data' })
  // @ApiOperation({ summary: 'Change user info' })
  // async changeUserData(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() dto: UserDto,
  // ) {
  //   return await this.authService.changeUserInfo(id, dto);
  // }
}
