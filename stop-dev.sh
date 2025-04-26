#!/bin/bash

# Stop the application in development environment
echo "Stopping AIPenPilot in development environment..."

# Stop frontend
cd frontend
docker-compose -f dev-docker-compose.yaml down
cd ..

# Stop backend
cd backend
docker-compose -f dev-docker-compose.yaml down
cd ..

echo "AIPenPilot development environment has been stopped!"