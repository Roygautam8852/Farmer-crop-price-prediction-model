#!/bin/bash
# ngrok Setup Helper for exposing Jenkins publicly

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              ngrok Setup for Jenkins Access                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "⚠️  ngrok is not installed. Installing..."
    
    # Platform detection
    OS=$(uname -s)
    
    case "$OS" in
        Darwin)
            echo "macOS detected - installing ngrok via Homebrew..."
            brew install ngrok
            ;;
        Linux)
            echo "Linux detected - installing ngrok..."
            wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
            tar xvzf ngrok-v3-stable-linux-amd64.tgz -C /usr/local/bin
            rm ngrok-v3-stable-linux-amd64.tgz
            ;;
        MINGW*|MSYS*|CYGWIN*)
            echo "Windows detected"
            echo "Download from: https://ngrok.com/download"
            echo "Then add to PATH and run: ngrok http 8080"
            exit 1
            ;;
        *)
            echo "Unsupported OS: $OS"
            exit 1
            ;;
    esac
fi

echo "✓ ngrok is installed"
echo ""
echo "1. Sign up for ngrok at: https://ngrok.com"
echo "2. Get your auth token from: https://dashboard.ngrok.com/auth"
echo ""

read -p "Enter your ngrok auth token: " AUTH_TOKEN

if [ -z "$AUTH_TOKEN" ]; then
    echo "❌ Auth token cannot be empty"
    exit 1
fi

# Configure ngrok
echo "Configuring ngrok..."
ngrok config add-authtoken "$AUTH_TOKEN"

echo "✓ ngrok configured"
echo ""
echo "Starting ngrok tunnel to Jenkins (localhost:8080)..."
echo ""
echo "⚠️  Keep this terminal open!"
echo ""
ngrok http 8080

# The tunnel will be printed on screen with a URL like:
# https://xxxxx-xxx.ngrok.io
# Use this URL in GitHub Webhook settings
