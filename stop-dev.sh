# Stop the development environment
echo "Stopping development environment..."
docker compose -f dev-docker-compose.yaml down --remove-orphans

echo "Development environment stopped successfully."