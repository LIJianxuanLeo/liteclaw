#!/usr/bin/env bash
# Encrypt the LLM API_KEY with a password using AES-256-CBC + PBKDF2 (200K iters).
# Output: .env.api.enc (binary ciphertext, no plaintext touches disk).
#
# Usage: ./scripts/encrypt-api.sh

set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v openssl >/dev/null 2>&1; then
  echo "❌ openssl not found. Install it first (macOS: brew install openssl)." >&2
  exit 1
fi

read -r -s -p "Enter your API key (input hidden): " API_KEY
echo
read -r -s -p "Choose an encryption password: " PASS
echo
read -r -s -p "Confirm password: " PASS2
echo

if [[ -z "$API_KEY" ]]; then
  echo "❌ API key is empty. Aborted." >&2
  exit 1
fi
if [[ "$PASS" != "$PASS2" ]]; then
  echo "❌ Passwords do not match. Aborted." >&2
  exit 1
fi

# Stream the key directly into openssl — never write it to disk in plaintext.
printf '%s' "$API_KEY" | \
  openssl enc -aes-256-cbc -salt -pbkdf2 -iter 200000 \
    -pass "pass:$PASS" \
    -out .env.api.enc

chmod 600 .env.api.enc

echo "✅ Encrypted key written to .env.api.enc (mode 600)."
echo "   Now edit your .env and remove the plain 'API_KEY=...' line."
echo "   Start LiteClaw with:  ./scripts/start.sh"
