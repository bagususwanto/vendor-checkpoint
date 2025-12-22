import { getClientIp } from './client-ip.util';
import { getDeviceIdentifier } from './device-identifier.util';

export function getRequestInfo(req: any) {
  return {
    ipAddress: getClientIp(req),
    deviceIdentifier: getDeviceIdentifier(req),
    userAgent: req.headers['user-agent'] ?? null,
  };
}
