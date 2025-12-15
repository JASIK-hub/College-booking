import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const Auth = () => {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('Authorization'),
  );
};
