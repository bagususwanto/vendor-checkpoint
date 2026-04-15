# 2. System Requirement Specs — Versi 2 (Revisi Besar)

> **Versi:** 2.2 | **Tanggal Revisi:** 2026-04-15
> **Changelog v2.0:** Penambahan FR untuk Delivery Slot Monitoring, Scan DN/PO, AI Safety Check, Departure Scan, Missed Cycle Detection.
> **Changelog v2.1:** Proses verifikasi Staff dinonaktifkan secara default (self-service mode).
> **Changelog v2.2:** Verifikasi Staff **dikembalikan sebagai fitur opsional** yang dikontrol via `cfg_system.VERIFICATION_MODE_ENABLED`. Dapat diaktifkan kembali kapan saja tanpa perubahan struktur database.

---

# **1. Functional Requirements (FR)**

| **ID** | **Nama Modul** | **Deskripsi Kebutuhan Fungsional** | **Target User** |
| --- | --- | --- | --- |
| **FR-01** | Public Landing Page | Menampilkan halaman publik berisi tombol "Mulai Check-In". Tampilan high contrast, font besar. | Vendor |
| **FR-02** | Scan DN & PO — Identitas Awal | **[v2]** Step 1: Vendor men-scan DN untuk mengambil `dn_number` dan `po_number`. Sistem secara otomatis mencocokkan vendor dari data DN dan memvalidasi bahwa perusahaan terdaftar dalam master. | Vendor |
| **FR-03** | Dynamic Checklist SQPE | Step 2: Vendor mengisi checklist SQPE mandiri berdasarkan kategori vendor aktif (Safety, Quality, Productivity, Environment). Checklist General & Specific. | Vendor |
| **FR-04** | AI Safety Check (APD Verification) | **[v2]** Verifikasi APD melalui kamera. AI menetapkan `ai_safety_status`: Pass atau Fail. | Vendor, Sistem |
| **FR-05** | Submission & Status Entry | **[v2.2 Updated]** Step 3: Konfirmasi dan submit. Sistem generate nomor antrean **YYYYMMDD-XXX**. Status awal bergantung pada mode: jika `VERIFICATION_MODE_ENABLED = false` → langsung `AKTIF`; jika `true` → `MENUNGGU`. | Sistem, Vendor |
| **FR-06** | Vendor Queue Lookup | Halaman cek status entry, input nomor antrean, menampilkan perusahaan dan status, auto-refresh. | Vendor |
| **FR-07** | Public Queue Display (TV Mode) | Full-screen table entry aktif hari ini, auto-refresh 10 detik. | Publik |
| **FR-08** | Login & Role-Based Access | Login menggunakan JWT eksternal, membaca role (Staff/Leader/Admin) untuk akses fitur. | Staff, Leader, Admin |
| **FR-09** | Monitoring & Verification List | **[v2.2 Updated]** Table entri harian dengan filter, search, pagination. Menampilkan identitas, DN/PO, AI Safety Status, arrival status, departure status. Jika `VERIFICATION_MODE_ENABLED = true`: muncul tombol **Approve/Reject** pada setiap entry berstatus `MENUNGGU`. Jika `false`: tampilan read-only tanpa action. | Staff, Leader |
| **FR-10** | Verification Drawer | **[v2.2 — OPSIONAL]** Drawer berisi identitas, DN/PO, arrival status, hasil AI safety, checklist lengkap. Pilihan Approved/Rejected, alasan wajib jika Rejected. **Hanya muncul jika `VERIFICATION_MODE_ENABLED = true`.** | Staff |
| **FR-11** | Departure Scan & Status | **[v2]** Vendor scan keluar. Sistem bandingkan waktu aktual vs `planned_departure_time`. Set `departure_status`. Jika Overdue, vendor pilih alasan. Entry status → `SELESAI`. | Vendor, Sistem |
| **FR-12** | Arrival Status Detection | **[v2]** Saat scan DN, sistem bandingkan waktu aktual vs `planned_arrival_time`. Set `arrival_status`: On-Time / Late / Early. Jika Late, vendor wajib pilih alasan. | Sistem, Vendor |
| **FR-13** | Delivery Slot Monitoring & Missed Cycle | **[v2]** Slot dibuat otomatis setiap pagi. EOD: slot dengan `entry_id = NULL` → `Missed`. | Sistem |
| **FR-14** | Monitoring Dashboard | **[v2.2 Updated]** Dashboard harian: total aktif, total selesai, Missed Cycle count, On-Time Arrival %, On-Time Departure %, mode aktif (Self-Service / Verification). Jika verification mode aktif: tambahkan count MENUNGGU, DISETUJUI, DITOLAK. | Staff, Leader |
| **FR-15** | Reporting & Export XLSX | Filter date range, kategori vendor, arrival/departure status. Export Excel: Summary, Detail Entry, Checklist Answers, Cycle Monitoring. | Leader, Admin |
| **FR-16** | Vendor Master Management | CRUD kategori vendor, sync. Termasuk manage `mst_vendor_schedule` dan `mst_delay_reason`. | Admin |
| **FR-17** | Checklist Master Management | CRUD checklist SQPE general & specific, drag-drop reorder, toggle required, preview. | Admin |
| **FR-18** | Konfigurasi Sistem | **[v2.2 NEW]** Admin dapat mengubah `VERIFICATION_MODE_ENABLED` (dan config lainnya) melalui halaman Konfigurasi Sistem. Perubahan berlaku instan tanpa restart aplikasi. | Admin |

