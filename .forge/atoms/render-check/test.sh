#!/bin/bash
# Run from the repo root. Tests check.sh, which run.sh calls, without the Forge hooks.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
check=.forge/atoms/render-check/check.sh
tmp=$(mktemp -d); trap 'rm -rf "$tmp" templates/zz-tmp-*.html' EXIT

# 1. Default run: starter passes, every posts.mjs post is covered, nothing fails.
out=$(bash "$check" 2>&1) || { echo "$out"; echo "FAIL: default run should pass"; exit 1; }
grep -q 'ok: templates/starter.html' <<<"$out" || { echo "$out"; echo "FAIL: starter not covered"; exit 1; }
for p in bandPost carnivalPost; do grep -q "ok: posts.mjs $p" <<<"$out" || { echo "$out"; echo "FAIL: $p not covered"; exit 1; }; done

# 2. A page with a missing image must fail and be named (single-page override).
echo '<body><img src="nope-missing.png"></body>' > "$tmp/bad.html"
out=$(RENDER_CHECK_PAGE="$tmp/bad.html" bash "$check" 2>&1) && { echo "FAIL: broken image not caught"; exit 1; }
grep -q "FAIL: $tmp/bad.html" <<<"$out" || { echo "$out"; echo "FAIL: failing file not named"; exit 1; }

# 3. A new template is picked up (good passes, broken fails by name) and a non-feed page is skipped.
cp templates/starter.html templates/zz-tmp-good.html
out=$(bash "$check" 2>&1) && grep -q 'ok: templates/zz-tmp-good.html' <<<"$out" || { echo "$out"; echo "FAIL: new template not covered"; exit 1; }
echo '<body style="width:1080px;height:1350px"><img src="nope-missing.png"></body>' > templates/zz-tmp-bad.html
echo '<body style="width:1080px;height:1920px"><img src="nope-missing.png"></body>' > templates/zz-tmp-story.html
out=$(bash "$check" 2>&1) && { echo "FAIL: broken template not caught"; exit 1; }
grep -q 'FAIL: templates/zz-tmp-bad.html' <<<"$out" || { echo "$out"; echo "FAIL: broken template not named"; exit 1; }
grep -q 'skip: templates/zz-tmp-story.html' <<<"$out" || { echo "$out"; echo "FAIL: non-feed page not skipped"; exit 1; }
echo "ok"
