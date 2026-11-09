#!/bin/bash
set -uo pipefail
ROOT="${FORGE_WORKTREE:-$(git rev-parse --show-toplevel)}"
source "${FORGE_LIB:-${FORGE_REPO:?}/tools/forge/lib}/hooks.sh"
FORGE_STEPS=1
work() { (cd "$ROOT" && t=$(mktemp -d) && trap 'rm -rf "$t"' EXIT && o=$(bun shot.mjs "${RENDER_CHECK_PAGE:-templates/starter.html}" 1080 1350 "$t/check.jpg" 2>&1) && echo "$o" && [ -s "$t/check.jpg" ] && ! grep -q 'images that did not load' <<<"$o"); }
if forge_dry_run; then forge_step work true; else forge_step work work || { forge_result --fail --json '{"reason":"the starter template failed to render or an image did not load"}'; exit 1; }; fi
forge_result --ok --json '{}'
