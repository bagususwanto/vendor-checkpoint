export function getDeviceIdentifier(req: any): string {
  return (
    (req.headers['x-device-id'] as string) ||
    req.headers['user-agent'] ||
    'UNKNOWN_DEVICE'
  );
}
