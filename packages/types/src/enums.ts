export enum UserRole {
  WAREHOUSE_STAFF = 'warehouse staff',
  GROUP_LEADER = 'group leader',
  SECTION_HEAD = 'section head',
  SUPER_ADMIN = 'super admin',
}

export enum QueueStatus {
  MENUNGGU = 'MENUNGGU',
  DISETUJUI = 'DISETUJUI',
  DITOLAK = 'DITOLAK',
  SELESAI = 'SELESAI',
}

export enum ChecklistItemType {
  UMUM = 'UMUM',
  KHUSUS = 'KHUSUS',
}

export enum AuditLogAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VERIFY = 'VERIFY',
  REJECT = 'REJECT',
  EXPORT = 'EXPORT',
}
