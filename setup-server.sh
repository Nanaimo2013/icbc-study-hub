#!/bin/sh

# Exit on error
set -e

echo "=== ICBC Study Hub Server Setup ==="
echo "This script will set up Nginx and SSL for icbc.jmfhosting.com"

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root" 
    exit 1
fi

# Update system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
apt-get install -y nginx certbot python3-certbot-nginx

# Create Nginx directories if they don't exist
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# Copy Nginx configuration
echo "Setting up Nginx configuration..."
cp nginx/icbc.conf /etc/nginx/sites-available/icbc.conf

# Create symbolic link if it doesn't exist
if [ ! -L /etc/nginx/sites-enabled/icbc.conf ]; then
    ln -s /etc/nginx/sites-available/icbc.conf /etc/nginx/sites-enabled/
fi

# Remove default Nginx configuration if it exists
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

# Create build directory if it doesn't exist
mkdir -p /home/container/build

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

# Start and enable Nginx
echo "Starting Nginx..."
systemctl start nginx
systemctl enable nginx

# Get SSL certificate
echo "Obtaining SSL certificate..."
certbot --nginx -d icbc.jmfhosting.com --non-interactive --agree-tos --email jadenbowditch1@gmail.com

# Reload Nginx to apply changes
echo "Reloading Nginx..."
systemctl reload nginx

echo "=== Setup Complete ==="
echo "Your website should now be accessible at https://icbc.jmfhosting.com"
echo ""
echo "Don't forget to:"
echo "1. Set up your DNS A record to point icbc.jmfhosting.com to your server's IP"
echo "2. Make sure port 80 and 443 are open in your firewall"
echo ""
echo "To check the status of your site, run: systemctl status nginx" 