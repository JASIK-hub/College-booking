import { TokenGenerationService } from './../../features/auth/services/token.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokenService: TokenGenerationService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const header = req.headers.authorization;
      const accessToken = header.split(' ')[1];
      const payload = this.tokenService.validateToken(accessToken);
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
