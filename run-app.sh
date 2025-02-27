#!/bin/bash

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

# Check if npx is installed
if ! command_exists npx; then
  echo "Error: npx is not installed. Please install npm to run this application."
  exit 1
fi

# Function to handle cleanup on exit
cleanup() {
  echo ""
  echo "Shutting down servers..."
  
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

# Start the backend server
echo ""
echo "Starting backend server..."
node "$BASE_DIR/src/server.js" &
BACKEND_PID=$!

# Check if backend started successfully
sleep 2
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "Error: Failed to start backend server."
  exit 1
fi

echo "Backend server running on http://localhost:3000"

# Start the frontend server
echo ""
echo "Starting frontend server..."
cd "$BASE_DIR/frontend"
npx ng serve --open &
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
echo "  Both servers are now running!                      "
echo "  - Backend: http://localhost:3000                   "
echo "  - Frontend: http://localhost:4200                  "
echo "  - API Documentation: http://localhost:3000/api-docs"
echo "====================================================="
echo "Press Ctrl+C to stop both servers."

# Keep the script running
wait
