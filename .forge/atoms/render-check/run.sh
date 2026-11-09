#!/bin/bash
set -uo pipefail
ROOT="${FORGE_WORKTREE:-$(git rev-parse --show-toplevel)}"
source "${FORGE_LIB:-${FORGE_REPO:?}/tools/forge/lib}/hooks.sh"
FORGE_STEPS=1
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
work() { (cd "$ROOT" && bash "$HERE/check.sh"); }
if forge_dry_run; then forge_step work true; else forge_step work work || { forge_result --fail --json '{"reason":"a page failed to render or an image did not load (the log names the file)"}'; exit 1; }; fi
forge_result --ok --json '{}'
