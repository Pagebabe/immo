// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form validation and submission
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });

            if (isValid) {
                // Show success message (in a real app, this would submit to server)
                alert('Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.');
                contactForm.reset();
            } else {
                alert('Bitte füllen Sie alle Pflichtfelder aus.');
            }
        });
    }

    // Property search form
    const searchForm = document.querySelector('form[class*="grid"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, this would filter properties
            console.log('Search form submitted');
        });
    }

    // Add loading states to buttons
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Wird verarbeitet...';
            this.disabled = true;
            
            // Reset button after 2 seconds (simulate processing)
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        });
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add scroll effect to header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('bg-white/95', 'backdrop-blur-sm');
            } else {
                header.classList.remove('bg-white/95', 'backdrop-blur-sm');
            }
        });
    }
});

// Utility functions
function formatCurrency(amount, currency = 'THB') {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('de-DE').format(number);
}

// Export for use in other scripts
window.PattayaEstate = {
    formatCurrency,
    formatNumber
};

// Social Proof Logic
const socialProofElement = document.getElementById('social-proof');
if (socialProofElement) {
    // Zeige den Hinweis nach 8 Sekunden an
    setTimeout(() => {
        socialProofElement.classList.remove('hidden');
        socialProofElement.classList.add('animate-fade-in-up');
    }, 8000);

    // Verstecke ihn nach weiteren 10 Sekunden
    setTimeout(() => {
        socialProofElement.style.display = 'none';
    }, 18000);
}

// Funktion zum Schließen der Social Proof Notification
function closeSocialProof() {
    const socialProof = document.getElementById('social-proof');
    if (socialProof) {
        socialProof.style.display = 'none';
    }
}

// KI-Immobilienberater Chatbot Logic
class PattayaEstateChatbot {
    constructor() {
        this.isOpen = false;
        this.conversationState = {
            step: 'welcome',
            preferences: {
                stadtteil: null,
                budget: null,
                immobilientyp: null,
                zimmer: null
            }
        };
        this.init();
    }
    
