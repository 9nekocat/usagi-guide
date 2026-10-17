#!/usr/bin/env bash
# 从 README.md 重新生成 index.html
set -euo pipefail
cd "$(dirname "$0")"
npx -y marked -i README.md -o .body.html
node render.mjs
rm -f .body.html
