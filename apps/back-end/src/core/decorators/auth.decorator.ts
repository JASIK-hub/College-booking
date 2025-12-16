import { ROLES_KEY } from '../guards/role.guard';
import { RoleEnum } from '../db/enums/role-enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../guards/role.guard';

export const Auth = (roles?: RoleEnum[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles ?? Object.values(RoleEnum)),
    UseGuards(JwtAuthGuard, RoleGuard),
    ApiBearerAuth('Authorization'),
  );
};
