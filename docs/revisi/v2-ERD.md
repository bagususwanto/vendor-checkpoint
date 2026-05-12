# 4. ERD — Versi 2.3 (Revisi Besar)

> Menggunakan ChartDB — DBML/Json
> **Versi:** 2.3 | **Tanggal Revisi:** 2026-05-12
> **Changelog v2.0:** Penambahan `ops_delivery_slot`, `mst_delay_reason`, `mst_vendor_schedule`; update kolom pada `ops_checkin_entry` dan `ops_timelog`.
> **Changelog v2.1:** Proses verifikasi Staff dinonaktifkan secara default. Alur menjadi fully self-service.
> **Changelog v2.2:** `ops_verification` dikembalikan via feature flag `VERIFICATION_MODE_ENABLED`.
> **Changelog v2.3:** Penambahan `ops_ppe_scan`, `ops_officer_discrepancy`, dan `ops_performance_adjustment`. Update field pada `mst_vendor_schedule` (rit, truck_station) dan `ops_checkin_entry`.

---

## Ringkasan Perubahan dari v1

| 🆕 Baru | `ops_performance_adjustment` | Log penyesuaian manual status performa oleh Section Head / Admin |
| 🆕 Baru | `ops_officer_discrepancy` | Penandaan ketidaksesuaian jawaban checklist oleh petugas lapangan |
| 🆕 Baru | `ops_ppe_scan` | Hasil verifikasi APD otomatis (Hardhat, Safety Vest) |
| 🔄 Update | `mst_vendor_schedule` | Tambah: `rit`, `truck_station` |
| 🔄 Update | `ops_checkin_entry` | Tambah: `dn_number`, `po_number`, `slot_id`, `arrival_status`, `delay_arrival_reason_id`, `ai_safety_status`. Status: `WAITING`, `AKTIF`, `SELESAI`, `DISETUJUI`, `DITOLAK`. |
| 🔄 Update | `ops_timelog` | Tambah: `departure_status`, `delay_departure_reason_id` |
| 🔄 Update | `ops_verification` | **Tetap ada** — hanya aktif jika `VERIFICATION_MODE_ENABLED = true` di `cfg_system` |
| 🔄 Update | `cfg_system` | Tambah key: `VERIFICATION_MODE_ENABLED` (BOOLEAN) untuk toggle fitur verifikasi |
| ✅ Tidak berubah | Semua tabel lain | `mst_vendor`, `mst_vendor_category`, `mst_checklist_*`, `mst_user`, `ops_queue_status`, `log_*` |

---

## DBML

