const { google } = require('googleapis');

// Diese Handler-Funktion wird von Netlify ausgeführt
exports.handler = async (event, context) => {
  try {
    // CORS Headers für Cross-Origin Requests
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json',
    };

    // Handle OPTIONS request (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    // 1. Authentifizierung
    const auth = new google.auth.GoogleAuth({
      // Die Credentials holen wir aus den Netlify Environment Variables
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 2. Daten abrufen
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID, // Die ID Ihres Sheets
      range: 'Sheet1', // Name des Tabellenblatts
    });

    // 3. Daten umwandeln (von Array zu schönem JSON)
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return { 
        statusCode: 200, 
        headers,
        body: JSON.stringify([]) 
      };
    }
    
    const headers_row = rows[0]; // Holt die Überschriften (id, title, etc.)
    const data = rows.slice(1).map(row => {
      let obj = {};
      headers_row.forEach((header, index) => {
        // Konvertiere Preis und Zahlen in echte Zahlen
        if (['id', 'price', 'bedrooms', 'bathrooms', 'area'].includes(header)) {
          obj[header] = parseFloat(row[index]) || 0;
        } else {
          obj[header] = row[index] || '';
        }
      });
      return obj;
    });

    // 4. Daten zurücksenden
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch properties.',
        details: error.message 
      }),
    };
  }
};
