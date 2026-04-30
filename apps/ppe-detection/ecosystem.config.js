module.exports = {
  apps: [
    {
      name: "ppe-detection",
      script: "venv\\Scripts\\python.exe",
      // Tambahkan -u agar log Python tidak di-buffer yang bisa menyebabkan crash di PM2
      args: "-u -m uvicorn main:app --host 0.0.0.0 --port 8000",
      interpreter: "none",
      cwd: ".",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G", // Otomatis restart jika makan RAM lebih dari 1GB
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      time: true,
      env: {
        NODE_ENV: "production",
      }
    }
  ]
}
