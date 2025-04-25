#!/bin/bash
# ICBC Study Hub - Entrypoint Script for Pterodactyl

# Exit on error
set -e

# Print banner
cat << "EOF"
 _____ _____ ______  _____    _____ _____ _   _ ______  _   _    _   _ _   _ ______
|_   _/  __ \| ___ \/  __ \  /  ___/  ___| | | |  _  \| | | |  | | | | | | || ___ \
  | | | /  \/| |_/ /| /  \/  \ `--.\ `--.| |_| | | | || | | |  | |_| | | | || |_/ /
  | | | |    | ___ \| |      `--. \`--. \|  _  | | | || | | |  |  _  | | | || ___ \
 _| |_| \__/\| |_/ /| \__/\  /\__/ /\__/ /| | | | |/ / | |_| |  | | | | |_| || |_/ /
 \___/ \____/\____/  \____/  \____/\____/ \_| |_/___/   \___/   \_| |_/\___/ \____/
                                                                                  
EOF

# Print system info
echo "System Information:"
echo "Node.js: $(node -v)"
echo "NPM: $(npm -v)"
echo "Platform: $(uname -s)"
echo "Architecture: $(uname -m)"

# Set environment variables
export PORT=${PORT:-3000}
export NODE_ENV=${NODE_ENV:-production}

echo "Starting with:"
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"

# Check if we're in a Pterodactyl environment
if [ -n "$P_SERVER_LOCATION" ]; then
    echo "Running in Pterodactyl environment"
fi

# Check for node_modules
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.installed" ]; then
    echo "Installing dependencies..."
    npm ci
    touch node_modules/.installed
fi

# Print environment for debugging (excluding sensitive data)
echo "Node Environment: $NODE_ENV"
echo "Port: $PORT"

# Ensure required directories exist
mkdir -p /app/logs

# Wait for any dependent services (if needed)
# Example: wait-for-it.sh db:3306 -t 60

# Start the application with proper production flags
if [ "$NODE_ENV" = "production" ]; then
    # Use PM2 in production for better process management
    npm install -g pm2
    pm2-runtime start npm -- start
else
    # Development mode
    npm start
fi 