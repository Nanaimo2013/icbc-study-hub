#!/bin/bash

# Exit on error
set -e

cd /home/container

# Output current state
echo "------------------------------------"
echo "Starting installation process..."
echo "Current directory: $(pwd)"
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "------------------------------------"

# Clone repository if it doesn't exist
if [ ! -d ".git" ]; then
    echo "Cloning fresh repository..."
    git clone https://github.com/Nanaimo2013/icbc-study-hub.git .
else
    echo "Repository exists, pulling updates..."
    git pull
fi

# Verify package.json exists
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Make scripts executable
echo "Setting up permissions..."
chmod +x startup.sh entrypoint.sh

# Create necessary directories
mkdir -p /home/container/logs
mkdir -p /home/container/tmp

# Set proper ownership
chown -R container:container /home/container

echo "------------------------------------"
echo "Installation complete!"
echo "Contents of directory:"
ls -la
echo "------------------------------------" 