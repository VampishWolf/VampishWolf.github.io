#!/bin/bash
set -e

# Get the root directory of the project
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Building all projects..."
echo "Root directory: $ROOT_DIR"
echo ""

# Build Landing (Next.js) - outputs to src/landing/out
echo "=== Building Landing Page (Next.js) ==="
cd "$ROOT_DIR/src/landing"
bun install
bun run build

# Copy Next.js static export to root (excluding debug files)
echo "Copying landing page to root..."
cd "$ROOT_DIR/src/landing/out"
find . -name "*.txt" -delete  # Remove debug text files
cp -r ./* "$ROOT_DIR/"
rm -rf "$ROOT_DIR/src/landing/out"

echo ""

# Build QR Code Crafter (Vite) - outputs directly to /qr-code-crafter
echo "=== Building QR Code Crafter (Vite) ==="
cd "$ROOT_DIR/src/qr-code-crafter-src"
npm install
npm run build

echo ""
echo "=== Build Complete ==="
echo "Landing page: root directory"
echo "QR Code Crafter: /qr-code-crafter"
