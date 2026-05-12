# 3. User Flow — Versi 2.4 (Revisi Besar)

> Copy paste code ke https://mermaid.live/edit untuk view yang lebih jelas
> **Versi:** 2.4 | **Tanggal Revisi:** 2026-05-12
> **Changelog v2.1:** Proses verifikasi Staff dinonaktifkan secara default (self-service mode).
> **Changelog v2.2:** Verifikasi Staff **dikembalikan sebagai fitur opsional** yang dikontrol via `cfg_system.VERIFICATION_MODE_ENABLED`.
> **Changelog v2.3:** Penambahan konsep **expected_date (Operational Date)** & **Cut-off Time**.
> **Changelog v2.4:** Penambahan flow **Officer Discrepancy Marking** dan **Performance Adjustment** pada dashboard detail.

---

## Mode Operasional

Sistem mendukung 2 mode yang dapat diubah kapan saja melalui halaman Admin tanpa perlu deploy ulang:

| Config Key                  | Value               | Mode             | Keterangan                                                                       |
| --------------------------- | ------------------- | ---------------- | -------------------------------------------------------------------------------- |
| `VERIFICATION_MODE_ENABLED` | `false` _(default)_ | **Self-Service** | Vendor langsung `AKTIF` setelah submit. Tidak ada gate Staff.                    |
| `VERIFICATION_MODE_ENABLED` | `true`              | **Verification** | Vendor masuk status `MENUNGGU`, Staff harus Approve/Reject sebelum vendor masuk. |

---

## 1. Main Operational Flow v2.4 — Dual Mode & Post-Submission Activities

