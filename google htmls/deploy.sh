#!/bin/bash

# Pattaya Living Estate - Deployment Script
# Verwendung: ./deploy.sh [server-type]

set -e

echo "🏠 Pattaya Living Estate - Deployment Script"
echo "=============================================="

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funktionen
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Prüfe ob Docker installiert ist
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker ist nicht installiert!"
        echo "Installation: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon läuft nicht!"
        echo "Starten Sie Docker Desktop oder den Docker-Service"
        exit 1
    fi
    
    print_success "Docker ist verfügbar"
}

# Docker Deployment
deploy_docker() {
    print_warning "Docker Image wird gebaut..."
    docker build -t pattaya-living-estate .
    
    print_warning "Alten Container stoppen (falls vorhanden)..."
    docker stop pattaya-website 2>/dev/null || true
    docker rm pattaya-website 2>/dev/null || true
    
    print_warning "Neuen Container starten..."
    docker run -d -p 80:80 --name pattaya-website pattaya-living-estate
    
    print_success "Website läuft auf http://localhost"
}

# Docker Compose Deployment
deploy_compose() {
    print_warning "Docker Compose wird gestartet..."
    docker-compose down 2>/dev/null || true
    docker-compose up -d --build
    
    print_success "Website läuft auf http://localhost"
}

# Nginx Deployment (für VPS)
deploy_nginx() {
    print_warning "Nginx Deployment wird vorbereitet..."
    
    # Prüfe ob Nginx installiert ist
    if ! command -v nginx &> /dev/null; then
        print_error "Nginx ist nicht installiert!"
        echo "Installation: sudo apt-get install nginx"
        exit 1
    fi
    
    # Website-Dateien kopieren
    sudo mkdir -p /var/www/pattaya-living-estate
    sudo cp -r . /var/www/pattaya-living-estate/
    sudo chown -R www-data:www-data /var/www/pattaya-living-estate
    
    # Nginx-Konfiguration erstellen
    sudo tee /etc/nginx/sites-available/pattaya-living-estate > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    root /var/www/pattaya-living-estate;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    # Site aktivieren
    sudo ln -sf /etc/nginx/sites-available/pattaya-living-estate /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    
    print_success "Website läuft auf http://$(hostname -I | awk '{print $1}')"
}

# Apache Deployment
deploy_apache() {
    print_warning "Apache Deployment wird vorbereitet..."
    
    # Prüfe ob Apache installiert ist
    if ! command -v apache2 &> /dev/null; then
        print_error "Apache ist nicht installiert!"
        echo "Installation: sudo apt-get install apache2"
        exit 1
    fi
    
    # Website-Dateien kopieren
    sudo mkdir -p /var/www/pattaya-living-estate
    sudo cp -r . /var/www/pattaya-living-estate/
    sudo chown -R www-data:www-data /var/www/pattaya-living-estate
    
    # Apache Virtual Host erstellen
    sudo tee /etc/apache2/sites-available/pattaya-living-estate.conf > /dev/null <<EOF
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot /var/www/pattaya-living-estate
    
    <Directory /var/www/pattaya-living-estate>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog \${APACHE_LOG_DIR}/pattaya-error.log
    CustomLog \${APACHE_LOG_DIR}/pattaya-access.log combined
</VirtualHost>
EOF
    
    # Site aktivieren
    sudo a2ensite pattaya-living-estate
    sudo systemctl reload apache2
    
    print_success "Website läuft auf http://$(hostname -I | awk '{print $1}')"
}

# Hauptfunktion
main() {
    case "${1:-docker}" in
        "docker")
            check_docker
            deploy_docker
            ;;
        "compose")
            check_docker
            deploy_compose
            ;;
        "nginx")
            deploy_nginx
            ;;
        "apache")
            deploy_apache
            ;;
        "help"|"-h"|"--help")
            echo "Verwendung: $0 [server-type]"
            echo ""
            echo "Server-Typen:"
            echo "  docker   - Docker Container (Standard)"
            echo "  compose  - Docker Compose"
            echo "  nginx    - Nginx auf VPS/Server"
            echo "  apache   - Apache auf VPS/Server"
            echo "  help     - Diese Hilfe anzeigen"
            ;;
        *)
            print_error "Unbekannter Server-Typ: $1"
            echo "Verwenden Sie '$0 help' für verfügbare Optionen"
            exit 1
            ;;
    esac
}

# Script ausführen
main "$@"
