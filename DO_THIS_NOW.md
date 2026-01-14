# ⚡ DO THIS NOW - Complete Setup in 3 Commands

Stop reading docs. Just do these 3 things:

## 1️⃣ Run the Setup Script

```bash
./COMPLETE_SETUP.sh
```

**This will automatically:**
- ✅ Install all dependencies
- ✅ Generate package-lock.json
- ✅ Commit your changes
- ✅ Push to GitHub
- ✅ Guide you through API key setup

## 2️⃣ Get Your API Key

While the script is running, open this in another tab:

👉 **https://makersuite.google.com/app/apikey**

- Sign in with Google
- Click "Get API Key"
- Copy the key (starts with `AIza...`)
- Paste it when the script asks

## 3️⃣ Test It

After the script completes:

```bash
# Create a test issue on GitHub
gh issue create --title "Add dark mode" --body "Please add a dark mode toggle"

# Get the issue number (e.g., #7)
# Then comment:
gh issue comment 7 --body "@gemini-cli please implement this feature"

# Watch the magic! Check back in 2 minutes
gh pr list  # You'll see a new PR created by AI!
```

---

## 🚨 If Script Doesn't Work

Do it manually in 5 minutes:

### A. Push Your Code

```bash
git add .
git commit -m "Complete setup"
git push origin pr  # or your branch name
```

### B. Add API Key

```bash
# Get key from: https://makersuite.google.com/app/apikey
gh secret set GEMINI_API_KEY
# Paste your key when prompted
```

### C. Enable Permissions

1. Go to: `https://github.com/YOUR_USERNAME/gemini-git/settings/actions`
2. Under "Workflow permissions":
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create PRs
3. Click "Save"

### D. Test

Create an issue and mention `@gemini-cli` - done!

---

## ✅ How to Know It's Working

After mentioning `@gemini-cli`:

**Within 2 minutes you'll see:**
1. New branch created: `gemini-cli/issue-X-...`
2. Pull request opened with actual code
3. Comment: "✅ Task Completed! 🔗 PR #X"

**Check with:**
```bash
gh pr list  # Shows the AI-created PR
```

**If you see a PR = IT'S WORKING! 🎉**

---

## 🆘 Still Stuck?

```bash
# Check if API key is set:
gh secret list

# Check workflow runs:
gh run list

# See detailed logs:
gh run view --log
```

Or just create an issue and I'll help debug!

---

**TL;DR:**
1. Run `./COMPLETE_SETUP.sh`
2. Add API key when prompted
3. Create issue + mention @gemini-cli
4. See AI create PR ✨

**That's it!**
