# Create Docker networks if they don't exist

# Check if development network exists
if ! docker network inspect aicontentpilot-dev-network >/dev/null 2>&1; then
  echo "Creating development network: aicontentpilot-dev-network"
  docker network create aicontentpilot-dev-network
else
  echo "Development network already exists: aicontentpilot-dev-network"
fi

# Check if staging network exists
if ! docker network inspect aicontentpilot-staging-network >/dev/null 2>&1; then
  echo "Creating staging network: aicontentpilot-staging-network"
  docker network create aicontentpilot-staging-network
else
  echo "Staging network already exists: aicontentpilot-staging-network"
fi

# Check if production network exists
if ! docker network inspect aicontentpilot-prod-network >/dev/null 2>&1; then
  echo "Creating production network: aicontentpilot-prod-network"
  docker network create aicontentpilot-prod-network
else
  echo "Production network already exists: aicontentpilot-prod-network"
fi

echo "Network setup complete."