    init() {
        // Toggle Button
        const toggleBtn = document.getElementById('chatbot-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleChat();
            });
        }
        
        // Close Button
        const closeBtn = document.getElementById('chatbot-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeChat();
            });
        }
        
        // Chat Options
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('chat-option')) {
                this.handleOptionClick(e.target.dataset.option);
            }
        });
        
        // Send Button
        const sendBtn = document.getElementById('chat-send');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        // Enter Key
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }
    
    toggleChat() {
        const window = document.getElementById('chatbot-window');
        if (!window) return;
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            window.classList.remove('hidden');
            window.classList.add('animate-fade-in-up');
        } else {
            window.classList.add('hidden');
        }
    }
    
    closeChat() {
        this.isOpen = false;
        const window = document.getElementById('chatbot-window');
        if (window) {
            window.classList.add('hidden');
        }
    }
    
    addMessage(message, isUser = false, options = null) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start';
        
        if (isUser) {
            messageDiv.innerHTML = `
                <div class="ml-auto bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                    <p class="text-sm">${message}</p>
                </div>
            `;
        } else {
            let optionsHtml = '';
            if (options) {
                optionsHtml = `
                    <div class="mt-3 space-y-2">
                        ${options.map(option => `
                            <button class="chat-option w-full text-left bg-white rounded px-3 py-2 text-sm hover:bg-blue-100 transition-colors" 
                                    data-option="${option.value}">
                                ${option.label}
                            </button>
                        `).join('')}
                    </div>
                `;
            }
            
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <i class="fas fa-robot text-blue-600 text-sm"></i>
                </div>
                <div class="bg-blue-50 rounded-lg p-3 max-w-xs">
                    <p class="text-gray-800 text-sm">${message}</p>
                    ${optionsHtml}
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    handleOptionClick(option) {
        switch (option) {
            case 'immobilie-suchen':
                this.startPropertySearch();
                break;
            case 'frage-kaufprozess':
                this.showKnowledgeOptions();
                break;
            case 'services-beratung':
                this.showServicesOptions();
                break;
            case 'jomtien':
            case 'pratumnak':
            case 'wongamat':
            case 'andere':
                this.conversationState.preferences.stadtteil = option;
                this.askBudget();
                break;
            case 'budget-5m':
            case 'budget-5-10m':
            case 'budget-10-20m':
            case 'budget-20m+':
                this.conversationState.preferences.budget = option;
                this.askPropertyType();
                break;
            case 'condo':
            case 'haus':
            case 'beides':
                this.conversationState.preferences.immobilientyp = option;
                this.askRooms();
                break;
            case 'rooms-1':
            case 'rooms-2':
            case 'rooms-3+':
                this.conversationState.preferences.zimmer = option;
                this.searchProperties();
                break;
            case 'foreign-quota':
            case 'chanote':
            case 'nebenkosten':
                this.showKnowledgeAnswer(option);
                break;
            case 'service-kaufbegleitung':
            case 'service-vermietung':
            case 'service-management':
            case 'service-finanzierung':
            case 'service-visa':
                this.showServiceDetails(option);
                break;
            case 'mensch-berater':
                this.handoffToHuman();
                break;
        }
    }
    
    startPropertySearch() {
        this.addMessage('Großartig! Um Ihnen die besten Optionen zu zeigen, habe ich ein paar kurze Fragen. In welchem Stadtteil suchen Sie hauptsächlich?', false, [
            { value: 'jomtien', label: '🏖️ Jomtien' },
            { value: 'pratumnak', label: '🏔️ Pratumnak' },
            { value: 'wongamat', label: '🌊 Wongamat' },
            { value: 'andere', label: '📍 Andere/Egal' }
        ]);
    }
    
    askBudget() {
        const stadtteil = this.conversationState.preferences.stadtteil;
        let message = 'Verstanden, ';
        
        switch (stadtteil) {
            case 'jomtien':
                message += 'Jomtien ist eine ausgezeichnete Wahl für entspanntes Wohnen am Strand.';
                break;
            case 'pratumnak':
                message += 'Pratumnak bietet exklusive Ruhe und atemberaubende Ausblicke.';
                break;
            case 'wongamat':
                message += 'Wongamat ist bekannt für seine sauberen Privatstrände.';
                break;
            default:
                message += 'eine gute Wahl.';
        }
        
        message += ' Wie hoch ist Ihr ungefähres Budget in Thailändischen Baht?';
        
        this.addMessage(message, false, [
            { value: 'budget-5m', label: '💰 Bis 5 Mio THB' },
            { value: 'budget-5-10m', label: '💰 5-10 Mio THB' },
            { value: 'budget-10-20m', label: '💰 10-20 Mio THB' },
            { value: 'budget-20m+', label: '💰 20 Mio+ THB' }
        ]);
    }
    
    askPropertyType() {
        this.addMessage('Perfekt. Suchen Sie eher ein Condo, ein Haus/Villa oder sind Sie für beides offen?', false, [
            { value: 'condo', label: '🏢 Nur Condo' },
            { value: 'haus', label: '🏡 Nur Haus/Villa' },
            { value: 'beides', label: '🏘️ Beides zeigen' }
        ]);
    }
    
    askRooms() {
        this.addMessage('Alles klar. Letzte Frage: Wie viele Schlafzimmer sollten es mindestens sein?', false, [
            { value: 'rooms-1', label: '🛏️ Studio/1 Zimmer' },
            { value: 'rooms-2', label: '🛏️ 2 Schlafzimmer' },
            { value: 'rooms-3+', label: '🛏️ 3+ Schlafzimmer' }
        ]);
    }
    
    searchProperties() {
        this.addMessage('Einen Moment, bitte. Ich suche in unserer Datenbank nach passenden Objekten...', false);
        
        // Simulate API call
        setTimeout(() => {
            this.showPropertyResults();
        }, 2000);
    }
    
    showPropertyResults() {
        const prefs = this.conversationState.preferences;
        let message = `Ich habe 3 Top-Objekte gefunden, die zu Ihren Wünschen passen!`;
        
        this.addMessage(message, false, [
            { value: 'objekt-1', label: '🏠 Luxus Condo Jomtien - 8.5M THB' },
            { value: 'objekt-2', label: '🏡 Villa mit Pool - 15M THB' },
            { value: 'objekt-3', label: '🏢 Penthouse - 25M THB' },
            { value: 'mensch-berater', label: '👤 Mit Berater sprechen' }
        ]);
    }
    
    showKnowledgeOptions() {
        this.addMessage('Gerne! Wählen Sie ein Thema, über das Sie mehr erfahren möchten:', false, [
            { value: 'foreign-quota', label: '📋 Foreign Quota' },
            { value: 'chanote', label: '📄 Chanote Title Deeds' },
            { value: 'nebenkosten', label: '💰 Nebenkosten & Steuern' },
            { value: 'mensch-berater', label: '👤 Persönliche Beratung' }
        ]);
    }
    
    showKnowledgeAnswer(topic) {
        let message = '';
        let options = [
            { value: 'mensch-berater', label: '👤 Mit Berater sprechen' }
        ];
        
        switch (topic) {
            case 'foreign-quota':
                message = 'Foreign Quota bedeutet, dass bis zu 49% der Gesamtfläche eines Condominium-Gebäudes direkt an Ausländer verkauft werden können. Sie können die Immobilie auf Ihren eigenen Namen erwerben.';
                break;
            case 'chanote':
                message = 'Chanote ist das höchste Eigentumsrecht in Thailand. Es gibt Ihnen vollständige Eigentumsrechte und ist die sicherste Form des Immobilienbesitzes.';
                break;
            case 'nebenkosten':
                message = 'Beim Kauf fallen etwa 5-7% Nebenkosten an: Transfer Tax (2%), Stamp Duty (0.5%), und andere Gebühren. Wir erstellen Ihnen gerne eine detaillierte Aufstellung.';
                break;
        }
        
        this.addMessage(message, false, options);
    }
    
    showServicesOptions() {
        this.addMessage('Gerne! Welchen unserer Services interessiert Sie am meisten?', false, [
            { value: 'service-kaufbegleitung', label: '🤝 Kaufbegleitung' },
            { value: 'service-vermietung', label: '🔑 Vermietungsservice' },
            { value: 'service-management', label: '🏢 Property Management' },
            { value: 'service-finanzierung', label: '💰 Finanzierungsberatung' },
            { value: 'service-visa', label: '📋 Visa-Beratung' },
            { value: 'mensch-berater', label: '👤 Persönliche Beratung' }
        ]);
    }
    
    showServiceDetails(service) {
        let message = '';
        let options = [
            { value: 'mensch-berater', label: '👤 Mit Berater sprechen' }
        ];
        
        switch (service) {
            case 'service-kaufbegleitung':
                message = 'Unsere Kaufbegleitung umfasst: Persönliche Beratung, Immobiliensuche, Besichtigungen, rechtliche Prüfung und Begleitung beim Notartermin. Wir sind bei jedem Schritt an Ihrer Seite.';
                break;
            case 'service-vermietung':
                message = 'Unser Vermietungsservice bietet: Professionelle Vermarktung, Mieterauswahl, Vertragsabwicklung, Mieteinzug und regelmäßige Berichterstattung für maximale Rendite.';
                break;
            case 'service-management':
                message = 'Property Management beinhaltet: Technische Wartung, Hausmeister-Service, Versicherungsangelegenheiten, Notfallmanagement 24/7 und Wertsteigerungsmaßnahmen.';
                break;
            case 'service-finanzierung':
                message = 'Finanzierungsberatung: Wir beraten Sie bei Bankkrediten, Finanzierungsoptionen, Zinsvergleichen und der optimalen Finanzierungsstruktur für Ihr Immobilienprojekt.';
                break;
            case 'service-visa':
                message = 'Visa-Beratung: Unterstützung bei verschiedenen Visa-Optionen für Immobilienbesitzer, Langzeitaufenthalte und die richtige Visa-Strategie für Ihre Situation.';
                break;
        }
        
        this.addMessage(message, false, options);
    }
    
    handoffToHuman() {
        this.addMessage('Selbstverständlich! Meine menschlichen Kollegen können Ihnen eine detaillierte und persönliche Beratung geben. Um Sie direkt mit dem richtigen Experten zu verbinden, benötige ich nur noch Ihren Namen und Ihre bevorzugte Kontaktmethode.', false, [
            { value: 'whatsapp', label: '📱 WhatsApp Beratung' },
            { value: 'telefon', label: '📞 Telefonische Beratung' },
            { value: 'email', label: '✉️ E-Mail Beratung' }
        ]);
    }
    
    sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;
        
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, true);
            input.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                this.addMessage('Vielen Dank für Ihre Nachricht! Ein Experte wird sich in Kürze bei Ihnen melden.', false, [
                    { value: 'mensch-berater', label: '👤 Direkt mit Berater sprechen' }
                ]);
            }, 1000);
        }
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', function() {
    new PattayaEstateChatbot();
});

