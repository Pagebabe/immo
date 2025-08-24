// ======================================================= 
// ============= IMMOBILIEN DETAIL LOGIK =================
// ======================================================= 

class PropertyDetailManager {
    constructor() {
        this.property = null;
        this.propertyId = this.getPropertyIdFromURL();
        this.init();
    }

    // Property ID aus URL extrahieren
    getPropertyIdFromURL() {
        const path = window.location.pathname;
        const segments = path.split('/');
        const lastSegment = segments[segments.length - 1];
        
        // Mapping von URL-Segmenten zu Property IDs
        const urlToIdMap = {
            'jomtien-condo-85qm': 'PLE-001',
            'pratumnak-villa-pool': 'PLE-002',
            'wongamat-penthouse': 'PLE-003',
            'central-studio': 'PLE-004',
            'naklua-bauland': 'PLE-005',
            'pratumnak-luxus-villa': 'PLE-006',
            'jomtien-condo-meerblick': 'PLE-007',
            'east-pattaya-haus': 'PLE-008'
        };
        
        return urlToIdMap[lastSegment] || 'PLE-001';
    }

    // Initialisierung
    init() {
        this.loadProperty();
        this.initSwiper();
    }

    // Property laden
    loadProperty() {
        this.property = propertiesDatabase.find(p => p.id === this.propertyId);
        
        if (!this.property) {
            this.property = propertiesDatabase[0]; // Fallback
        }
        
        this.updatePageContent();
        this.updateMetaTags();
        this.updateJSONLD();
    }

    // Seiteninhalt aktualisieren
    updatePageContent() {
        // Titel und Beschreibung
        document.getElementById('property-title').textContent = this.property.title;
        document.getElementById('property-location').textContent = this.property.location;
        document.getElementById('property-description').textContent = this.property.description;
        
        // Breadcrumb
        document.getElementById('breadcrumb-title').textContent = this.property.title;
        
        // Galerie
        this.updateGallery();
        
        // Features
        this.updateFeatures();
        
        // Details Sidebar
        this.updatePropertyDetails();
        
        // WhatsApp Link
        this.updateWhatsAppLink();
        
        // Karte
        this.updateMap();
    }

    // Galerie aktualisieren
    updateGallery() {
        const galleryWrapper = document.getElementById('gallery-wrapper');
        
        // Hauptbild + zusätzliche Bilder (falls vorhanden)
        const images = [
            this.property.image,
            // Hier könnten weitere Bilder hinzugefügt werden
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop'
        ];
        
        galleryWrapper.innerHTML = images.map((image, index) => `
            <div class="swiper-slide">
                <img src="${image}" alt="${this.property.title} - Bild ${index + 1}" class="w-full h-96 object-cover">
            </div>
        `).join('');
    }

    // Features aktualisieren
    updateFeatures() {
        const featuresGrid = document.getElementById('features-grid');
        
        const allFeatures = [
            ...(this.property.features || []),
            this.property.bedrooms ? `${this.property.bedrooms} Schlafzimmer` : null,
            this.property.bathrooms ? `${this.property.bathrooms} Badezimmer` : null,
            this.property.size ? `${this.property.size}m²` : null,
            this.property.floor ? `${this.property.floor}. Stock` : null
        ].filter(Boolean);
        
        featuresGrid.innerHTML = allFeatures.map(feature => `
            <div class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                <span class="text-gray-700">${feature}</span>
            </div>
        `).join('');
    }

