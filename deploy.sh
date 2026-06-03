#!/bin/bash
set -e

echo "=========================================="
echo "    Summer Training Portal - Deployment   "
echo "=========================================="

# Ensure script is run from project root
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "Error: docker-compose.prod.yml not found. Please run this script from the project root."
    exit 1
fi

# Ensure .env file exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found!"
    echo "Please copy .env.example to .env and fill in your secrets before deploying."
    echo "Run: cp .env.example .env && nano .env"
    exit 1
fi

echo "[1/4] Pulling latest code..."
git pull origin main || echo "Warning: Not a git repository or pull failed. Continuing with local files."

echo "[2/4] Building Docker Images..."
docker compose -f docker-compose.prod.yml build

echo "[3/4] Starting the containers in detached mode..."
docker compose -f docker-compose.prod.yml up -d

echo "[4/4] Pruning old unused images..."
docker image prune -f

echo "=========================================="
echo " Deployment Successful! 🚀"
echo " Your application is now running."
echo " To view logs, run: docker-compose -f docker-compose.prod.yml logs -f"
echo "=========================================="
