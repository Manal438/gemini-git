# Architecture Overview

## Project Structure

```
gemini-git/
│
├── Frontend Files (Todo App)
│   ├── index.html          # Main HTML structure
│   ├── style.css           # Styling and design
│   └── app.js              # Todo application logic
│
├── GitHub Integration
│   └── .github/
│       ├── workflows/
│       │   └── gemini-cli.yml          # Main automation workflow
│       └── ISSUE_TEMPLATE/
│           ├── feature_request.md      # Template for features
│           └── bug_report.md           # Template for bugs
│
├── Documentation
│   ├── README.md           # Main documentation
│   ├── SETUP.md            # Setup instructions
│   ├── SAMPLE_ISSUES.md    # Example issues to test
│   └── ARCHITECTURE.md     # This file
│
└── Configuration
    └── .gitignore          # Git ignore rules
```

## Application Flow

### Todo App User Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         index.html                  │
│  ┌──────────────────────────────┐  │
│  │  Header & Input Section       │  │
│  │  - Title: "My Todo List"      │  │
│  │  - Input field for new tasks  │  │
│  │  - Add button                 │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Filter Section              │  │
│  │  [All] [Active] [Completed]  │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Todo List                   │  │
│  │  □ Task 1         [Delete]   │  │
│  │  ☑ Task 2         [Delete]   │  │
│  │  □ Task 3         [Delete]   │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Stats & Actions             │  │
│  │  "X tasks remaining"          │  │
│  │  [Clear Completed]           │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│          app.js (Logic)              │
│                                      │
│  • Add/Delete/Toggle todos           │
│  • Filter todos (all/active/done)    │
│  • Update statistics                 │
│  • Persist to localStorage           │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│       localStorage                   │
│  { todos: [...] }                    │
└─────────────────────────────────────┘
```

## GitHub Actions Workflow

### Workflow Triggers

```
GitHub Events
│
├─ Issue Created ──────────────────────┐
│                                      │
├─ Issue Comment Created ─────────────┤
│   (contains @gemini-cli)             │
│                                      │
├─ PR Opened ─────────────────────────┤
│                                      │
└─ PR Comment Created ────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────┐
                    │  GitHub Actions Runner          │
                    │                                 │
                    │  Executes: gemini-cli.yml       │
                    └─────────────────────────────────┘
```

### Auto-Label Job Flow

```
Issue Created
     │
     ▼
┌─────────────────────────────────┐
│  Analyze Issue Content          │
│  • Read title                   │
│  • Read description             │
│  • Extract keywords             │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Categorization Logic           │
│                                 │
│  Keywords → Labels:             │
│  • "bug" → bug                  │
│  • "feature" → enhancement      │
│  • "ui/css" → frontend          │
│  • "logic/js" → backend         │
│  • "urgent" → priority: high    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Apply Labels via GitHub API    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Post Acknowledgment Comment    │
│  "I've categorized this issue"  │
└─────────────────────────────────┘
```

### Task Delegation Job Flow

```
User mentions @gemini-cli
     │
     ▼
┌─────────────────────────────────┐
│  Checkout Repository Code       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Post Acknowledgment            │
│  "Task received! Planning..."   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Create Implementation Plan     │
│                                 │
│  • List files to modify         │
│  • Outline steps                │
│  • Show approach                │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  [Demo Mode]                    │
│  Explain what full AI would do: │
│  • Analyze codebase             │
│  • Generate code changes        │
│  • Create commits               │
│  • Open PR                      │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Post Summary Comment           │
│  With links and resources       │
└─────────────────────────────────┘
```

### Auto-Review Job Flow

```
Pull Request Opened
     │
     ▼
┌─────────────────────────────────┐
│  Checkout PR Code               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Analyze Changes                │
│  • Files modified               │
│  • Lines added/removed          │
│  • Code patterns                │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Generate Review Comments       │
│                                 │
│  Template-based suggestions:    │
│  • Good practices detected      │
│  • Potential improvements       │
│  • Checklist items              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Post Review as Comment         │
│  On the Pull Request            │
└─────────────────────────────────┘
```

## Data Flow

### Todo App Data Flow

```
User Input
    ↓
Add Todo Function
    ↓
Update todos array
    ↓
Save to localStorage ─────┐
    ↓                     │
Render todos              │
    ↓                     │
Update UI                 │
                          │
On Page Load ←────────────┘
    ↓
Load from localStorage
    ↓
Restore todos array
    ↓
Render todos
    ↓
Update UI
```

### GitHub Actions Data Flow

```
GitHub Event (webhook)
    ↓
Trigger workflow
    ↓
GitHub Actions Runner
    ↓
Execute job steps
    ↓
Call GitHub API
    ↓
Update Issue/PR
    ↓
