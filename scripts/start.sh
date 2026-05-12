#!/usr/bin/env bash
# Unlock the encrypted API key, export it, then run LiteClaw.
# The decrypted key lives only in this process's environment — never on disk.
#
# Usage: ./scripts/start.sh

set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f .env.api.enc ]]; then
  echo "❌ .env.api.enc not found. Run scripts/encrypt-api.sh first." >&2
  exit 1
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "❌ openssl not found. Install it first (macOS: brew install openssl)." >&2
  exit 1
fi

read -r -s -p "Password to unlock API key: " PASS
echo

# Decrypt to a shell variable, never to disk.
if ! API_KEY=$(openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 \
                 -pass "pass:$PASS" -in .env.api.enc 2>/dev/null); then
  echo "❌ Decryption failed. Wrong password or corrupted file." >&2
  exit 1
fi

if [[ -z "$API_KEY" ]]; then
  echo "❌ Decrypted key is empty." >&2
  exit 1
fi

# dotenv inside the app will NOT override existing process.env vars,
# so this export wins even if .env still contains a stale API_KEY line.
export API_KEY

unset PASS
echo "🔓 API key unlocked. Starting LiteClaw…"
exec npm start
