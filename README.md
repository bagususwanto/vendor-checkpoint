# VendorCheckpoint

> 🚀 **Sistem Self Check-In & Verifikasi Digital Safety & Health untuk Vendor Warehouse**

<div align="center">

![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)
![Turborepo](https://img.shields.io/badge/turborepo-2.6.x-purple.svg)

</div>

---

## 📋 Overview

**VendorCheckpoint** adalah aplikasi web yang menyediakan **Self Check-In publik (tanpa login)** bagi vendor/driver untuk mengisi checklist digital yang telah direplikasi 100% dari dokumen manual resmi. Setelah submit, sistem membuat **nomor antrean otomatis** dan mengatur status ke _Waiting for Verification_. Petugas melakukan **Verifikasi Total** (Final Judgement Approved/Rejected) melalui halaman yang terproteksi login.

### ✨ Key Features

| Fitur                      | Deskripsi                                                               |
| -------------------------- | ----------------------------------------------------------------------- |
| **Public Self Check-In**   | Halaman publik tanpa login untuk vendor mengisi identitas dan checklist |
| **Dynamic Checklist**      | Checklist tampil sesuai kategori vendor (General + Specific)            |
| **Automatic Queue System** | Nomor antrean format `YYYYMMDD-XXX` dengan real-time tracking           |
| **Verification Module**    | Petugas memverifikasi data dengan keputusan Approved/Rejected           |
| **Time Log Tracking**      | Check-in otomatis saat Approved, Check-out oleh Petugas                 |
| **Monitoring Dashboard**   | Ringkasan harian dan export laporan Excel                               |

---

## 🏗️ Project Structure

```
vendor-checkpoint/
├── apps/
│   ├── api/                          # NestJS Backend API
│   └── web/                          # Next.js Frontend
├── packages/
│   ├── @repo/api/                    # Shared NestJS resources
│   ├── @repo/types/                  # Shared TypeScript types
│   ├── @repo/ui/                     # Shared React component library
│   ├── @repo/eslint-config/          # ESLint configurations
│   ├── @repo/jest-config/            # Jest configurations
│   └── @repo/typescript-config/      # TypeScript configurations
├── docs/                             # Project documentation
│   ├── 1. Project Overview.md
│   ├── 2. System Requirement Specs.md
│   ├── 3. User Flow.md
│   └── 4. ERD.md
└── turbo.json                        # Turborepo configuration
```

---

## 🛠️ Tech Stack

### Frontend

- **Next.js** (TypeScript) - React Framework
- **Tailwind CSS** - Utility-first CSS
- **Shadcn UI** - Component Library
- **Lucide Icons** - Icon Library
- **React Hook Form + Zod** - Form Handling & Validation
- **React Query** - Data Fetching
- **TanStack Table** - Data Tables

### Backend

- **Node.js + NestJS** (TypeScript) - Backend Framework
- **SQL Server + Prisma ORM** - Database
- **JWT Auth** - Authentication (External Provider)
- **node-cron** - Scheduler
- **ExcelJS** - Export Reports

### DevOps

- **Windows Server + Nginx + PM2** - Deployment
- **Turborepo** - Monorepo Build System
- **GitHub/GitLab** - Version Control

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 10.x
- **Python** >= 3.9 (untuk fitur PPE Detection)
- **SQL Server** (sebagai database utama)

### Installation & Setup

1. **Clone repository dari GitHub**

   ```bash
   git clone <repository-url>
   cd vendor-checkpoint
   ```

2. **Install Dependencies (JS/TS)**

   Karena proyek ini menggunakan Turborepo dan PNPM workspace, gunakan `pnpm` untuk instalasi:

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**

   Duplikasi file `.env.example` ke `.env` untuk masing-masing aplikasi:

   ```bash
   # Backend API
   cp apps/api/.env.example apps/api/.env

   # Frontend Web
   cp apps/web/.env.example apps/web/.env.local
   ```

   > **Note:** Pastikan Anda mengisi credential koneksi database (SQL Server) di `apps/api/.env` sebelum melanjutkan.

4. **Setup Database (Prisma)**

   Jalankan perintah berikut dari root folder secara berurutan. Pertama untuk meng-generate Prisma Client, kemudian mereset database untuk meng-apply migrasi dan menjalankan file seed awal:

   ```bash
   # Generate Prisma Client
   pnpm --filter api exec prisma generate

   # Reset DB, Apply Migrasi, & Run Seed
   pnpm --filter api run reset
   ```

5. **Setup PPE Detection (Python FastAPI)**

   Fitur deteksi APD menggunakan FastAPI. Anda perlu melakukan setup _virtual environment_:

   ```bash
   cd apps/ppe-detection

   # Buat virtual environment
   python -m venv venv

   # Install dependensi Python (Gunakan python dari venv agar pasti masuk ke folder venv)
   .\venv\Scripts\python.exe -m pip install -r requirement.txt

   # Kembali ke root folder
   cd ../..
   ```

6. **Start Development Server**

   Jalankan semua service (Frontend Web, Backend API NestJS, dan PPE FastAPI) secara serentak dari root direktori:

   ```bash
   pnpm run dev
   ```

---

## ⚠️ Catatan: Development di Jaringan Perusahaan (Local Server)

Jika Anda menjalankan aplikasi ini **di laptop/server yang terhubung ke jaringan internal perusahaan** (corporate network), perhatikan hal-hal berikut:

### Masalah: HTTP 407 Proxy Authentication Required

Saat menjalankan development di lokal (dalam jaringan kantor), NestJS backend bisa gagal melakukan request ke external API (`wh-backend-1`) dengan error:

```
Login error: { status: 407, message: 'Request failed with status code 407' }
```

**Penyebab:** Axios secara otomatis membaca environment variable `HTTP_PROXY` / `http_proxy` dari sistem operasi dan meneruskan semua HTTP request melalui corporate proxy. Karena `wh-backend-1` adalah host internal, proxy tersebut menolak request dengan 407.

### Solusi: Tambahkan `proxy: false` pada Axios Config

Buka `apps/api/src/modules/auth/auth.service.ts` dan tambahkan `proxy: false` pada setiap Axios request config:

```typescript
// Untuk development di jaringan perusahaan
this.httpService.post(url, dto, { httpsAgent, proxy: false });

// Atau pada config object
const config: AxiosRequestConfig = {
  headers: { Cookie: cookies },
  httpsAgent,
  proxy: false, // Bypass corporate proxy untuk internal host
};
```

### Masalah: SSL Certificate Error

Jika muncul error `unable to verify the first certificate`, backend sudah dikonfigurasi untuk bypass validasi SSL via `httpsAgent`:

```typescript
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
```

Konfigurasi ini sudah aktif secara default dan tidak perlu diubah.

---

## 🌐 Backend Production (PM2)

Untuk menjalankan Backend API di lingkungan production menggunakan PM2:

1. **Build Project**

   ```bash
   pnpm run build
   ```

2. **Jalankan API (NestJS)**

   ```bash
   cd apps/api
   pm2 start dist/src/main.js --name "vendor-api"
   ```

3. **Jalankan PPE Detection (FastAPI)**

   ```bash
   cd apps/ppe-detection

    # Linux/macOS
    pm2 start ./venv/bin/uvicorn --name "ppe-detection" -- main:app --host 0.0.0.0 --port 8000

    # Windows (Rekomendasi: Pakai ecosystem.config.js)
    pm2 start ecosystem.config.js
   ```

---

## 🌐 Frontend Deployment (Firebase Hosting)

Ikuti langkah-langkah berikut untuk men-deploy frontend Next.js ke Firebase Hosting menggunakan metode **Static Export**:

### 1. Persiapan Firebase CLI

Pastikan Anda sudah menginstall Firebase Tools secara global:

```bash
npm install -g firebase-tools
firebase login
```

### 2. Konfigurasi Next.js (Static Export)

Ubah `apps/web/next.config.js` untuk mengaktifkan mode export:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Tambahkan baris ini
  // ... config lainnya
};
```

### 3. Inisialisasi Firebase

Jalankan perintah ini di **root folder**:

```bash
firebase init hosting
```

- Pilih project Firebase Anda.
- Tentukan direktori publik: `apps/web/out`
- Konfigurasikan sebagai single-page app: `Yes`
- Setup GitHub Actions: (Opsional)

### 4. Build & Deploy

Jalankan build untuk aplikasi web, lalu deploy:

```bash
# Build aplikasi web
pnpm --filter web build

