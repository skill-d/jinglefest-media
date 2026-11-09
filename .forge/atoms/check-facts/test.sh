#!/bin/bash
# Run from the repo root. Tests what `work` does, without the Forge hooks.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
body=$(sed -n 's/^work() { \(.*\); }$/\1/p' .forge/atoms/check-facts/run.sh)
[ -n "$body" ] || { echo "cannot find work() in run.sh"; exit 1; }
work() { ROOT="$PWD"; eval "$body"; }
work || { echo "FAIL: current copy should pass"; exit 1; }
t=$(mktemp -d); trap 'rm -rf "$t"' EXIT
echo '<p>Fee ₹749. Call +91 80988 41307. contact@thejinglefest.com thejinglefest.com/kids/baking</p>' > "$t/good.html"
CHECK_FACTS_FILES="$t/good.html" work >/dev/null 2>&1 || { echo "FAIL: good copy rejected"; exit 1; }
for bad in '<p>Fee ₹999</p>' '<p>Call +91 99999 11111</p>' '<p>hi@example.com</p>' '<p>thejinglefest.com/prizes</p>' '<p>An unforgettable day</p>'; do
  echo "$bad" > "$t/bad.html"
  CHECK_FACTS_FILES="$t/bad.html" work >/dev/null 2>&1 && { echo "FAIL: not caught: $bad"; exit 1; }
done
echo "ok"
