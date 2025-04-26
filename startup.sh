#!/bin/sh

cd /home/container || exit 1

# Environment Variables
export NODE_ENV=${NODE_ENV:-production}
export SERVER_PORT=${SERVER_PORT:-25572}
export PORT=${SERVER_PORT}
export TZ=${TZ:-UTC}
export MONGODB_URI=${MONGODB_URI:-mongodb://localhost:27017/icbc-study-hub}
export JWT_SECRET=${JWT_SECRET:-icbc-study-hub-jwt-secret-key-$(date +%s)}

# Output current state
echo "------------------------------------"
echo "Starting ICBC Study Hub..."
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Working directory: $(pwd)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "MongoDB URI: $MONGODB_URI"
echo "------------------------------------"

# Install MongoDB if needed
if [ "$INSTALL_MONGODB" = "true" ]; then
    echo "Checking for MongoDB..."
    if ! command -v mongod &> /dev/null; then
        echo "MongoDB not found, installing..."
        apt-get update && apt-get install -y mongodb
        systemctl enable mongodb
        systemctl start mongodb
        echo "MongoDB installed and started"
    else
        echo "MongoDB already installed"
        if ! systemctl is-active --quiet mongodb; then
            echo "Starting MongoDB service..."
            systemctl start mongodb
        fi
    fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production
fi

# Function to check if rebuild is needed
needs_rebuild() {
    # If build directory doesn't exist, rebuild
    if [ ! -d "build" ]; then
        return 0
    fi
    
    # If package.json is newer than build directory, rebuild
    if [ "$(find package.json -newer build -print -quit)" ]; then
        return 0
    fi
    
    # If src files are newer than build directory, rebuild
    if [ "$(find src -newer build -print -quit 2>/dev/null)" ]; then
        return 0
    fi
    
    return 1
}

# Start the application
if [ -f "package.json" ]; then
    # Check if we need to rebuild
    if needs_rebuild; then
        echo "Changes detected, rebuilding application..."
        npm run build
    else
        echo "No changes detected, using existing build..."
    fi

    # Serve the React application
    if [ -d "build" ]; then
        echo "Starting production server on port $PORT..."
        exec node server.js
    else
        echo "ERROR: build directory not found after build!"
        exit 1
    fi
else
    echo "ERROR: package.json not found!"
    exit 1
fi 