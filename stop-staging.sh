# Stop the staging environment
echo "Stopping staging environment..."
docker compose -f ./frontend/staging-docker-compose.yaml down --remove-orphans

echo "Staging environment stopped successfully."