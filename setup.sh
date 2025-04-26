#!/bin/bash

# Exit on any error
set -e

echo "=== ICBC Study Hub Complete Setup ==="
echo "This script will set up everything needed for the ICBC Study Hub application"

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root or with sudo"
    exit 1
fi

# Update system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required base packages
echo "Installing required base packages..."
apt-get install -y curl wget git nginx certbot python3-certbot-nginx

# Set up the MongoDB database
echo "Setting up MongoDB..."
bash ./setup-mongodb.sh

# Set up Nginx configuration
echo "Setting up Nginx..."
bash ./setup-server.sh

# Check for Node.js, install if missing
if ! command -v node &> /dev/null; then
    echo "Node.js not found, installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    echo "Node.js installed: $(node -v)"
fi

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
    pm2 startup
    systemctl enable pm2-root
fi

# Build the application
echo "Building the application..."
npm install
npm run build

# Start the application with PM2
echo "Starting the application with PM2..."
pm2 start server.js --name "icbc-study-hub" --update-env
pm2 save

# Configure Cloudflare
echo "
=== Cloudflare Configuration Instructions ===

1. In Cloudflare DNS, add the following records:
   - A record:
     Name: icbc
     Content: $(curl -s ifconfig.me)
     Proxy status: Proxied

2. In Cloudflare SSL/TLS settings:
   - Set SSL mode to 'Full (strict)'
   - Enable 'Always Use HTTPS'
   - Set minimum TLS version to 1.2

3. In Cloudflare Page Rules:
   Add a rule for https://icbc.jmfhosting.com/*
   - Cache Level: Cache Everything
   - Browser Cache TTL: 4 hours

4. In Cloudflare Caching:
   - Set Browser Cache TTL to 4 hours

5. Verify that the website works at:
   https://icbc.jmfhosting.com
"

# Print summary
echo "
=== Setup Complete ===

Your ICBC Study Hub is now set up and running!

Server IP: $(curl -s ifconfig.me)
Website URL: https://icbc.jmfhosting.com
MongoDB URI: mongodb://icbcapp:icbcpassword@localhost:27017/icbc-study-hub

Test Account:
Username: testuser
Password: password

To restart the application: pm2 restart icbc-study-hub
To view logs: pm2 logs icbc-study-hub
To stop the application: pm2 stop icbc-study-hub

Thank you for using ICBC Study Hub!
" 