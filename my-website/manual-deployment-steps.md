# 🚀 MANUELLE DEPLOYMENT-ANLEITUNG

## Schritt 1: Server bereinigen

```bash
# SSH-Verbindung herstellen
ssh root@paattaya.space
# Passwort: Fuckthematrix123!

# Alle Container stoppen
docker stop $(docker ps -aq)

# Alle Container entfernen
docker rm $(docker ps -aq)

# Docker System bereinigen
docker system prune -af

# Alle Images entfernen
docker rmi $(docker images -aq)

# Verzeichnis bereinigen
cd /root
rm -rf *
```

## Schritt 2: Website-Dateien kopieren

```bash
# In einem neuen Terminal (lokal):
# Docker-Dateien kopieren
scp Dockerfile root@paattaya.space:/root/
scp docker-compose-server.yml root@paattaya.space:/root/docker-compose.yml
scp nginx.conf root@paattaya.space:/root/

# Website-Dateien kopieren
rsync -avz --exclude='public/' --exclude='.git/' --exclude='node_modules/' ./ root@paattaya.space:/root/website/
```

## Schritt 3: Website starten

```bash
# Auf dem Server:
cd /root

# Website bauen und starten
docker-compose up --build -d

# Status prüfen
docker ps
docker logs paattaya-website
```

## Schritt 4: Website testen

```bash
# Website testen
curl -I http://localhost
curl -I https://paattaya.space
```

## 🎯 ERWARTETES ERGEBNIS

- ✅ Server komplett bereinigt
- ✅ Nur Hugo-Website läuft in Docker
- ✅ Website erreichbar unter https://paattaya.space
- ✅ Alle anderen Services entfernt