User sees result
```

## Component Interactions

### Frontend Components

```
┌─────────────────────────────────────────┐
│           index.html (View)             │
│                                         │
│  ┌────────────┐  ┌──────────────────┐  │
│  │   Header   │  │   Input Section  │  │
│  └────────────┘  └──────────────────┘  │
│  ┌────────────┐  ┌──────────────────┐  │
│  │  Filters   │  │    Todo List     │  │
│  └────────────┘  └──────────────────┘  │
│  ┌────────────────────────────────┐    │
│  │      Stats & Actions           │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
         │                    ▲
         │ User Actions       │ Update DOM
         ▼                    │
┌─────────────────────────────────────────┐
│        app.js (Controller)              │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  Event Listeners               │    │
│  │  • addBtn.click                │    │
│  │  • todoInput.keypress          │    │
│  │  • filterBtns.click            │    │
│  │  • clearCompleted.click        │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │  Business Logic                │    │
│  │  • addTodo()                   │    │
│  │  • deleteTodo()                │    │
│  │  • toggleTodo()                │    │
│  │  • getFilteredTodos()          │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │  Rendering                     │    │
│  │  • renderTodos()               │    │
│  │  • updateStats()               │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
         │                    ▲
         │ Save               │ Load
         ▼                    │
┌─────────────────────────────────────────┐
│      localStorage (Model)               │
│                                         │
│  todos: [                               │
│    {                                    │
│      id: 123456789,                     │
│      text: "Sample task",               │
│      completed: false,                  │
│      createdAt: "2024-01-01..."         │
│    },                                   │
│    ...                                  │
│  ]                                      │
└─────────────────────────────────────────┘
```

### GitHub Actions Components

```
┌──────────────────────────────────────────┐
│      GitHub Repository                   │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Issues                             │ │
│  │  • Feature requests                 │ │
│  │  • Bug reports                      │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Pull Requests                      │ │
│  │  • Code changes                     │ │
│  │  • Reviews                          │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
                  │
                  │ Webhooks
                  ▼
┌──────────────────────────────────────────┐
│     GitHub Actions                       │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  gemini-cli.yml                     │ │
│  │                                     │ │
│  │  Jobs:                              │ │
│  │  ├─ auto-label                      │ │
│  │  ├─ gemini-task                     │ │
│  │  └─ auto-review                     │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
                  │
                  │ GitHub API calls
                  ▼
┌──────────────────────────────────────────┐
│     GitHub API                           │
│                                          │
│  • Add labels                            │
│  • Create comments                       │
│  • Update PR status                      │
│  • Get file contents                     │
└──────────────────────────────────────────┘
```

## Workflow Permissions

```
Repository Permissions
│
├─ contents: write ─────────► Read/write to code
│                              • Checkout code
│                              • Create commits
│                              • Push branches
│
├─ issues: write ───────────► Manage issues
│                              • Add labels
│                              • Create comments
│                              • Update status
│
└─ pull-requests: write ────► Manage PRs
                               • Create PRs
                               • Add reviews
                               • Create comments
```

## Integration Points

### Local Development → GitHub

```
Developer
    ↓ (writes code)
Local Repository
    ↓ (git push)
Remote Repository (GitHub)
    ↓ (triggers)
GitHub Actions
    ↓ (automated workflows)
Updated Issues/PRs
    ↓ (notifications)
Team Members
```

### User → Application

```
User Opens App
    ↓
Browser loads HTML/CSS/JS
    ↓
User interacts with UI
    ↓
JavaScript handles events
    ↓
localStorage persists data
    ↓
UI updates in real-time
```

## Key Features by File

### index.html
- Semantic HTML structure
- Input field for new tasks
- Filter buttons (All/Active/Completed)
- Todo list container
- Statistics footer

### style.css
- Gradient purple background
- Modern card-based design
- Hover effects and transitions
- Responsive layout
- Consistent color scheme

### app.js
- Todo CRUD operations
- Local storage persistence
- Filtering logic
- Event handling
- Dynamic rendering

### gemini-cli.yml
- Auto-labeling on issue creation
- Task delegation via @mentions
- Automated PR reviews
- GitHub API interactions
- Workflow orchestration

## Scalability Considerations

### Frontend
- Currently: Plain JavaScript (no framework)
- Can scale to: React, Vue, or Svelte
- Storage: Can migrate to backend API + database

### GitHub Actions
- Currently: Template-based responses
- Can integrate: Real AI (Gemini API)
- Can extend: Custom tooling and automation

### Features
- Modular structure allows easy feature additions
- Each feature can be developed independently
- Workflow can handle multiple concurrent operations

## Security Notes

### Application
- No backend → No server-side vulnerabilities
- localStorage only → Data stays client-side
- No external dependencies → No supply chain risks

### GitHub Actions
- Permissions scoped to minimum required
- No secrets needed for demo version
- Workflows run in isolated containers
- All actions are auditable

## Performance

### Frontend
- Lightweight: < 10KB total (HTML + CSS + JS)
- Fast load time: < 100ms
- No external dependencies
- Instant UI updates

### GitHub Actions
- Workflow startup: ~10-20 seconds
- Job execution: ~30-60 seconds
- Concurrent job execution supported
- Cached dependencies speed up runs
