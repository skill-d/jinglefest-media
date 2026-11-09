#!/bin/bash
set -uo pipefail
ROOT="${FORGE_WORKTREE:-$(git rev-parse --show-toplevel)}"
source "${FORGE_LIB:-${FORGE_REPO:?}/tools/forge/lib}/hooks.sh"
FORGE_STEPS=1
work() { (cd "$ROOT" && facts=$(sed -n '/^## Approved facts/,/^## Notes/p' README.md) && [ -n "$facts" ] && files=${CHECK_FACTS_FILES:-"posts.mjs render.mjs templates/*.html"} && bad=0 && for re in '₹[0-9,]+' '[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z.]+' 'thejinglefest\.com/[A-Za-z0-9/_-]*[A-Za-z0-9]' '\+91 ?[0-9][0-9 ]*[0-9]'; do for t in $(grep -ohE "$re" $files 2>/dev/null | tr ' ' '~' | sort -u); do t=${t//\~/ }; grep -qF -- "$t" <<<"$facts" || { echo "not in Approved facts: $t"; bad=1; }; done; done; w=$(grep -noiE 'ultimate|unforgettable|magical' $files 2>/dev/null); [ -z "$w" ] || { echo "banned words: $w"; bad=1; }; [ "$bad" = 0 ] && echo "copy matches Approved facts"); }
if forge_dry_run; then forge_step work true; else forge_step work work || { forge_result --fail --json '{"reason":"copy has a price, phone, email, link or word that is not in the README Approved facts"}'; exit 1; }; fi
forge_result --ok --json '{}'
