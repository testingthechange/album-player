#!/bin/bash
set -e

echo "🧱 Building project..."
mvn -DskipTests clean package

echo "🚀 Committing changes..."
git add .
git commit -m "Auto redeploy from Mac" || true

echo "⬆️ Pushing to GitHub..."
git push origin main

echo "🌐 Triggering Render deploy..."
curl -s -X POST "https://api.render.com/v1/services/srv-d45ts3i4d50c73c8rva0/deploys" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  -d ''

echo "✅ Done! Render deploy triggered."
