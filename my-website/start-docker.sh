#!/bin/bash

# Pattaya Estate Website - Docker Start Script

echo "🐳 Starte Pattaya Estate Website in Docker..."

# Prüfe ob Docker läuft
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker ist nicht gestartet. Bitte starten Sie Docker Desktop."
    exit 1
fi

# Stoppe eventuell laufende Container
echo "🛑 Stoppe eventuell laufende Container..."
docker-compose down

# Baue und starte die Container
echo "🔨 Baue Docker-Image..."
docker-compose build --no-cache

echo "🚀 Starte Container..."
docker-compose up -d

# Warte kurz und zeige Status
sleep 3
echo "📊 Container-Status:"
docker-compose ps

echo ""
echo "✅ Website ist verfügbar unter:"
echo "   🌐 http://localhost:8080"
echo "   🌐 https://paattaya.space (mit SSL)"
echo ""
echo "📝 Logs anzeigen: docker-compose logs -f"
echo "🛑 Stoppen: docker-compose down"
