# ICBC Study Hub - Pterodactyl Deployment Guide

This guide will walk you through the process of setting up the ICBC Study Hub application on a Pterodactyl panel.

## Prerequisites

- A working Pterodactyl panel installation
- Administrator access to the panel
- Basic knowledge of Docker and Pterodactyl

## Step 1: Create a New Nest

1. Log in to your Pterodactyl panel as an administrator
2. Go to the "Nests" section in the admin area
3. Click "Create New" to create a new nest
4. Fill in the following details:
   - **Name**: Web Applications
   - **Description**: Nest for various web applications

## Step 2: Create a New Egg

1. Navigate to your newly created nest
2. Click "Create New Egg"
3. Fill in the following details:
   - **Name**: ICBC Study Hub
   - **Description**: A comprehensive study application for the ICBC knowledge test
   - **Docker Image**: `ghcr.io/yourusername/icbc-study-hub:latest` (or use the Node.js image: `ghcr.io/pterodactyl/yolks:nodejs_16`)
   - **Startup Command**: `bash entrypoint.sh`

4. Set the appropriate configuration:
   - **File Configuration**:
     ```json
     {
       "files": {
         "entrypoint.sh": {
           "parser": "file",
           "find": {}
         }
       }
     }
     ```
   - **Startup Detection**:
     ```json
     {
       "done": "Starting in production mode..."
     }
     ```

5. Add environment variables:
   - **PORT**: The port to run the application on (default: 3000)
   - **NODE_ENV**: The environment to run in (default: production)

6. Save the egg

## Step 3: Import the Egg (Alternative)

Instead of manually creating an egg, you can import the provided `pterodactyl.json` file:

1. Navigate to your nest
2. Click "Import Egg"
3. Upload the `pterodactyl.json` file from this repository
4. Click "Import"

## Step 4: Create a New Server

1. Go to the "Servers" section in the admin area
2. Click "Create New"
3. Select the nest and egg you created
4. Fill in the server details:
   - **Name**: ICBC Study Hub
   - **Owner**: Select a user
   - **Memory**: 1024 MB (minimum recommended)
   - **Disk**: 1024 MB (minimum recommended)
   - **Port Range**: 3000-3000 (or any other available port)

5. Set any other configuration options as needed
6. Create the server

## Step 5: Deploy and Configure

1. Log in to the panel as the server owner
2. Navigate to the server console
3. Click "Start" to start the server

The application should now be accessible at your server's IP address and port (e.g., http://your-server-ip:3000).

## Troubleshooting

### Application Not Starting

If the application doesn't start, check the logs for errors. Common issues include:

- **Port already in use**: Change the port in the environment variables
- **Missing dependencies**: Ensure the server has enough memory to install dependencies
- **File permissions**: Make sure the entrypoint script has execute permissions

### Can't Access the Application

If you can't access the application in your browser:

- Check that the server is running in the Pterodactyl panel
- Verify that the port is open in your firewall
- Ensure that the server's IP address is correct

## Advanced Configuration

### Custom Domain

To use a custom domain with your application:

1. Set up a DNS record pointing to your server's IP address
2. Configure a reverse proxy (such as Nginx or Apache) to forward requests to your application

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### HTTPS Support

To enable HTTPS:

1. Obtain SSL certificates (e.g., using Let's Encrypt)
2. Configure your reverse proxy to use the certificates

Example Nginx configuration with SSL:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}
```

## Updating the Application

To update the application:

1. Stop the server in the Pterodactyl panel
2. Go to the "File Manager" tab
3. Delete the existing files (except for customizations you want to keep)
4. Upload the new version of the application
5. Start the server 