import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_KEY = 'audit_log';

export interface AuditLogOptions {
  actionType: string | ((req: any, res: any) => string);
  actionDescription: string | ((req: any, res: any) => string);
  buildDetails?: (
    req: any,
    res: any,
  ) => {
    entry_id?: number;
    old_value?: any;
    new_value?: any;
    user_id?: number;
  };
}

export const AuditLog = (options: AuditLogOptions) =>
  SetMetadata(AUDIT_LOG_KEY, options);
