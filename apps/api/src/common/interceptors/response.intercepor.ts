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
        // Case: service return { data, meta?, message? }
        if (response && typeof response === 'object' && 'data' in response) {
          const { data, meta, message } = response as any;

          return {
            status: true,
            message: message ?? 'OK',
            data,
            ...(meta ? { meta } : {}),
          };
        }

        // Case: service return data langsung
        return {
          status: true,
          message: 'OK',
          data: response,
        };
      }),
    );
  }
}
