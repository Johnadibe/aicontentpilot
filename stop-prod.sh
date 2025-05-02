# Stop the production environment
echo "Stopping production environment..."
docker compose -f prod-docker-compose.yaml down --remove-orphans

echo "Production environment stopped successfully."