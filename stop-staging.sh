#!/bin/bash

# Stop the application in staging environment
echo "Stopping AIPenPilot in staging environment..."

# Stop frontend
cd frontend
docker-compose -f staging-docker-compose.yaml down
cd ..

# Stop backend
cd backend
docker-compose -f staging-docker-compose.yaml down
cd ..

echo "AIPenPilot staging environment has been stopped!"