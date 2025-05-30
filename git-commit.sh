#!/bin/bash

# Usage: ./git-commit.sh "Your commit message"

# Check if commit message is passed
if [ -z "$1" ]; then
  echo "❌ Please provide a commit message."
  echo "✅ Usage: ./git-commit.sh \"Your commit message\""
  exit 1
fi

# Add all changes
git add .

# Commit with the provided message
git commit -m "$1"

# Push to the current branch
git push

echo "✅ Code committed and pushed successfully."
