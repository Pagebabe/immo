# Google Sheets CMS Template für Pattaya Living Estate

## 📋 Spalten-Struktur

Erstellen Sie ein neues Google Sheet mit folgenden Spalten (Reihenfolge ist egal, aber Namen müssen exakt stimmen):

| Spalte | Name | Typ | Beispiel | Beschreibung |
|--------|------|-----|----------|--------------|
| A | id | Text | PLE-001 | Eindeutige ID des Objekts |
| B | title | Text | Luxus-Condo mit Meerblick | Titel des Objekts |
| C | location | Text | Jomtien, Pattaya | Standort/Adresse |
| D | status | Text | buy/rent | Verkaufsstatus (buy = Verkauf, rent = Miete) |
| E | type | Text | condo/house/villa/studio/land | Immobilientyp |
| F | price | Zahl | 8500000 | Preis in THB |
| G | bedrooms | Zahl | 2 | Anzahl Schlafzimmer |
| H | bathrooms | Zahl | 2 | Anzahl Badezimmer |
| I | area | Zahl | 95 | Größe in m² |
| J | floor | Zahl | 15 | Stockwerk (optional) |
| K | image | URL | https://... | Hauptbild-URL |
| L | features | Text | Pool,Meerblick,Fitness | Features (kommagetrennt) |
| M | description | Text | Exklusives Condo... | Beschreibung |
| N | district | Text | jomtien | Stadtteil |
| O | isNew | Text | true/false | Neu-Objekt (true/false) |
| P | detail_url | URL | /immobilien/objekt-123/ | Detail-URL |

## 📝 Beispiel-Daten

```
id	title	location	status	type	price	bedrooms	bathrooms	area	floor	image	features	description	district	isNew	detail_url
PLE-001	Luxus-Condo mit Meerblick	Jomtien, Pattaya	buy	condo	8500000	2	2	95	15	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop	Pool,Meerblick,Fitness,24h Security	Exklusives Condo mit Meerblick in Top-Lage von Jomtien	jomtien	true	/immobilien/jomtien-condo-85qm/
PLE-002	Villa mit Pool	Pratumnak Hill	rent	villa	45000	3	3	200		https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop	Privatpool,Garten,Parkplatz,Terrasse	Luxuriöse Villa mit Privatpool und Garten	pratumnak	false	/immobilien/pratumnak-villa-pool/
PLE-003	Penthouse Wongamat	Wongamat Beach	buy	penthouse	25000000	4	4	300		https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop	Dachterrasse,Meerblick,Privatpool,Lift	Exklusives Penthouse mit Dachterrasse und Meerblick	wongamat	false	/immobilien/wongamat-penthouse/
```

## 🔧 Setup-Anleitung

### 1. Google Sheet erstellen
1. Gehen Sie zu [sheets.google.com](https://sheets.google.com)
2. Erstellen Sie ein neues Sheet
3. Benennen Sie das erste Tabellenblatt "Sheet1"
4. Fügen Sie die Spaltenüberschriften in Zeile 1 ein
5. Frieren Sie Zeile 1 ein (Ansicht > Fixieren > 1 Zeile)

### 2. Google Cloud Console Setup
1. Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes
3. Aktivieren Sie die Google Sheets API:
   - APIs & Dienste > Bibliothek
   - Suchen Sie nach "Google Sheets API"
   - Klicken Sie auf "Aktivieren"

### 3. Service Account erstellen
1. IAM & Verwaltung > Dienstkonten
2. "+ DIENSTKONTO ERSTELLEN"
3. Name: "Website Sheet Reader"
4. Rolle: "Betrachter"
5. Schlüssel erstellen:
   - Klicken Sie auf das Dienstkonto
   - Schlüssel > Schlüssel hinzufügen > Neuen Schlüssel erstellen
   - JSON auswählen und herunterladen

### 4. Sheet freigeben
1. Öffnen Sie die heruntergeladene JSON-Datei
2. Kopieren Sie die `client_email` (sieht aus wie: ...@...iam.gserviceaccount.com)
3. Gehen Sie zurück zu Ihrem Google Sheet
4. Freigeben > E-Mail-Adresse hinzufügen (Betrachter-Rechte)

### 5. Netlify Environment Variables
1. Netlify Dashboard > Site settings > Environment variables
2. Fügen Sie hinzu:
   - `SPREADSHEET_ID`: Die ID aus der Sheet-URL
   - `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS`: Der gesamte Inhalt der JSON-Datei

## 📊 Spalten-Details

### Pflichtfelder
- **id**: Eindeutige ID (z.B. PLE-001, PLE-002)
- **title**: Objekttitel (wird als H1 angezeigt)
- **location**: Standort (wird unter dem Titel angezeigt)
- **status**: "buy" für Verkauf, "rent" für Miete
- **type**: Immobilientyp (condo, house, villa, studio, land)
- **price**: Preis in THB (Zahl ohne Kommas)
- **area**: Größe in m² (Zahl)

### Optionale Felder
- **bedrooms**: Anzahl Schlafzimmer (Zahl)
- **bathrooms**: Anzahl Badezimmer (Zahl)
- **floor**: Stockwerk (Zahl)
- **image**: URL zum Hauptbild
- **features**: Kommagetrennte Liste von Features
- **description**: Ausführliche Beschreibung
- **district**: Stadtteil (jomtien, pratumnak, wongamat, etc.)
- **isNew**: "true" für neue Objekte
- **detail_url**: URL zur Detailseite

## 🎯 Tipps für die Pflege

1. **Bilder**: Verwenden Sie Unsplash-URLs oder andere öffentliche Bild-URLs
2. **Preise**: Nur Zahlen eingeben (keine Währungssymbole)
3. **Features**: Kommagetrennt ohne Leerzeichen (Pool,Meerblick,Fitness)
4. **URLs**: Relative URLs verwenden (/immobilien/objekt-name/)
5. **IDs**: Eindeutige IDs vergeben (PLE-001, PLE-002, etc.)

## 🔄 Daten aktualisieren

Nach Änderungen im Google Sheet:
1. Speichern Sie das Sheet
2. Die Website lädt automatisch neue Daten beim nächsten Seitenaufruf
3. Für sofortige Updates: Klicken Sie den "🔄 Daten aktualisieren" Button (nur in Entwicklung)