---

# **2. Non-Functional Requirements (NFR)**

## **2.1 Security**

| **ID** | **Kebutuhan** | **Deskripsi** |
| --- | --- | --- |
| **NFR-S1** | Role-Based Access Control | Sistem menerapkan pembatasan akses berdasarkan peran (Petugas, Leader, Admin) sesuai payload JWT eksternal. |
| **NFR-S2** | Secure Authentication | Verifikasi token dilakukan menggunakan public key dari sistem eksternal. Token yang expired atau invalid ditolak. |

---

## **2.2 Performance**

| **ID** | **Kebutuhan** | **Deskripsi** |
| --- | --- | --- |
| **NFR-P1** | Page Load Time | Halaman Self Check-In harus memuat maksimal 3 detik pada jaringan standar. |
| **NFR-P2** | Query Responsiveness | Query laporan harus memiliki waktu respons rata-rata di bawah 5 detik untuk 95% permintaan, dengan kapasitas minimal 500.000 entri histori. |

---

## **2.3 Operational**

| **ID** | **Kebutuhan** | **Deskripsi** |
| --- | --- | --- |
| **NFR-O1** | Checklist Replication Accuracy | Sistem mereplikasi seluruh item checklist manual sesuai dokumen resmi Safety & Health Check tanpa mengubah isi, urutan, kategori, serta menambahkan hanya item tambahan yang telah disetujui. |
| **NFR-O2** | Audit Trail | Sistem mencatat seluruh aktivitas verifikasi (ID Petugas, tanggal, waktu, status, alasan penolakan, Missed Cycle event) dan menyimpannya minimal 1 tahun. |
| **NFR-O3** | System Availability | Sistem memiliki ketersediaan minimal 99.9% selama jam operasional gudang. |
| **NFR-O4** | Scheduler Reliability | **[v2]** Scheduler harian (slot generation & missed cycle check) harus berjalan tepat waktu dengan toleransi maksimal ±5 menit dan memiliki mekanisme retry jika gagal. |

---

# **3. Data Architecture**

