# Check if networks exist, create if they don't
./setup-networks.sh

# Start the staging environment
echo "Starting staging environment..."
docker compose -f ./frontend/staging-docker-compose.yaml up -d --build

echo "Staging environment started successfully."
echo "Frontend available at: http://localhost:3000"
echo "Backend API available at: http://localhost:8000"