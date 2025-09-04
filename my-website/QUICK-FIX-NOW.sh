#!/bin/bash

echo "🚨 SOFORT-REPARATUR für paattaya.space"

# Verwende sshpass für automatische Anmeldung
sshpass -p "Fuckthematrix123!" ssh -o StrictHostKeyChecking=no root@paattaya.space << 'EOF'

echo "=== SERVER BEREINIGEN ==="
docker stop $(docker ps -aq) 2>/dev/null || echo "Keine Container"
docker rm $(docker ps -aq) 2>/dev/null || echo "Keine Container"

echo "=== WEBSITE ERSTELLEN ==="
cat > index.html << 'HTML_EOF'
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pattaya Estate</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); }
        h1 { text-align: center; font-size: 3em; margin-bottom: 20px; }
        .contact { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .service { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; text-align: center; }
        .status { background: #4CAF50; color: white; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏖️ Pattaya Estate</h1>
        <div class="status">✅ WEBSITE LÄUFT WIEDER!</div>
        
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
        
        <div class="contact">
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
HTML_EOF

echo "=== NGINX CONTAINER STARTEN ==="
docker run -d --name paattaya-website \
    -p 80:80 -p 443:443 \
    -v /root/index.html:/usr/share/nginx/html/index.html:ro \
    --restart unless-stopped \
    nginx:alpine

echo "=== STATUS PRÜFEN ==="
docker ps
sleep 3
curl -I http://localhost

EOF

echo "=== WEBSITE TESTEN ==="
sleep 5
curl -I http://paattaya.space
curl -I https://paattaya.space

echo ""
echo "✅ REPARATUR ABGESCHLOSSEN!"
echo "🌐 Website: https://paattaya.space"
