#!/bin/bash

# Exit on error
set -e

# Update package lists
echo "Updating package lists..."
apt-get update

# Install essential packages
echo "Installing essential packages..."
apt-get install -y \
    bash \
    nginx \
    curl \
    ca-certificates \
    openssl \
    git \
    tzdata \
    nodejs \
    npm \
    build-essential \
    python3

# Clean up
apt-get clean
rm -rf /var/lib/apt/lists/*

# Install Node.js global packages
echo "Installing global Node.js packages..."
npm install -g pm2

# Create necessary directories
echo "Setting up directories..."
mkdir -p /home/container

# Set permissions
echo "Setting permissions..."
chown -R container:container /home/container

# Set up Node.js environment
echo "Setting up Node.js environment..."
npm ci --only=production

echo "Installation complete!" 