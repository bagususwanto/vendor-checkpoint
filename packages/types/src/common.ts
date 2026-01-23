export type SyncResult = {
  created: number;
  updated: number;
  total: number;
  syncTime: Date | string; // Date on backend, string (ISO) on frontend
};
