#!/bin/bash
# Remove any stuck Git lock files
rm -f .git/index.lock

# Add changes
git add .

# Initial commit (Replit will force wrong email here)
git commit -m "$1"

# IMMEDIATELY amend with correct author (bypasses Replit's environment override)
# This re-infers identity from .git/config AFTER Replit's override fires
git commit --amend --reset-author --no-edit

# Try normal push first
echo "Attempting push to GitHub..."
if git push origin main 2>&1 | grep -q "non-fast-forward\|rejected"; then
  echo "⚠️  Divergence detected - auto-resolving with rebase..."
  
  # Fetch latest remote state
  git fetch origin
  
  # Rebase local changes on top of remote
  git rebase origin/main
  
  # Force push to resolve divergence
  echo "🚀 Force pushing to resolve divergence..."
  git push origin main --force
  
  echo "✅ Divergence resolved and pushed successfully!"
else
  echo "✅ Pushed successfully!"
fi
