# Check if networks exist, create if they don't
./setup-networks.sh

# Start the development environment
echo "Starting development environment..."
docker compose -f dev-docker-compose.yaml up -d --build

echo "Development environment started successfully."
echo "Frontend available at: http://localhost:3000"
echo "Backend API available at: http://localhost:8000"