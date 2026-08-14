#!/bin/bash
set -e

echo "🚀 [1/3] Pulling latest changes from Git..."
git pull origin main

echo "🔨 [2/3] Building and restarting Docker containers..."
docker compose up -d --build

echo "🧹 [3/3] Pruning unused Docker images..."
docker image prune -f

echo "✅ Deployment successful! App is running on port 3000."
