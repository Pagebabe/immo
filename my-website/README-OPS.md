# 🚀 **README-OPS.md** — Operations Guide

## ⚠️ **SECURITY WARNING**
Bei Secret-Fund sofort rotieren (n8n/GA/GSC/SSH).

## Quick Start

```bash
cp env.example .env
export $(grep -v '^#' .env | xargs)
make bootstrap
make serve
make build && make check
make deploy-gh
```

## Commands

- `make serve` - Development server
- `make build` - Production build
- `make check` - i18n validation
- `make bootstrap` - Configure with env vars
- `make deploy-gh` - Deploy to GitHub Pages
- `make htmltest` - Link validation
- `make clean` - Clean build directory

## Git Hook (optional)

```bash
mkdir -p .git/hooks
ln -sf ../../scripts/pre-commit.sh .git/hooks/pre-commit
chmod +x scripts/pre-commit.sh
```
