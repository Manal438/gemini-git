# Gemini API Setup Guide

This guide will help you set up the **real Gemini API integration** for your GitHub Actions workflow.

## Prerequisites

- GitHub repository with Actions enabled
- Google Cloud account (or Google AI Studio account)
- Node.js 18+ (for local testing)

## Step 1: Get Your Gemini API Key

### Option A: Google AI Studio (Easiest)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy your API key (starts with `AIza...`)

**Note**: Google AI Studio provides free tier access to Gemini models!

### Option B: Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Generative Language API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **API Key**
6. Copy your API key

## Step 2: Add API Key to GitHub Secrets

### Using GitHub Web Interface

1. Go to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `GEMINI_API_KEY`
6. Value: Paste your API key (e.g., `AIzaSyA...`)
7. Click **Add secret**

### Using GitHub CLI

```bash
# Set the secret using gh CLI
gh secret set GEMINI_API_KEY

# You'll be prompted to enter the value
# Paste your API key and press Enter
```

## Step 3: Install Dependencies Locally (Optional)

If you want to test the scripts locally:

```bash
# Install Node.js dependencies
npm install

# Set environment variable (Linux/Mac)
export GEMINI_API_KEY="your-api-key-here"

# Set environment variable (Windows PowerShell)
$env:GEMINI_API_KEY="your-api-key-here"
```

## Step 4: Configure GitHub Actions Permissions

### Enable Workflow Permissions

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

### Enable Actions (if not already)

1. In **Settings** → **Actions** → **General**
2. Under **Actions permissions**, select:
   - ✅ **Allow all actions and reusable workflows**
3. Click **Save**

## Step 5: Push Changes to GitHub

```bash
# Add all new files
git add .

# Commit
git commit -m "Add real Gemini API integration

- Added package.json with dependencies
- Created gemini-task-handler.js for task automation
- Created gemini-pr-reviewer.js for PR reviews
- Updated GitHub Actions workflow
- Added comprehensive documentation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to GitHub
git push origin main
```

## Step 6: Test the Integration

### Test 1: Auto-labeling (No API Key Needed)

1. Create a new issue with title: "Add dark mode feature"
2. **Expected**: Issue is automatically labeled with `enhancement` and `frontend`

### Test 2: Task Delegation with AI

1. In the same issue, add a comment:
   ```
   @gemini-cli please implement this feature with a toggle button in the header
   ```

2. **Expected**:
   - ✅ Acknowledgment comment appears
   - ✅ Implementation plan is posted (AI-generated)
   - ✅ New branch is created
   - ✅ Code changes are committed
   - ✅ Pull request is opened
   - ✅ Summary with PR link is posted

3. Check the **Actions** tab to see the workflow running

### Test 3: PR Auto-review with AI

1. Create a test branch and make a simple change:
   ```bash
   git checkout -b test-feature
   echo "/* Test comment */" >> style.css
   git add style.css
   git commit -m "Test: Add comment to CSS"
   git push -u origin test-feature
   ```

2. Open a Pull Request on GitHub

3. **Expected**:
   - ✅ AI review comment appears within 1-2 minutes
   - ✅ Review includes specific feedback on your changes
   - ✅ Suggestions for improvement
   - ✅ Security and performance notes (if applicable)

## Verifying the Setup

### Check GitHub Actions Logs

1. Go to **Actions** tab in your repository
2. Click on the most recent workflow run
3. Click on the job (e.g., "Handle Gemini Task")
4. Expand the steps to see logs

**Look for:**
- ✅ "Starting Gemini task handler..."
- ✅ "Calling Gemini API..."
- ✅ "Analysis complete: ..."
- ✅ "Creating branch and committing changes..."
- ✅ "Task completed successfully!"

### Common Success Indicators

- New comments from "github-actions" bot appear on issues/PRs
- New branches created with pattern `gemini-cli/issue-X-timestamp`
- Pull requests created by the workflow
- Changes are relevant to the request

## Troubleshooting

### Error: "GEMINI_API_KEY is not set"

**Solution:**
- Verify you added the secret with exact name `GEMINI_API_KEY`
- Check spelling and capitalization
- Make sure you're viewing the correct repository settings

### Error: "API key not valid"

**Solution:**
- Verify your API key is correct
- Check if the key has been restricted in Google Cloud Console
- Ensure Generative Language API is enabled

### Error: "Could not parse Gemini response as JSON"

**Cause:** The AI's response wasn't in expected JSON format

**Solution:**
- This is usually temporary - try commenting `@gemini-cli` again
- Check Actions logs to see the raw response
- The prompt might need adjustment for complex requests

### Error: "Permission denied" when pushing

**Solution:**
- Ensure workflow permissions are set to "Read and write"
- Check that "Allow GitHub Actions to create and approve pull requests" is enabled
- Verify `GITHUB_TOKEN` has necessary permissions

### Workflow doesn't trigger

**Check:**
- [ ] Workflow file is in `.github/workflows/` directory
- [ ] YAML syntax is valid (use a YAML linter)
- [ ] Actions are enabled in repository settings
- [ ] You mentioned `@gemini-cli` in a comment (case-sensitive)

