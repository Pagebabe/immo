#!/bin/bash

echo "🚀 Deploye my-website auf paattaya.space Server..."

# Schritt 1: Server bereinigen
echo "🧹 Bereinige Server..."
ssh root@paattaya.space << 'EOF'
docker stop $(docker ps -aq) 2>/dev/null || echo "Keine Container"
docker rm $(docker ps -aq) 2>/dev/null || echo "Keine Container"
docker system prune -af
cd /root && rm -rf *
echo "✅ Server bereinigt"
EOF

# Schritt 2: Dateien kopieren
echo "📁 Kopiere Dateien..."
scp Dockerfile root@paattaya.space:/root/
scp docker-compose-server.yml root@paattaya.space:/root/docker-compose.yml
scp nginx.conf root@paattaya.space:/root/
rsync -avz --exclude='public/' --exclude='.git/' --exclude='node_modules/' ./ root@paattaya.space:/root/website/

# Schritt 3: Website starten
echo "🚀 Starte Website..."
ssh root@paattaya.space << 'EOF'
cd /root
docker-compose up --build -d
docker ps
echo "✅ Website gestartet"
EOF

# Schritt 4: Testen
echo "🧪 Teste Website..."
curl -I https://paattaya.space

echo "🎉 Deployment abgeschlossen!"
echo "🌐 Website: https://paattaya.space"
