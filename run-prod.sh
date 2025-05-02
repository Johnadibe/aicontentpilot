# Check if networks exist, create if they don't
./setup-networks.sh

# Start the production environment
echo "Starting production environment..."
docker compose -f prod-docker-compose.yaml up -d --build

echo "Production environment started successfully."
echo "Frontend available at: http://localhost:3000"
echo "Backend API available at: http://localhost:8000"