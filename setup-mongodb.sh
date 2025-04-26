#!/bin/bash

# Exit on any error
set -e

echo "=== ICBC Study Hub MongoDB Setup ==="
echo "This script will set up a MongoDB database for the ICBC Study Hub application"

# Check if MongoDB is installed, if not, install it
if ! command -v mongod &> /dev/null; then
    echo "MongoDB not found, installing..."
    
    # Add MongoDB repository
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    
    # Update package lists and install MongoDB
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    
    # Start MongoDB service
    sudo systemctl daemon-reload
    sudo systemctl start mongod
    sudo systemctl enable mongod
    
    echo "MongoDB installed and started"
else
    echo "MongoDB is already installed"
    
    # Ensure MongoDB is running
    if ! systemctl is-active --quiet mongod; then
        echo "Starting MongoDB service..."
        sudo systemctl start mongod
    fi
fi

# Wait for MongoDB to start completely
echo "Waiting for MongoDB to start..."
sleep 5

# Create the database and user
echo "Setting up ICBC Study Hub database and user..."
mongo --eval "
    db = db.getSiblingDB('icbc-study-hub');
    
    // Create user for the application
    if (!db.getUser('icbcapp')) {
        db.createUser({
            user: 'icbcapp',
            pwd: 'icbcpassword',
            roles: [{ role: 'readWrite', db: 'icbc-study-hub' }]
        });
        print('Created user icbcapp');
    } else {
        print('User icbcapp already exists');
    }
    
    // Create collections
    db.createCollection('users');
    print('Collection users created or already exists');
    
    // Create indexes
    db.users.createIndex({ username: 1 }, { unique: true });
    db.users.createIndex({ email: 1 }, { unique: true });
    print('Created indexes on users collection');
    
    // Add a test user if it doesn't exist
    var testUser = db.users.findOne({ username: 'testuser' });
    if (!testUser) {
        db.users.insertOne({
            username: 'testuser',
            email: 'test@example.com',
            password: '$2a$10$XgZxhQmHRW8Ua1XMw5qIgOFNeJ/edX2z1k4Mwy0VpXoKmlDGbJr7G', // 'password'
            progress: {
                flashcards: { total: 10, correct: 8 },
                practice: { total: 20, correct: 15 },
                signs: { total: 5, correct: 5 }
            },
            createdAt: new Date()
        });
        print('Added test user');
    } else {
        print('Test user already exists');
    }
"

# Configure MongoDB connection string in environment
echo "Configuring MongoDB connection string..."
MONGODB_URI="mongodb://icbcapp:icbcpassword@localhost:27017/icbc-study-hub"

# Add to environment variables
if ! grep -q "MONGODB_URI" /etc/environment; then
    echo "MONGODB_URI=\"$MONGODB_URI\"" | sudo tee -a /etc/environment
    echo "Added MONGODB_URI to environment variables"
else
    echo "MONGODB_URI is already in environment variables"
fi

# Apply environment variables for the current session
export MONGODB_URI="$MONGODB_URI"

echo "=== MongoDB Setup Complete ==="
echo "MongoDB is now configured for ICBC Study Hub"
echo "Connection string: $MONGODB_URI"
echo ""
echo "You can use the following test account:"
echo "Username: testuser"
echo "Password: password"
echo ""
echo "To start using MongoDB in your application, update your server.js or .env file to use this connection string." 