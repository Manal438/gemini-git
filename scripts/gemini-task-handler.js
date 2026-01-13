#!/usr/bin/env node

/**
 * Gemini Task Handler
 *
 * This script handles task delegation when @gemini-cli is mentioned.
 * It uses the Gemini API to analyze the request and generate code changes.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const ISSUE_NUMBER = process.env.ISSUE_NUMBER;
const COMMENT_BODY = process.env.COMMENT_BODY;

// Initialize clients
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const octokit = new Octokit({ auth: GITHUB_TOKEN });

const [owner, repo] = GITHUB_REPOSITORY.split('/');

/**
 * Post a comment to the issue/PR
 */
async function postComment(body) {
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: ISSUE_NUMBER,
    body
  });
}

/**
 * Get the issue or PR details
 */
async function getIssueDetails() {
  const { data } = await octokit.rest.issues.get({
    owner,
    repo,
    issue_number: ISSUE_NUMBER
  });
  return data;
}

/**
 * Read project files to provide context
 */
async function getProjectContext() {
  const files = ['index.html', 'style.css', 'app.js', 'README.md'];
  const context = {};

  for (const file of files) {
    try {
      const content = await fs.readFile(path.join(process.cwd(), file), 'utf-8');
      context[file] = content;
    } catch (error) {
      console.log(`Could not read ${file}: ${error.message}`);
    }
  }

  return context;
}

/**
 * Analyze the request using Gemini
 */
async function analyzeRequest(issueDetails, userRequest, projectContext) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are an AI assistant helping with a GitHub issue in a Todo app project.

**Issue Title:** ${issueDetails.title}
**Issue Description:**
${issueDetails.body}

**User Request:**
${userRequest}

**Current Project Files:**
${Object.entries(projectContext).map(([filename, content]) => `
--- ${filename} ---
${content}
`).join('\n')}

**Your Task:**
1. Analyze what changes are needed based on the user's request
2. Identify which files need to be modified
3. Create a detailed implementation plan
4. Generate the actual code changes

**Output Format (JSON):**
{
  "summary": "Brief description of what you'll do",
  "files_to_modify": ["file1.html", "file2.js"],
  "implementation_plan": [
    "Step 1: ...",
    "Step 2: ..."
  ],
  "changes": {
    "filename.ext": {
      "description": "What changes to make",
      "new_content": "Full new file content here"
    }
  }
}

Provide practical, working code that implements the requested feature.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Try to extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Could not parse Gemini response as JSON');
}

/**
 * Create a new branch and commit changes
 */
async function createBranchAndCommit(branchName, changes, commitMessage) {
  const { execSync } = require('child_process');

  try {
    // Configure git
    execSync('git config user.name "gemini-cli[bot]"');
    execSync('git config user.email "gemini-cli[bot]@users.noreply.github.com"');

    // Create and checkout new branch
    execSync(`git checkout -b ${branchName}`);

    // Write changes to files
    for (const [filename, change] of Object.entries(changes)) {
      await fs.writeFile(path.join(process.cwd(), filename), change.new_content);
      execSync(`git add ${filename}`);
    }

    // Commit changes
    execSync(`git commit -m "${commitMessage}"`);

    // Push to remote
    execSync(`git push -u origin ${branchName}`);

    return branchName;
  } catch (error) {
    console.error('Error creating branch and committing:', error);
    throw error;
  }
}

/**
 * Create a pull request
 */
async function createPullRequest(branchName, title, body) {
  const { data } = await octokit.rest.pulls.create({
    owner,
    repo,
    title,
    head: branchName,
    base: 'main',
    body
  });

  return data;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Validate environment
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is not set');
    }

    console.log('Starting Gemini task handler...');

    // Post acknowledgment
    await postComment('🤖 **Gemini CLI**: Task received! Analyzing your request with AI...\n\n⏳ Status: Planning...');

    // Get issue details
    const issueDetails = await getIssueDetails();
    console.log(`Processing issue #${ISSUE_NUMBER}: ${issueDetails.title}`);

    // Get project context
    const projectContext = await getProjectContext();
    console.log('Loaded project files:', Object.keys(projectContext).join(', '));

    // Analyze with Gemini
    console.log('Calling Gemini API...');
    const analysis = await analyzeRequest(issueDetails, COMMENT_BODY, projectContext);
    console.log('Analysis complete:', analysis.summary);

    // Post implementation plan
    const planComment = `## 📋 Implementation Plan

${analysis.summary}

### Files to modify:
${analysis.files_to_modify.map(f => `- \`${f}\``).join('\n')}

### Steps:
${analysis.implementation_plan.map((step, i) => `${i + 1}. ${step}`).join('\n')}

⏳ Status: Implementing changes...`;

    await postComment(planComment);

    // Create branch and commit
    const branchName = `gemini-cli/issue-${ISSUE_NUMBER}-${Date.now()}`;
    const commitMessage = `${analysis.summary}\n\nCo-Authored-By: gemini-cli[bot] <gemini-cli[bot]@users.noreply.github.com>`;

    console.log('Creating branch and committing changes...');
    await createBranchAndCommit(branchName, analysis.changes, commitMessage);

    // Create pull request
    const prBody = `## 🤖 Automated Implementation

${analysis.summary}

### Changes Made:
${Object.entries(analysis.changes).map(([file, change]) => `
**${file}**
${change.description}
`).join('\n')}

### Implementation Plan:
${analysis.implementation_plan.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---

Closes #${ISSUE_NUMBER}

Generated by Gemini CLI 🚀`;

    console.log('Creating pull request...');
    const pr = await createPullRequest(
      branchName,
      `${analysis.summary} (fixes #${ISSUE_NUMBER})`,
      prBody
    );

    // Post success comment
    const successComment = `## ✅ Task Completed!

I've successfully implemented the requested changes!

### Summary:
${analysis.summary}

### Pull Request:
🔗 [#${pr.number} - ${pr.title}](${pr.html_url})

### Files Modified:
${analysis.files_to_modify.map(f => `- \`${f}\``).join('\n')}

Please review the changes and let me know if you need any adjustments!

You can ask me to make changes by commenting on the PR with \`@gemini-cli\`.`;

    await postComment(successComment);

    console.log('Task completed successfully!');
    console.log(`PR URL: ${pr.html_url}`);

  } catch (error) {
    console.error('Error:', error);

    // Post error comment
    await postComment(`## ❌ Error

I encountered an error while processing your request:

\`\`\`
${error.message}
\`\`\`

Please check the GitHub Actions logs for more details, or try rephrasing your request.`);

    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { analyzeRequest, postComment, getIssueDetails };
