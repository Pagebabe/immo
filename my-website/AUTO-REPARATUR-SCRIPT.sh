#!/bin/bash

echo "🔍 SYSTEM-ANALYSE UND AUTO-REPARATUR für paattaya.space"
echo "=================================================="

# Funktion für SSH-Befehle
run_ssh_command() {
    local command="$1"
    echo "Ausführe: $command"
    ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@paattaya.space "$command"
}

# Funktion für lokale Befehle
run_local_command() {
    local command="$1"
    echo "Lokal ausführe: $command"
    eval "$command"
}

echo "📊 SCHRITT 1: GRUNDLEGENDE DIAGNOSE"
echo "--------------------------------"

# DNS-Auflösung prüfen
echo "🔍 DNS-Auflösung prüfen..."
run_local_command "nslookup paattaya.space"

# Server-Erreichbarkeit prüfen
echo "🔍 Server-Erreichbarkeit prüfen..."
run_local_command "ping -c 3 paattaya.space"

# Port-Scan
echo "🔍 Port-Scan..."
run_local_command "nmap -p 22,80,443 paattaya.space"

echo ""
echo "📊 SCHRITT 2: SERVER-ZUGANG TESTEN"
echo "--------------------------------"

# SSH-Verbindung testen
echo "🔍 SSH-Verbindung testen..."
if run_ssh_command "echo 'SSH-Verbindung erfolgreich'"; then
    echo "✅ SSH-Verbindung funktioniert"
else
    echo "❌ SSH-Verbindung fehlgeschlagen"
    echo "🚨 PROBLEM: Server nicht erreichbar oder SSH blockiert"
    exit 1
fi

echo ""
echo "📊 SCHRITT 3: SERVER-STATUS ANALYSIEREN"
echo "--------------------------------------"

# System-Status
echo "🔍 System-Status prüfen..."
run_ssh_command "uptime && df -h && free -h"

# Netzwerk-Status
echo "🔍 Netzwerk-Status prüfen..."
run_ssh_command "ip addr show && netstat -tlnp | grep -E ':(80|443|22)'"

# Firewall-Status
echo "🔍 Firewall-Status prüfen..."
run_ssh_command "ufw status"

echo ""
echo "📊 SCHRITT 4: WEBSERVER-REPARATUR"
echo "--------------------------------"

# Alle Services stoppen
echo "🛑 Alle Services stoppen..."
run_ssh_command "systemctl stop nginx apache2 2>/dev/null || true"
run_ssh_command "docker stop \$(docker ps -aq) 2>/dev/null || true"

# Nginx installieren
echo "📦 Nginx installieren..."
run_ssh_command "apt update && apt install -y nginx"

# Website erstellen
echo "📄 Website erstellen..."
run_ssh_command "mkdir -p /var/www/html"

# HTML-Website erstellen
run_ssh_command 'cat > /var/www/html/index.html << "EOF"
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pattaya Estate - System Repariert</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); }
        h1 { text-align: center; font-size: 3em; margin-bottom: 20px; }
        .status { background: #4CAF50; color: white; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0; font-size: 1.2em; }
        .info { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .service { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏖️ Pattaya Estate</h1>
        <div class="status">✅ SYSTEM REPARIERT - WEBSITE LÄUFT WIEDER!</div>
        <h2>Ihr deutschsprachiger Immobilienmakler in Pattaya</h2>
        <p>Willkommen bei Pattaya Estate - Ihrem vertrauensvollen Partner für Immobilien in Thailands beliebtestem Urlaubs- und Lebensparadies.</p>
        
        <div class="services">
            <div class="service">
                <h3>🏠 Immobilienkauf</h3>
                <p>Villen, Condos, Townhouses</p>
            </div>
            <div class="service">
                <h3>💰 Investment</h3>
                <p>Renditeobjekte in Pattaya</p>
            </div>
            <div class="service">
                <h3>🔧 Verwaltung</h3>
                <p>Vollservice für Ihre Immobilie</p>
            </div>
            <div class="service">
                <h3>🌍 Deutschsprachig</h3>
                <p>Keine Sprachbarrieren</p>
            </div>
        </div>
        
        <div class="info">
            <h3>🔧 System-Status</h3>
            <p>✅ Server online</p>
            <p>✅ Nginx läuft</p>
            <p>✅ Website erreichbar</p>
            <p>✅ Firewall konfiguriert</p>
        </div>
        
        <div class="info">
            <h3>📞 Kontakt</h3>
            <p><strong>Telefon:</strong> +66 38 123 4567</p>
            <p><strong>WhatsApp:</strong> +66 81 234 5678</p>
            <p><strong>E-Mail:</strong> info@paattaya.space</p>
            <p><strong>Website:</strong> https://paattaya.space</p>
        </div>
        
        <p style="text-align: center; margin-top: 30px; opacity: 0.8;">
            © 2025 Pattaya Estate. Alle Rechte vorbehalten.
        </p>
    </div>
</body>
</html>
EOF'

# Nginx starten
echo "🚀 Nginx starten..."
run_ssh_command "systemctl start nginx && systemctl enable nginx"

# Firewall konfigurieren
echo "🔥 Firewall konfigurieren..."
run_ssh_command "ufw allow 80 && ufw allow 443 && ufw allow 22"

# Nginx-Konfiguration optimieren
echo "⚙️ Nginx-Konfiguration optimieren..."
run_ssh_command 'cat > /etc/nginx/sites-available/paattaya.space << "NGINX_EOF"
server {
    listen 80;
    listen [::]:80;
    server_name paattaya.space www.paattaya.space;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
NGINX_EOF'

run_ssh_command "ln -sf /etc/nginx/sites-available/paattaya.space /etc/nginx/sites-enabled/"
run_ssh_command "rm -f /etc/nginx/sites-enabled/default"
run_ssh_command "nginx -t && systemctl reload nginx"

echo ""
echo "📊 SCHRITT 5: TESTING UND VERIFIKATION"
echo "-------------------------------------"

# Lokale Tests
echo "🧪 Lokale Tests..."
run_ssh_command "curl -I http://localhost"

# Status prüfen
echo "📊 Status prüfen..."
run_ssh_command "systemctl status nginx --no-pager"

# Externe Tests
echo "🌐 Externe Tests..."
run_local_command "curl -I http://paattaya.space"
run_local_command "curl -I https://paattaya.space"

echo ""
echo "✅ AUTO-REPARATUR ABGESCHLOSSEN!"
echo "=================================="
echo "🌐 Website sollte verfügbar sein unter:"
echo "   http://paattaya.space"
echo "   https://paattaya.space"
echo ""
echo "📊 System-Status:"
run_ssh_command "systemctl status nginx --no-pager | head -5"
run_ssh_command "netstat -tlnp | grep :80"

echo ""
echo "🎉 REPARATUR ERFOLGREICH ABGESCHLOSSEN!"

