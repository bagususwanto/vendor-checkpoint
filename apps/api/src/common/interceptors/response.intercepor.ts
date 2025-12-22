import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return {
            status: true,
            message: response.message ?? 'OK',
            data: response.data,
          };
        }

        return {
          status: true,
          message: 'OK',
          data: response,
        };
      }),
    );
  }
}
