#!/bin/bash

echo "🚨 NOTFALL-REPARATUR für paattaya.space"

# Schritt 1: Server-Status prüfen
echo "🔍 Prüfe Server-Status..."
ssh root@paattaya.space << 'EOF'
echo "=== SYSTEM STATUS ==="
uptime
df -h
free -h

echo "=== DOCKER STATUS ==="
docker ps -a
docker images

echo "=== NETWORK STATUS ==="
netstat -tlnp | grep :80
netstat -tlnp | grep :443

echo "=== VERZEICHNIS INHALT ==="
ls -la /root/
EOF

# Schritt 2: Website neu starten
echo "🚀 Starte Website neu..."
ssh root@paattaya.space << 'EOF'
cd /root

# Falls docker-compose.yml existiert
if [ -f "docker-compose.yml" ]; then
    echo "Docker Compose gefunden - starte neu..."
    docker-compose down
    docker-compose up --build -d
else
    echo "Kein docker-compose.yml - erstelle einfache Website..."
    
    # Einfache nginx Website erstellen
    cat > index.html << 'HTML_EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Pattaya Estate - Temporäre Seite</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>🏖️ Pattaya Estate</h1>
    <p>Website wird repariert...</p>
    <p>Ihr deutschsprachiger Immobilienmakler in Pattaya</p>
</body>
</html>
HTML_EOF

    # Einfacher nginx Container
    docker run -d --name paattaya-website \
        -p 80:80 -p 443:443 \
        -v /root/index.html:/usr/share/nginx/html/index.html:ro \
        --restart unless-stopped \
        nginx:alpine
fi

echo "=== FINAL STATUS ==="
docker ps
curl -I http://localhost || echo "Website noch nicht bereit"
EOF

# Schritt 3: Testen
echo "🧪 Teste Website..."
sleep 5
curl -I http://paattaya.space || echo "HTTP nicht erreichbar"
curl -I https://paattaya.space || echo "HTTPS nicht erreichbar"

echo "✅ Notfall-Reparatur abgeschlossen!"
echo "🌐 Website sollte verfügbar sein unter: http://paattaya.space"
