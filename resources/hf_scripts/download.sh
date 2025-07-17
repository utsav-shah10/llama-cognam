#!/bin/bash

# Prompt user
echo "Enter the organization/user name (e.g., 'microsoft'):"
read ORG

echo "Enter the model name (e.g., 'phi-2'):"
read MODEL

echo "Enter the target local directory (default: ./local_models):"
read LOCAL_DIR

# Use default if empty
LOCAL_DIR=${LOCAL_DIR:-./local_models}

# Create directory if it doesn't exist
mkdir -p "$LOCAL_DIR"

# Run download command
echo "📥 Downloading $ORG/$MODEL to $LOCAL_DIR..."
huggingface-cli download "$ORG/$MODEL" --local-dir "$LOCAL_DIR"

# Completion message
echo "✅ Model downloaded to: $LOCAL_DIR"
