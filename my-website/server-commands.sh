#!/bin/bash

# Serverprotokolle und Status-Befehle für paattaya.space
echo "🔍 Serverprotokolle für paattaya.space abrufen..."

# SSH-Verbindung herstellen und Befehle ausführen
ssh root@paattaya.space << 'EOF'

echo "=== DOCKER CONTAINER STATUS ==="
docker ps

echo ""
echo "=== WEBSITE LOGS ==="
docker logs paattaya-website --tail 20

echo ""
echo "=== N8N LOGS ==="
docker logs paattaya-n8n --tail 20

echo ""
echo "=== TRAEFIK LOGS ==="
docker logs paattaya-traefik --tail 20

echo ""
echo "=== SYSTEM STATUS ==="
df -h
free -h
uptime

echo ""
echo "=== WEBSITE FILES ==="
ls -la /root/
ls -la /root/public/ 2>/dev/null || echo "Kein public Verzeichnis"

echo ""
echo "=== DOCKER COMPOSE STATUS ==="
docker-compose ps

EOF

echo "✅ Serverprotokolle abgerufen!"
