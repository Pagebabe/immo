// =======================================================
// ============= DIGITAL CONCIERGE LOGIC ================
// =======================================================

// Import der Wissensdatenbank
import { findBestAnswer, generateSuggestions } from './knowledgeBase.js';

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('concierge-toggle');
    const chat = document.getElementById('concierge-chat');
    const close = document.getElementById('concierge-close');
    const messages = document.getElementById('concierge-messages');

    if (!toggle || !chat || !close || !messages) {
        console.log('Concierge elements not found');
        return;
    }

    let currentState = 'start';
    let isFreeTextMode = false;

    // === Das Gehirn des Concierge: Konversations-Struktur ===
    const conversationFlows = {
        start: {
            message: "👋 Hallo! Ich bin Ihr digitaler Immobilien-Concierge. Wie kann ich Ihnen heute helfen?",
            options: [
                { text: "🏠 Ich möchte eine Immobilie kaufen", next: "buy_start" },
                { text: "💰 Ich möchte meine Immobilie verkaufen", next: "sell_start" },
                { text: "📅 Einen Beratungstermin vereinbaren", next: "schedule_start" },
                { text: "❓ Allgemeine Fragen zu Pattaya", next: "general_questions" },
                { text: "💬 Freie Frage stellen", next: "free_text_mode" }
            ]
        },
        
        free_text_mode: {
            message: "💬 Perfekt! Sie können mir jetzt Ihre Frage direkt eingeben. Ich werde versuchen, Ihnen die beste Antwort zu geben.",
            action: 'enable_text_input'
        },
        
        buy_start: {
            message: "Ausgezeichnet! Um Ihnen die besten Angebote zu zeigen, habe ich ein paar kurze Fragen. Was für eine Art von Immobilie suchen Sie?",
            options: [
                { text: "🏢 Ein Condominium", next: "buy_condo_budget" },
                { text: "🏡 Ein Haus / Eine Villa", next: "buy_house_budget" },
                { text: "🏗️ Ein Grundstück", next: "buy_land_budget" }
            ]
        },
        
        buy_condo_budget: {
            message: "Verstanden, ein Condominium. Was ist Ihr ungefähres Budget in Thailändischen Baht?",
            options: [
                { text: "💵 Unter 5 Mio. THB", next: "buy_condo_location" },
                { text: "💰 5-10 Mio. THB", next: "buy_condo_location" },
                { text: "💎 10-20 Mio. THB", next: "buy_condo_location" },
                { text: "👑 Über 20 Mio. THB", next: "buy_condo_location" }
            ]
        },
        
        buy_condo_location: {
            message: "Perfekt! In welchem Stadtteil von Pattaya suchen Sie hauptsächlich?",
            options: [
                { text: "🏖️ Jomtien", next: "buy_condo_rooms" },
                { text: "🏔️ Pratumnak", next: "buy_condo_rooms" },
                { text: "💎 Wongamat", next: "buy_condo_rooms" },
                { text: "🌊 Naklua", next: "buy_condo_rooms" },
                { text: "🤷 Egal, zeigen Sie mir alles", next: "buy_condo_rooms" }
            ]
        },
        
        buy_condo_rooms: {
            message: "Alles klar! Wie viele Schlafzimmer sollten es mindestens sein?",
            options: [
                { text: "🛏️ Studio/1 Zimmer", next: "show_results" },
                { text: "🛌 2 Schlafzimmer", next: "show_results" },
                { text: "🛏️ 3+ Schlafzimmer", next: "show_results" }
            ]
        },
        
        sell_start: {
            message: "Gerne unterstützen wir Sie beim Verkauf! Um eine kostenlose Bewertung zu starten, sagen Sie mir bitte, um was für eine Immobilie es sich handelt.",
            options: [
                { text: "🏢 Ein Condominium", next: "sell_details" },
                { text: "🏡 Ein Haus / Eine Villa", next: "sell_details" },
                { text: "🏗️ Ein Grundstück", next: "sell_details" }
            ]
        },
        
        sell_details: {
            message: "Verstanden! Für eine präzise Bewertung benötige ich noch ein paar Details. In welchem Stadtteil befindet sich Ihre Immobilie?",
            options: [
                { text: "🏖️ Jomtien", next: "sell_valuation" },
                { text: "🏔️ Pratumnak", next: "sell_valuation" },
                { text: "💎 Wongamat", next: "sell_valuation" },
                { text: "🌊 Naklua", next: "sell_valuation" },
                { text: "📍 Anderer Stadtteil", next: "sell_valuation" }
            ]
        },
        
        sell_valuation: {
            message: "Perfekt! Ich kann Ihnen eine kostenlose Bewertung anbieten. Möchten Sie, dass ein Experte Ihre Immobilie besichtigt und eine professionelle Bewertung erstellt?",
            options: [
                { text: "✅ Ja, kostenlose Bewertung", next: "schedule_valuation" },
                { text: "📞 Erstmal telefonisch besprechen", next: "schedule_start" }
            ]
        },
        
        schedule_start: {
            message: "Sehr gerne! Ein persönliches Gespräch ist immer am besten. Wollen wir einen Termin für einen Video-Call oder eine persönliche Besprechung finden?",
            options: [
                { text: "📹 Video-Call (Zoom/Skype)", next: "schedule_getName" },
                { text: "🤝 Persönliches Treffen in Pattaya", next: "schedule_getName" },
                { text: "📞 Telefonat", next: "schedule_getName" }
            ]
        },
        
        schedule_getName: {
            message: "Perfekt! Um den Termin zu vereinbaren, benötige ich noch Ihren Namen.",
            options: [
                { text: "📝 Name eingeben", next: "schedule_getContact" }
            ]
        },
        
        schedule_getContact: {
            message: "Vielen Dank! Wie können wir Sie am besten erreichen?",
            options: [
                { text: "📧 Per E-Mail", next: "schedule_success" },
                { text: "📱 Per WhatsApp", next: "schedule_success" },
                { text: "📞 Per Telefon", next: "schedule_success" }
            ]
        },
        
        schedule_valuation: {
            message: "Ausgezeichnet! Ein Experte wird sich innerhalb von 24 Stunden bei Ihnen melden, um einen Termin für die kostenlose Bewertung zu vereinbaren.",
            options: [
                { text: "✅ Verstanden, vielen Dank!", next: "end" }
            ]
        },
        
        schedule_success: {
            message: "Perfekt! Ein Berater wird sich innerhalb von 2 Stunden bei Ihnen melden, um den Termin zu bestätigen. Vielen Dank für Ihr Vertrauen!",
            options: [
                { text: "✅ Verstanden, vielen Dank!", next: "end" }
            ]
        },
        
        show_results: {
            message: "Einen Moment, bitte. Ich suche in unserer Datenbank nach passenden Immobilien...",
            options: [
                { text: "🏠 Immobilien anzeigen", next: "show_properties" }
            ]
        },
        
        show_properties: {
            message: "Ich habe 3 Top-Immobilien für Sie gefunden! Möchten Sie diese ansehen oder direkt mit einem Berater sprechen?",
            options: [
                { text: "🏠 Immobilien anzeigen", next: "redirect_properties" },
                { text: "📞 Mit Berater sprechen", next: "schedule_start" }
            ]
        },
        
        redirect_properties: {
            message: "Perfekt! Ich leite Sie zu unseren Immobilien weiter. Dort können Sie alle Details einsehen und direkt Kontakt aufnehmen.",
            options: [
                { text: "🏠 Zu den Immobilien", next: "end" }
            ]
        },
        
        general_questions: {
            message: "Gerne beantworte ich Ihre Fragen zu Pattaya! Was möchten Sie wissen?",
            options: [
                { text: "🏖️ Beste Stadtteile", next: "districts_info" },
                { text: "💰 Lebenshaltungskosten", next: "costs_info" },
                { text: "📋 Kaufprozess", next: "process_info" },
                { text: "📞 Direkt mit Berater sprechen", next: "schedule_start" }
            ]
        },
        
        districts_info: {
            message: "Pattaya hat viele verschiedene Stadtteile, jeder mit seinem eigenen Charme. Jomtien ist entspannt und familienfreundlich, Pratumnak ist exklusiv mit Meerblick, Wongamat ist luxuriös, und Central Pattaya ist lebhaft und zentral gelegen.",
            options: [
                { text: "🏠 Immobilien in diesen Stadtteilen", next: "redirect_properties" },
                { text: "📞 Persönliche Beratung", next: "schedule_start" }
            ]
        },
        
        costs_info: {
            message: "Die Lebenshaltungskosten in Pattaya sind deutlich niedriger als in Deutschland. Ein Condo kostet zwischen 3-15 Mio. THB, die monatlichen Nebenkosten sind etwa 2.000-5.000 THB.",
            options: [
                { text: "🏠 Immobilien anzeigen", next: "redirect_properties" },
                { text: "📞 Detaillierte Beratung", next: "schedule_start" }
            ]
        },
        
        process_info: {
            message: "Der Kaufprozess ist einfacher als Sie denken! Als Ausländer können Sie Condos direkt kaufen (Foreign Quota), für Häuser gibt es verschiedene Lösungen. Wir begleiten Sie durch den gesamten Prozess.",
            options: [
                { text: "🏠 Immobilien anzeigen", next: "redirect_properties" },
                { text: "📞 Beratung zum Kaufprozess", next: "schedule_start" }
            ]
        },
        
        end: {
            message: "Vielen Dank für das Gespräch! Ein Berater wird sich bald bei Ihnen melden. Haben Sie noch weitere Fragen?",
            options: [
                { text: "🏠 Immobilien anzeigen", next: "redirect_properties" },
                { text: "📞 Weitere Beratung", next: "schedule_start" },
                { text: "👋 Nein, danke", next: "start" }
            ]
        }
    };

    // === Funktionen ===
    function displayMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-4 ${isUser ? 'text-right' : 'text-left'}`;
        
        const messageBubble = document.createElement('div');
        messageBubble.className = `inline-block p-3 rounded-lg max-w-xs ${
            isUser 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800'
        }`;
        messageBubble.textContent = message;
        
        messageDiv.appendChild(messageBubble);
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    function displayOptions(options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'space-y-2 mt-4';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm';
            button.textContent = option.text;
            button.onclick = () => handleUserChoice(option.next);
            optionsDiv.appendChild(button);
        });
        
        messages.appendChild(optionsDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    function displayTextInput() {
        const inputDiv = document.createElement('div');
        inputDiv.className = 'mt-4';
        inputDiv.innerHTML = `
            <div class="flex space-x-2">
                <input type="text" 
                       id="concierge-text-input" 
                       placeholder="Ihre Frage eingeben..." 
                       class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button id="concierge-send-btn" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;
        
        messages.appendChild(inputDiv);
        messages.scrollTop = messages.scrollHeight;
        
        // Event Listeners für Text-Eingabe
        const input = document.getElementById('concierge-text-input');
        const sendBtn = document.getElementById('concierge-send-btn');
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleTextInput();
            }
        });
        
        sendBtn.addEventListener('click', handleTextInput);
        
        // Focus auf Input
        input.focus();
    }

    function handleTextInput() {
        const input = document.getElementById('concierge-text-input');
        const userInput = input.value.trim();
        
        if (!userInput) return;
        
        // Benutzer-Nachricht anzeigen
        displayMessage(userInput, true);
        
        // Input-Feld entfernen
        input.parentElement.remove();
        
        // Antwort aus Wissensdatenbank suchen
        const answer = findBestAnswer(userInput);
        
        if (answer) {
            // Antwort aus Wissensdatenbank anzeigen
            displayMessage(answer.answer);
            
            // Vorschläge generieren
            const suggestions = generateSuggestions(userInput);
            displaySuggestions(suggestions);
        } else {
            // Keine Antwort gefunden
            displayMessage("Entschuldigung, dazu habe ich keine spezifische Information. Möchten Sie eine andere Frage stellen oder mit einem Berater sprechen?");
            
            displayOptions([
                { text: "💬 Andere Frage stellen", next: "free_text_mode" },
                { text: "📞 Mit Berater sprechen", next: "schedule_start" },
                { text: "🏠 Immobilien anzeigen", next: "redirect_properties" }
            ]);
        }
    }

    function displaySuggestions(suggestions) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'mt-4';
        suggestionsDiv.innerHTML = '<p class="text-sm text-gray-600 mb-2">Weitere Fragen:</p>';
        
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'block w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-sm mb-1';
            button.textContent = suggestion;
            button.onclick = () => {
                displayMessage(suggestion, true);
                const answer = findBestAnswer(suggestion);
                if (answer) {
                    displayMessage(answer.answer);
                }
            };
            suggestionsDiv.appendChild(button);
        });
        
        messages.appendChild(suggestionsDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    function handleUserChoice(nextState) {
        if (nextState === 'redirect_properties') {
            window.location.href = '/immobilien.html';
            return;
        }
        
        if (nextState === 'free_text_mode') {
            currentState = nextState;
            const flow = conversationFlows[nextState];
            displayMessage(flow.message);
            displayTextInput();
            return;
        }
        
        if (nextState === 'end') {
            displayMessage("Vielen Dank für das Gespräch! Ein Berater wird sich bald bei Ihnen melden.", false);
            setTimeout(() => {
                currentState = 'start';
                messages.innerHTML = '';
                displayMessage(conversationFlows.start.message);
                displayOptions(conversationFlows.start.options);
            }, 3000);
            return;
        }
        
        currentState = nextState;
        const flow = conversationFlows[nextState];
        
        if (flow) {
            displayMessage(flow.message);
            if (flow.options) {
                displayOptions(flow.options);
            }
            if (flow.action === 'enable_text_input') {
                displayTextInput();
            }
        }
    }

    function startConversation() {
        messages.innerHTML = '';
        currentState = 'start';
        const flow = conversationFlows.start;
        displayMessage(flow.message);
        displayOptions(flow.options);
    }

    // === Event Listeners ===
    toggle.addEventListener('click', function() {
        chat.classList.toggle('hidden');
        if (!chat.classList.contains('hidden')) {
            startConversation();
        }
    });

    close.addEventListener('click', function() {
        chat.classList.add('hidden');
    });

    // Schließen bei Klick außerhalb
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#concierge-container')) {
            chat.classList.add('hidden');
        }
    });
});
