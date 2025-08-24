// ======================================================= 
// ============= GOOGLE SHEETS CMS INTEGRATION ===========
// ======================================================= 

// Fallback-Datenbank (wird überschrieben, wenn Google Sheets verfügbar ist)
let propertiesDatabase = [
    {
        id: "PLE-001",
        title: "Luxus Condominium in Jomtien",
        type: "condominium",
        status: "sale",
        price: 8500000,
        priceType: "sale", // sale oder rent
        location: "Jomtien Beach Road",
        district: "jomtien",
        bedrooms: 2,
        bathrooms: 2,
        size: 85,
        floor: 15,
        features: ["Meerblick", "Pool", "Fitness", "24h Security"],
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
        description: "Exklusives Condo mit Meerblick in Top-Lage von Jomtien",
        isNew: true,
        url: "/immobilien/jomtien-condo-85qm/"
    },
    {
        id: "PLE-002",
        title: "Villa mit Pool in Pratumnak",
        type: "villa",
        status: "rent",
        price: 45000,
        priceType: "rent",
        location: "Pratumnak Hill",
        district: "pratumnak",
        bedrooms: 3,
        bathrooms: 3,
        size: 200,
        features: ["Privatpool", "Garten", "Parkplatz", "Terrasse"],
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
        description: "Luxuriöse Villa mit Privatpool und Garten",
        isNew: false,
        url: "/immobilien/pratumnak-villa-pool/"
    },
    {
        id: "PLE-003",
        title: "Penthouse in Wongamat",
        type: "penthouse",
        status: "sale",
        price: 25000000,
        priceType: "sale",
        location: "Wongamat Beach",
        district: "wongamat",
        bedrooms: 4,
        bathrooms: 4,
        size: 300,
        features: ["Dachterrasse", "Meerblick", "Privatpool", "Lift"],
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop",
        description: "Exklusives Penthouse mit Dachterrasse und Meerblick",
        isNew: false,
        url: "/immobilien/wongamat-penthouse/"
    },
    {
        id: "PLE-004",
        title: "Studio Apartment Central",
        type: "studio",
        status: "rent",
        price: 15000,
        priceType: "rent",
        location: "Central Pattaya",
        district: "central-pattaya",
        bedrooms: 1,
        bathrooms: 1,
        size: 35,
        floor: 8,
        features: ["Zentrale Lage", "Balkon", "Klimaanlage"],
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2076&auto=format&fit=crop",
        description: "Kompaktes Studio in zentraler Lage",
        isNew: false,
        url: "/immobilien/central-studio/"
    },
    {
        id: "PLE-005",
        title: "Bauland in Naklua",
        type: "land",
        status: "sale",
        price: 12000000,
        priceType: "sale",
        location: "Naklua, Pattaya",
        district: "naklua",
        size: 800,
        features: ["Baurecht", "Meerblick", "Straßenzugang"],
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop",
        description: "Baureifes Grundstück mit Meerblick",
        isNew: false,
        url: "/immobilien/naklua-bauland/"
    },
    {
        id: "PLE-006",
        title: "Luxus Villa mit Garten",
        type: "villa",
        status: "sale",
        price: 35000000,
        priceType: "sale",
        location: "Pratumnak",
        district: "pratumnak",
        bedrooms: 5,
        bathrooms: 4,
        size: 450,
        features: ["Garten", "Privatpool", "Garage", "Terrasse"],
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
        description: "Luxuriöse Villa mit großem Garten",
        isNew: false,
        url: "/immobilien/pratumnak-luxus-villa/"
    },
    {
        id: "PLE-007",
        title: "Condo mit Meerblick Jomtien",
        type: "condominium",
        status: "sale",
        price: 6500000,
        priceType: "sale",
        location: "Jomtien Beach",
        district: "jomtien",
        bedrooms: 2,
        bathrooms: 2,
        size: 75,
        floor: 12,
        features: ["Meerblick", "Balkon", "Pool", "Fitness"],
        image: "https://images.unsplash.com/photo-1590892211130-2a8a3a4041b3?q=80&w=2070&auto=format&fit=crop",
        description: "Gemütliches Condo mit Meerblick",
        isNew: true,
        url: "/immobilien/jomtien-condo-meerblick/"
    },
    {
        id: "PLE-008",
        title: "Haus in East Pattaya",
        type: "house",
        status: "rent",
        price: 35000,
        priceType: "rent",
        location: "East Pattaya",
        district: "east-pattaya",
        bedrooms: 3,
        bathrooms: 2,
        size: 180,
        features: ["Garten", "Terrasse", "Parkplatz"],
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
        description: "Familienfreundliches Haus mit Garten",
        isNew: false,
        url: "/immobilien/east-pattaya-haus/"
    }
];

