# Multi-stage build für Hugo Website
FROM alpine:latest AS builder

# Installiere Hugo
RUN apk add --no-cache hugo

# Arbeitsverzeichnis setzen
WORKDIR /src

# Hugo-Konfiguration und Inhalte kopieren
COPY . .

# Website bauen
RUN hugo --minify

# Production stage mit nginx
FROM nginx:alpine

# Nginx-Konfiguration kopieren
COPY nginx.conf /etc/nginx/nginx.conf

# Gebaute Website aus dem Builder-Stage kopieren
COPY --from=builder /src/public /usr/share/nginx/html

# Port 80 freigeben
EXPOSE 80

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]
