#!/bin/bash
# Pre-commit hook to prevent secrets from being committed

SECRETS_FOUND=0

# Check for common secret patterns
if git diff --cached --name-only | xargs grep -l -E "(ssh|password|api_key|ga-|gsc_|n8n.*webhook)" 2>/dev/null; then
    echo "❌ SECRETS DETECTED in staged files!"
    echo "Please remove sensitive information before committing."
    SECRETS_FOUND=1
fi

if [ $SECRETS_FOUND -eq 1 ]; then
    echo "Commit blocked. Remove secrets and try again."
    exit 1
fi

echo "✅ No secrets detected. Proceeding with commit."
exit 0