    // Property Details aktualisieren
    updatePropertyDetails() {
        const detailsContainer = document.getElementById('property-details');
        
        const priceText = this.property.priceType === 'rent' 
            ? `฿${this.property.price.toLocaleString()}/Monat`
            : `฿${this.property.price.toLocaleString()}`;
            
        const statusText = this.property.status === 'sale' ? 'Zum Verkauf' : 'Zur Miete';
        
        detailsContainer.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="text-gray-600">Status:</span>
                <span class="font-semibold ${this.property.status === 'sale' ? 'text-blue-600' : 'text-green-600'}">${statusText}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-gray-600">Preis:</span>
                <span class="text-2xl font-bold text-blue-600">${priceText}</span>
            </div>
            ${this.property.bedrooms ? `
            <div class="flex justify-between items-center">
                <span class="text-gray-600">Schlafzimmer:</span>
                <span class="font-semibold">${this.property.bedrooms}</span>
            </div>
            ` : ''}
            ${this.property.bathrooms ? `
            <div class="flex justify-between items-center">
                <span class="text-gray-600">Badezimmer:</span>
                <span class="font-semibold">${this.property.bathrooms}</span>
            </div>
            ` : ''}
            <div class="flex justify-between items-center">
                <span class="text-gray-600">Größe:</span>
                <span class="font-semibold">${this.property.size}m²</span>
            </div>
            ${this.property.floor ? `
            <div class="flex justify-between items-center">
                <span class="text-gray-600">Stockwerk:</span>
                <span class="font-semibold">${this.property.floor}</span>
            </div>
            ` : ''}
            <div class="flex justify-between items-center">
                <span class="text-gray-600">Stadtteil:</span>
                <span class="font-semibold">${this.getDistrictName(this.property.district)}</span>
            </div>
            ${this.property.isNew ? `
            <div class="flex justify-between items-center">
                <span class="text-gray-600">Status:</span>
                <span class="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">Neu</span>
            </div>
            ` : ''}
        `;
    }

    // WhatsApp Link aktualisieren
    updateWhatsAppLink() {
        const whatsappLink = document.getElementById('whatsapp-link');
        const message = `Hallo! Ich interessiere mich für ${this.property.title} (${this.property.location}). Können Sie mir mehr Informationen geben?`;
        const encodedMessage = encodeURIComponent(message);
        whatsappLink.href = `https://wa.me/66381234567?text=${encodedMessage}`;
    }

    // Karte aktualisieren
    updateMap() {
        const mapIframe = document.getElementById('map-iframe');
        
        // Koordinaten für verschiedene Stadtteile
        const coordinates = {
            'jomtien': '12.8889,100.8767',
            'pratumnak': '12.9167,100.8833',
            'wongamat': '12.9667,100.8833',
            'naklua': '12.9667,100.9000',
            'central-pattaya': '12.9333,100.8833',
            'east-pattaya': '12.9333,100.9000'
        };
        
        const coords = coordinates[this.property.district] || '12.9333,100.8833';
        mapIframe.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${coords}`;
    }

    // Meta Tags aktualisieren
    updateMetaTags() {
        const title = `${this.property.title} | ${this.property.location} | Pattaya Living Estate`;
        const description = `${this.property.description} ${this.property.location}. ${this.property.priceType === 'rent' ? 'Zur Miete' : 'Zum Verkauf'}.`;
        const url = `https://www.pattaya-living-estate.com${this.property.url}`;
        
        // Title
        document.title = title;
        document.getElementById('page-title').textContent = title;
        
        // Description
        document.getElementById('page-description').content = description;
        
        // Canonical
        document.getElementById('page-canonical').href = url;
        
        // OpenGraph
        document.getElementById('og-title').content = title;
        document.getElementById('og-description').content = description;
        document.getElementById('og-url').content = url;
        document.getElementById('og-image').content = this.property.image;
        
        // Twitter
        document.getElementById('twitter-title').content = title;
        document.getElementById('twitter-description').content = description;
        document.getElementById('twitter-image').content = this.property.image;
    }

    // JSON-LD aktualisieren
    updateJSONLD() {
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": this.property.title,
            "image": this.property.image,
            "description": this.property.description,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "THB",
                "price": this.property.price.toString(),
                "availability": "https://schema.org/InStock",
                "seller": {
                    "@type": "RealEstateAgent",
                    "name": "Pattaya Living Estate"
                }
            }
        };
        
        document.getElementById('json-ld').textContent = JSON.stringify(jsonLd, null, 2);
    }

    // Stadtteil-Name abrufen
    getDistrictName(district) {
        const districts = {
            'jomtien': 'Jomtien',
            'pratumnak': 'Pratumnak',
            'wongamat': 'Wongamat',
            'naklua': 'Naklua',
            'central-pattaya': 'Central Pattaya',
            'east-pattaya': 'East Pattaya'
        };
        return districts[district] || district;
    }

    // Swiper initialisieren
    initSwiper() {
        new Swiper('.property-gallery', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        });
    }
}

// ======================================================= 
// ============= INITIALISIERUNG =========================
// ======================================================= 

let propertyDetailManager;

document.addEventListener('DOMContentLoaded', function() {
    propertyDetailManager = new PropertyDetailManager();
});
