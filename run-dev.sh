#!/bin/bash

# Run the application in development environment
echo "Starting AIPenPilot in development environment..."

# Create networks if they don't exist
./setup-networks.sh

# Run backend
cd backend
# Load environment variables from .env.dev file
echo "Loading backend environment variables from .env.dev..."
export $(grep -v '^#' .env.dev | xargs)
# Run docker-compose with env file explicitly specified
docker-compose -f dev-docker-compose.yaml --env-file .env.dev up -d --build
cd ..

# Run frontend
cd frontend
# Load environment variables from .env.dev file
echo "Loading frontend environment variables from .env.dev..."
export $(grep -v '^#' .env.dev | xargs)
# Run docker-compose with env file explicitly specified
docker-compose -f dev-docker-compose.yaml --env-file .env.dev up -d --build
cd ..

echo "AIPenPilot development environment is running!"
echo "Frontend: http://localhost:3010"
echo "Backend: http://localhost:3011"