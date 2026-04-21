FROM python:3.11-slim

# Install system dependencies for OpenCV and other heavy libraries
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirement.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --default-timeout=1000 --no-cache-dir -r requirement.txt

# Copy the rest of the application
COPY . .

# Expose the port uvicorn is running on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
