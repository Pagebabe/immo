#!/bin/bash

# Server "platt machen" - Alle Services stoppen
echo "🛑 Stoppe alle Services auf paattaya.space..."

# SSH-Verbindung und alle Container stoppen
ssh root@paattaya.space << 'EOF'

echo "=== ALLE DOCKER CONTAINER STOPPEN ==="
docker stop $(docker ps -aq) 2>/dev/null || echo "Keine Container zu stoppen"

echo ""
echo "=== ALLE CONTAINER ENTFERNEN ==="
docker rm $(docker ps -aq) 2>/dev/null || echo "Keine Container zu entfernen"

echo ""
echo "=== DOCKER COMPOSE DOWN ==="
docker-compose down 2>/dev/null || echo "Kein docker-compose aktiv"

echo ""
echo "=== ALLE DOCKER NETWORKS ENTFERNEN ==="
docker network prune -f

echo ""
echo "=== ALLE DOCKER VOLUMES ENTFERNEN ==="
docker volume prune -f

echo ""
echo "=== DOCKER SYSTEM CLEANUP ==="
docker system prune -af

echo ""
echo "=== VERBLEIBENDE CONTAINER PRÜFEN ==="
docker ps -a

echo ""
echo "=== VERBLEIBENDE IMAGES PRÜFEN ==="
docker images

echo ""
echo "=== SYSTEM STATUS ==="
df -h
free -h

EOF

echo "✅ Server wurde 'platt gemacht' - alle Services gestoppt!"
