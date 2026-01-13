# Setup Guide: Deploying to GitHub

Follow these steps to deploy your Todo App with Gemini CLI GitHub Actions integration.

## Step 1: Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Todo app with Gemini CLI integration"
```

## Step 2: Create GitHub Repository

### Option A: Using GitHub CLI (gh)

```bash
# Create a public repository
gh repo create gemini-git --public --source=. --remote=origin --push

# Or create a private repository
gh repo create gemini-git --private --source=. --remote=origin --push
```

### Option B: Using GitHub Web Interface

1. Go to https://github.com/new
2. Repository name: `gemini-git` (or your preferred name)
3. Choose Public or Private
4. **Don't** initialize with README (we already have one)
5. Click "Create repository"
6. Follow the commands shown:

```bash
git remote add origin https://github.com/YOUR_USERNAME/gemini-git.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. In the left sidebar, click "Actions" → "General"
4. Under "Actions permissions", select:
   - ✅ "Allow all actions and reusable workflows"
5. Click "Save"

## Step 4: Configure Workflow Permissions

1. Still in Settings → Actions → General
2. Scroll down to "Workflow permissions"
3. Select:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"
4. Click "Save"

## Step 5: Create Labels (Optional but Recommended)

Run these commands to create labels that match the auto-labeling workflow:

```bash
gh label create "enhancement" --color "a2eeef" --description "New feature or request" || echo "Label already exists"
gh label create "bug" --color "d73a4a" --description "Something isn't working" || echo "Label already exists"
gh label create "documentation" --color "0075ca" --description "Documentation improvements" || echo "Label already exists"
gh label create "frontend" --color "d4c5f9" --description "Frontend related" || echo "Label already exists"
gh label create "backend" --color "c5def5" --description "Backend/Logic related" || echo "Label already exists"
gh label create "priority: high" --color "e99695" --description "High priority" || echo "Label already exists"
```

Or create them manually in GitHub:
1. Go to your repository
2. Click "Issues" tab
3. Click "Labels"
4. Click "New label" and create each label above

## Step 6: Test the Application Locally

Before testing GitHub Actions, verify the app works:

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx http-server

# Option 3: PHP
php -S localhost:8000
```

Visit http://localhost:8000 and test the todo app functionality.

## Step 7: Test Gemini CLI GitHub Actions

### Test 1: Auto-labeling

1. Go to your GitHub repository
2. Click "Issues" → "New issue"
3. Choose "Feature Request" template
4. Title: "Add dark mode toggle"
5. Fill in the description with details about dark mode
6. Click "Submit new issue"
7. **Expected**: Within seconds, you should see:
   - A comment from GitHub Actions
   - Labels automatically applied (enhancement, frontend)

### Test 2: Task Delegation

1. In the same issue, add a comment:
   ```
   @gemini-cli please implement this feature with a toggle button
   ```
2. **Expected**: You should see:
   - Acknowledgment comment
   - Implementation plan
   - Summary of what would happen in full version

### Test 3: Create a PR and Test Auto-review

1. Create a new branch and make a simple change:
   ```bash
   git checkout -b test-pr
   # Make a small change to style.css or app.js
   echo "/* Test comment */" >> style.css
   git add style.css
   git commit -m "Test PR for auto-review"
   git push -u origin test-pr
   ```

2. Go to GitHub and create a Pull Request
3. **Expected**: Auto-review comment should appear on the PR

## Step 8: Monitor GitHub Actions

1. Go to "Actions" tab in your repository
2. You'll see workflows running when:
   - Issues are created
   - Comments with @gemini-cli are posted
   - PRs are opened

3. Click on any workflow run to see:
   - Job execution details
   - Logs
   - Success/failure status

## Troubleshooting

### Workflow Not Running?

**Check:**
- [ ] Actions are enabled (Settings → Actions → General)
- [ ] Workflow permissions are set correctly
- [ ] The `.github/workflows/gemini-cli.yml` file exists
- [ ] YAML syntax is valid (check Actions tab for errors)

### Labels Not Applied?

**Check:**
- [ ] Workflow has "issues: write" permission
- [ ] Check Actions tab for any errors
- [ ] Verify the issue contains keywords (bug, feature, etc.)

### Bot Not Responding to @gemini-cli?

**Check:**
- [ ] You used `@gemini-cli` (not @gemini or @gemini_cli)
- [ ] Comment was on an issue or PR (not in discussion)
- [ ] Check Actions tab to see if workflow triggered
- [ ] Workflow permissions include "Read and write"

## Advanced Configuration

### Customizing Auto-labeling

Edit `.github/workflows/gemini-cli.yml` to add more label categories:

```javascript
// Add custom keywords
if (body.includes('performance') || body.includes('optimization')) {
  labels.push('performance');
}
```

### Adding More Workflow Triggers

You can extend the workflow to trigger on:
- `pull_request_target` for PRs from forks
- `schedule` for periodic tasks
- `workflow_dispatch` for manual triggers

Example:
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:      # Manual trigger
```

### Deploying the App

#### GitHub Pages
```bash
# Enable GitHub Pages
gh repo edit --enable-pages --pages-branch main --pages-path /
```

Your app will be available at: `https://YOUR_USERNAME.github.io/gemini-git/`

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Next Steps

1. **Test all sample issues** from `SAMPLE_ISSUES.md`
2. **Customize the workflow** for your needs
3. **Invite collaborators** to test @gemini-cli mentions
4. **Deploy the app** to make it publicly accessible
5. **Extend the app** with new features

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub CLI Documentation](https://cli.github.com/)
- [Gemini CLI GitHub](https://github.com/google-gemini/gemini-cli)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

## Support

If you encounter issues:

1. Check the Actions tab for detailed logs
2. Review the troubleshooting section above
3. Ensure all permissions are correctly set
4. Verify YAML syntax in the workflow file

---

Happy coding with Gemini CLI! 🚀
