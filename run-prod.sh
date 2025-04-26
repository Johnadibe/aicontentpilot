#!/bin/bash

# Run the application in production environment
echo "Starting AIPenPilot in production environment..."

# Create networks if they don't exist
./setup-networks.sh

# Run backend
cd backend
# Load environment variables from .env.prod file
echo "Loading backend environment variables from .env.prod..."
export $(grep -v '^#' .env.prod | xargs)
# Run docker-compose with env file explicitly specified
docker-compose -f prod-docker-compose.yaml --env-file .env.prod up -d --build
cd ..

# Run frontend
cd frontend
# Load environment variables from .env.prod file
echo "Loading frontend environment variables from .env.prod..."
export $(grep -v '^#' .env.prod | xargs)
# Run docker-compose with env file explicitly specified
docker-compose -f prod-docker-compose.yaml --env-file .env.prod up -d --build
cd ..

echo "AIPenPilot production environment is running!"
echo "Frontend: http://localhost:3013"
echo "Backend: http://localhost:3015"