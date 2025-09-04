# 📌 **PINS.md** — Operations-Checkliste

## **P1 Content**
- [ ] Jede Property hat `title, description, gallery, lat, lng, price (THB), type, location, bedrooms`
- [ ] Alle Properties haben valide Koordinaten (lat/lng)
- [ ] Gallery-Bilder sind optimiert und vorhanden

## **P2 SEO**
- [ ] Jede Seite mit `description` in Frontmatter
- [ ] Interne Links → Services/Areas/Top-Properties
- [ ] FAQ sichtbar + JSON-LD Schema
- [ ] OG-Bild wenn vorhanden

## **P3 Local SEO**
- [ ] Footer NAP konsistent (Name, Address, Phone)
- [ ] `RealEstateAgent`-Schema gepflegt
- [ ] Kontaktdaten in allen Sprachen identisch

## **P4 Performance**
- [ ] LCP < 2.5s
- [ ] Hero-Bilder klein (< 500KB)
- [ ] Alle `<img loading="lazy">`

## **P5 Tracking**
- [ ] GA4 Events `lead_submit` feuern auf EN/DE/TH
- [ ] GA4 Events `whatsapp_click` feuern auf EN/DE/TH
- [ ] GA4 Events `cal_click` feuern auf EN/DE/TH

## **P6 Leads**
- [ ] n8n 200 OK
- [ ] Google Sheet/CRM aktualisiert
- [ ] Wöchentlicher Test

## **P7 I18n**
- [ ] `hugo --printI18nWarnings` = **leer**

## **P8 Deploy**
- [ ] `baseURL` live
- [ ] `sitemap.xml`/`robots.txt` vorhanden
- [ ] Pages/Netlify/Vercel grün

## **P9 Rates**
- [ ] `hugo.toml` Wechselkurse wöchentlich pflegen
- [ ] Currency-Switcher testen

## **P10 Backups**
- [ ] Repo + n8n Workflows exportieren
- [ ] `CNAME` nicht ändern
