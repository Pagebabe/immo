#!/bin/bash
# =============================================================================
# PATTAYA LIVING ESTATE - BOOTSTRAP SCRIPT
# =============================================================================
# Automatische Einrichtung und erster Start der Website
# Version: 1.0
# Datum: 2025-09-04
# =============================================================================

set -e  # Exit bei Fehlern

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging-Funktion
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Header
echo "============================================================================="
echo "🏠 PATTAYA LIVING ESTATE - BOOTSTRAP SCRIPT"
echo "============================================================================="
echo ""

# =============================================================================
# 1. SYSTEM-CHECKS
# =============================================================================
log "🔍 System-Checks werden durchgeführt..."

# Hugo Installation prüfen
if ! command -v hugo &> /dev/null; then
    error "Hugo ist nicht installiert. Bitte installieren Sie Hugo: https://gohugo.io/installation/"
fi

HUGO_VERSION=$(hugo version | head -n1 | cut -d' ' -f2)
success "Hugo gefunden: $HUGO_VERSION"

# Git Installation prüfen
if ! command -v git &> /dev/null; then
    error "Git ist nicht installiert. Bitte installieren Sie Git."
fi

success "Git gefunden: $(git --version)"

# Node.js Installation prüfen (optional für htmltest)
if command -v node &> /dev/null; then
    success "Node.js gefunden: $(node --version)"
else
    warning "Node.js nicht gefunden. htmltest wird übersprungen."
fi

echo ""

# =============================================================================
# 2. PROJEKT-SETUP
# =============================================================================
log "📁 Projekt-Setup wird durchgeführt..."

# Aktuelles Verzeichnis prüfen
if [ ! -f "hugo.toml" ]; then
    error "hugo.toml nicht gefunden. Bitte führen Sie das Script im Projekt-Root aus."
fi

success "Projekt-Verzeichnis erkannt"

# Git Status prüfen
if [ -d ".git" ]; then
    success "Git Repository erkannt"
    if [ -n "$(git status --porcelain)" ]; then
        warning "Uncommitted Changes gefunden. Bitte committen Sie diese vor dem Bootstrap."
    fi
else
    warning "Kein Git Repository gefunden. Initialisierung empfohlen."
fi

echo ""

# =============================================================================
# 3. DEPENDENCIES & BUILD
# =============================================================================
log "🔧 Dependencies werden überprüft..."

# Hugo Theme prüfen
if [ ! -d "themes/pattaya-estate" ]; then
    error "Theme 'pattaya-estate' nicht gefunden. Bitte Theme installieren."
fi

success "Theme 'pattaya-estate' gefunden"

# Content-Verzeichnisse prüfen
for lang in en de th; do
    if [ -d "content/$lang" ]; then
        success "Content für Sprache '$lang' gefunden"
    else
        warning "Content für Sprache '$lang' nicht gefunden"
    fi
done

echo ""

# =============================================================================
# 4. BUILD & VALIDATION
# =============================================================================
log "🏗️  Build wird durchgeführt..."

# Clean Build
log "Cleaning previous build..."
rm -rf public/
success "Previous build cleaned"

# Hugo Build
log "Building Hugo site..."
if hugo --minify; then
    success "Hugo Build erfolgreich"
else
    error "Hugo Build fehlgeschlagen"
fi

# Build-Statistiken
TOTAL_PAGES=$(find public -name "*.html" | wc -l)
EN_PAGES=$(find public/en -name "*.html" 2>/dev/null | wc -l)
DE_PAGES=$(find public/de -name "*.html" 2>/dev/null | wc -l)
TH_PAGES=$(find public/th -name "*.html" 2>/dev/null | wc -l)

success "Build abgeschlossen: $TOTAL_PAGES HTML-Seiten generiert"
info "Sprach-Verteilung: EN: $EN_PAGES, DE: $DE_PAGES, TH: $TH_PAGES"

echo ""

# =============================================================================
# 5. I18N VALIDATION
# =============================================================================
log "🌍 i18n Validation wird durchgeführt..."

if hugo --printI18nWarnings > /dev/null 2>&1; then
    success "i18n Validation erfolgreich - keine Warnings"
else
    warning "i18n Warnings gefunden. Bitte überprüfen Sie die Übersetzungen."