```json
Table "mst_vendor_category" {
  "vendor_category_id" int [pk, not null, increment]
  "category_name" varchar(255) [unique, not null, note: 'e.g., Chemical, BBM, Sparepart & Tool']
  "category_code" varchar(50) [unique, not null]
  "description" text
  "is_active" boolean [not null, default: `true`]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    category_code [unique, name: "idx_mst_vendor_category_category_code"]
  }

  Note: 'Master kategori vendor untuk mengklasifikasikan vendor'
}

Table "mst_vendor" {
  "vendor_id" int [pk, not null, increment]
  "vendor_code" varchar(100) [unique, not null, note: 'External Vendor ID from sync']
  "company_name" varchar(500) [not null]
  "vendor_category_id" int [not null, ref: < "mst_vendor_category"."vendor_category_id"]
  "is_active" boolean [not null, default: `true`]
  "last_sync_time" datetime
  "sync_source" varchar(100) [note: 'External system source']
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    vendor_code [unique, name: "idx_mst_vendor_vendor_code"]
    (vendor_category_id, is_active) [name: "idx_mst_vendor_category_active"]
  }

  Note: 'Master data vendor dari sistem eksternal dengan kategori yang dikelola internal. FR-13'
}

// =====================================================
// 🆕 BARU v2: Master Jadwal Internal per Vendor
// =====================================================
Table "mst_vendor_schedule" {
  "schedule_id" int [pk, not null, increment]
  "vendor_id" int [not null, ref: < "mst_vendor"."vendor_id"]
  "day_of_week" int [not null, note: '1=Monday ... 7=Sunday']
  "rit" int [not null, default: 1]
  "arrival_time" varchar(10) [not null, note: 'HH:mm']
  "departure_time" varchar(10) [not null, note: 'HH:mm']
  "truck_station" varchar(100)
  "is_active" boolean [not null, default: `true`]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    (vendor_id, is_active) [name: "idx_mst_vendor_schedule_vendor_active"]
    (day_of_week, is_active) [name: "idx_mst_vendor_schedule_day_active"]
  }

  Note: 'Master jadwal kedatangan & keberangkatan vendor per hari. v2.3'
}

// =====================================================
// 🆕 BARU v2: Master Alasan Keterlambatan
// =====================================================
Table "mst_delay_reason" {
  "reason_id" int [pk, not null, increment]
  "reason_category" varchar(20) [not null, note: 'Arrival atau Departure']
  "reason_text" varchar(255) [not null, note: 'e.g., Macet Tol, Kendaraan Rusak, Proses Internal Pabrik Lama']
  "is_active" boolean [not null, default: `true`]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    (reason_category, is_active) [name: "idx_mst_delay_reason_category_active"]
  }

  Note: 'Master alasan keterlambatan. reason_category = Arrival | Departure. v2'
}

// =====================================================
// 🆕 BARU v2: Wadah Monitoring Cycle Harian
// =====================================================
Table "ops_delivery_slot" {
  "slot_id" int [pk, not null, increment]
  "schedule_id" int [not null, ref: < "mst_vendor_schedule"."schedule_id"]
  "expected_date" date [not null, note: 'Tanggal rencana kedatangan, e.g., 2026-04-17']
  "entry_id" int [null, note: 'Terisi otomatis saat vendor scan DN. NULL = Missed Cycle', ref: - "ops_checkin_entry"."entry_id"]
  "status" varchar(20) [not null, default: `Open`, note: 'Open | Filled | Missed']
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    (schedule_id, expected_date) [name: "idx_ops_delivery_slot_schedule_date"]
    (status, expected_date) [name: "idx_ops_delivery_slot_status_date"]
    entry_id [name: "idx_ops_delivery_slot_entry_id"]
  }

  Note: 'Wadah monitoring cycle harian. Dibuat otomatis setiap pagi dari mst_vendor_schedule. Jika entry_id NULL sampai EOD = Missed Cycle. v2'
}

Table "mst_checklist_category" {
  "checklist_category_id" int [pk, not null, increment]
  "category_name" varchar(255) [unique, not null, note: 'Safety, Quality, Productivity, Environment']
  "category_code" varchar(50) [unique, not null]
  "display_order" int [not null]
  "icon_name" varchar(100) [note: 'Lucide icon name']
  "color_code" varchar(50) [note: 'Tailwind color class']
  "description" text
  "is_active" boolean [not null, default: `true`]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    (is_active, display_order) [name: "idx_mst_checklist_category_active_order"]
  }

  Note: 'Kategori checklist: Safety, Quality, Productivity, Environment. FR-14'
}

Table "mst_checklist_item" {
  "checklist_item_id" int [pk, not null, increment]
  "checklist_category_id" int [not null, ref: < "mst_checklist_category"."checklist_category_id"]
  "item_code" varchar(100) [unique, not null]
  "item_text" text [not null, note: 'Pertanyaan checklist']
  "item_type" varchar(50) [not null, note: 'UMUM atau KHUSUS']
  "vendor_category_id" int [note: 'NULL untuk UMUM, ada value untuk KHUSUS', ref: < "mst_vendor_category"."vendor_category_id"]
  "display_order" int [not null]
  "is_required" boolean [not null, default: `true`]
  "is_active" boolean [not null, default: `true`]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    item_code [unique, name: "idx_mst_checklist_item_item_code"]
    (checklist_category_id, is_active, display_order) [name: "idx_mst_checklist_item_category_active_order"]
    (item_type, vendor_category_id, is_active) [name: "idx_mst_checklist_item_type_vendor_active"]
  }

  Note: 'Item checklist UMUM dan KHUSUS per kategori vendor. FR-14, NFR-O1: mereplikasi checklist manual'
}

Table "mst_user" {
  "user_id" int [pk, not null, increment]
  "external_user_id" int [unique, not null, note: 'User ID dari JWT eksternal']
  "username" varchar(255) [not null]
  "full_name" varchar(500) [not null]
  "role" varchar(50) [not null, note: 'Warehouse Staff, Group Leader, Section Head, Admin']
  "last_login" datetime
  "is_active" boolean [not null, default: `true`]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    external_user_id [unique, name: "idx_mst_user_external_user_id"]
  }

  Note: 'Data user dari JWT eksternal untuk audit dan tampilan. FR-07: Role-based access'
}

// =====================================================
// 🔄 UPDATE v2: ops_checkin_entry
// Tambah: dn_number, po_number, slot_id, arrival_status,
//         delay_arrival_reason_id, ai_safety_status
// =====================================================
Table "ops_checkin_entry" {
  "entry_id" int [pk, not null, increment, ref: < "ops_queue_status"."entry_id", ref: < "ops_timelog"."entry_id", ref: < "ops_verification"."entry_id", ref: < "ops_ppe_scan"."entry_id", ref: < "ops_officer_discrepancy"."entry_id", ref: < "ops_performance_adjustment"."entry_id"]
  "queue_number" varchar(50) [unique, not null, note: 'Format: YYYYMMDD-XXX']
  "vendor_id" int [not null, ref: < "mst_vendor"."vendor_id"]

  // 🆕 v2: Hasil scan DN & PO
  "dn_number" varchar(100) [null, note: 'Nomor DN hasil scan, e.g., 2100248426']
  "po_number" varchar(100) [null, note: 'Nomor PO hasil scan, e.g., 4550152955']

  // 🆕 v2: Relasi ke slot monitoring cycle
  "slot_id" int [null, ref: < "ops_delivery_slot"."slot_id", note: 'Dijodohkan otomatis ke slot paling awal yang Open']

  "driver_name" varchar(500) [not null]
  "snapshot_vendor_category_id" int [not null, note: 'Snapshot kategori vendor saat check-in', ref: < "mst_vendor_category"."vendor_category_id"]
  "snapshot_company_name" varchar(500) [not null, note: 'Snapshot nama perusahaan']
  "snapshot_category_name" varchar(255) [not null, note: 'Snapshot nama kategori']
  "submission_time" datetime [not null, default: `CURRENT_TIMESTAMP`]
  // v2.3: Status mendukung 2 mode:
  //   Self-Service mode: WAITING | AKTIF | SELESAI
  //   Verification mode: WAITING | DISETUJUI | DITOLAK | SELESAI
  "current_status" varchar(50) [not null, default: `WAITING`, note: 'WAITING | AKTIF | SELESAI | DISETUJUI | DITOLAK']

  // 🆕 v2: Status ketepatan waktu kedatangan
  "arrival_status" varchar(20) [null, note: 'On-Time | Late | Early']
  "delay_arrival_reason_id" int [null, ref: < "mst_delay_reason"."reason_id", note: 'Wajib diisi jika arrival_status = Late']

  // 🆕 v2: Hasil verifikasi APD oleh AI
  "ai_safety_status" varchar(20) [null, note: 'Pass | Fail — Hasil AI vision check APD']

  "device_identifier" varchar(255)
  "ip_address" varchar(50)
  "has_non_compliant_items" boolean [not null, default: `false`]
  "non_compliant_count" int [not null, default: 0]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    queue_number [unique, name: "idx_ops_checkin_entry_queue_number"]
    (current_status, submission_time) [name: "idx_ops_checkin_entry_status_time"]
    (submission_time, vendor_id) [name: "idx_ops_checkin_entry_time_vendor"]
    has_non_compliant_items [name: "idx_ops_checkin_entry_non_compliant"]
    slot_id [name: "idx_ops_checkin_entry_slot_id"]
    arrival_status [name: "idx_ops_checkin_entry_arrival_status"]
    dn_number [name: "idx_ops_checkin_entry_dn_number"]
  }

  Note: 'Entri check-in vendor. v2.3'
}

// =====================================================
// 🔄 OPSIONAL v2.2: ops_verification
// Aktif jika cfg_system.VERIFICATION_MODE_ENABLED = true.
// Jika false, tabel ini tidak diisi namun tetap ada di schema.
// Dapat diaktifkan kembali kapan saja tanpa perubahan struktur DB.
// =====================================================
Table "ops_verification" {
  "verification_id" int [pk, not null, increment]
  "entry_id" int [unique, not null, ref: - "ops_checkin_entry"."entry_id"]
  "verified_by_user_id" int [not null, ref: < "mst_user"."user_id"]
  "verification_status" varchar(50) [not null, note: 'DISETUJUI | DITOLAK']
  "rejection_reason" text [note: 'Wajib diisi jika DITOLAK']
  "verification_time" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    entry_id [unique, name: "idx_ops_verification_entry_id"]
    (verification_time, verification_status) [name: "idx_ops_verification_time_status"]
  }

  Note: 'Hasil verifikasi oleh Staff. OPSIONAL — hanya aktif jika cfg_system.VERIFICATION_MODE_ENABLED = true. FR-09 (opsional). v2.2'
}

Table "ops_checkin_response" {
  "response_id" int [pk, not null, increment]
  "entry_id" int [not null, ref: < "ops_checkin_entry"."entry_id"]
  "checklist_item_id" int [not null, ref: < "mst_checklist_item"."checklist_item_id"]
  "checklist_category_id" int [not null, ref: < "mst_checklist_category"."checklist_category_id"]
  "item_text_snapshot" text [not null, note: 'Snapshot pertanyaan saat dijawab']
  "item_type" varchar(50) [not null, note: 'UMUM/KHUSUS']
  "response_value" boolean [not null, note: 'TRUE = YA, FALSE = TIDAK']
  "is_compliant" boolean [not null, note: 'Inverse dari response jika pertanyaan safety-critical']
  "display_order" int [not null]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    entry_id [name: "idx_ops_checkin_response_entry_id"]
    (entry_id, is_compliant) [name: "idx_ops_checkin_response_entry_compliant"]
  }

  Note: 'Jawaban checklist per item. FR-03: Dynamic checklist dengan progress tracking'
}

Table "ops_verification" {
  "verification_id" int [pk, not null, increment]
  "entry_id" int [unique, not null]
  "verified_by_user_id" int [not null, ref: < "mst_user"."user_id"]
  "verification_status" varchar(50) [not null, note: 'DISETUJUI/DITOLAK']
  "rejection_reason" text [note: 'Wajib diisi jika REJECTED']
  "verification_time" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    entry_id [unique, name: "idx_ops_verification_entry_id"]
    (verification_time, verification_status) [name: "idx_ops_verification_time_status"]
  }

  Note: 'Hasil verifikasi oleh Petugas. FR-09: Approved/Rejected dengan alasan. NFR-O2: Audit trail'
}

// =====================================================
// 🔄 UPDATE v2: ops_timelog
// Tambah: departure_status, delay_departure_reason_id
// =====================================================
Table "ops_timelog" {
  "timelog_id" int [pk, not null, increment]
  "entry_id" int [unique, not null]
  "checkin_time" datetime [note: 'Diisi saat status APPROVED atau AKTIF']
  "checkout_time" datetime [note: 'Diisi sekali saat Check-Out / Departure Scan']
  "checkout_by_user_id" int [ref: < "mst_user"."user_id"]
  "duration_minutes" int [note: 'Calculated: checkout_time - checkin_time']
  "is_checked_out" boolean [not null, default: `false`]

  // 🆕 v2: Status ketepatan waktu keberangkatan
  "departure_status" varchar(20) [null, note: 'On-Time | Overdue']
  "delay_departure_reason_id" int [null, ref: < "mst_delay_reason"."reason_id", note: 'Wajib diisi jika departure_status = Overdue']

  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    entry_id [unique, name: "idx_ops_timelog_entry_id"]
    (is_checked_out, checkin_time) [name: "idx_ops_timelog_checkout_time"]
    departure_status [name: "idx_ops_timelog_departure_status"]
  }

  Note: 'Log waktu check-in dan check-out. v2.3'
}

// =====================================================
// 🆕 BARU v2.3: Hasil Scan PPE Otomatis
// =====================================================
Table "ops_ppe_scan" {
  "ppe_scan_id" int [pk, not null, increment]
  "entry_id" int [unique, not null]
  "has_hardhat" boolean [not null]
  "has_safety_vest" boolean [not null]
  "is_compliant" boolean [not null]
  "image_path" varchar(1000)
  "scan_time" datetime [not null]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    entry_id [unique, name: "idx_ops_ppe_scan_entry_id"]
    is_compliant [name: "idx_ops_ppe_scan_is_compliant"]
  }

  Note: 'Hasil verifikasi APD otomatis oleh AI. v2.3'
}

// =====================================================
// 🆕 BARU v2.3: Penandaan Diskrepansi Checklist
// =====================================================
Table "ops_officer_discrepancy" {
  "discrepancy_id" int [pk, not null, increment]
  "entry_id" int [not null]
  "response_id" int [null, ref: < "ops_checkin_response"."response_id"]
  "item_text_snapshot" text [not null]
  "officer_note" text
  "evidence_image_path" varchar(1000)
  "marked_by_user_id" int [not null, ref: < "mst_user"."user_id"]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    entry_id [name: "idx_ops_officer_discrepancy_entry_id"]
  }

  Note: 'Penandaan ketidaksesuaian jawaban vendor oleh petugas. v2.3'
}

// =====================================================
// 🆕 BARU v2.3: Penyesuaian Performa (Manual Adjustment)
// =====================================================
Table "ops_performance_adjustment" {
  "adjustment_id" int [pk, not null, increment]
  "entry_id" int [not null]
  "adjusted_by_user_id" int [not null, ref: < "mst_user"."user_id"]
  
  "original_arrival_status" varchar(50)
  "adjusted_arrival_status" varchar(50)
  
  "original_ai_safety_status" varchar(50)
  "adjusted_ai_safety_status" varchar(50)
  
  "original_ppe_compliant" boolean
  "adjusted_ppe_compliant" boolean
  
  "original_departure_status" varchar(50)
  "adjusted_departure_status" varchar(50)
  
  "override_has_non_compliant" boolean
  
  "adjustment_reason" text [not null]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    entry_id [name: "idx_ops_performance_adjustment_entry_id"]
    adjusted_by_user_id [name: "idx_ops_performance_adjustment_user_id"]
  }

  Note: 'Log penyesuaian manual status performa oleh atasan. v2.3'
}

Table "ops_queue_status" {
  "queue_status_id" int [pk, not null, increment]
  "entry_id" int [unique, not null]
  "queue_number" varchar(50) [not null]
  "current_status" varchar(50) [not null]
  "status_display_text" varchar(255) [not null, note: 'Text untuk display publik']
  "priority_order" int [note: 'Untuk sorting di TV Display']
  "estimated_wait_minutes" int [note: 'Future: estimasi waktu tunggu']
  "last_updated" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    entry_id [unique, name: "idx_ops_queue_status_entry_id"]
    (current_status, priority_order) [name: "idx_ops_queue_status_display"]
  }

  Note: 'Status antrean real-time untuk dashboard dan TV Display. FR-06: Auto-refresh'
}

Table "log_audit" {
  "audit_id" int [pk, not null, increment]
  "entry_id" int [ref: < "ops_checkin_entry"."entry_id"]
  "user_id" int [ref: < "mst_user"."user_id"]
  "action_type" varchar(100) [not null, note: 'CHECKIN/VERIFY/APPROVE/REJECT/CHECKOUT/SYNC/SLOT_MISSED']
  "action_description" text [not null]
  "old_value" text [note: 'JSON snapshot sebelum perubahan']
  "new_value" text [note: 'JSON snapshot setelah perubahan']
  "ip_address" varchar(50)
  "user_agent" varchar(500)
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    (created_at, action_type) [name: "idx_log_audit_time_action"]
    entry_id [name: "idx_log_audit_entry_id"]
  }

  Note: 'Log audit untuk semua aktivitas. NFR-O2: Audit trail minimal 1 tahun. v2: +SLOT_MISSED action_type'
}

Table "log_report_export" {
  "export_id" int [pk, not null, increment]
  "exported_by_user_id" int [not null, ref: < "mst_user"."user_id"]
  "report_type" varchar(100) [not null, note: 'DAILY/CUSTOM/COMPLIANCE/CYCLE_MONITORING']
  "date_from" datetime [not null]
  "date_to" datetime [not null]
  "filter_criteria" text [note: 'JSON filter yang digunakan']
  "total_records" int [not null]
  "file_name" varchar(500) [not null]
  "file_path" varchar(1000)
  "export_time" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    (export_time, report_type) [name: "idx_log_report_export_time_type"]
  }

  Note: 'Log export report. v2.3'
}

Table "cfg_system" {
  "config_id" int [pk, not null, increment]
  "config_key" varchar(255) [unique, not null]
  "config_value" text [not null]
  "config_type" varchar(50) [not null, note: 'STRING/INT/BOOLEAN/JSON']
  "description" text
  "is_editable" boolean [not null, default: `true`]
  "updated_by_user_id" int [ref: < "mst_user"."user_id"]
  "created_at" datetime [not null, default: `CURRENT_TIMESTAMP`]
  "updated_at" datetime [not null, default: `CURRENT_TIMESTAMP`]

  Indexes {
    config_key [unique, name: "idx_cfg_system_config_key"]
  }

  Note: 'Konfigurasi sistem. v2.2: Tambah key VERIFICATION_MODE_ENABLED (BOOLEAN) untuk toggle fitur verifikasi Staff. false = self-service mode, true = verification mode.'
}

```
