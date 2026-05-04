# 1. Base Image wählen (schlank!)
FROM python:3.14-slim-bookworm

# Verhindert, dass Python .pyc-Dateien schreibt und stellt sicher, 
# dass Logs sofort im Render-Dashboard erscheinen
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 2. System-Abhängigkeiten nur einmal installieren
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. DER TRICK: Zuerst NUR die requirements.txt kopieren
# Render merkt sich diesen Layer. Wenn du nur Code änderst, 
# wird dieser Schritt (das langsame Installieren) übersprungen.
COPY requirements.txt .

# Installiere Dependencies (wird nur neu ausgeführt, wenn die txt ändert)
RUN pip install --no-cache-dir -r requirements.txt

# 4. Erst jetzt den Rest des Codes kopieren
COPY . .

# Port-Freigabe
EXPOSE 8080

# 5. Start-Kommando
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]