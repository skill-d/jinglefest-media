#!/bin/bash
# Run from the repo root. Tests what `work` does, without the Forge hooks.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
body=$(sed -n 's/^work() { \(.*\); }$/\1/p' .forge/atoms/render-a5/run.sh)
[ -n "$body" ] || { echo "cannot find work() in run.sh"; exit 1; }
work() { ROOT="$PWD"; eval "$body"; }
P=jinglefest-media-kit/07-poster/little-chefs-bake-off-a5
FILES="$P.png $P-print.pdf $P-print-with-bleed.pdf"
marker=$(mktemp); trap 'rm -f "$marker"; git checkout -q -- $FILES 2>/dev/null' EXIT
sleep 1
work >/dev/null 2>&1 || { echo "FAIL: A5 flyer should render"; exit 1; }
for f in $FILES; do
  [ "$f" -nt "$marker" ] || { echo "FAIL: $f was not rebuilt"; exit 1; }
done
[ ! -e $P-bleed.png ] || { echo "FAIL: scratch bleed png left behind"; exit 1; }
echo "ok"
