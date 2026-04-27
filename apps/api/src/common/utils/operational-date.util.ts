/**
 * Utility to handle Operational Date logic based on a 07:15 AM cut-off.
 * Operational Day starts at 07:15 AM and ends at 07:14:59 AM the next day.
 */

/**
 * Returns the start of the Operational Date for a given timestamp.
 * Operational day in WIB (UTC+7). Cut-off is 07:15 AM WIB.
 */
export function getOperationalDate(date: Date = new Date()): Date {
  // Get current time in Jakarta
  const jakartaTime = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const hours = jakartaTime.getHours();
  const minutes = jakartaTime.getMinutes();

  const result = new Date(date);
  // If before 07:15 AM WIB, operational date is yesterday
  if (hours < 7 || (hours === 7 && minutes < 15)) {
    result.setDate(result.getDate() - 1);
  }

  // Normalize to start of day in local-relative terms, 
  // but we want the UTC date part to represent the operational date.
  // Using the same logic as SlotGeneratorJob for consistency.
  return new Date(
    Date.UTC(
      result.getFullYear(),
      result.getMonth(),
      result.getDate(),
      0, 0, 0, 0
    )
  );
}

/**
 * Calculates the full planned DateTime for a schedule based on the Operational Date.
 * Handles midnight crossings relative to WIB.
 */
export function getPlannedDateTime(operationalDate: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const plannedDate = new Date(operationalDate);

  // If the scheduled time is in the early morning WIB (before 07:15),
  // it belongs to the "next calendar day" relative to the operational date.
  if (hours < 7 || (hours === 7 && minutes < 15)) {
    plannedDate.setUTCDate(plannedDate.getUTCDate() + 1);
  }

  // Set time as WIB (UTC+7)
  plannedDate.setUTCHours(hours - 7, minutes, 0, 0);
  return plannedDate;
}