// ======================================================= 
// ============= FILTER & SORTIERUNG LOGIK ===============
// ======================================================= 

class PropertyManager {
    constructor() {
        this.properties = [...propertiesDatabase];
        this.filteredProperties = [...propertiesDatabase];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.filters = {
            type: '',
            district: '',
            status: '',
            minPrice: '',
            maxPrice: '',
            bedrooms: ''
        };
        this.sortBy = 'date';
        this.sortOrder = 'desc';
    }

    // Filter anwenden
    applyFilters() {
        this.filteredProperties = this.properties.filter(property => {
            // Typ Filter
            if (this.filters.type && property.type !== this.filters.type) return false;
            
            // Stadtteil Filter
            if (this.filters.district && property.district !== this.filters.district) return false;
            
            // Status Filter
            if (this.filters.status && property.status !== this.filters.status) return false;
            
            // Preis Filter
            if (this.filters.minPrice && property.price < parseInt(this.filters.minPrice)) return false;
            if (this.filters.maxPrice && property.price > parseInt(this.filters.maxPrice)) return false;
            
            // Schlafzimmer Filter
            if (this.filters.bedrooms && property.bedrooms < parseInt(this.filters.bedrooms)) return false;
            
            return true;
        });

        this.sortProperties();
        this.currentPage = 1;
        this.updateURL();
        this.renderProperties();
    }

    // Sortierung anwenden
    sortProperties() {
        this.filteredProperties.sort((a, b) => {
            let comparison = 0;
            
            switch (this.sortBy) {
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'size':
                    comparison = a.size - b.size;
                    break;
                case 'date':
                    comparison = a.isNew ? 1 : -1;
                    break;
                default:
                    comparison = 0;
            }
            
            return this.sortOrder === 'desc' ? -comparison : comparison;
        });
    }

    // Sortierung ändern
    changeSort(sortBy, sortOrder = 'asc') {
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.sortProperties();
        this.currentPage = 1;
        this.updateURL();
        this.renderProperties();
    }

