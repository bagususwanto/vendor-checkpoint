import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../modules/audit/audit.service';
import { AUDIT_LOG_KEY, AuditLogOptions } from '../decorators/audit.decorator';
import { getRequestInfo } from '../utils/request-info.util';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditOptions = this.reflector.get<AuditLogOptions>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );

    if (!auditOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    // Assuming request.user is populated by JwtAuthGuard for authenticated routes
    // For public routes, it might be undefined, but the service might resolve it or return it in the response.

    return next.handle().pipe(
      tap(async (response) => {
        try {
          const requestInfo = getRequestInfo(request);
          let actionType = '';
          if (typeof auditOptions.actionType === 'function') {
            actionType = auditOptions.actionType(request, response);
          } else {
            actionType = auditOptions.actionType;
          }

          let actionDescription = '';
          if (typeof auditOptions.actionDescription === 'function') {
            actionDescription = auditOptions.actionDescription(
              request,
              response,
            );
          } else {
            actionDescription = auditOptions.actionDescription;
          }

          let details: any = {};
          if (auditOptions.buildDetails) {
            details = auditOptions.buildDetails(request, response);
          }

          // Resolve user_id:
          // 1. From details (if service returned resolved user_id)
          // 2. From request.user.userId (JWT)
          const userId = details.user_id || request.user?.userId;

          // If we still don't have a user_id for some reason (public endpoint),
          // we might want to log it as system or anonymous, but for now we follow the existing pattern
          // which requires a user_id.
          // However, existing code in CheckInService.create uses 'localUserId' which implies it handles looking up the user.
          // The service refactor should ensure 'user_id' is passed back in the response if it wasn't in the request.

          await this.auditService.create(null, {
            entry_id: details.entry_id,
            user_id: userId,
            action_type: actionType,
            action_description: actionDescription,
            old_value: details.old_value
              ? JSON.stringify(details.old_value)
              : undefined,
            new_value: details.new_value
              ? JSON.stringify(details.new_value)
              : undefined,
            ip_address: requestInfo.ipAddress,
            user_agent: requestInfo.userAgent,
          });
        } catch (error) {
          this.logger.error(
            `Failed to create audit log for ${context.getHandler().name}`,
            (error as Error).stack,
          );
        }
      }),
    );
  }
}
