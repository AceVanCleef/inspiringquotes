# Wir nutzen das offizielle 3.14-slim Image für maximale Kompatibilität
FROM python:3.14-slim

WORKDIR /app

# System-Abhängigkeiten für PostgreSQL und Build-Tools
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Port-Freigabe
EXPOSE 8080

# Start-Befehl
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]