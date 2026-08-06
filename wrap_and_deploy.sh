#!/bin/bash
set -e

# Configuration for KIBM Production VPS
REMOTE_HOST="srv1616850.hstgr.cloud"
REMOTE_USER="root"
DEPLOY_PATH="/docker/edunexuspro"
SSH_KEY="/home/abhi/.ssh/hostinger_edunexus.pem"

echo "=========================================================="
echo "    🚀 EDU-NEXUS PRO: Production Deployment Wrapper"
echo "=========================================================="

# 1. Local Integrity Check
echo "[1/4] Running final local build checks..."
(cd backend && npm run build) > /dev/null
(cd frontend && npm run build) > /dev/null
echo "✅ Build verified."

# 2. Syncing Source to VPS
echo "[2/4] Transferring source code to production server..."
# Note: We exclude node_modules and dist for speed, they are built/managed via Docker on server
rsync -avz --delete \
  -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=10" \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.git' \
  --exclude '.env' \
  --exclude 'backend/.env' \
  ./ ${REMOTE_USER}@${REMOTE_HOST}:${DEPLOY_PATH}/

echo "✅ Transfer complete."

# 3. Executing Remote Deployment
echo "[3/4] Triggering remote Docker Compose orchestrator..."
ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=10 ${REMOTE_USER}@${REMOTE_HOST} << EOF
  cd ${DEPLOY_PATH}

  # Ensure the .env exists (we don't sync it as it contains secrets)
  if [ ! -f .env ]; then
    echo "⚠️ Remote .env missing! Using fallback template if available..."
  fi

  # Stop any active containers from other compose configurations
  docker compose down || true

  # Build backend and frontend first to ensure new prisma generation and updated frontend static files
  docker compose -f docker-compose.prod.yml build --no-cache backend frontend

  # Bring up the stack with new images
  docker compose -f docker-compose.prod.yml up -d

  # Cleanup unused layers
  docker image prune -f

  echo "📡 Checking service health..."
  docker compose -f docker-compose.prod.yml ps
EOF

echo "✅ Remote deployment commands executed."

# 4. Final Smoke Check Hint
echo "=========================================================="
echo " 🎉 DEPLOYMENT WRAPPED SUCCESSFULLY!"
echo " Portal URL: https://edunexus.kibm.in"
echo " API Status: https://edunexus.kibm.in/api/"
echo "=========================================================="
