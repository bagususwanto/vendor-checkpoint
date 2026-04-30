module.exports = {
  apps: [
    {
      name: "ppe-detection",
      script: "./.venv/Scripts/uvicorn.exe",
      args: "main:app --host 0.0.0.0 --port 8000",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
}
