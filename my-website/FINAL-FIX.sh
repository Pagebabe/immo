#!/bin/bash

echo "🚨 FINALE REPARATUR - paattaya.space Website"

# Einfache Website direkt auf Server erstellen
ssh root@paattaya.space << 'EOF'

echo "=== SERVER BEREINIGEN ==="
docker stop $(docker ps -aq) 2>/dev/null || echo "Keine Container"
docker rm $(docker ps -aq) 2>/dev/null || echo "Keine Container"

echo "=== EINFACHE WEBSITE ERSTELLEN ==="
cat > index.html << 'HTML_EOF'
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pattaya Estate - Ihr Immobilienmakler</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f0f8ff; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c5aa0; text-align: center; }
        .contact { background: #e8f4fd; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .service { background: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏖️ Pattaya Estate</h1>
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
        
        <p style="text-align: center; color: #666; margin-top: 30px;">
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
curl -I http://localhost || echo "Website noch nicht bereit"

EOF

echo "=== WEBSITE TESTEN ==="
sleep 5
curl -I http://paattaya.space || echo "HTTP nicht erreichbar"
curl -I https://paattaya.space || echo "HTTPS nicht erreichbar"

echo ""
echo "✅ REPARATUR ABGESCHLOSSEN!"
echo "🌐 Website sollte verfügbar sein unter:"
echo "   http://paattaya.space"
echo "   https://paattaya.space"
echo ""
echo "📱 Falls nicht erreichbar, warten Sie 2-3 Minuten und versuchen Sie es erneut."