| **Tipe Data** | **Deskripsi** |
| --- | --- |
| **VendorMaster** | Menyimpan Vendor ID, Nama Perusahaan, dan Kategori Vendor. ID dan Nama berasal dari sinkronisasi eksternal, sedangkan kategori dikelola internal. |
| **VendorSchedule** | **[v2]** Menyimpan jadwal rencana kedatangan (`planned_arrival_time`) dan keberangkatan (`planned_departure_time`) per vendor per hari. |
| **DelayReasonMaster** | **[v2]** Menyimpan daftar alasan keterlambatan: kategori `Arrival` dan `Departure`. |
| **ChecklistItemMaster** | Menyimpan seluruh item checklist SQPE beserta kategorinya (General / Specific). |
| **DeliverySlot** | **[v2]** Wadah monitoring harian. Status: `Open` → `Filled` (vendor hadir) atau `Missed` (tidak hadir sampai EOD). |
| **CheckInEntry** | **[v2.2]** Menyimpan identitas vendor, DN/PO, slot, arrival status, AI safety status, nomor antrean. Status mendukung 2 mode: Self-Service (`AKTIF`/`SELESAI`) atau Verification (`MENUNGGU`/`DISETUJUI`/`DITOLAK`/`SELESAI`). |
| **CheckInResponse** | Jawaban checklist SQPE per item, terhubung ke CheckInEntry. |
| **VerificationResult** | **[v2.2 — OPSIONAL]** Keputusan Staff (Approve/Reject) beserta alasan. Hanya terisi jika `VERIFICATION_MODE_ENABLED = true`. Tabel tetap ada di schema. |
| **TimeLogData** | **[v2]** Timestamp masuk & departure. Mencatat `departure_status` dan alasan keterlambatan keluar. |
| **QueueStatus** | Status terbaru setiap entry untuk real-time dashboard dan TV Display. |
| **SystemConfig** | **[v2.2]** Konfigurasi sistem termasuk `VERIFICATION_MODE_ENABLED` untuk toggle mode verifikasi. |

---

# **4. Detail Flow Operasional**

> Flow ini menggantikan deskripsi flow lama. Tidak ada sistem scoring; fokus pada monitoring dan ketepatan waktu.

| **Langkah** | **Aktor** | **Aksi** | **Kondisi** | **Data yang Terlibat** |
| --- | --- | --- | --- | --- |
| **1. Slot Generation** | Sistem (Scheduler) | Setiap pagi, buat `ops_delivery_slot` dari `mst_vendor_schedule` aktif hari ini. Status: `Open`. | Selalu | `mst_vendor_schedule` → `ops_delivery_slot` |
| **2. Scan DN** | Vendor | Scan barcode DN → ambil `dn_number` & `po_number`. | Selalu | `ops_checkin_entry` |
| **3. Slot Matching** | Sistem | Jodohkan ke slot `Open` paling awal. Slot → `Filled`. | Selalu | `ops_delivery_slot` |
| **4. Arrival Status** | Sistem | Bandingkan waktu aktual vs `planned_arrival_time`. Set `arrival_status`. | Selalu | `ops_checkin_entry`.`arrival_status` |
| **5. Alasan Terlambat Datang** | Vendor | Pilih alasan dari `mst_delay_reason` (Arrival). | Jika `arrival_status = Late` | `ops_checkin_entry`.`delay_arrival_reason_id` |
| **6. AI Safety Check** | Sistem + Vendor | Verifikasi APD via kamera. Set `ai_safety_status`. | Selalu | `ops_checkin_entry`.`ai_safety_status` |
| **7. Checklist SQPE** | Vendor | Isi checklist mandiri (Ya/Tidak). | Selalu | `ops_checkin_response` |
| **8a. Submit → AKTIF** | Sistem | Generate queue number. Status langsung `AKTIF`. | Jika `VERIFICATION_MODE_ENABLED = false` | `ops_checkin_entry`.`current_status = AKTIF` |
| **8b. Submit → MENUNGGU** | Sistem | Generate queue number. Status `MENUNGGU`, masuk antrian Staff. | Jika `VERIFICATION_MODE_ENABLED = true` | `ops_checkin_entry`.`current_status = MENUNGGU` |
| **9. Verifikasi Staff** | Staff | Review entry di dashboard. Approve → `DISETUJUI`/`AKTIF`. Reject → `DITOLAK` + alasan. | Jika `VERIFICATION_MODE_ENABLED = true` | `ops_verification` |
| **10. Departure Scan** | Vendor | Scan keluar. Bandingkan vs `planned_departure_time`. Set `departure_status`. | Selalu (setelah AKTIF) | `ops_timelog`.`departure_status` |
| **11. Alasan Terlambat Keluar** | Vendor | Pilih alasan dari `mst_delay_reason` (Departure). | Jika `departure_status = Overdue` | `ops_timelog`.`delay_departure_reason_id` |
| **12. Entry Selesai** | Sistem | Status → `SELESAI`. `ops_timelog` lengkap. | Selalu | `ops_checkin_entry`.`current_status = SELESAI` |
| **13. Missed Cycle Check** | Sistem (EOD) | Slot `entry_id = NULL` → `Missed`. Catat `log_audit`. | Selalu | `ops_delivery_slot`.`status = Missed` |

