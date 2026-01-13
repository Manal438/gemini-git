# Quick Start Guide - Real Gemini API Integration

Get your AI-powered GitHub automation running in **5 minutes**!

## 🚀 Fast Track Setup

### 1. Get API Key (2 minutes)

```bash
# Open this URL in your browser:
https://makersuite.google.com/app/apikey

# Click "Get API Key" or "Create API Key"
# Copy the key (starts with AIza...)
```

### 2. Add to GitHub (1 minute)

```bash
# Option A: Using GitHub CLI (fastest)
gh secret set GEMINI_API_KEY
# Paste your key when prompted

# Option B: Web interface
# Go to: Settings → Secrets and variables → Actions
# New repository secret → Name: GEMINI_API_KEY → Paste key
```

### 3. Configure Permissions (1 minute)

```bash
# Go to: Settings → Actions → General
# Scroll to "Workflow permissions"
# Select: ✅ Read and write permissions
# Select: ✅ Allow GitHub Actions to create and approve pull requests
# Click Save
```

### 4. Push to GitHub (1 minute)

```bash
git add .
git commit -m "Add real Gemini API integration"
git push origin main
```

### 5. Test It! (< 1 minute)

```bash
# Create a new issue with this:
Title: Add dark mode toggle
Description: I want a dark mode feature with a toggle button

# Then comment:
@gemini-cli please implement this feature
```

**Expected result**: Within 1-2 minutes, you'll see:
- ✅ Acknowledgment comment
- ✅ Implementation plan
- ✅ New branch created
- ✅ Code changes committed
- ✅ Pull request opened
- ✅ Summary with PR link

## 🧪 Test Locally First (Optional)

Want to verify your API key works before deploying?

```bash
# Install dependencies
npm install

# Run test script
npm run test-api

# If it works, you'll see:
# ✅ Success! Your Gemini API is working correctly.
```

## 📋 Checklist

Before you start, make sure:

- [ ] You have a GitHub repository
- [ ] Actions are enabled in your repo
- [ ] You have a Google account (for Gemini API)
- [ ] Node.js 18+ installed (for local testing)

## 🎯 What You Get

Once set up, your repository will have:

### Automatic Issue Labeling
- Creates issue → Bot auto-labels it
- Keywords detected → Appropriate tags applied
- No manual categorization needed

### AI Task Delegation
- Mention `@gemini-cli` → AI implements feature
- Natural language requests → Working code
- Auto-creates branch and PR

### Intelligent PR Reviews
- Open PR → AI reviews automatically
- Specific feedback on changes
- Security and performance analysis

## 💡 Usage Examples

### Example 1: New Feature
```markdown
Issue: Add task priority levels

Comment: @gemini-cli please add High/Medium/Low priority
with color coding (red/yellow/green) and ability to sort by priority
```

**Result**: AI will create a PR with:
- Priority dropdown in UI
- Color-coded task display
- Sort functionality
- Updated localStorage schema

### Example 2: Bug Fix
```markdown
Issue: Clear completed button not working

Comment: @gemini-cli please investigate and fix this bug
```

**Result**: AI will:
- Analyze the code
- Identify the issue
- Fix the bug
- Create PR with explanation

### Example 3: Improvement Request
```markdown
PR opened with changes

AI automatically comments:
- Summary of changes
- Good practices detected
- Potential issues
- Suggestions for improvement
```

## ⚡ Power Tips

### 1. Be Specific
```markdown
❌ @gemini-cli add dark mode
✅ @gemini-cli add dark mode with a toggle button in the header,
   save preference to localStorage, use dark purple gradient
```

### 2. Iterate on Feedback
```markdown
# On the PR created by AI:
@gemini-cli please address the review comments and make the
suggested improvements
```

### 3. Request Explanations
```markdown
@gemini-cli please implement this and explain the key design
decisions in the PR description
```

## 🔧 Troubleshooting

### "Workflow not running"
```bash
# Check Actions tab for errors
# Verify GEMINI_API_KEY secret exists
# Ensure @gemini-cli is spelled correctly
```

### "Permission denied"
```bash
# Settings → Actions → General
# Enable "Read and write permissions"
# Enable "Allow GitHub Actions to create PRs"
```

### "API key invalid"
```bash
# Verify key in GitHub Secrets
# Generate new key: https://makersuite.google.com/app/apikey
# Update the secret
```

## 📚 Next Steps

1. ✅ **Try sample issues** from [SAMPLE_ISSUES.md](SAMPLE_ISSUES.md)
2. ✅ **Read full docs** in [GEMINI_API_SETUP.md](GEMINI_API_SETUP.md)
3. ✅ **Customize prompts** in [scripts/](scripts/)
4. ✅ **Monitor usage** at [Google AI Studio](https://makersuite.google.com/)

## 🎉 You're Done!

Your repository now has:
- 🤖 AI-powered task automation
- 📋 Automatic issue labeling
- 🔍 Intelligent PR reviews
- 💬 Natural language interface

**Start delegating tasks to @gemini-cli and watch the magic happen!** ✨

---

**Need help?** Check [GEMINI_API_SETUP.md](GEMINI_API_SETUP.md) for detailed documentation.
