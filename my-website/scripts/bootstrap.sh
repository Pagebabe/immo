#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

: "${BASEURL:=https://deine-domain.tld/}"
: "${GA4:=G-XXXXXXX}"
: "${GSC:=GSC_TOKEN}"
: "${WHATSAPP:=66XXXXXXXXX}"
: "${CALCOM:=your-cal-alias}"
: "${N8N:=https://DEIN-N8N/webhook/lead-intake}"
: "${RATE_EUR:=0.027}"
: "${RATE_USD:=0.030}"

# hugo.toml: baseURL
perl -0777 -pi -e 's|^baseURL\s*=\s*.*$|baseURL = '"'"'$ENV{BASEURL}'"'"'|m' hugo.toml

# params ga4/gsc (anlegen falls fehlen)
perl -0777 -pi -e '
if ($ARGV[0] =~ /\[params\]/s) {
  $ARGV[0] =~ s/\[params\][^\[]*/$&\nga4 = "'$ENV{GA4}'"\ngsc_verify = "'$ENV{GSC}'"\n/s;
} else {
  $_ .= "\n[params]\nga4 = \"'$ENV{GA4}'\"\ngsc_verify = \"'$ENV{GSC}'\"\n";
}
' hugo.toml

# Currency-Rates (EUR/USD)
perl -0777 -pi -e '
if ($ARGV[0] =~ /\[params\.currencyRates\]/s) {
  $ARGV[0] =~ s/(EUR\s*=\s*).*/$1'$ENV{RATE_EUR}'/;
  $ARGV[0] =~ s/(USD\s*=\s*).*/$1'$ENV{RATE_USD}'/;
} else {
  $_ .= "\n[params.currencyRates]\nTHB = 1\nEUR = '$ENV{RATE_EUR}'\nUSD = '$ENV{RATE_USD}'\n";
}
' hugo.toml

# Lead-Form Webhook
perl -pi -e 's|action="https://[^"]+/webhook/lead-intake"|action="'$ENV{N8N}'"|g' themes/pattaya-estate/layouts/partials/lead-form.html

# WhatsApp in Hero & Detail
perl -pi -e 's|https://wa\.me/\d+|https://wa.me/'"$WHATSAPP"'|g' themes/pattaya-estate/layouts/_default/index.html
perl -pi -e 's|https://wa\.me/\d+|https://wa.me/'"$WHATSAPP"'|g' themes/pattaya-estate/layouts/properties/single.html

# Cal.com in Detail
perl -pi -e 's|https://cal\.com/[^?"]+|https://cal.com/'"$CALCOM"'|g' themes/pattaya-estate/layouts/properties/single.html

# Build + i18n
hugo --minify
hugo --printI18nWarnings || true
echo -e "\nBootstrap OK: baseURL=$BASEURL GA4=$GA4 GSC=$GSC Rates: EUR=$RATE_EUR USD=$RATE_USD"
