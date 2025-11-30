import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/back-end/core/db/entities/user-entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from 'src/back-end/core/config/env-keys';
import { TokenGenerationService } from './token-service';
import { UserService } from './user-service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private tokenService: TokenGenerationService,
  ) {}
  async registerUser(dto: UserEntity) {
    const salt = await bcrypt.genSalt(
      this.configService.get(ENV_KEYS.PASSWORD_HASH),
    );
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    await this.userService.createOne({
      ...dto,
      password: hashedPassword,
    });
    return await this.tokenService.generateTokens(dto);
  }
}