# Deploy ke Firebase
firebase deploy --only hosting
```

> **Note:** Jika Anda memerlukan fitur Server-Side Rendering (SSR) atau API Routes di Next.js, disarankan menggunakan **Firebase App Hosting** (lebih modern & mendukung Next.js secara native).

---

## 📝 Available Scripts

| Command            | Description                           |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Start development server for all apps |
| `npm run build`    | Build all apps and packages           |
| `npm run test`     | Run test suites                       |
| `npm run test:e2e` | Run end-to-end tests                  |
| `npm run lint`     | Lint all code                         |
| `npm run format`   | Format code with Prettier             |

---

## 👥 Target Users

| User                  | Role                                                      |
| --------------------- | --------------------------------------------------------- |
| **Vendor (Public)**   | Melakukan Self Check-In dan melihat status antrean        |
| **Petugas Receiving** | Melakukan verifikasi, check-in/out, dan mengelola antrean |
| **Leader / Section**  | Monitoring dan laporan                                    |
| **Admin**             | Manajemen kategori vendor, laporan, dan sinkronisasi data |

---

## 📖 Documentation

Dokumentasi lengkap tersedia di folder `/docs`:

- [📘 Project Overview](docs/1.%20Project%20Overview.md) - Gambaran umum proyek
- [📋 System Requirements](docs/2.%20System%20Requirement%20Specs.md) - Spesifikasi kebutuhan sistem
- [🔄 User Flow](docs/3.%20User%20Flow.md) - Alur pengguna
- [🗄️ ERD](docs/4.%20ERD.md) - Entity Relationship Diagram

---

## 🔧 Development Guidelines

### Code Style

- Menggunakan **TypeScript** untuk type safety
- Mengikuti **ESLint** rules yang ditetapkan
- Format code dengan **Prettier**

### Git Workflow

1. Buat branch dari `main` dengan format: `feature/nama-fitur` atau `fix/nama-bug`
2. Commit dengan pesan yang deskriptif
3. Buat Pull Request untuk review

### Folder Conventions

- **apps/**: Aplikasi utama (API & Web)
- **packages/**: Shared packages & configurations
- **docs/**: Dokumentasi proyek

---

## 📄 License

This project is **UNLICENSED** - proprietary software.

---

<div align="center">

**Built with ❤️ using [Turborepo](https://turbo.build/repo)**

</div>