    // Paginierung
    getCurrentPageProperties() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredProperties.slice(startIndex, endIndex);
    }

    // Zur nächsten Seite
    nextPage() {
        const maxPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage);
        if (this.currentPage < maxPages) {
            this.currentPage++;
            this.updateURL();
            this.renderProperties();
        }
    }

    // Zur vorherigen Seite
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateURL();
            this.renderProperties();
        }
    }

    // Zu bestimmter Seite
    goToPage(page) {
        const maxPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage);
        if (page >= 1 && page <= maxPages) {
            this.currentPage = page;
            this.updateURL();
            this.renderProperties();
        }
    }

    // URL Parameter aktualisieren
    updateURL() {
        const params = new URLSearchParams();
        
        Object.keys(this.filters).forEach(key => {
            if (this.filters[key]) {
                params.set(key, this.filters[key]);
            }
        });
        
        if (this.sortBy !== 'date') {
            params.set('sort', this.sortBy);
            params.set('order', this.sortOrder);
        }
        
        if (this.currentPage > 1) {
            params.set('page', this.currentPage);
        }
        
        const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.pushState({}, '', newURL);
    }

    // URL Parameter laden
    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        Object.keys(this.filters).forEach(key => {
            const value = params.get(key);
            if (value) {
                this.filters[key] = value;
                // UI Elemente aktualisieren
                const element = document.querySelector(`[name="${key}"]`);
                if (element) element.value = value;
            }
        });
        
        const sort = params.get('sort');
        const order = params.get('order');
        if (sort) {
            this.sortBy = sort;
            this.sortOrder = order || 'asc';
        }
        
        const page = params.get('page');
        if (page) {
            this.currentPage = parseInt(page);
        }
        
        this.applyFilters();
    }

    // Properties rendern
    renderProperties() {
        const container = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        if (!container) return;

        const properties = this.getCurrentPageProperties();
        
        container.innerHTML = properties.map(property => this.createPropertyCard(property)).join('');
        
        this.updateResultsInfo();
        this.updatePagination();
        this.updateJSONLD();
    }

    // Property Card HTML erstellen
    createPropertyCard(property) {
        const priceText = property.priceType === 'rent' 
            ? `฿${property.price.toLocaleString()}/Monat`
            : `฿${property.price.toLocaleString()}`;
            
        const statusText = property.status === 'sale' ? 'Zum Verkauf' : 'Zur Miete';
        const statusClass = property.status === 'sale' ? 'bg-blue-600' : 'bg-green-600';
        
        const features = property.features ? property.features.slice(0, 3).join(' • ') : '';
        
        return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow card-hover">
                <div class="relative">
                    <img src="${property.image}" alt="${property.title}" class="w-full h-64 object-cover" loading="lazy" decoding="async">
                    <div class="absolute top-4 right-4 ${statusClass} text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ${statusText}
                    </div>
                    ${property.isNew ? '<div class="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">Neu</div>' : ''}
                    <div class="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        <i class="fas fa-map-marker-alt mr-1"></i>${this.getDistrictName(property.district)}
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${property.title}</h3>
                    <p class="text-gray-600 mb-2">${property.location}</p>
                    <p class="text-gray-600 mb-4">
                        ${property.bedrooms ? property.bedrooms + ' Schlafzimmer • ' : ''}
                        ${property.bathrooms ? property.bathrooms + ' Badezimmer • ' : ''}
                        ${property.size}m²
                        ${property.floor ? ' • ' + property.floor + '. Stock' : ''}
                    </p>
                    ${features ? `<p class="text-gray-500 text-sm mb-4">${features}</p>` : ''}
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-blue-600">${priceText}</span>
                        <a href="${property.url}" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Details
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Stadtteil-Name abrufen
    getDistrictName(district) {
        const districts = {
            'jomtien': 'Jomtien',
            'pratumnak': 'Pratumnak',
            'wongamat': 'Wongamat',
            'naklua': 'Naklua',
            'central-pattaya': 'Central',
            'east-pattaya': 'East Pattaya'
        };
        return districts[district] || district;
    }

    // Ergebnisse-Info aktualisieren
    updateResultsInfo() {
        const infoElement = document.querySelector('.text-gray-600');
        if (infoElement) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredProperties.length);
            infoElement.innerHTML = `Zeige <span class="font-semibold">${start}-${end}</span> von <span class="font-semibold">${this.filteredProperties.length}</span> Immobilien`;
        }
    }

    // Paginierung aktualisieren
    updatePagination() {
        const paginationContainer = document.querySelector('.flex.justify-center.mt-12');
        if (!paginationContainer) return;

        const maxPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage);
        
        if (maxPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        
        let paginationHTML = '';
        
        // Zurück Button
        paginationHTML += `<a href="#" class="px-3 py-2 text-gray-500 hover:text-blue-600 ${this.currentPage === 1 ? 'pointer-events-none' : ''}" onclick="propertyManager.prevPage()">← Zurück</a>`;
        
        // Seitenzahlen
        for (let i = 1; i <= maxPages; i++) {
            if (i === 1 || i === maxPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `<a href="#" class="px-3 py-2 ${i === this.currentPage ? 'bg-blue-600 text-white rounded-lg' : 'text-gray-700 hover:text-blue-600'}" onclick="propertyManager.goToPage(${i})">${i}</a>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span class="px-3 py-2 text-gray-400">...</span>`;
            }
        }
        
        // Weiter Button
        paginationHTML += `<a href="#" class="px-3 py-2 text-gray-500 hover:text-blue-600 ${this.currentPage === maxPages ? 'pointer-events-none' : ''}" onclick="propertyManager.nextPage()">Weiter →</a>`;
        
        paginationContainer.innerHTML = paginationHTML;
    }

    // JSON-LD für SEO aktualisieren
    updateJSONLD() {
        const jsonLdElement = document.getElementById('properties-json-ld');
        if (!jsonLdElement) return;

        const currentProperties = this.getCurrentPageProperties();
        
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Immobilien in Pattaya",
            "description": "Auswahl an Immobilien in Pattaya zum Kauf und zur Miete",
            "numberOfItems": this.filteredProperties.length,
            "itemListElement": currentProperties.map((property, index) => ({
                "@type": "ListItem",
                "position": (this.currentPage - 1) * this.itemsPerPage + index + 1,
                "item": {
                    "@type": "Product",
                    "name": property.title,
                    "url": `https://www.pattaya-living-estate.com${property.url}`,
                    "image": property.image,
                    "description": property.description,
                    "offers": {
                        "@type": "Offer",
                        "priceCurrency": "THB",
                        "price": property.price.toString(),
                        "availability": "https://schema.org/InStock"
                    }
                }
            }))
        };

        jsonLdElement.textContent = JSON.stringify(jsonLd, null, 2);
    }
}

