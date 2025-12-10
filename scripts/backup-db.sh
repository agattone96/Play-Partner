#!/bin/bash

# Backup script for Play-Partner database
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups"
CONTAINER_NAME="playpartner-db"
DB_NAME="playpartner"
DB_USER="postgres"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Perform backup
echo "Creating backup of $DB_NAME from container $CONTAINER_NAME..."
docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

if [ $? -eq 0 ]; then
  echo "Backup created successfully: $BACKUP_DIR/backup_$TIMESTAMP.sql"
  
  # Optional: Keep only last 5 backups
  cd "$BACKUP_DIR"
  ls -t | tail -n +6 | xargs -I {} rm -- {}
  echo "Cleaned up old backups, keeping latest 5."
else
  echo "Backup failed!"
  exit 1
fi
