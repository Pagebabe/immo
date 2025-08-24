# 🐳 Docker Deployment - Pattaya Living Estate

## 🚀 Schnellstart

### 1. Docker Image bauen
```bash
docker build -t pattaya-living-estate .
```

### 2. Container starten
```bash
docker run -d -p 80:80 --name pattaya-website pattaya-living-estate
```

### 3. Website aufrufen
```
http://localhost
```

## 🐙 Mit Docker Compose (Empfohlen)

### 1. Container starten
```bash
docker-compose up -d
```

### 2. Container stoppen
```bash
docker-compose down
```

### 3. Logs anzeigen
```bash
docker-compose logs -f
```

## 🌐 Online Deployment

### Option 1: Eigenes VPS/Server

1. **Dateien auf Server kopieren:**
```bash
scp -r . user@your-server:/var/www/pattaya-living-estate/
```

2. **Auf Server wechseln:**
```bash
ssh user@your-server
cd /var/www/pattaya-living-estate/
```

3. **Docker Container starten:**
```bash
docker-compose up -d
```

4. **Domain konfigurieren:**
```bash
# Nginx Reverse Proxy (optional)
sudo nano /etc/nginx/sites-available/pattaya-living-estate
```

### Option 2: Cloud Provider

#### AWS EC2:
```bash
# EC2 Instance starten
# Docker installieren
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Website deployen
git clone <your-repo>
cd pattaya-living-estate
docker-compose up -d
```

#### DigitalOcean Droplet:
```bash
# Droplet erstellen
# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Website deployen
git clone <your-repo>
cd pattaya-living-estate
docker-compose up -d
```

#### Google Cloud Platform:
```bash
# VM Instance erstellen
# Docker installieren
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Website deployen
git clone <your-repo>
cd pattaya-living-estate
docker-compose up -d
```

## 🔒 SSL/HTTPS Setup

### Mit Let's Encrypt:
```bash
# Certbot installieren
sudo apt-get install certbot python3-certbot-nginx

# SSL-Zertifikat erstellen
sudo certbot --nginx -d your-domain.com

# Nginx-Konfiguration anpassen
sudo nano /etc/nginx/sites-available/pattaya-living-estate
```

### Docker Compose mit SSL:
```yaml
version: '3.8'
services:
  pattaya-website:
    build: .
    container_name: pattaya-living-estate
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./logs:/var/log/nginx
      - ./ssl:/etc/nginx/ssl
    environment:
      - NGINX_HOST=your-domain.com
    restart: unless-stopped
```

## 📊 Monitoring

### Container-Status prüfen:
```bash
docker ps
docker stats pattaya-website
```

### Logs überwachen:
```bash
docker logs -f pattaya-website
```

### Backup erstellen:
```bash
# Container-Backup
docker commit pattaya-website pattaya-backup:$(date +%Y%m%d)

# Image exportieren
docker save pattaya-living-estate > pattaya-backup.tar
```

## 🔧 Konfiguration

### Umgebungsvariablen:
```bash
# .env Datei erstellen
NGINX_HOST=your-domain.com
NGINX_PORT=80
```

### Nginx-Konfiguration anpassen:
```bash
# nginx.conf bearbeiten
nano nginx.conf

# Container neu starten
docker-compose restart
```

## 🚨 Troubleshooting

### Port bereits belegt:
```bash
# Port prüfen
sudo netstat -tulpn | grep :80

# Anderen Port verwenden
docker run -d -p 8080:80 pattaya-living-estate
```

### Container startet nicht:
```bash
# Logs prüfen
docker logs pattaya-website

# Container neu bauen
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Performance-Optimierung:
```bash
# Nginx Worker-Prozesse anpassen
# In nginx.conf:
worker_processes auto;
worker_connections 1024;
```

## 📈 Skalierung

### Load Balancer Setup:
```yaml
version: '3.8'
services:
  pattaya-website:
    build: .
    deploy:
      replicas: 3
    ports:
      - "80:80"
```

### Reverse Proxy mit Traefik:
```yaml
version: '3.8'
services:
  traefik:
    image: traefik:v2.5
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

  pattaya-website:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.pattaya.rule=Host(`your-domain.com`)"
```

## 🎯 Production Checklist

- [ ] SSL-Zertifikat installiert
- [ ] Domain konfiguriert
- [ ] Backup-Strategie implementiert
- [ ] Monitoring eingerichtet
- [ ] Logs konfiguriert
- [ ] Security-Headers aktiviert
- [ ] Performance optimiert
- [ ] CDN eingerichtet (optional)

## 📞 Support

Bei Problemen:
1. Logs prüfen: `docker logs pattaya-website`
2. Container-Status: `docker ps`
3. Nginx-Konfiguration testen: `docker exec pattaya-website nginx -t`
4. Issue auf GitHub erstellen
