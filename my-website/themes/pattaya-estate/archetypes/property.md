---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: false
price: 0
location: ""
type_key: "condo"  # condo, villa, house
type: "Condo"      # Display name (will be translated via i18n)
bedrooms: 0
bathrooms: 0
living_area: 0
pool: "shared"     # shared, private, none
ownership: "foreign_quota"  # foreign_quota, thai_quota
deed: "chanote"    # chanote, nor_sor_3
status: "available"  # available, sold
features: []       # sea_view, parking, gym, security, etc.
gallery: []        # Image filenames
contact:
  agent: ""
  phone: ""
  email: ""
slug: "{{ .Name }}"
---

Kurze Beschreibung der Immobilie...
