module.exports = {
  apps: [
    {
      name: "ppe-detection",
      script: "venv\\Scripts\\python.exe",
      args: "-m uvicorn main:app --host 0.0.0.0 --port 8000",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
}
