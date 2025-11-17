#!/bin/bash

# Florian Project Setup Script

echo "🚀 Setting up VT Project..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
else
    echo "✅ .env file already exists."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create output directory if it doesn't exist
mkdir -p client/output

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run 'npm run dev' to start both client and server"
echo "3. Or run 'npm run dev:server' and 'npm run dev:client' separately"
echo ""
echo "Available commands:"
echo "  npm run dev          # Run both client and server"
echo "  npm run dev:server   # Run server only"
echo "  npm run dev:client   # Run client only"
echo "  npm run start:server # Start server in production"
echo "  npm run start:client # Start client in production"
echo ""