fi

echo ""

# =============================================================================
# 6. OPTIONAL: HTMLTEST
# =============================================================================
if command -v htmltest &> /dev/null; then
    log "🔗 Link-Validation wird durchgeführt..."
    
    if [ -f ".htmltest.yml" ]; then
        if htmltest; then
            success "Link-Validation erfolgreich"
        else
            warning "Link-Validation fehlgeschlagen - bitte überprüfen Sie die Links"
        fi
    else
        warning ".htmltest.yml nicht gefunden - Link-Validation übersprungen"
    fi
else
    warning "htmltest nicht installiert - Link-Validation übersprungen"
fi

echo ""

# =============================================================================
# 7. FEATURE-STATUS
# =============================================================================
log "⚡ Feature-Status wird überprüft..."

# P0 Features prüfen
P0_FEATURES=0
if [ -f "themes/pattaya-estate/layouts/partials/lead-form.html" ]; then
    ((P0_FEATURES++))
fi
if [ -f "themes/pattaya-estate/layouts/partials/analytics.html" ]; then
    ((P0_FEATURES++))
fi
if [ -f "themes/pattaya-estate/layouts/partials/meta-og.html" ]; then
    ((P0_FEATURES++))
fi

# P2 Features prüfen
P2_FEATURES=0
if [ -f "themes/pattaya-estate/layouts/partials/currency-switcher.html" ]; then
    ((P2_FEATURES++))
fi
if [ -f "themes/pattaya-estate/layouts/partials/search-box.html" ]; then
    ((P2_FEATURES++))
fi
if [ -f "themes/pattaya-estate/layouts/partials/compare-drawer.html" ]; then
    ((P2_FEATURES++))
fi

success "P0 Features: $P0_FEATURES/3 aktiv"
success "P2 Features: $P2_FEATURES/3 aktiv"

echo ""

# =============================================================================
# 8. DEVELOPMENT SERVER
# =============================================================================
log "🚀 Development Server wird gestartet..."

# Port prüfen
PORT=1313
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    warning "Port $PORT bereits belegt. Verwende Port 1314."
    PORT=1314
fi

success "Development Server startet auf Port $PORT"
echo ""
echo "============================================================================="
echo "🎉 BOOTSTRAP ERFOLGREICH ABGESCHLOSSEN!"
echo "============================================================================="
echo ""
echo "📊 BUILD-STATISTIKEN:"
echo "   • Hugo Version: $HUGO_VERSION"
echo "   • Generierte Seiten: $TOTAL_PAGES"
echo "   • EN: $EN_PAGES, DE: $DE_PAGES, TH: $TH_PAGES"
echo "   • Port: $PORT"
echo "   • P0 Features: $P0_FEATURES/3"
echo "   • P2 Features: $P2_FEATURES/3"
echo ""
echo "🌐 WEBSITE ZUGRIFF:"
echo "   • Local: http://localhost:$PORT"
echo "   • Network: http://$(hostname -I | awk '{print $1}' 2>/dev/null || echo 'localhost'):$PORT"
echo ""
echo "📁 WICHTIGE VERZEICHNISSE:"
echo "   • Content: content/"
echo "   • Theme: themes/pattaya-estate/"
echo "   • Build: public/"
echo "   • Config: hugo.toml"
echo ""
echo "🔧 NÜTZLICHE COMMANDS:"
echo "   • Build: hugo --minify"
echo "   • Server: hugo server -D --bind 0.0.0.0 --port $PORT"
echo "   • i18n Check: hugo --printI18nWarnings"
echo "   • Clean: rm -rf public/"
echo ""
echo "⚠️  NÄCHSTE SCHRITTE:"
echo "   1. Website testen: http://localhost:$PORT"
echo "   2. Wechselkurse in hugo.toml aktualisieren"
echo "   3. Property-Koordinaten (lat/lng) ergänzen"
echo "   4. GitHub Repository für Deployment einrichten"
echo ""
echo "============================================================================="

# Development Server starten
echo ""
log "Starting Hugo Development Server..."
echo "Drücken Sie Ctrl+C zum Beenden"
echo ""

hugo server -D --bind 0.0.0.0 --port $PORT
