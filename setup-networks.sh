#!/bin/bash

# Create Docker networks for different environments
echo "Creating Docker networks for different environments..."

# Dev network
docker network create aipen-network || true
echo "Created aipen-network for development environment"

# Staging network
docker network create aipen-staging-network || true
echo "Created aipen-staging-network for staging environment"

# Production network
docker network create aipen-prod-network || true
echo "Created aipen-prod-network for production environment"

echo "Docker networks setup complete!"