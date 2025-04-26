#!/bin/sh
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

# Change to container directory
cd /home/container || exit 1

# Output Current Running Process
echo "Starting container with the following settings:"
echo "Running as user: $(whoami)"
echo "Current working directory: $(pwd)"
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# Default environment variables
export NODE_ENV=${NODE_ENV:-production}
export SERVER_PORT=${SERVER_PORT:-25572}
export PORT=${SERVER_PORT}
export TZ=${TZ:-UTC}

# Make scripts executable if they exist
if [ -f "startup.sh" ]; then
    chmod +x startup.sh
fi

if [ -f "install.sh" ]; then
    chmod +x install.sh
fi

# Install dependencies if needed
if [ ! -d "node_modules" ] && [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm install --production
fi

# Execute the startup script
if [ -f "startup.sh" ]; then
    echo "Running startup script..."
    exec ./startup.sh
else
    echo "ERROR: startup.sh not found!"
    exit 1
fi 