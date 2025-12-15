import bcrypt from 'bcryptjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from 'src/core/config/env-keys';
import { TokenGenerationService } from './token.service';
import { UserService } from './user.service';
import { UserLoginDto } from '../dto/login.dto';
import { GenerateTokenDto } from '../dto/generate-token.dto';
import { UserDto } from '../dto/user.dto';
import { UserResponseDto } from '../dto/response/user-response.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private tokenService: TokenGenerationService,
  ) {}
  async registerUser(dto: UserDto) {
    const userExists = await this.userService.findOneBy({ email: dto.email });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await this.hashPassword(dto.password);
    await this.userService.createOne({
      ...dto,
      password: hashedPassword,
    });
  }
  async loginUser(dto: UserLoginDto) {
    const user = await this.userService.findOneBy({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('User is not authorized');
    }
    await this.validatePassword(dto.password, user.password);
    const userPayload: GenerateTokenDto = {
      id: user.id,
      email: user.email,
    };
    return await this.tokenService.generateTokens(userPayload);
  }

  async getSingleUserInfo(userId: number): Promise<UserResponseDto> {
    const user = await this.userService.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    };
  }
  async getAllUsersInfo(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    if (!users) {
      throw new NotFoundException('No users found');
    }
    return users.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    }));
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(
      Number(this.configService.get(ENV_KEYS.PASSWORD_HASH)),
    );
    return await bcrypt.hash(password, salt);
  }
  async validatePassword(password: string, userPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
  }
}