### No PR created after task delegation

**Possible causes:**
1. API key issue - check logs
2. Git configuration issue - workflow couldn't push
3. Gemini couldn't generate valid code - check response in logs
4. Merge conflicts with main branch

**Debug steps:**
1. Check Actions tab for error messages
2. Look at the last step that succeeded
3. Check if branch was created (even without PR)

## Understanding the Workflow

### What Happens When You Mention @gemini-cli

```
1. Comment detected → Workflow triggered
2. Repository checked out
3. Node.js and dependencies installed
4. gemini-task-handler.js runs:
   a. Posts acknowledgment comment
   b. Fetches issue/PR details
   c. Reads project files for context
   d. Calls Gemini API with full context
   e. Parses AI response (JSON)
   f. Creates new branch
   g. Applies code changes
   h. Commits and pushes
   i. Creates pull request
   j. Posts summary comment
```

### What Happens on PR Creation

```
1. PR opened → Workflow triggered
2. Repository checked out with full history
3. Base branch fetched for comparison
4. Node.js and dependencies installed
5. gemini-pr-reviewer.js runs:
   a. Gets PR details
   b. Fetches diff and changed files
   c. Calls Gemini API for review
   d. Formats review as markdown
   e. Posts review comment
```

## Cost Considerations

### Google AI Studio (Free Tier)

- **Free requests per minute**: 15
- **Free requests per day**: 1,500
- **Free tokens per minute**: 1 million

For most repositories, this is **more than enough**!

### Staying Within Limits

- Each task delegation = 1-2 API calls
- Each PR review = 1 API call
- Auto-labeling doesn't use API (keyword-based)

**Example usage:**
- 50 issues/PRs per day = ~75 API calls
- Well within free tier!

### Monitoring Usage

1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Click on your profile → **Usage**
3. Monitor API calls and tokens

## Advanced Configuration

### Customizing the AI Prompts

Edit the prompts in the scripts to change AI behavior:

**For task handling** ([scripts/gemini-task-handler.js](scripts/gemini-task-handler.js:65-105)):
```javascript
const prompt = `You are an AI assistant...
// Modify this to change how the AI understands requests
`;
```

**For PR reviews** ([scripts/gemini-pr-reviewer.js](scripts/gemini-pr-reviewer.js:68-123)):
```javascript
const prompt = `You are a code reviewer...
// Modify this to change review focus areas
`;
```

### Using Different Gemini Models

Change the model in the scripts:

```javascript
// Current (fast, cost-effective)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// Alternative: More powerful
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Alternative: Multimodal (for images)
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
```

### Adding Rate Limiting

To prevent API quota exhaustion:

```javascript
// Add to scripts
const RATE_LIMIT_DELAY = 4000; // 4 seconds between calls
await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
```

### Restricting API Key

For additional security, restrict your API key:

1. Go to Google Cloud Console → Credentials
2. Click on your API key
3. Under **API restrictions**, select:
   - Restrict key to specific APIs
   - Choose: Generative Language API
4. Under **Application restrictions**, optionally:
   - Add IP address restrictions (GitHub Actions IPs)
5. Save changes

## Security Best Practices

### ✅ DO:
- Store API key in GitHub Secrets (never in code)
- Use read-only access where possible
- Monitor API usage regularly
- Rotate API keys periodically
- Use API restrictions in Google Cloud

### ❌ DON'T:
- Commit API keys to repository
- Share API keys in issues/PRs
- Use same key across multiple projects (use separate keys)
- Disable security features to "make it work"

## Next Steps

Once everything is working:

1. ✅ **Test with real features**: Try the sample issues from [SAMPLE_ISSUES.md](SAMPLE_ISSUES.md)
2. ✅ **Customize prompts**: Adjust AI behavior for your needs
3. ✅ **Add team members**: Let others use @gemini-cli
4. ✅ **Monitor performance**: Check if AI suggestions are helpful
5. ✅ **Iterate and improve**: Refine prompts based on results

## Resources

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google Generative AI Node.js SDK](https://www.npmjs.com/package/@google/generative-ai)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Octokit REST API](https://octokit.github.io/rest.js/)

## Support

If you encounter issues:

1. Check the **Actions** tab logs for detailed error messages
2. Verify all secrets are set correctly
3. Test API key manually using the Gemini API playground
4. Review this guide's troubleshooting section

## Success Checklist

Before going live, verify:

- [ ] `GEMINI_API_KEY` secret is set in GitHub
- [ ] Workflow permissions are "Read and write"
- [ ] Actions can create PRs
- [ ] Dependencies install successfully (check Actions logs)
- [ ] Test issue with @gemini-cli works
- [ ] PR review triggers automatically
- [ ] Branches are created with correct names
- [ ] Pull requests are opened automatically
- [ ] Comments appear on issues/PRs

---

🎉 **Congratulations!** You now have a fully functional AI-powered GitHub automation workflow!

The AI will:
- ✅ Automatically label issues
- ✅ Implement features based on natural language
- ✅ Create pull requests with working code
- ✅ Review PRs with specific, contextual feedback
- ✅ Suggest improvements and catch issues

Try it out and watch the magic happen! 🚀
