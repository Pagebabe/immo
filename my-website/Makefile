.PHONY: serve build check bootstrap deploy-gh htmltest clean
serve: ; hugo server -D --bind 0.0.0.0
build: ; hugo --minify
check: ; hugo --printI18nWarnings
bootstrap: ; bash scripts/bootstrap.sh
deploy-gh:
	git add -A
	git commit -m "deploy: site update" || true
	git push origin main
htmltest: ; command -v htmltest >/dev/null 2>&1 && htmltest || echo "htmltest not installed"
clean: ; rm -rf public/
