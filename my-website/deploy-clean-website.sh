#!/bin/bash

# Server bereinigen und nur Hugo-Website deployen
echo "🧹 Bereinige Server und deploye nur die Hugo-Website..."

# SSH-Verbindung und Server bereinigen
ssh root@paattaya.space << 'EOF'

echo "=== SERVER KOMPLETT BEREINIGEN ==="

# Alle Docker Container stoppen
echo "Stoppe alle Container..."
docker stop $(docker ps -aq) 2>/dev/null || echo "Keine Container zu stoppen"

# Alle Container entfernen
echo "Entferne alle Container..."
docker rm $(docker ps -aq) 2>/dev/null || echo "Keine Container zu entfernen"

# Docker Compose herunterfahren
echo "Docker Compose herunterfahren..."
docker-compose down 2>/dev/null || echo "Kein docker-compose aktiv"

# Alle Docker Networks entfernen
echo "Entferne alle Networks..."
docker network prune -f

# Alle Docker Volumes entfernen
echo "Entferne alle Volumes..."
docker volume prune -f

# Komplettes Docker System bereinigen
echo "Docker System bereinigen..."
docker system prune -af

# Alle Docker Images entfernen
echo "Entferne alle Images..."
docker rmi $(docker images -aq) 2>/dev/null || echo "Keine Images zu entfernen"

# Verzeichnis bereinigen
echo "Bereinige /root Verzeichnis..."
cd /root
rm -rf * 2>/dev/null || echo "Verzeichnis bereits leer"

echo "=== SERVER BEREINIGT ==="
docker ps -a
docker images
df -h

EOF

echo "✅ Server bereinigt! Jetzt deploye ich die Website..."

# Website-Dateien auf Server kopieren
echo "📁 Kopiere Website-Dateien auf Server..."

# Docker-Dateien kopieren
scp Dockerfile root@paattaya.space:/root/
scp docker-compose.yml root@paattaya.space:/root/
scp nginx.conf root@paattaya.space:/root/
scp .dockerignore root@paattaya.space:/root/

# Hugo-Website kopieren
echo "📄 Kopiere Hugo-Website..."
rsync -avz --exclude='public/' --exclude='.git/' --exclude='node_modules/' ./ root@paattaya.space:/root/website/

# Website auf Server starten
ssh root@paattaya.space << 'EOF'

echo "=== WEBSITE DEPLOYEN ==="

cd /root

# Einfaches docker-compose.yml für nur die Website erstellen
cat > docker-compose.yml << 'COMPOSE_EOF'
services:
  website:
    build:
      context: ./website
      dockerfile: ../Dockerfile
    container_name: paattaya-website
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped
    environment:
      - HUGO_ENV=production
    networks:
      - website-network

networks:
  website-network:
    driver: bridge
COMPOSE_EOF

# Website bauen und starten
echo "Baue und starte Website..."
docker-compose up --build -d

# Status prüfen
echo "=== WEBSITE STATUS ==="
docker ps
docker logs paattaya-website --tail 10

# Website testen
echo "=== WEBSITE TEST ==="
curl -I http://localhost || echo "Website noch nicht bereit"

EOF

echo "✅ Website deployed! Teste Verbindung..."

# Website testen
curl -I https://paattaya.space || echo "Website noch nicht erreichbar"

echo "🎉 Deployment abgeschlossen!"
echo "🌐 Website sollte verfügbar sein unter: https://paattaya.space"
