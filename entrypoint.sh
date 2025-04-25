#!/bin/bash
# ICBC Study Hub - Entrypoint Script for Pterodactyl

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

# Start based on environment
if [ "$NODE_ENV" = "production" ]; then
    echo "Starting in production mode..."
    
    # Check if build folder exists, if not, build the app
    if [ ! -d "build" ]; then
        echo "Building application..."
        npm run build
    fi
    
    # Start with serve for production
    npx serve -s build -l $PORT
else
    echo "Starting in development mode..."
    npm start
fi 