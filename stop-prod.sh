#!/bin/bash

# Stop the application in production environment
echo "Stopping AIPenPilot in production environment..."

# Stop frontend
cd frontend
docker-compose -f prod-docker-compose.yaml down
cd ..

# Stop backend
cd backend
docker-compose -f prod-docker-compose.yaml down
cd ..

echo "AIPenPilot production environment has been stopped!"