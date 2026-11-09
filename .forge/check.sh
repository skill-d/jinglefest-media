#!/bin/bash
# The done-check Forge setup wrote from the commands it ran. It's yours: edit it like any other file.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

echo '== setup'
bun install && bunx playwright install chromium || exit 1
