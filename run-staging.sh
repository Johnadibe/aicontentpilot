#!/bin/bash

# Run the application in staging environment
echo "Starting AIPenPilot in staging environment..."

# Create networks if they don't exist
./setup-networks.sh

# Run backend
cd backend
# Load environment variables from .env.staging file
echo "Loading backend environment variables from .env.staging..."
export $(grep -v '^#' .env.staging | xargs)
# Run docker-compose with env file explicitly specified
docker-compose -f staging-docker-compose.yaml --env-file .env.staging up -d --build
cd ..

# Run frontend
cd frontend
# Load environment variables from .env.staging file
echo "Loading frontend environment variables from .env.staging..."
export $(grep -v '^#' .env.staging | xargs)
# Run docker-compose with env file explicitly specified
docker-compose -f staging-docker-compose.yaml --env-file .env.staging up -d --build
cd ..

echo "AIPenPilot staging environment is running!"
echo "Frontend: http://localhost:3012"
echo "Backend: http://localhost:3014"