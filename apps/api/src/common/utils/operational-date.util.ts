/**
 * Utility to handle Operational Date logic based on a 07:15 AM cut-off.
 * Operational Day starts at 07:15 AM and ends at 07:14:59 AM the next day.
 */

/**
 * Returns the start of the Operational Date for a given timestamp.
 * If time is before 07:15 AM, it returns the start of the previous day.
 */
export function getOperationalDate(date: Date = new Date()): Date {
  const result = new Date(date);
  const hours = result.getHours();
  const minutes = result.getMinutes();

  // If before 07:15 AM, operational date is yesterday
  if (hours < 7 || (hours === 7 && minutes < 15)) {
    result.setDate(result.getDate() - 1);
  }

  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Calculates the full planned DateTime for a schedule based on the Operational Date.
 * Handles midnight crossings: if the scheduled time is before 07:15 AM,
 * it's treated as H+1 from the operational date.
 * 
 * @param operationalDate The start of the operational day (00:00:00)
 * @param timeStr Schedule time in "HH:mm" format
 */
export function getPlannedDateTime(operationalDate: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const plannedDate = new Date(operationalDate);

  // If the scheduled time is in the early morning (before cut-off),
  // it belongs to the "next calendar day" relative to the operational date.
  if (hours < 7 || (hours === 7 && minutes < 15)) {
    plannedDate.setDate(plannedDate.getDate() + 1);
  }

  plannedDate.setHours(hours, minutes, 0, 0);
  return plannedDate;
}
