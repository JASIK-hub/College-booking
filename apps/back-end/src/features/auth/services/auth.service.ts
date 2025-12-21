import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenGenerationService } from './token.service';
import { GenerateCodeDto } from '../dto/generate-code.dto';
import { UserDto } from '../dto/user.dto';
import { LoginDto } from '../dto/login.dto';
import { SetCode } from 'src/core/helpers/set-code.helper';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { SendEmail } from 'src/core/helpers/send-email.helper';
import { Request } from 'express';
import { RoleEnum } from 'src/core/db/enums/role.enum';
import { FetchSheetsService } from 'src/features/sheets/services/sheets.service';
import { ENV_KEYS } from 'src/core/config/env-keys';
@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private tokenService: TokenGenerationService,
    private redisService: RedisService,
    private sheetsSerivce: FetchSheetsService,
  ) {}
  async generateCode(dto: GenerateCodeDto, req: Request) {
    //YOY MAY CHANGE THIS IF NEEDED
    const allowedDomen = this.configService.get(ENV_KEYS.ALLOWED_DOMEN);
    const exceptionEmail = this.configService.get(ENV_KEYS.EXCEPTIONAL_DOMEN);
    const users = await this.sheetsSerivce.getUsers();
    const userExists = users.some((user) => dto.email == user.email);
    const domen = dto.email.split('@')[1];
    if (dto.email !== exceptionEmail && domen !== allowedDomen) {
      throw new BadRequestException(
        `Email должен быть с доменом ${allowedDomen}`,
      );
    }
    if (!userExists) {
      throw new NotFoundException('Пользователь не найден');
    }

    (req.session as any).user = { email: dto.email };
    const code = await new SetCode(this.redisService).setCodeToRedis();
    await new SendEmail(this.configService).sendCodeEmail(dto.email, code);
    return true;
  }

  async login(dto: LoginDto, req: Request) {
    const sessionUser = (req as any).session?.user;
    if (!sessionUser?.email) {
      throw new BadRequestException('Код исчерпан используйте другой');
    }
    const email = sessionUser.email;
    const users = await this.sheetsSerivce.getUsers();
    const user = users.find((user) => email == user.email);
    if (!user) {
      throw new NotFoundException();
    }
    const allowedDomen = this.configService.get(ENV_KEYS.ALLOWED_DOMEN);
    const exceptionEmail = this.configService.get(ENV_KEYS.EXCEPTIONAL_DOMEN);
    const domen = email.split('@')[1];
    if (email !== exceptionEmail && domen !== allowedDomen) {
      throw new BadRequestException(
        `Email должен быть с доменом ${allowedDomen}`,
      );
    }
    const validCode = await new SetCode(this.redisService).getCodeFromRedis(
      dto.code,
    );
    if (!validCode) {
      throw new BadRequestException('Код не соответсвует');
    }

    const userRole = user.role == 'teacher' ? RoleEnum.TEACHER : RoleEnum.ADMIN;
    const userPayload: UserDto = {
      role: userRole,
      email: user.email,
    };
    return await this.tokenService.generateTokens(userPayload);
  }

  async getSingleUserInfo(req: Request) {
    const email = (req as any).user.identifier;
    const users = await this.sheetsSerivce.getUsers();
    const user = users.find((user) => email == user.email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }
  // async getAllUsersInfo() {
  //   const users = await this.userService.findAll();
  //   if (!users) {
  //     throw new NotFoundException('Пользователь не найден');
  //   }
  //   return users;
  // }
  // async changeUserInfo(userId: number, dto: UserDto) {
  //   let user = await this.userService.findOneBy({ id: userId });
  //   if (!user) {
  //     throw new NotFoundException('Пользователь не найден');
  //   }
  //   this.userService.updateOne(userId, dto);
  //   return await this.userService.findOneBy({ id: userId });
  // }
}
