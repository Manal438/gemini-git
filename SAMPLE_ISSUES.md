# Sample Issues to Test Gemini CLI

Once you've pushed this repository to GitHub, try creating these sample issues to test the Gemini CLI GitHub Actions workflow.

## 1. Feature Request: Dark Mode

**Title**: Add dark mode toggle

**Description**:

```markdown
I would like to have a dark mode option for the todo app. The current light theme is great, but having a dark mode would be easier on the eyes during nighttime use.

The dark mode should:
- Have a toggle button in the header
- Save the preference to localStorage
- Use a dark purple/blue gradient background
- Adjust all text colors for readability
```

**After creating, comment**:

```markdown
@gemini-cli please implement this feature with a toggle button in the header
```

---

## 2. Feature Request: Task Priority

**Title**: Add priority levels to tasks

**Description**:

```markdown
It would be helpful to assign priority levels (High, Medium, Low) to tasks so I can focus on what's most important.

Requirements:
- Dropdown or buttons to select priority when adding a task
- Color coding for different priorities (red for high, yellow for medium, green for low)
- Ability to sort tasks by priority
- Show priority indicator on each task
```

**After creating, comment**:

```markdown
@gemini-cli please add priority levels with color coding and sorting
```

---

## 3. Feature Request: Due Dates

**Title**: Add due date functionality

**Description**:

```markdown
I want to add due dates to my tasks to better manage deadlines.

Features needed:
- Date picker when adding a task
- Display due date on each task
- Highlight overdue tasks in red
- Sort option by due date
```

**After creating, comment**:

```markdown
@gemini-cli implement due dates with a date picker
```

---

## 4. Bug Report: Mobile Responsiveness

**Title**: Layout breaks on small mobile screens

**Description**:

```markdown
When viewing the app on screens smaller than 400px, the layout breaks:
- Input field and Add button stack awkwardly
- Delete buttons get cut off
- Filter buttons are too crowded

Steps to reproduce:
1. Open the app in Chrome DevTools
2. Set device width to 350px
3. Notice layout issues

Expected: App should be fully usable on small screens
Actual: Layout breaks and some elements are not accessible
```

**After creating, comment**:

```markdown
@gemini-cli please fix the mobile responsiveness issues
```

---

## 5. Feature Request: Task Categories

**Title**: Add categories/tags to organize tasks

**Description**:

```markdown
I'd like to organize my tasks by categories like Work, Personal, Shopping, etc.

Requirements:
- Ability to assign one or more categories to a task
- Filter tasks by category
- Display category tags on each task
- Predefined categories with option to add custom ones
```

**After creating, comment**:

```markdown
@gemini-cli add task categories with filtering functionality
```

---

## 6. Feature Request: Edit Tasks

**Title**: Allow editing existing tasks

**Description**:

```markdown
Currently, I can only delete tasks. I should be able to edit the text of existing tasks.

Requirements:
- Double-click or edit button to enable editing
- Inline editing experience
- Save/Cancel buttons
- Preserve task completion status when editing
```

**After creating, comment**:

```markdown
@gemini-cli implement task editing functionality with inline editing
```

---

## 7. Enhancement: Keyboard Shortcuts

**Title**: Add keyboard shortcuts for better productivity

**Description**:

```markdown
Add keyboard shortcuts to make the app more efficient:
- `Ctrl+N` or `Cmd+N`: Focus on input field
- `Ctrl+1/2/3`: Switch between All/Active/Completed filters
- `Ctrl+Shift+C`: Clear completed tasks
- `Escape`: Cancel editing (if edit mode is implemented)
```

**After creating, comment**:

```markdown
@gemini-cli add keyboard shortcuts for common actions
```

---

## 8. Feature Request: Task Statistics

**Title**: Add statistics dashboard

**Description**:

```markdown
Show statistics about task completion:
- Total tasks created
- Completion rate (percentage)
- Tasks completed today/this week
- Longest streak of task completions
- Chart or visual representation of progress
```

**After creating, comment**:

```markdown
@gemini-cli create a statistics dashboard with completion metrics
```

---

## 9. Feature Request: Drag and Drop Reordering

**Title**: Reorder tasks via drag and drop

**Description**:

```markdown
Allow users to manually reorder tasks by dragging and dropping them.

Requirements:
- Drag handle on each task
- Smooth drag animation
- Save custom order to localStorage
- Visual feedback during dragging
```

**After creating, comment**:

```markdown
@gemini-cli implement drag and drop reordering for tasks
```

---

## 10. Feature Request: Export/Import

**Title**: Export and import tasks

**Description**:

```markdown
Add functionality to export tasks to JSON/CSV and import them back.

Features:
- Export all tasks to a downloadable file
- Import tasks from a file
- Support for JSON and CSV formats
- Validation on import to prevent data corruption
```

**After creating, comment**:

```markdown
@gemini-cli add export/import functionality for tasks
```

---

## Testing the Workflow

### Expected Behavior:

1. **When you create an issue**:

   - Gemini CLI bot comments acknowledging the issue
   - Appropriate labels are automatically added
   - Suggestion to use `@gemini-cli` for delegation
2. **When you mention @gemini-cli**:

   - Bot acknowledges the task
   - Creates an implementation plan
   - Shows which files will be modified
   - (In demo version) Explains what full version would do
3. **When you create a PR**:

   - Automatic review is posted
   - Suggestions for improvements
   - Code quality checks

### Tips for Testing:

- Start with simpler features (like dark mode toggle)
- Progress to more complex features (like drag-and-drop)
- Try mentioning `@gemini-cli` in different ways
- Test on both issues and PR comments
- Observe how labels are applied automatically

### Note:

The current implementation is a **demonstration workflow**. It shows the structure and interaction patterns of Gemini CLI GitHub Actions. For full AI-powered implementation, you would need to integrate with actual Gemini CLI tools or build custom AI integration using the Gemini API.
