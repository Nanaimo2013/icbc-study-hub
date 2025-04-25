#!/bin/ash
# ICBC Study Hub - Pterodactyl Startup Script

# Set environment variables with the defaults if not set
export PORT=${PORT:-3000}
export NODE_ENV=${NODE_ENV:-production}

# Print environment information
echo "Starting ICBC Study Hub..."
echo "Node.js Version: $(node -v)"
echo "NPM Version: $(npm -v)"
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"

# Install dependencies if they don't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the application
if [ "$NODE_ENV" = "production" ]; then
  echo "Starting application in production mode..."
  npm run build && npx serve -s build -l $PORT
else
  echo "Starting application in development mode..."
  npm start
fi 