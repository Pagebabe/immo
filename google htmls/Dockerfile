# Verwende offizielles Nginx Image
FROM nginx:alpine

# Kopiere die Website-Dateien in den Nginx HTML-Ordner
COPY . /usr/share/nginx/html/

# Kopiere eine benutzerdefinierte Nginx-Konfiguration
COPY nginx.conf /etc/nginx/nginx.conf

# Exponiere Port 80
EXPOSE 80

# Starte Nginx
CMD ["nginx", "-g", "daemon off;"]