// =======================================================
// ============= HERO SLIDER INITIALIZATION =============
// =======================================================

// Initialize Hero Slider
document.addEventListener('DOMContentLoaded', function() {
    const heroSlider = new Swiper('.hero-slider', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        speed: 1000,
        grabCursor: true,
    });
    
    // Initialize Property Gallery Slider
    const propertyGallery = new Swiper('.property-gallery', {
        loop: true,
        grabCursor: true, // Zeigt eine "Greif"-Hand als Cursor an

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        speed: 600,
        // Tastatur-Steuerung für Barrierefreiheit am Desktop
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        // Touch-Support für mobile Geräte
        touchRatio: 1,
        touchAngle: 45,
        // Autoplay für bessere UX
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
});

// =======================================================
// ============= PERFORMANCE OPTIMIZATION ===============
// =======================================================

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-image');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

// Global function to open chatbot from buttons
function openChatbot() {
    const chatbot = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    if (chatbot && toggle) {
        chatbot.classList.remove('hidden');
        chatbot.classList.add('animate-fade-in-up');
        toggle.querySelector('span').style.display = 'none'; // Hide notification dot
    }
}

// =======================================================
// ============= CONVERSION TRACKING ====================
// =======================================================

// Track user interactions
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 Event Tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'user_interaction',
            event_label: window.location.pathname,
            ...eventData
        });
    }
    
    // Custom event tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track form submissions
