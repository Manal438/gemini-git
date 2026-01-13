# Simple Todo App with Gemini CLI GitHub Actions

A clean, functional todo list application demonstrating Gemini CLI GitHub Actions integration for automated issue triage, task delegation, and PR reviews.

## Features

### Todo App Features
- ✅ Add, complete, and delete tasks
- 🔍 Filter tasks (All, Active, Completed)
- 💾 Persistent storage using localStorage
- 📱 Responsive design
- 🎨 Modern, gradient UI

### Gemini CLI GitHub Actions Features
- 🏷️ **Auto-labeling**: Automatically categorizes issues based on content
- 🤖 **Task delegation**: Mention `@gemini-cli` to delegate implementation tasks
- 📋 **Implementation planning**: Shows planned steps before execution
- 🔍 **Auto PR review**: Automated code review on pull requests
- 💬 **Interactive feedback**: Conversational interface through GitHub comments

## Quick Start

### Running the App Locally

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gemini-git
```

2. Open `index.html` in your browser:
```bash
# On Linux
xdg-open index.html

# On macOS
open index.html

# On Windows
start index.html
```

Or use a simple HTTP server:
```bash
# Python 3
python -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server
```

3. Visit `http://localhost:8000` in your browser

## Gemini CLI GitHub Actions Setup

### Prerequisites
- GitHub repository with Actions enabled
- Repository permissions set up correctly

### Setup Steps

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit with Gemini CLI integration"
git push origin main
```

2. **Enable GitHub Actions**:
   - Go to your repository settings
   - Navigate to "Actions" → "General"
   - Enable "Allow all actions and reusable workflows"

3. **Configure Permissions**:
   - Go to repository "Settings" → "Actions" → "General"
   - Under "Workflow permissions", select:
     - ✅ "Read and write permissions"
     - ✅ "Allow GitHub Actions to create and approve pull requests"

4. **Create Labels** (optional, for better categorization):
```bash
# These labels will be auto-applied by the workflow
gh label create "enhancement" --color "a2eeef" --description "New feature or request"
gh label create "bug" --color "d73a4a" --description "Something isn't working"
gh label create "documentation" --color "0075ca" --description "Documentation improvements"
gh label create "frontend" --color "d4c5f9" --description "Frontend related"
gh label create "backend" --color "c5def5" --description "Backend/Logic related"
gh label create "priority: high" --color "e99695" --description "High priority"
```

## How to Use Gemini CLI

### 1. Automatic Issue Labeling

When you create a new issue, the Gemini CLI bot will automatically:
- Analyze the issue title and description
- Apply relevant labels (bug, enhancement, documentation, etc.)
- Add a comment acknowledging the categorization

**Example**: Create an issue with title "Add dark mode feature" → automatically labeled as `enhancement` and `frontend`

### 2. Task Delegation

Mention `@gemini-cli` in any issue or PR comment to delegate tasks:

```markdown
@gemini-cli please implement this feature with a dropdown menu
```

The bot will:
1. ✅ Acknowledge the task
2. 📋 Create an implementation plan
3. 🔧 (In full version) Implement the changes
4. 📝 Provide a summary with links to PRs

### 3. Automated PR Reviews

When you open a pull request:
- Gemini CLI automatically reviews the code
- Provides feedback on code quality
- Suggests improvements
- Identifies potential issues

### 4. Interactive Collaboration

You can iteratively work with Gemini CLI:

```markdown
@gemini-cli address the review feedback and update the PR
```

## Workflow Overview

### Issue Triage Flow
```
New Issue Created
    ↓
Auto-analyze content
    ↓
Apply labels (bug, enhancement, etc.)
    ↓
Post acknowledgment comment
```

### Task Delegation Flow
```
User mentions @gemini-cli
    ↓
Acknowledge task
    ↓
Create implementation plan
    ↓
(Full version) Implement changes
    ↓
Create PR with changes
    ↓
Provide summary
```

### PR Review Flow
```
PR Opened
    ↓
Analyze changes
    ↓
Review code quality
    ↓
Post review comments
    ↓
Suggest improvements
```

## Project Structure

```
gemini-git/
├── index.html              # Main HTML file
├── style.css               # Styling
├── app.js                  # Todo app logic
├── README.md               # This file
└── .github/
    ├── workflows/
    │   └── gemini-cli.yml  # Gemini CLI GitHub Actions workflow
    └── ISSUE_TEMPLATE/
        ├── feature_request.md
        └── bug_report.md
```

## Workflow Configuration

The Gemini CLI workflow (`.github/workflows/gemini-cli.yml`) handles:

- **Auto-labeling**: Triggered on issue creation
- **Task delegation**: Triggered on comments containing `@gemini-cli`
- **PR reviews**: Triggered on PR creation

### Key Jobs:

1. **auto-label**: Categorizes issues automatically
2. **gemini-task**: Handles task delegation and implementation
3. **auto-review**: Reviews pull requests automatically

## Example Use Cases

### 1. Request a New Feature
Create an issue:
```
Title: Add task priority levels
Description: I want to mark tasks as high, medium, or low priority
```

Then comment:
```
@gemini-cli please implement priority levels with color coding
```

### 2. Report and Fix a Bug
Create an issue:
```
Title: Clear completed button not working
Description: When I click "Clear Completed", nothing happens
```

Then comment:
```
@gemini-cli please investigate and fix this bug
```

### 3. Request Code Improvements
On a PR, comment:
```
@gemini-cli please refactor the rendering logic for better performance
```

## About the Workflow

This project includes a **demonstration workflow** that shows the structure and concept of Gemini CLI GitHub Actions.

**Current Implementation**:
- ✅ Auto-labels issues based on content analysis
- ✅ Responds to `@gemini-cli` mentions
- ✅ Creates implementation plans
- ✅ Provides automated PR reviews (template-based)

**Full Gemini CLI Integration Would Include**:
- 🤖 Actual AI-powered code generation
- 🔧 Autonomous implementation of features
- 🧪 Automatic testing
- 📊 Advanced code analysis and optimization

## Extending the App

Ideas for features you can request from Gemini CLI:

- 🌓 Dark mode toggle
- 📅 Due dates for tasks
- 🏷️ Task categories/tags
- 🔍 Search functionality
- ⭐ Priority levels
- 📊 Statistics dashboard
- 🔔 Notifications
- 📤 Export/import functionality
- ✏️ Edit existing tasks
- 🎨 Custom themes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Or simply create an issue and ask `@gemini-cli` to implement it!

## Resources

- [Gemini CLI Official Repository](https://github.com/google-gemini/gemini-cli)
- [Google AI for Developers](https://ai.google.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

## License

MIT License - feel free to use this project for learning and experimentation!

## Acknowledgments

Inspired by the Gemini CLI GitHub Action demo presented by Jerop Kipruto at Google I/O 2024.

---

Built with ❤️ to demonstrate the power of AI-assisted development workflows
