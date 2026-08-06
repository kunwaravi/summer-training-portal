#!/bin/bash
set -e

# EduNexus Pro - Database Backup Utility
# Saves PostgreSQL database backups to the backups/ directory.

echo "=========================================="
echo "    EduNexus Pro - DB Backup    "
echo "=========================================="

# Load environment variables from root or backend if available
if [ -f .env ]; then
  echo "Loading variables from root .env..."
  export $(grep -v '^#' .env | xargs)
elif [ -f backend/.env ]; then
  echo "Loading variables from backend/.env..."
  export $(grep -v '^#' backend/.env | xargs)
fi

DB_USER=${DB_USER:-nexusadmin}
DB_NAME=${DB_NAME:-nexus}
DB_CONTAINER_NAME="edunexuspro-db-1"

# Create backup directory
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Generate backup filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Check if database container is running
IS_DOCKER_RUNNING=false
if command -v docker &> /dev/null; then
  # Try to find a container with 'db' or 'postgres' in the name
  CONTAINER_ID=$(docker ps --filter "name=db" --filter "status=running" -q | head -n 1)
  if [ -n "$CONTAINER_ID" ]; then
    IS_DOCKER_RUNNING=true
    DB_CONTAINER_NAME=$(docker ps --filter "name=db" --filter "status=running" --format "{{.Names}}" | head -n 1)
  fi
fi

if [ "$IS_DOCKER_RUNNING" = true ]; then
  echo "Database container ($DB_CONTAINER_NAME) detected."
  echo "Dumping database schema and content..."
  docker exec -t "$DB_CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"
else
  echo "Active database container not found."
  echo "Attempting standard pg_dump command locally..."
  if command -v pg_dump &> /dev/null; then
    pg_dump -U "$DB_USER" -d "$DB_NAME" -h localhost > "$BACKUP_FILE"
  else
    echo "Error: pg_dump utility not installed locally, and no active Docker db container was found."
    exit 1
  fi
fi

echo "=========================================="
echo " Backup Completed Successfully! 💾"
echo " Saved to: $BACKUP_FILE"
echo " Size: $(du -sh "$BACKUP_FILE" | cut -f1)"
echo "=========================================="