function trackFormSubmission(formType) {
    trackEvent('form_submit', {
        form_type: formType,
        page: window.location.pathname
    });
}

// Track property views
function trackPropertyView(propertyId, propertyType) {
    trackEvent('property_view', {
        property_id: propertyId,
        property_type: propertyType,
        page: window.location.pathname
    });
}

// Track chatbot interactions
function trackChatbotInteraction(interactionType) {
    trackEvent('chatbot_interaction', {
        interaction_type: interactionType,
        page: window.location.pathname
    });
}

// === Social Proof Logic (Optimized) ===
function initSocialProof() {
    const notification = document.getElementById('social-proof-notification');
    if (!notification) return; // Nur ausführen, wenn das Element existiert

    const nameEl = document.getElementById('social-proof-name');
    const cityEl = document.getElementById('social-proof-city');

    const names = ["Markus K.", "Julia S.", "Thomas B.", "Sabine W.", "Peter L.", "David R."];
    const cities = ["Pattaya", "Jomtien", "Naklua", "Bang Saray", "Wong Amat"];

    function showSocialProof() {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomCity = cities[Math.floor(Math.random() * cities.length)];

        if (nameEl) nameEl.textContent = randomName;
        if (cityEl) cityEl.textContent = randomCity;

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000); // 5 Sekunden sichtbar
    }

    // Starte den Zyklus nach 8 Sekunden, wiederhole alle 15 Sekunden
    setTimeout(() => {
        showSocialProof();
        setInterval(showSocialProof, 15000);
    }, 8000);
}

// =======================================================
// ============= MIKRO-INTERAKTIONEN ====================
// =======================================================

// Fade-in Animation Observer
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-section');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
}

// Smooth Scroll für Anker-Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax-Effekt für Hero-Sections
function initParallaxEffect() {
    const heroSections = document.querySelectorAll('.hero-slider-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroSections.forEach(section => {
            const rate = scrolled * -0.5;
            section.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Initialize performance features
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    initPerformanceMonitoring();
    initSocialProof();
    initFadeInAnimations();
    initSmoothScroll();
    initParallaxEffect();
    
    // Track page views
    trackEvent('page_view', {
        page_title: document.title,
        page_url: window.location.href
    });
    
    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const formType = form.getAttribute('data-form-type') || 'contact';
            trackFormSubmission(formType);
        });
    });
    
    // Track property card clicks
    document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const propertyId = card.getAttribute('data-property-id');
            const propertyType = card.getAttribute('data-property-type');
            trackPropertyView(propertyId, propertyType);
        });
    });
});
