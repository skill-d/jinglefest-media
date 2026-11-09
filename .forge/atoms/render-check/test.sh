#!/bin/bash
# Run from the repo root. Tests what `work` does, without the Forge hooks.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
body=$(sed -n 's/^work() { \(.*\); }$/\1/p' .forge/atoms/render-check/run.sh)
[ -n "$body" ] || { echo "cannot find work() in run.sh"; exit 1; }
work() { ROOT="$PWD"; eval "$body"; }
work || { echo "FAIL: starter template should pass"; exit 1; }
# A page with a missing image must fail.
bad=$(mktemp -d); trap 'rm -rf "$bad"' EXIT
echo '<body><img src="nope-missing.png"></body>' > "$bad/bad.html"
RENDER_CHECK_PAGE="$bad/bad.html" work >/dev/null 2>&1 && { echo "FAIL: broken image not caught"; exit 1; }
echo "ok"
