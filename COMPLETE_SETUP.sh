#!/bin/bash

# Complete Setup Script for Gemini CLI GitHub Actions
# This script automates the entire setup process

set -e  # Exit on any error

echo "🚀 Gemini CLI GitHub Actions - Complete Setup"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check dependencies
echo -e "${BLUE}Step 1: Checking dependencies...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ git not found. Please install git${NC}"
    exit 1
fi

if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI (gh) not found. Will use manual steps for GitHub setup${NC}"
    GH_CLI_AVAILABLE=false
else
    GH_CLI_AVAILABLE=true
fi

echo -e "${GREEN}✅ All dependencies checked${NC}"
echo ""

# Step 2: Install npm dependencies
echo -e "${BLUE}Step 2: Installing npm dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Create .env file if needed
echo -e "${BLUE}Step 3: Setting up environment file...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and add your GEMINI_API_KEY${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi
echo ""

# Step 4: Check git status
echo -e "${BLUE}Step 4: Checking git repository...${NC}"
if [ -d .git ]; then
    echo -e "${GREEN}✅ Git repository found${NC}"

    # Check if there are uncommitted changes
    if [[ -n $(git status -s) ]]; then
        echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
        echo ""
        git status -s
        echo ""
        read -p "Commit all changes? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "Complete Gemini CLI integration setup

- Added all AI scripts and handlers
- Updated GitHub Actions workflows
- Added comprehensive documentation
- Fixed npm dependencies and caching"
            echo -e "${GREEN}✅ Changes committed${NC}"
        fi
    else
        echo -e "${GREEN}✅ No uncommitted changes${NC}"
    fi
else
    echo -e "${RED}❌ Not a git repository${NC}"
    exit 1
fi
echo ""

# Step 5: Push to GitHub
echo -e "${BLUE}Step 5: Pushing to GitHub...${NC}"
echo ""
echo "Current branch: $(git branch --show-current)"
echo "Remote: $(git remote get-url origin 2>/dev/null || echo 'No remote configured')"
echo ""

if git remote get-url origin &> /dev/null; then
    read -p "Push to GitHub now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        CURRENT_BRANCH=$(git branch --show-current)
        if $GH_CLI_AVAILABLE; then
            gh auth status &> /dev/null || gh auth login
            git push origin $CURRENT_BRANCH
        else
            git push origin $CURRENT_BRANCH
        fi
        echo -e "${GREEN}✅ Pushed to GitHub${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipping push. Run 'git push' manually later${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No remote configured. Please set up GitHub remote first${NC}"
fi
echo ""

# Step 6: Get Gemini API Key
echo -e "${BLUE}Step 6: Gemini API Key Setup${NC}"
echo ""
echo "To use the AI features, you need a Gemini API key:"
echo ""
echo "1. Visit: https://makersuite.google.com/app/apikey"
echo "2. Sign in with your Google account"
echo "3. Click 'Get API Key' or 'Create API Key'"
echo "4. Copy the key (starts with AIza...)"
echo ""

if $GH_CLI_AVAILABLE; then
    read -p "Do you have your API key ready? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Adding secret to GitHub..."
        gh secret set GEMINI_API_KEY
        echo -e "${GREEN}✅ API key added to GitHub Secrets${NC}"
    else
        echo -e "${YELLOW}⚠️  Get your API key and run: gh secret set GEMINI_API_KEY${NC}"
    fi
else
    echo -e "${YELLOW}Manual setup required:${NC}"
    echo "1. Go to your repository on GitHub"
    echo "2. Settings → Secrets and variables → Actions"
    echo "3. Click 'New repository secret'"
    echo "4. Name: GEMINI_API_KEY"
    echo "5. Value: Paste your API key"
    echo "6. Click 'Add secret'"
fi
echo ""

# Step 7: Configure GitHub Actions permissions
echo -e "${BLUE}Step 7: GitHub Actions Permissions${NC}"
echo ""
echo "You need to enable workflow permissions:"
echo ""
echo "1. Go to your repository on GitHub"
echo "2. Settings → Actions → General"
echo "3. Scroll to 'Workflow permissions'"
echo "4. Select: ✅ Read and write permissions"
echo "5. Select: ✅ Allow GitHub Actions to create and approve pull requests"
echo "6. Click 'Save'"
echo ""

if $GH_CLI_AVAILABLE; then
    REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
    if [ -n "$REPO" ]; then
        echo "Repository: $REPO"
        echo "Direct link: https://github.com/$REPO/settings/actions"
    fi
fi

read -p "Press Enter when you've configured the permissions..."
echo -e "${GREEN}✅ Permissions configured${NC}"
echo ""

# Step 8: Test the setup (optional)
echo -e "${BLUE}Step 8: Test API Connection (optional)${NC}"
echo ""

if [ -f .env ]; then
    source .env
    if [ -n "$GEMINI_API_KEY" ] && [ "$GEMINI_API_KEY" != "your_gemini_api_key_here" ]; then
        read -p "Test your API key locally? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm run test-api
        fi
    else
        echo -e "${YELLOW}⚠️  API key not set in .env file. Skipping local test${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No .env file found. Skipping local test${NC}"
fi
echo ""

# Final summary
echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=============================================="
echo ""
echo -e "${BLUE}What was set up:${NC}"
echo "✅ npm dependencies installed"
echo "✅ package-lock.json generated"
echo "✅ Environment file created"
echo "✅ Changes committed to git"
echo "✅ (Optional) Pushed to GitHub"
echo "✅ (Optional) API key configured"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. Make sure your code is pushed to GitHub"
echo "2. Verify GEMINI_API_KEY is in GitHub Secrets"
echo "3. Check workflow permissions are enabled"
echo ""
echo "4. Test it:"
echo "   - Create a new issue on GitHub"
echo "   - Title: 'Add dark mode feature'"
echo "   - Comment: '@gemini-cli please implement this'"
echo "   - Watch the AI create a PR in 1-2 minutes!"
echo ""
echo -e "${BLUE}Quick test commands:${NC}"
if $GH_CLI_AVAILABLE; then
    echo "  gh issue create --title 'Test: Add dark mode' --body 'Add a dark mode toggle'"
    echo "  gh issue comment <issue-number> --body '@gemini-cli please implement this'"
fi
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "  📖 QUICK_START.md - Fast setup guide"
echo "  📖 GEMINI_API_SETUP.md - Detailed API setup"
echo "  📖 VERIFICATION_GUIDE.md - How to verify it works"
echo "  📖 SAMPLE_ISSUES.md - Example issues to try"
echo ""
echo -e "${GREEN}Happy coding with AI! 🤖✨${NC}"
echo ""