---

# **5. Minimum Viable Product (MVP)**

| **Aspect** | **In-Scope** | **Out-of-Scope** |
| --- | --- | --- |
| **Validasi** | AI Safety Check APD hasil kamera. Checklist SQPE mandiri. Verifikasi Staff **opsional** via feature flag. | Deteksi safety lanjutan realtime. |
| **Analitik** | Dashboard harian: Missed Cycle, On-Time %, avg durasi, mode aktif. Export laporan (.xlsx). | Analytics lanjutan: vendor ranking, trend mingguan. |
| **Identitas** | Scan DN untuk ambil nomor DN & PO. | OCR kartu identitas, QR code kartu vendor. |
| **Scheduling** | Jadwal per vendor per hari. Slot generation otomatis. EOD missed cycle detection. | Jadwal dinamis berbasis permintaan ad-hoc. |
| **Akses User** | Login Staff/Leader/Admin via JWT eksternal. Toggle verifikasi via Admin panel. Vendor tidak memiliki akun. | Portal Vendor & akun Vendor. |

---

# **6. System Interface & Hardware Requirements**

## 6.1 Client Devices

| **Peruntukan** | **User Target** | **Spesifikasi Minimum Hardware** | **Spesifikasi Software** |
| --- | --- | --- | --- |
| **Kiosk Station** | Vendor / Driver | **Device:** Tablet atau Touchscreen PC (Min. 10 inch). **Network:** Koneksi Wi-Fi stabil. **Input:** Layar sentuh responsif + **Kamera untuk AI Safety Check**. | **Browser:** Google Chrome / Edge (Versi Terbaru). **Mode:** Kiosk Mode enabled. |

---

## **6.2 Public Display**

| **Komponen** | **Spesifikasi** |
| --- | --- |
| **Display** | Monitor LED ukuran min. 32 inch. |
| **Controller** | Mini PC yang terhubung via HDMI. |
| **Resolution** | Full HD (1920x1080) aspek rasio 16:9. |

---

## 6.3 Additional Hardware

| Komponen | Peruntukan | Status |
| --- | --- | --- |
| **Kamera Eksternal (Webcam)** | AI Safety Check — verifikasi APD saat kedatangan | **MVP v2** |
| **Barcode Scanner** | Scan DN & PO saat kedatangan, Scan keluar (Departure) | **MVP v2** |
| **Scanner ID** | OCR atau scan ID otomatis untuk autofill identitas driver | Next Phase |

---

# **7. Technology Stack**

### **Frontend**

- Next.js (typescript), Tailwind CSS, Shadcn UI, Lucide Icons
- React Hook Form + Zod
- React Query
- TanStack Table

### **Backend**

- Node.js + NestJS (typescript)
- SQL Server + Prisma ORM
- JWT Auth (from external provider)
- **Scheduler (node-cron)** — untuk slot generation & EOD missed cycle check
- ExcelJS untuk export

### **DevOps**

- Windows Server + Nginx + PM2
- GitHub/GitLab
- CI/CD opsional
- Logging (Winston) & Sentry opsional
