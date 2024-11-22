import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LanguageDto } from '../types/enums';

export const Language = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const lang = request.headers['accept-language'];

    // Default language is EN if header is not provided
    return lang || LanguageDto.en;
  },
);
