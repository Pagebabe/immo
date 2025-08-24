// =======================================================
// ============= DIGITAL CONCIERGE LOGIC ================
// =======================================================

document.addEventListener('DOMContentLoaded', function() {
    const trigger = document.getElementById('concierge-trigger');
    const windowEl = document.getElementById('concierge-window');
    const closeBtn = document.getElementById('concierge-close');
    const log = document.getElementById('concierge-log');
    const inputArea = document.getElementById('concierge-input-area');

    // === Das Gehirn des Concierge: Konversations-Struktur ===
    const conversationFlows = {
        start: {
            message: "👋 Hallo! Ich bin Ihr digitaler Immobilien-Concierge. Wie kann ich Ihnen heute helfen?",
            options: [
                { text: "🏠 Ich möchte eine Immobilie kaufen", next: "buy_start" },
                { text: "💰 Ich möchte meine Immobilie verkaufen", next: "sell_start" },
                { text: "📅 Einen Beratungstermin vereinbaren", next: "schedule_start" },
                { text: "❓ Allgemeine Fragen zu Pattaya", next: "general_questions" }
            ]
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
            message: "Perfekt! Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse an, damit ich den Termin für Sie reservieren kann.",
            action: 'collect_user_data_and_schedule'
        },
        
        general_questions: {
            message: "Gerne beantworte ich Ihre Fragen! Worum geht es?",
            options: [
                { text: "🏛️ Rechtliche Fragen (Foreign Quota, etc.)", next: "legal_questions" },
                { text: "💰 Finanzierung & Banken", next: "finance_questions" },
                { text: "📋 Visa & Aufenthalt", next: "visa_questions" },
                { text: "🌍 Leben in Pattaya", next: "lifestyle_questions" }
            ]
        },
        
        legal_questions: {
            message: "Sehr gute Frage! Als Ausländer können Sie in Thailand Immobilien auf verschiedene Weise besitzen. Die sicherste Methode ist der Kauf über 'Foreign Quota' bei Condominiums. Möchten Sie mehr Details dazu?",
            options: [
                { text: "📖 Mehr über Foreign Quota", next: "foreign_quota_details" },
                { text: "👨‍💼 Mit Anwalt sprechen", next: "schedule_start" }
            ]
        },
        
        foreign_quota_details: {
            message: "Foreign Quota bedeutet, dass bis zu 49% der Fläche eines Condominiums direkt an Ausländer verkauft werden können. Sie erhalten ein 'Chanote' (Eigentumsurkunde) auf Ihren Namen. Das ist der einfachste und sicherste Weg zum Immobilienbesitz in Thailand.",
            options: [
                { text: "🏠 Condos mit Foreign Quota anzeigen", next: "show_results" },
                { text: "📅 Beratungstermin vereinbaren", next: "schedule_start" }
            ]
        },
        
        show_results: {
            message: "Einen Moment, bitte. Ich suche in unserer Datenbank nach den besten Angeboten für Sie...",
            action: 'show_property_results'
        },
        
        schedule_valuation: {
            message: "Ausgezeichnet! Ein Experte wird sich innerhalb von 24 Stunden bei Ihnen melden, um einen Besichtigungstermin zu vereinbaren. Bitte geben Sie mir Ihre Kontaktdaten.",
            action: 'collect_user_data_and_schedule'
        }
    };

    let currentNode = 'start';
    let userData = {};

    // === Chat-Funktionen ===
    function showBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'bot-message';
        msg.innerHTML = text;
        log.appendChild(msg);
        log.scrollTop = log.scrollHeight;
    }

    function showUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'user-message';
        msg.textContent = text;
        log.appendChild(msg);
        log.scrollTop = log.scrollHeight;
    }

    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        log.appendChild(typing);
        log.scrollTop = log.scrollHeight;
        return typing;
    }

    function showOptions(options) {
        inputArea.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = option.text;
            button.onclick = () => handleChoice(option);
            inputArea.appendChild(button);
        });
    }

    function handleChoice(option) {
        showUserMessage(option.text);
        currentNode = option.next;
        
        // Kleine Verzögerung für Realismus
        setTimeout(() => {
            runConversation();
        }, 800);
    }
    
    function runConversation() {
        const node = conversationFlows[currentNode];
        inputArea.innerHTML = '';

        if (node.message) {
            showBotMessage(node.message);
        }

        if (node.options) {
            setTimeout(() => {
                showOptions(node.options);
            }, 1000);
        }

        if (node.action) {
            setTimeout(() => {
                executeAction(node.action);
            }, 1500);
        }
    }
    
    function executeAction(action) {
        switch(action) {
            case 'collect_user_data_and_schedule':
                startSchedulingProcess();
                break;
            case 'show_property_results':
                showPropertyResults();
                break;
        }
    }
    
    function showPropertyResults() {
        showBotMessage("Ich habe 3 exklusive Angebote für Sie gefunden:");
        
        setTimeout(() => {
            showBotMessage("🏠 <strong>Luxus Condo Jomtien</strong><br>2 SZ, 85m², Meerblick<br>💎 <strong>8.5 Mio. THB</strong>");
        }, 1000);
        
        setTimeout(() => {
            showBotMessage("🏡 <strong>Villa mit Pool Pratumnak</strong><br>3 SZ, 200m², Privatpool<br>💎 <strong>15.8 Mio. THB</strong>");
        }, 2000);
        
        setTimeout(() => {
            showBotMessage("🏢 <strong>Investment Condo Wongamat</strong><br>1 SZ, 45m², Vermietung<br>💎 <strong>3.2 Mio. THB</strong>");
        }, 3000);
        
        setTimeout(() => {
            showOptions([
                { text: "📅 Besichtigungstermin vereinbaren", next: "schedule_start" },
                { text: "📞 Mit Berater sprechen", next: "schedule_start" },
                { text: "🏠 Weitere Objekte anzeigen", next: "show_results" }
            ]);
        }, 4000);
    }
    
    async function startSchedulingProcess() {
        showBotMessage("Bitte geben Sie Ihren vollen Namen an:");
        
        // In einer echten App würde hier ein Eingabefeld erscheinen
        // Für Demo-Zwecke simulieren wir das:
        setTimeout(() => {
            const name = prompt("Ihr voller Name:");
            if (name) {
                userData.name = name;
                showUserMessage(name);
                
                setTimeout(() => {
                    showBotMessage("Danke! Und Ihre E-Mail-Adresse?");
                    
                    setTimeout(() => {
                        const email = prompt("Ihre E-Mail-Adresse:");
                        if (email) {
                            userData.email = email;
                            showUserMessage(email);
                            
                            setTimeout(() => {
                                showBotMessage(`Vielen Dank, ${name}! Ich suche nach verfügbaren Terminen... Das kann einen Moment dauern.`);
                                
                                // Google Calendar Integration
                                scheduleAppointment(name, email);
                            }, 1000);
                        }
                    }, 1000);
                }, 1000);
            }
        }, 1000);
    }
    
    async function scheduleAppointment(name, email) {
        try {
            // Termin in 2 Tagen um 14:00 Uhr (Beispiel)
            const startTime = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
            startTime.setHours(14, 0, 0, 0);
            
            const response = await fetch('/.netlify/functions/create-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    startTime: startTime.toISOString(),
                    meetingType: 'Video-Call'
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showBotMessage("✅ Super! Ihr Termin ist bestätigt. Sie erhalten in Kürze eine Einladung per E-Mail.");
                
                setTimeout(() => {
                    showBotMessage(`📅 Termin: ${new Date(result.startTime).toLocaleString('de-DE')}<br>📧 E-Mail: ${email}`);
                }, 1000);
                
                setTimeout(() => {
                    showOptions([
                        { text: "🎉 Perfekt, danke!", next: "start" },
                        { text: "📅 Weitere Termine anzeigen", next: "schedule_start" }
                    ]);
                }, 2000);
            } else {
                throw new Error(result.error || 'Unknown error');
            }

        } catch (error) {
            console.error('Error scheduling appointment:', error);
            showBotMessage("Es tut mir leid, bei der Terminplanung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.");
            
            setTimeout(() => {
                showOptions([
                    { text: "📞 Direkt anrufen", next: "start" },
                    { text: "📧 E-Mail schreiben", next: "start" }
                ]);
            }, 2000);
        }
    }
    
    // === UI-Events ===
    trigger.onclick = () => {
        windowEl.classList.remove('concierge-hidden');
        if (log.children.length === 0) {
            setTimeout(() => {
                runConversation();
            }, 500);
        }
    };
    
    // Mobile Concierge Trigger
    const mobileTrigger = document.getElementById('concierge-trigger-mobile');
    if (mobileTrigger) {
        mobileTrigger.onclick = () => {
            windowEl.classList.remove('concierge-hidden');
            if (log.children.length === 0) {
                setTimeout(() => {
                    runConversation();
                }, 500);
            }
        };
    }
    
    closeBtn.onclick = () => {
        windowEl.classList.add('concierge-hidden');
    };
    
    // Schließen bei Klick außerhalb
    windowEl.onclick = (e) => {
        if (e.target === windowEl) {
            windowEl.classList.add('concierge-hidden');
        }
    };
    
    // ESC-Taste zum Schließen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !windowEl.classList.contains('concierge-hidden')) {
            windowEl.classList.add('concierge-hidden');
        }
    });
});
