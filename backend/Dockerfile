# Use Python base image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Copy requirements first (none yet, but placeholder)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt || true

# Copy app code
COPY . .

# Default command (overridden in docker-compose)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