```mermaid
flowchart TD
    classDef vendor fill:#e1f5fe,stroke:#0277bd,color:#000
    classDef system fill:#f3e5f5,stroke:#6a1b9a,color:#000,stroke-dasharray: 5 5
    classDef staff fill:#fff3e0,stroke:#ef6c00,color:#000
    classDef new fill:#e8f5e9,stroke:#2e7d32,color:#000
    classDef optional fill:#fce4ec,stroke:#c62828,color:#000,stroke-dasharray: 4 4
    classDef endpoint fill:#000,stroke:#000,color:#fff
    classDef adjustment fill:#fff9c4,stroke:#fbc02d,color:#000

    %% --- SYSTEM: CUT-OFF AWAL HARI ---
    S_SlotGen["🕗 Awal Hari Operasional (07:15 AM) Generate ops_delivery_slot Set expected_date Status: Open"]:::new

    %% --- VENDOR ARRIVAL ---
    subgraph VENDOR_ARRIVAL ["🚛 VENDOR — Kedatangan (Arrival)"]
        V_ScanDN["Scan DN & PO"]:::new
        V_MatchSlot["Sistem: Jodohkan ke Slot Open Paling Awal"]:::new
        V_ArrivalCheck{"Waktu aktual vs planned_arrival_time"}:::new
        V_ArrivalStatus["Set arrival_status: On-Time / Late / Early"]:::new
        V_LateReason["Pilih alasan keterlambatan Wajib jika Late"]:::new
    end

    %% --- VENDOR SQPE ---
    subgraph VENDOR_SQPE ["🔍 VENDOR — Self-Inspection SQPE"]
        V_AICheck["Verifikasi APD via Kamera (AI Safety Check) Set ai_safety_status & Record PPE Scan"]:::new
        V_Checklist["Isi Checklist SQPE Mandiri"]:::vendor
        V_Submit["Submit Generate Queue Number"]:::vendor
    end

    %% --- VERIFICATION GATE (OPSIONAL) ---
    V_ModeCheck{"VERIFICATION_MODE _ENABLED?"}:::system

    subgraph VERIFICATION_OPTIONAL ["⚙️ OPSIONAL — Aktif jika VERIFICATION_MODE_ENABLED = true"]
        V_Wait["Status → MENUNGGU"]:::optional
        P_List["Staff: Monitoring List"]:::staff
        P_Drawer["Staff: Review Entry"]:::staff
        P_Approve{"Approve?"}:::staff
        P_RejectReason["Input Alasan Reject"]:::staff
        S_Rejected(["Status → DITOLAK"])::::optional
        S_Approved(["Status → DISETUJUI"]):::optional
    end

    %% --- STAFF / ADMIN POST-ACTIVITIES ---
    subgraph POST_ACTIVITIES ["📊 DASHBOARD — Post-Submission & Analytics"]
        D_Discrepancy["Staff: Mark Discrepancy (Catatan + Bukti Foto)"]:::staff
        D_Adjustment["SH/Admin: Manual Adjustment (Override Status)"]:::adjustment
    end

    %% --- VENDOR DEPARTURE ---
    subgraph VENDOR_DEPARTURE ["🚪 VENDOR — Keberangkatan (Departure)"]
        V_ScanOut["Scan Keluar (Departure)"]:::vendor
        V_DepartureCheck{"Waktu aktual vs planned_departure_time"}:::new
        V_DepartureStatus["Set departure_status: On-Time / Overdue"]:::new
        V_OverdueReason["Pilih alasan terlambat keluar Wajib jika Overdue"]:::new
        V_Done(["Status → SELESAI"]):::endpoint
    end

    %% FLOW
    S_SlotGen --> V_ScanDN
    V_ScanDN --> V_MatchSlot --> V_ArrivalCheck
    V_ArrivalCheck -- "Late" --> V_ArrivalStatus --> V_LateReason --> V_AICheck
    V_ArrivalCheck -- "On-Time / Early" --> V_ArrivalStatus --> V_AICheck
    V_AICheck --> V_Checklist --> V_Submit

    V_Submit --> V_ModeCheck
    V_ModeCheck -- "false (Self-Service)" --> V_ScanOut
    V_ModeCheck -- "true (Verification Mode)" --> V_Wait --> P_List --> P_Drawer --> P_Approve
    P_Approve -- "Rejected" --> P_RejectReason --> S_Rejected
    P_Approve -- "Approved" --> S_Approved --> V_ScanOut

    %% Post-Activities can happen anytime after submission
    V_Submit -.-> D_Discrepancy
    V_ScanOut -.-> D_Adjustment

    V_ScanOut --> V_DepartureCheck
    V_DepartureCheck -- "Overdue" --> V_DepartureStatus --> V_OverdueReason --> V_Done
    V_DepartureCheck -- "On-Time" --> V_DepartureStatus --> V_Done
```

---

## 2. Status Lifecycle Entry — Dual Mode

```mermaid
stateDiagram-v2
    state "Self-Service Mode (VERIFICATION_MODE_ENABLED = false)" as SS {
        [*] --> AKTIF_SS : Submit
        AKTIF_SS --> SELESAI_SS : Departure Scan
    }

 state "Verification Mode (VERIFICATION_MODE_ENABLED = true)" as VM {
        [*] --> MENUNGGU : Submit
        MENUNGGU --> DISETUJUI : Staff Approve
        MENUNGGU --> DITOLAK : Staff Reject
        DISETUJUI --> AKTIF_VM : Status aktif
        AKTIF_VM --> SELESAI_VM : Departure Scan
    }
    
    SELESAI_SS --> [*]
    SELESAI_VM --> [*]
    DITOLAK --> [*]
```

> 💡 Perubahan mode dilakukan di halaman **Admin → Konfigurasi Sistem**, berlaku instan tanpa restart maupun perubahan database.

---

## 3. Diagram Delivery Slot — Missed Cycle Detection & Expected Date

Untuk mengakomodir cycle dari pagi hingga jam 07:00 pagi keesokan harinya, sistem menggunakan **`expected_date`** sebagai penanda hari operasional. Penentuan hari didasarkan pada waktu scan dikurangi batas cut-off (time-shift logic).

