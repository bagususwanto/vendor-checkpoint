# Panduan Deploy Next.js Static Export di IIS dengan Full Reverse Proxy

Target arsitektur:

```text
Client
  -> http://10.64.14.220/vendor-checkpoint/
  -> IIS port 80
  -> Frontend static Next.js

Client API
  -> http://10.64.14.220/vendor-checkpoint/api/...
  -> IIS port 80
  -> Reverse proxy ke http://127.0.0.1:5002/...
```

Backend tetap berjalan di PM2 port `5002`. Port `5002` tidak perlu dibuka ke client.

## 1. Cek Kondisi IIS

Jalankan PowerShell sebagai Administrator:

```powershell
Import-Module WebAdministration

Get-Website | Select-Object Name, State, PhysicalPath, Bindings

Get-WebBinding | ForEach-Object {
  [PSCustomObject]@{
    Site = ($_.ItemXPath -replace ".*name='([^']+)'.*", '$1')
    Protocol = $_.protocol
    Binding = $_.bindingInformation
  }
} | Format-Table -AutoSize
```

Pastikan port `80` dipakai oleh `Default Web Site`.

## 2. Install Komponen IIS

Install:

```text
IIS URL Rewrite Module 2.1
Application Request Routing 3.0
```

Setelah install:

1. Buka IIS Manager
2. Klik nama server paling atas
3. Buka **Application Request Routing Cache**
4. Klik **Server Proxy Settings**
5. Centang **Enable proxy**
6. Klik **Apply**

## 3. Konfigurasi Frontend

Di `.env` frontend:

```env
NEXT_PUBLIC_API_URL=/vendor-checkpoint/api
```

Di `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/vendor-checkpoint',
  assetPrefix: '/vendor-checkpoint',
  allowedDevOrigins: ['http://localhost:3000'],
};

export default nextConfig;
```

Build frontend:

```powershell
npm run build
```

Pastikan hasil export ada di:

```text
C:\Project\vendor-checkpoint\apps\web\out
```

Dan ada file:

```text
C:\Project\vendor-checkpoint\apps\web\out\index.html
```

## 4. Buat Application di IIS

Di IIS Manager:

```text
Default Web Site
  Add Application
```

Isi:

```text
Alias: vendor-checkpoint
Physical path: C:\Project\vendor-checkpoint\apps\web\out
Application pool: DefaultAppPool
```

URL frontend menjadi:

```text
http://10.64.14.220/vendor-checkpoint/
```

## 5. Buat web.config untuk Reverse Proxy

Simpan file ini di:

```text
C:\Project\vendor-checkpoint\apps\web\public\web.config
```

Isi:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Vendor Checkpoint API Reverse Proxy" stopProcessing="true">
          <match url="^api/?(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:5002/{R:1}" />
        </rule>

        <rule name="Vendor Checkpoint Static Fallback" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/vendor-checkpoint/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

Setelah build, pastikan file ikut ada di:

```text
C:\Project\vendor-checkpoint\apps\web\out\web.config
```

Kalau belum ada, copy manual:

```powershell
Copy-Item `
  C:\Project\vendor-checkpoint\apps\web\public\web.config `
  C:\Project\vendor-checkpoint\apps\web\out\web.config `
  -Force
```

## 6. Restart IIS

```powershell
iisreset
```

## 7. Tes dari Server

Tes frontend:

```powershell
curl.exe --noproxy "*" -I http://localhost/vendor-checkpoint/
curl.exe --noproxy "*" -I http://10.64.14.220/vendor-checkpoint/
```

Harus `200 OK`.

Tes backend langsung:

```powershell
curl.exe --noproxy "*" -i http://127.0.0.1:5002/
```

Tes API lewat IIS:

```powershell
curl.exe --noproxy "*" -i http://localhost/vendor-checkpoint/api/
curl.exe --noproxy "*" -i http://10.64.14.220/vendor-checkpoint/api/
```

Harus keluar response JSON dari backend.

## 8. Tes dari PC Client

Buka browser:

```text
http://10.64.14.220/vendor-checkpoint/
```

Buka DevTools > Network.

Pastikan request API menuju:

```text
http://10.64.14.220/vendor-checkpoint/api/...
```

Bukan:

```text
http://10.64.14.220:5002/...
```

Pastikan asset CSS/JS menuju:

```text
http://10.64.14.220/vendor-checkpoint/_next/...
```

Bukan:

```text
http://10.64.14.220/_next/...
```

## 9. Setelah Berhasil

Jika sebelumnya ada site lama `vendor-checkpoint` di port lain, misalnya `3002`, stop saja dulu:

```powershell
Stop-Website "vendor-checkpoint"
```

Jangan hapus sebelum yakin tidak dibutuhkan rollback.

Firewall client cukup buka port:

```text
80
```

Port backend:

```text
5002
```

tidak perlu dibuka ke client.