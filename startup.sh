#!/bin/bash

# Exit on error
set -e

cd /home/container

# Environment Variables
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}
export TZ=${TZ:-UTC}

# Output current state
echo "------------------------------------"
echo "Starting ICBC Study Hub..."
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Working directory: $(pwd)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "------------------------------------"

# Verify we have what we need
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found! Please run install.sh first."
    exit 1
fi

# Start the application
if [ "$NODE_ENV" == "production" ]; then
    echo "Starting in production mode..."
    if [ -f "build/index.js" ]; then
        node build/index.js
    else
        echo "Building application..."
        npm run build
        node build/index.js
    fi
else
    echo "Starting in development mode..."
    npm run dev
fi 