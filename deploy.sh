#!/bin/bash

# ICBC Study Hub Deployment Script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}ICBC Study Hub Deployment${NC}"
echo "=============================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm install
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please check the logs above.${NC}"
    exit 1
fi

# Build and start the Docker containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
docker-compose up -d --build

if [ $? -ne 0 ]; then
    echo -e "${RED}Docker Compose failed. Please check the logs above.${NC}"
    exit 1
fi

# Get the container IP
CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' icbc-study-hub)

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "The application is now running at: ${GREEN}http://localhost:3000${NC}"
echo -e "Container IP: ${GREEN}$CONTAINER_IP${NC}"
echo -e "To stop the application, run: ${YELLOW}docker-compose down${NC}" 