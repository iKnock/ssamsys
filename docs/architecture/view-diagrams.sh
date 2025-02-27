#!/bin/bash

# Script to open architecture diagrams in the default browser

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Open the index.html file in the default browser
open "$SCRIPT_DIR/index.html"

echo "Opening architecture diagrams in your default browser..."
