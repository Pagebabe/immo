#!/bin/bash

# Pattaya Space Server Connection Script
echo "🔗 Verbinde mit paattaya.space Server..."

# SSH-Verbindung mit Passwort
ssh -o StrictHostKeyChecking=no root@paattaya.space

# Nach der Verbindung können Sie folgende Befehle ausführen:
echo ""
echo "📋 Nützliche Server-Befehle:"
echo "docker ps                    # Container-Status anzeigen"
echo "docker logs paattaya-website # Website-Logs anzeigen"
echo "docker logs paattaya-n8n     # n8n-Logs anzeigen"
echo "docker logs paattaya-traefik # Traefik-Logs anzeigen"
echo "docker-compose ps            # Alle Services anzeigen"
echo "ls -la                       # Dateien auflisten"
echo "pwd                          # Aktuelles Verzeichnis"
echo ""
echo "🔧 Website-Deployment:"
echo "cd /root && ls -la           # Website-Dateien anzeigen"
echo "docker-compose restart website # Website neu starten"
