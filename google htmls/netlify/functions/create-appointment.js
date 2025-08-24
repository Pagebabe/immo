// =======================================================
// ============= GOOGLE CALENDAR INTEGRATION ============
// =======================================================

// WICHTIG: Sie müssen die Google API Library installieren:
// npm install googleapis

const { google } = require('googleapis');
const { OAuth2 } = google.auth;

// Diese Werte müssen Sie als Environment Variables in Netlify setzen
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const CALENDAR_ID = process.env.CALENDAR_ID || 'primary';

exports.handler = async (event, context) => {
    // CORS Headers für Frontend-Zugriff
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Nur POST-Requests erlauben
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Request Body parsen
        const { name, email, startTime, meetingType = 'Video-Call' } = JSON.parse(event.body);

        // Validierung
        if (!name || !email || !startTime) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Name, email and startTime are required' })
            };
        }

        // OAuth2 Client initialisieren
        const oauth2Client = new OAuth2(OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET);
        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        // Google Calendar API initialisieren
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Termin-Zeiten berechnen
        const eventStartTime = new Date(startTime);
        const eventEndTime = new Date(eventStartTime.getTime() + 30 * 60 * 1000); // 30 Min Termin

        // Kalender-Event erstellen
        const calendarEvent = {
            summary: `Immobilienberatung: ${name}`,
            description: `
Immobilienberatung für ${name}
Kontakt: ${email}
Meeting-Typ: ${meetingType}

Pattaya Living Estate
Deutschsprachige Immobilienberatung in Pattaya, Thailand
            `.trim(),
            start: {
                dateTime: eventStartTime.toISOString(),
                timeZone: 'Asia/Bangkok'
            },
            end: {
                dateTime: eventEndTime.toISOString(),
                timeZone: 'Asia/Bangkok'
            },
            attendees: [
                { email: email },
                { email: 'info@pattaya-living-estate.com' } // Ihre E-Mail
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 }, // 24 Stunden vorher
                    { method: 'popup', minutes: 30 } // 30 Minuten vorher
                ]
            },
            // Zoom-Link für Video-Calls (optional)
            ...(meetingType === 'Video-Call' && {
                conferenceData: {
                    createRequest: {
                        requestId: `meeting-${Date.now()}`,
                        conferenceSolutionKey: {
                            type: 'hangoutsMeet'
                        }
                    }
                }
            })
        };

        // Event in Google Calendar erstellen
        const result = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: calendarEvent,
            sendNotifications: true, // Sendet E-Mail-Einladungen
            conferenceDataVersion: meetingType === 'Video-Call' ? 1 : 0
        });

        // Erfolgreiche Antwort
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Termin erfolgreich erstellt!',
                eventId: result.data.id,
                eventLink: result.data.htmlLink,
                startTime: result.data.start.dateTime,
                endTime: result.data.end.dateTime
            })
        };

    } catch (error) {
        console.error('Error creating calendar event:', error);

        // Detaillierte Fehlerbehandlung
        let errorMessage = 'Failed to create appointment.';
        
        if (error.code === 401) {
            errorMessage = 'Authentication failed. Please check your Google Calendar credentials.';
        } else if (error.code === 403) {
            errorMessage = 'Access denied. Please check calendar permissions.';
        } else if (error.code === 409) {
            errorMessage = 'Time slot is already booked. Please choose a different time.';
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        };
    }
};