```mermaid
flowchart LR
    classDef schedule fill:#fff3e0,stroke:#ef6c00
    classDef slot fill:#e1f5fe,stroke:#0277bd
    classDef entry fill:#e8f5e9,stroke:#2e7d32
    classDef missed fill:#ffebee,stroke:#c62828

    MST["mst_vendor_schedule planned_arrival_time (contoh: 02:00 AM)"]:::schedule

    SLOT_OPEN["ops_delivery_slot expected_date: Hari Ini planned_arrival: Besok 02:00 status: Open entry_id: NULL"]:::slot
    SLOT_FILLED["ops_delivery_slot status: Filled entry_id: ✅"]:::entry
    SLOT_MISSED["ops_delivery_slot status: Missed entry_id: NULL"]:::missed

    MST -- "Scheduler Pagi (Jam 07:15 AM)" --> SLOT_OPEN
    SLOT_OPEN -- "Vendor Scan DN → Jodohkan berdasarkan expected_date (Operational Date)" --> SLOT_FILLED
    SLOT_OPEN -- "EOD Scheduler (Jam 07:00 AM H+1)" --> SLOT_MISSED
```

---

---

## 3. Performance Adjustment Flow (Detail View)

```mermaid
flowchart LR
    classDef actor fill:#fff3e0,stroke:#ef6c00
    classDef action fill:#fff9c4,stroke:#fbc02d
    classDef result fill:#e8f5e9,stroke:#2e7d32

    STAFF["Section Head / Admin"]:::actor
    DIALOG["Buka Adjustment Dialog pada Detail History"]:::action
    INPUT["Input Status Baru & Alasan Penyesuaian"]:::action
    SAVE["Simpan Penyesuaian (Record ops_performance_adjustment)"]:::action
    UPDATE["Status Entry & Dashboard KPI Terupdate"]:::result

    STAFF --> DIALOG --> INPUT --> SAVE --> UPDATE
```

---

## 4. Support, Monitoring & Admin Flow v2.4

```mermaid
flowchart TD
    classDef admin fill:#e8f5e9,stroke:#2e7d32
    classDef system fill:#f3e5f5,stroke:#6a1b9a,stroke-dasharray: 5 5
    classDef public fill:#e1f5fe,stroke:#0277bd
    classDef monitoring fill:#fff3e0,stroke:#ef6c00
    classDef config fill:#fce4ec,stroke:#c62828

    subgraph ADMIN ["🔧 Admin — Master Management"]
        A_Login["Admin Login"]:::admin
        A_VendorMaster["Manage Vendor Master"]:::admin
        A_ScheduleMaster["Manage Jadwal (Rit, Station)"]:::admin
        A_Config["Konfigurasi Sistem (Toggle Verifikasi)"]:::config
    end

    subgraph SYSTEMSYNC ["⚙️ System Scheduler"]
        SYNC["Sync Vendor Master"]:::system
        SLOT_GEN["Slot Generator (07:15 AM)"]:::system
        MISSED_CHECK["Missed Cycle Checker (07:00 AM)"]:::system
    end

    A_Login --> A_VendorMaster
    A_VendorMaster -.- SYNC
    A_ScheduleMaster -.-> SLOT_GEN
    SLOT_GEN --> MISSED_CHECK

    subgraph MONITORING ["📊 Staff / Leader — Monitoring"]
        M_Login["Staff / Leader Login"]:::monitoring
        M_Dashboard["Dashboard Detail: KPI Cards, Success Rates, History"]:::monitoring
        M_Adjustment["Performance Adjustment (SH/Admin)"]:::monitoring
        M_Report["Reporting & Export XLSX"]:::monitoring
    end

    M_Login --> M_Dashboard --> M_Adjustment --> M_Report

    subgraph PUBLIC ["📺 Public Display"]
        TV_Refresh{"Auto-Refresh 10s"}:::system
        TV_Display["Queue Display"]:::public
    end

    TV_Refresh --> TV_Display --> TV_Refresh
```
