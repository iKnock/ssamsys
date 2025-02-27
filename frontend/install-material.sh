#!/bin/bash

# Navigate to the frontend directory
cd "$(dirname "$0")"

# Install Angular Material
echo "Installing Angular Material..."
npx ng add @angular/material

# Install additional dependencies
echo "Installing additional dependencies..."
npm install chart.js ng2-charts @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools

echo "Installation complete!"