// ======================================================= 
// ============= GOOGLE SHEETS DATA LOADER ===============
// ======================================================= 

// Funktion zum Laden der Daten von Google Sheets
async function loadPropertiesFromGoogleSheets() {
    try {
        console.log('🔄 Lade Immobilien-Daten von Google Sheets...');
        
        const response = await fetch('/.netlify/functions/get-properties');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Google Sheets Daten in unser Format konvertieren
        const convertedData = data.map(row => ({
            id: row.id || `PLE-${Math.random().toString(36).substr(2, 9)}`,
            title: row.title || 'Unbekanntes Objekt',
            type: row.type || 'condominium',
            status: row.status || 'sale',
            price: parseFloat(row.price) || 0,
            priceType: row.status === 'rent' ? 'rent' : 'sale',
            location: row.location || 'Pattaya',
            district: row.district || 'central-pattaya',
            bedrooms: parseInt(row.bedrooms) || 0,
            bathrooms: parseInt(row.bathrooms) || 0,
            size: parseInt(row.area) || 0,
            floor: parseInt(row.floor) || null,
            features: row.features ? row.features.split(',').map(f => f.trim()) : [],
            image: row.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
            description: row.description || 'Keine Beschreibung verfügbar',
            isNew: row.isNew === 'true' || row.isNew === true,
            url: row.detail_url || `/immobilien/${row.id || 'objekt'}/`
        }));
        
        // Datenbank aktualisieren
        propertiesDatabase = convertedData;
        
        console.log(`✅ ${convertedData.length} Immobilien von Google Sheets geladen`);
        
        // Property Manager neu initialisieren
        if (propertyManager) {
            propertyManager.properties = [...propertiesDatabase];
            propertyManager.filteredProperties = [...propertiesDatabase];
            propertyManager.loadFromURL();
        }
        
        return convertedData;
        
    } catch (error) {
        console.error('❌ Fehler beim Laden von Google Sheets:', error);
        console.log('🔄 Verwende Fallback-Datenbank...');
        return propertiesDatabase; // Fallback zu lokalen Daten
    }
}

// ======================================================= 
// ============= INITIALISIERUNG =========================
// ======================================================= 

let propertyManager;

document.addEventListener('DOMContentLoaded', async function() {
    // Erst Google Sheets Daten laden, dann Property Manager initialisieren
    await loadPropertiesFromGoogleSheets();
    
    propertyManager = new PropertyManager();
    
    // Event Listeners für Filter
    const filterElements = document.querySelectorAll('select[name], input[name]');
    filterElements.forEach(element => {
        element.addEventListener('change', function() {
            propertyManager.filters[this.name] = this.value;
            propertyManager.applyFilters();
        });
    });
    
    // Event Listener für Sortierung
    const sortSelect = document.querySelector('select[name="sort"]');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            propertyManager.changeSort(this.value);
        });
    }
    
    // URL Parameter laden und initial rendern
    propertyManager.loadFromURL();
    
    // Refresh-Button für Google Sheets Daten (für Entwicklung)
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('netlify.app')) {
        const refreshButton = document.createElement('button');
        refreshButton.innerHTML = '🔄 Daten aktualisieren';
        refreshButton.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50';
        refreshButton.onclick = async () => {
            refreshButton.innerHTML = '⏳ Lade...';
            await loadPropertiesFromGoogleSheets();
            refreshButton.innerHTML = '✅ Aktualisiert!';
            setTimeout(() => {
                refreshButton.innerHTML = '🔄 Daten aktualisieren';
            }, 2000);
        };
        document.body.appendChild(refreshButton);
    }
});
