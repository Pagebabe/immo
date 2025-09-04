#!/bin/bash

# Deploy Script für paattaya.space
# Passwort: Fuckthematrix123!

echo "🚀 Deploying to paattaya.space..."

# 1. Website lokal bauen
echo "📦 Building website locally..."
docker-compose build --no-cache

# 2. Statische Dateien extrahieren
echo "📁 Extracting static files..."
docker run --rm -v $(pwd)/public:/output my-website-hugo-website cp -r /usr/share/nginx/html/* /output/

# 3. SSH-Verbindung zum Server
echo "🔐 Connecting to server..."
ssh root@paattaya.space << 'EOF'
    # Server-Status prüfen
    echo "=== SERVER STATUS ==="
    whoami
    pwd
    ls -la
    
    echo "=== SYSTEM INFO ==="
    uname -a
    df -h
    free -h
    
    echo "=== RUNNING SERVICES ==="
    systemctl list-units --type=service --state=running | head -20
    
    echo "=== NGINX STATUS ==="
    systemctl status nginx || echo "Nginx not running"
    
    echo "=== APACHE STATUS ==="
    systemctl status apache2 || echo "Apache not running"
    
    echo "=== DOCKER STATUS ==="
    docker ps || echo "Docker not running"
    
    echo "=== WEBSITE DIRECTORY ==="
    ls -la /var/www/ || echo "No /var/www directory"
    ls -la /var/www/html/ || echo "No /var/www/html directory"
    
    echo "=== LOGS ==="
    echo "--- Nginx Error Log ---"
    tail -20 /var/log/nginx/error.log 2>/dev/null || echo "No nginx error log"
    
    echo "--- Apache Error Log ---"
    tail -20 /var/log/apache2/error.log 2>/dev/null || echo "No apache error log"
    
    echo "--- System Log ---"
    tail -20 /var/log/syslog 2>/dev/null || echo "No syslog"
    
    echo "=== NETWORK STATUS ==="
    netstat -tlnp | grep :80
    netstat -tlnp | grep :443
    
    echo "=== DISK USAGE ==="
    du -sh /var/www/* 2>/dev/null || echo "No /var/www content"
    
EOF

echo "✅ Server analysis complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review the server logs above"
echo "2. Upload your website files"
echo "3. Configure web server"
echo ""
echo "🔧 To upload files, run:"
echo "scp -r ./public/* root@paattaya.space:/var/www/html/"
