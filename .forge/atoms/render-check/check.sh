#!/bin/bash
# Renders each feed page at 1080x1350 into a temp dir; exits non-zero naming any page that failed or had an image that did not load.
# Pages: every templates/*.html plus the Band Battle post. RENDER_CHECK_PAGE=<file> checks that one page only.
# Run from the repo root.
set -uo pipefail
t=$(mktemp -d) && trap 'rm -rf "$t"' EXIT
fail=0 n=0
# Feed size means the page declares both 1080px wide and 1350px tall (as --w/--h or width/height).
is_feed() { local s; s=$(tr -d ' \n\t' < "$1"); [[ $s =~ (--w|width):1080px ]] && [[ $s =~ (--h|height):1350px ]]; }
check() { # <label> <html>
  local o; n=$((n + 1))
  if o=$(bun shot.mjs "$2" 1080 1350 "$t/$n.jpg" 2>&1) && [ -s "$t/$n.jpg" ] && ! grep -q 'images that did not load' <<<"$o"; then
    echo "ok: $1"
  else
    echo "FAIL: $1"; echo "$o" | sed 's/^/    /'; fail=1
  fi
}
if [ -n "${RENDER_CHECK_PAGE:-}" ]; then
  check "$RENDER_CHECK_PAGE" "$RENDER_CHECK_PAGE"
else
  for f in templates/*.html; do
    if is_feed "$f"; then check "$f" "$f"; else echo "skip: $f (not 1080x1350)"; fi
  done
  if bun render.mjs band-html "$t/band-battle.html" && [ -s "$t/band-battle.html" ]; then check "Band Battle post (posts.mjs bandPost)" "$t/band-battle.html"; else echo "FAIL: Band Battle post page could not be built"; fail=1; fi
fi
[ "$n" -gt 0 ] || { echo "FAIL: no pages were rendered"; fail=1; }
exit "$fail"
