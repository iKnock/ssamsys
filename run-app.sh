#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "====================================================="
echo "   Baby Clothing Store Management System Launcher    "
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

# Check if Angular CLI is installed
if ! command_exists ng; then
  echo "Error: Angular CLI is not installed. Please install it using 'npm install -g @angular/cli'."
  exit 1
fi

# Check if Docker is installed
if ! command_exists docker; then
  echo "Error: Docker is not installed. Please install Docker to run this application."
  exit 1
fi

# Function to handle cleanup on exit
cleanup() {
  echo ""
  echo "Shutting down servers and services..."
  
  # Stop Docker services
  docker-compose down 2>/dev/null || true
  
  # Kill the backend process if it exists
  if [ -n "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null || true
    echo "Backend server stopped."
  fi
  
  # Kill the frontend process if it exists
  if [ -n "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null || true
    echo "Frontend server stopped."
  fi
  
  echo "Cleanup complete. Goodbye!"
  exit 0
}

# Set up trap to catch termination signals
trap cleanup INT TERM EXIT

# Start DynamoDB local services
echo ""
echo "Starting DynamoDB local services..."
docker-compose up -d dynamodb dynamodb-admin

# Wait for DynamoDB to be ready
echo "Waiting for DynamoDB to start..."
sleep 5

# Seed the database
echo ""
echo "Seeding database..."
cd "$BASE_DIR/backend"
npm run dynamodb:seed
cd "$BASE_DIR"

# Start the backend server
echo ""
echo "Starting backend server..."
cd "$BASE_DIR/backend"
npm run dev &
BACKEND_PID=$!
cd "$BASE_DIR"

# Check if backend started successfully
sleep 2
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "Error: Failed to start backend server."
  exit 1
fi

echo "Backend server running on http://localhost:3000"

# Start the frontend Angular server
echo ""
echo "Starting frontend Angular server..."
cd "$BASE_DIR/frontend"
ng serve --open &
FRONTEND_PID=$!

# Check if frontend started successfully
sleep 5
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
  echo "Error: Failed to start frontend server."
  kill $BACKEND_PID
  exit 1
fi

echo "Frontend server running on http://localhost:4200"

echo ""
echo "====================================================="
echo "  All Services are now running!                      "
echo "  - Backend: http://localhost:3000                   "
echo "  - API Docs: http://localhost:3000/api-docs         "
echo "  - Frontend: http://localhost:4200                  "
echo "  - DynamoDB: http://localhost:8000                  "
echo "  - DynamoDB Admin: http://localhost:8001            "
echo "====================================================="
echo "Press Ctrl+C to stop all services."

# Keep the script running
wait
