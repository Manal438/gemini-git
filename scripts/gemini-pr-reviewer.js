#!/usr/bin/env node

/**
 * Gemini PR Reviewer
 *
 * This script reviews pull requests using the Gemini API
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Octokit } = require('@octokit/rest');
const { execSync } = require('child_process');

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const PR_NUMBER = process.env.PR_NUMBER;

// Initialize clients
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const octokit = new Octokit({ auth: GITHUB_TOKEN });

const [owner, repo] = GITHUB_REPOSITORY.split('/');

/**
 * Post a comment to the PR
 */
async function postComment(body) {
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: PR_NUMBER,
    body
  });
}

/**
 * Get PR details
 */
async function getPRDetails() {
  const { data } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: PR_NUMBER
  });
  return data;
}

/**
 * Get PR diff
 */
async function getPRDiff() {
  try {
    const diff = execSync('git diff origin/main...HEAD').toString();
    return diff;
  } catch (error) {
    console.error('Error getting diff:', error);
    return '';
  }
}

/**
 * Get changed files
 */
async function getChangedFiles() {
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: PR_NUMBER
  });
  return files;
}

/**
 * Review PR using Gemini
 */
async function reviewPR(prDetails, diff, files) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const filesInfo = files.map(f => `
**${f.filename}** (${f.status})
- Additions: ${f.additions}
- Deletions: ${f.deletions}
- Changes: ${f.changes}
`).join('\n');

  const prompt = `You are a code reviewer for a GitHub pull request in a Todo app project.

**PR Title:** ${prDetails.title}
**PR Description:**
${prDetails.body || 'No description provided'}

**Changed Files:**
${filesInfo}

**Full Diff:**
\`\`\`diff
${diff.substring(0, 10000)} ${diff.length > 10000 ? '... (truncated)' : ''}
\`\`\`

**Your Task:**
Review this pull request and provide:
1. Summary of changes
2. Good practices you noticed
3. Potential issues or concerns
4. Specific suggestions for improvement
5. Security concerns (if any)
6. Performance considerations (if applicable)

**Output Format (JSON):**
{
  "summary": "Brief summary of what this PR does",
  "good_practices": [
    "Specific good practice 1",
    "Specific good practice 2"
  ],
  "issues": [
    {
      "severity": "high|medium|low",
      "description": "Issue description",
      "suggestion": "How to fix it"
    }
  ],
  "suggestions": [
    "General suggestion 1",
    "General suggestion 2"
  ],
  "security_concerns": [
    "Security concern 1"
  ],
  "performance_notes": [
    "Performance note 1"
  ],
  "overall_recommendation": "approve|request_changes|comment"
}

Be specific and constructive. Focus on actual code changes, not generic advice.`;

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
 * Format review as markdown comment
 */
function formatReview(review) {
  let markdown = `## 🤖 Gemini CLI Auto-Review\n\n`;

  markdown += `### 📋 Summary\n${review.summary}\n\n`;

  if (review.good_practices && review.good_practices.length > 0) {
    markdown += `### ✅ Good Practices Detected\n`;
    review.good_practices.forEach(practice => {
      markdown += `- ${practice}\n`;
    });
    markdown += `\n`;
  }

  if (review.issues && review.issues.length > 0) {
    markdown += `### ⚠️ Issues Found\n\n`;
    review.issues.forEach(issue => {
      const emoji = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢';
      markdown += `${emoji} **${issue.severity.toUpperCase()}**: ${issue.description}\n`;
      markdown += `   **Suggestion:** ${issue.suggestion}\n\n`;
    });
  }

  if (review.suggestions && review.suggestions.length > 0) {
    markdown += `### 💡 Suggestions for Improvement\n`;
    review.suggestions.forEach(suggestion => {
      markdown += `- ${suggestion}\n`;
    });
    markdown += `\n`;
  }

  if (review.security_concerns && review.security_concerns.length > 0) {
    markdown += `### 🔒 Security Considerations\n`;
    review.security_concerns.forEach(concern => {
      markdown += `- ${concern}\n`;
    });
    markdown += `\n`;
  }

  if (review.performance_notes && review.performance_notes.length > 0) {
    markdown += `### ⚡ Performance Notes\n`;
    review.performance_notes.forEach(note => {
      markdown += `- ${note}\n`;
    });
    markdown += `\n`;
  }

  markdown += `### 🎯 Recommendation\n`;
  const recEmoji = {
    'approve': '✅',
    'request_changes': '🔄',
    'comment': '💬'
  };
  markdown += `${recEmoji[review.overall_recommendation] || '💬'} ${review.overall_recommendation.replace('_', ' ').toUpperCase()}\n\n`;

  markdown += `---\n`;
  markdown += `*This review was generated by Gemini AI. You can ask me to address specific feedback by mentioning **@gemini-cli** with your instructions!*`;

  return markdown;
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

    console.log('Starting Gemini PR reviewer...');

    // Get PR details
    const prDetails = await getPRDetails();
    console.log(`Reviewing PR #${PR_NUMBER}: ${prDetails.title}`);

    // Get diff and changed files
    const diff = await getPRDiff();
    const files = await getChangedFiles();
    console.log(`Analyzing ${files.length} changed files`);

    // Review with Gemini
    console.log('Calling Gemini API for review...');
    const review = await reviewPR(prDetails, diff, files);
    console.log('Review complete');

    // Format and post comment
    const reviewComment = formatReview(review);
    await postComment(reviewComment);

    console.log('Review posted successfully!');

  } catch (error) {
    console.error('Error:', error);

    // Post error comment
    try {
      await postComment(`## ❌ Review Error

I encountered an error while reviewing this PR:

\`\`\`
${error.message}
\`\`\`

Please check the GitHub Actions logs for more details.`);
    } catch (commentError) {
      console.error('Could not post error comment:', commentError);
    }

    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { reviewPR, formatReview };
