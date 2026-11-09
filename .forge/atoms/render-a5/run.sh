#!/bin/bash
set -uo pipefail
ROOT="${FORGE_WORKTREE:-$(git rev-parse --show-toplevel)}"
source "${FORGE_LIB:-${FORGE_REPO:?}/tools/forge/lib}/hooks.sh"
FORGE_STEPS=1
work() { (cd "$ROOT" && { [ -d node_modules ] || bun install >&2; } && sed 's|new URL(.\./., import.meta.url).pathname|decodeURIComponent(&)|' render.mjs > .tmp-render.mjs && o=$(bun .tmp-render.mjs a5 2>&1); rc=$?; rm -f .tmp-render.mjs; echo "$o"; [ $rc -eq 0 ] && grep -qx a5 <<<"$o" && [ -s jinglefest-media-kit/07-poster/little-chefs-bake-off-a5.png ] && [ -s jinglefest-media-kit/07-poster/little-chefs-bake-off-a5-print.pdf ] && [ -s jinglefest-media-kit/07-poster/little-chefs-bake-off-a5-print-with-bleed.pdf ]); }
if forge_dry_run; then forge_step work true; else forge_step work work || { forge_result --fail --json '{"reason":"the Bake-Off A5 flyer failed to render"}'; exit 1; }; fi
forge_result --ok --json '{}'
