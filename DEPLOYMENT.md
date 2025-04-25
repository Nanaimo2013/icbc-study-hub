# ICBC Study Hub - Deployment Guide

This guide covers all deployment options for the ICBC Study Hub application, from local development to production deployment using Docker and Pterodactyl.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Pterodactyl Deployment](#pterodactyl-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Docker and Docker Compose (for Docker deployment)
- A Pterodactyl panel (for Pterodactyl deployment)

## Local Development

### Quick Start with npm

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at http://localhost:3000.

### Using the run_locally.bat Script (Windows)

1. Double-click the `run_locally.bat` file or run it from the command prompt.
2. The script will check for Node.js and npm, install dependencies if needed, and start the application.

### Building for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Serve the build directory
npx serve -s build
```

### Using the build_and_package.bat Script (Windows)

1. Double-click the `build_and_package.bat` file or run it from the command prompt.
2. The script will create a "release" folder with all necessary files for deployment.

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start the containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

The application will be available at http://localhost:3000.

### Using the deploy.sh Script (Linux/macOS)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the script
./deploy.sh
```

### Using the deploy.bat Script (Windows)

1. Double-click the `deploy.bat` file or run it from the command prompt.
2. The script will check for Docker and Docker Compose, build the application, and start the Docker containers.

### Manual Docker Build

```bash
# Build the Docker image
docker build -t icbc-study-hub .

# Run the container
docker run -d -p 3000:80 --name icbc-study-hub icbc-study-hub
```

### Docker Image Configuration

The application uses a multi-stage build process:
1. Stage 1: Builds the React application using Node.js
2. Stage 2: Serves the built files using Nginx

The Nginx configuration includes:
- Proper routing for single-page applications
- Security headers
- Gzip compression
- Cache control for static assets

## Pterodactyl Deployment

### Prerequisites

- A working Pterodactyl panel installation
- Administrator access to the panel
- Basic knowledge of Docker and Pterodactyl

### Step 1: Create a New Nest

1. Log in to your Pterodactyl panel as an administrator
2. Go to the "Nests" section in the admin area
3. Click "Create New" to create a new nest
4. Fill in the following details:
   - **Name**: Web Applications
   - **Description**: Nest for various web applications

### Step 2: Create a New Egg (Manual Method)

1. Navigate to your newly created nest
2. Click "Create New Egg"
3. Fill in the following details:
   - **Name**: ICBC Study Hub
   - **Description**: A comprehensive study application for the ICBC knowledge test
   - **Docker Image**: `ghcr.io/pterodactyl/yolks:nodejs_16`
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

### Step 3: Import the Egg (Alternative Method)

Instead of manually creating an egg, you can import the provided `pterodactyl.json` file:

1. Navigate to your nest
2. Click "Import Egg"
3. Upload the `pterodactyl.json` file from this repository
4. Click "Import"

### Step 4: Create a New Server

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

### Step 5: Deploy and Configure

1. Log in to the panel as the server owner
2. Navigate to the server console
3. Click "Start" to start the server

The application should now be accessible at your server's IP address and port (e.g., http://your-server-ip:3000).

## Environment Variables

The application supports the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | The port to run the application on | 3000 |
| `NODE_ENV` | The environment to run in | development |

## Troubleshooting

### Common Issues

#### Application Not Starting
- Check if the port is already in use
- Verify there's enough memory for Node.js to run
- Check file permissions on scripts (particularly entrypoint.sh)

#### Docker Issues
- Ensure Docker daemon is running
- Check if ports are already in use
- Verify Docker has enough resources allocated

#### Pterodactyl Issues
- Check server logs for detailed error messages
- Verify the server has sufficient resources
- Ensure all required files are uploaded correctly

### Logs

- **Development**: Logs are output to the console
- **Docker**: View logs with `docker-compose logs -f`
- **Pterodactyl**: View logs in the console tab of the panel

## Advanced Configuration

### Using a Reverse Proxy

If you want to serve the application behind a reverse proxy like Nginx or Apache, configure the proxy to forward requests to the application port.

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