# Git Configuration Instructions

## Prerequisites
1. Install Git: https://git-scm.com/download/windows
2. Create a GitHub repository for this project

## Setup Commands
Once Git is installed, run these commands:

```bash
# Initialize repository
git init

# Set default branch to main
git branch -M main

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Parent Portal & Staff Dashboard monorepo"

# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## GitHub Repository Settings

### Branch Protection Rules for `main` branch:
1. Go to Settings → Branches in your GitHub repository
2. Add rule for `main` branch with these settings:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (minimum: 1)
   - ✅ Dismiss stale PR approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Restrict pushes that create new files
   - ✅ Do not allow bypassing the above settings

### Repository Settings:
1. Go to Settings → General
2. Enable Issues: ✅
3. Enable Discussions: ✅
4. Enable Projects: ✅ (optional)
5. Enable Wiki: ✅ (optional)

### Required Status Checks:
Add these as required status checks:
- `build`
- `lint`
- `type-check`
- `test`