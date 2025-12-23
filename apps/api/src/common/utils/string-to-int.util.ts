export function toInt(value: unknown, options?: { default?: number }): number {
  if (value === null || value === undefined || value === '') {
    return options?.default ?? 0;
  }

  const parsed = Number.parseInt(String(value), 10);

  if (Number.isNaN(parsed)) {
    return options?.default ?? 0;
  }

  return parsed;
}
