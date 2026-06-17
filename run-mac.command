#!/bin/zsh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=8000
URL="http://localhost:${PORT}/"

cd "$SCRIPT_DIR"

python3 -m http.server "$PORT" >/tmp/snake-mac-server.log 2>&1 &
SERVER_PID=$!

sleep 1

if kill -0 "$SERVER_PID" 2>/dev/null; then
  open "$URL"
  echo "Snake is running at ${URL}"
  echo "Press Ctrl+C to stop the server."
else
  echo "Failed to start server. Check /tmp/snake-mac-server.log"
  exit 1
fi

cleanup() {
  if kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID"
  fi
}

trap cleanup EXIT INT TERM

wait "$SERVER_PID"
