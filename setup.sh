#!/bin/bash

echo "====================================================="
echo "   Baby Clothing Store Management System Setup       "
echo "====================================================="

# Set the base directory to the script location
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$BASE_DIR"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
  echo "Error: Node.js is not installed. Please install Node.js to run this application."
  exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
  echo "Error: npm is not installed. Please install npm to run this application."
  exit 1
fi

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
npm install

# Check if backend dependencies installed successfully
if [ $? -ne 0 ]; then
  echo "Error: Failed to install backend dependencies."
  exit 1
fi

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd "$BASE_DIR/frontend"
npm install

# Check if frontend dependencies installed successfully
if [ $? -ne 0 ]; then
  echo "Error: Failed to install frontend dependencies."
  exit 1
fi

# Install Angular Material
echo ""
echo "Installing Angular Material..."
npx ng add @angular/material --skip-confirmation

# Check if Angular Material installed successfully
if [ $? -ne 0 ]; then
  echo "Warning: Failed to install Angular Material. You may need to run this manually."
fi

echo ""
echo "====================================================="
echo "  Setup completed successfully!                      "
echo "  To start the application, run:                     "
echo "  ./run-app.sh                                       "
echo "====================================================="
