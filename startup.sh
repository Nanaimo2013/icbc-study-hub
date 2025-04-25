#!/bin/bash

# Exit on any error
set -e

# Print each command for debugging
set -x

# Default environment variables if not set
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}
export TZ=${TZ:-UTC}
export SERVER_JARFILE=${SERVER_JARFILE:-server.jar}
export STARTUP=${STARTUP:-npm run start}

# Function to handle server stop
cleanup() {
    echo "Stopping server gracefully..."
    if pm2 list | grep -q "app"; then
        pm2 stop all
        pm2 delete all
    fi
    exit 0
}

# Set up trap for graceful shutdown
trap cleanup SIGTERM SIGINT

# Create necessary directories
echo "Setting up directories..."
mkdir -p /home/container
cd /home/container

# Install Node.js and npm first
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get update
apt-get install -y nodejs

# Verify Node.js and npm installation
node --version
npm --version

# Check if we need to install dependencies
if [ ! -d "node_modules" ] || [ ! -f "package.json" ]; then
    echo "Installing dependencies..."
    
    # Install system dependencies if not already installed
    if ! command -v nginx &> /dev/null; then
        apt-get update
        apt-get install -y \
            bash \
            nginx \
            curl \
            ca-certificates \
            openssl \
            git \
            tzdata \
            build-essential \
            python3
        apt-get clean
        rm -rf /var/lib/apt/lists/*
    fi

    # Install PM2 globally if not installed
    if ! command -v pm2 &> /dev/null; then
        echo "Installing PM2 globally..."
        npm install -g pm2
    fi

    # Install project dependencies
    if [ -f "package.json" ]; then
        echo "Installing project dependencies..."
        npm ci --only=production || npm install --production
    fi
fi

# Ensure correct permissions
echo "Setting permissions..."
chown -R container:container /home/container

# Print environment for debugging (excluding sensitive data)
echo "Environment:"
env | grep -v "PASSWORD\|TOKEN\|KEY"

# Start Nginx if it's configured
if [ -f "/etc/nginx/nginx.conf" ]; then
    echo "Starting Nginx..."
    nginx
fi

# Initialize PM2 with proper logging
echo "Initializing PM2..."
pm2 flush
pm2 delete all > /dev/null 2>&1 || true

# Start the application with PM2
echo "Starting application..."
if [ -f "package.json" ]; then
    # Use PM2 to start the application
    pm2 start npm --name "app" -- start
else
    echo "No package.json found. Please ensure your application is properly set up."
    exit 1
fi

# Monitor logs
echo "Application started! Monitoring logs..."
pm2 logs --lines 50 