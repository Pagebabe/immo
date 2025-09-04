#!/bin/bash

echo "🚨 NOTFALL-REPARATUR für paattaya.space"

# Direkte SSH-Verbindung mit allen Reparatur-Befehlen
expect << 'EOF'
spawn ssh root@paattaya.space
expect "password:"
send "Fuckthematrix123!\r"
expect "#"

# Server bereinigen
send "docker stop \$(docker ps -aq) 2>/dev/null\r"
expect "#"
send "docker rm \$(docker ps -aq) 2>/dev/null\r"
expect "#"
send "docker system prune -f\r"
expect "#"

# Nginx direkt installieren
send "apt update && apt install -y nginx\r"
expect "#"
send "systemctl stop apache2 2>/dev/null || true\r"
expect "#"

# Website erstellen
send "mkdir -p /var/www/html\r"
expect "#"
send "cat > /var/www/html/index.html << 'HTML_EOF'\r"
send "<!DOCTYPE html>\r"
send "<html><head><title>Pattaya Estate</title></head>\r"
send "<body><h1>Pattaya Estate</h1><p>Website läuft!</p></body>\r"
send "</html>\r"
send "HTML_EOF\r"
expect "#"

# Nginx starten
send "systemctl start nginx\r"
expect "#"
send "systemctl enable nginx\r"
expect "#"

# Firewall öffnen
send "ufw allow 80\r"
expect "#"
send "ufw allow 443\r"
expect "#"

# Status prüfen
send "systemctl status nginx\r"
expect "#"
send "curl -I http://localhost\r"
expect "#"
send "netstat -tlnp | grep :80\r"
expect "#"

send "exit\r"
expect eof
EOF

echo "✅ Notfall-Reparatur abgeschlossen!"
echo "🌐 Teste Website: http://paattaya.space"

# Website testen
curl -I http://paattaya.space
curl -I https://paattaya.space
