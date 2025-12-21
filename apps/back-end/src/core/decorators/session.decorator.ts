import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SessionEmail = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    console.log('session:', req.session);
    return (req.session as any)?.user?.email;
  },
);
