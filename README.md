Task Dashboard App (React + Vite)

Task Management Dashboard built using React.js and Vite, featuring task creation, filtering, editing, and pagination with a clean UI and mock API integration.


Step 1: Initialize Project
Created project using React + Vite
Fast development and optimized build setup

Step 2:  Folder Structure
Organized project with a clean and scalable structure:
src/
 ├── components/
 ├── hooks/
 ├── services/
 ├── utils/
 ├── pages/
 ├── App.jsx
 ├── main.jsx
 └── style.css

index.html
Removed unnecessary default files
Followed a structured and modular approach


Step 3: Task Dashboard Page
Created TaskDashboard.jsx inside pages/
Integrated into main app via App.jsx

Features:
1. Task Form
-UI for adding new tasks
-Handles input and submission logic

2. Task Table
-Displays tasks in table format
-Fields included:
-Title
-Status
-Priority
-Created Date
-Due Date
-Actions (Edit/Delete)
-Temporary state-based data rendering


3. Filtering & Search
-Search input for tasks
-Filters available:
-Status
-Priority
-Sort By
-Order
-Implemented using dropdown (select)

4. Task Modal(off canvas menu)
-Side modal for task creation/editing
-Smooth UI interaction

5. Pagination
-UI for paginated task list
-Functional navigation between pages

6. Loading State
-Loader UI while fetching data


7. Toaster Notifications
-Positioned at top-right
-Displays success/error messages



Step 4: Mock API (Services Layer)

Created inside services/taskServices.js

Features:
-used MAth random Generated ~1200 random tasks
-Fields included:
-id 
-title
-status
-priority
-createdAt
-dueDate

Random date generation for realistic data

API Functions:
-Fetch Tasks
-Create Task
-Update Task
-Delete Task
-Change Task Status

Error Handling:
-Used Promises to simulate network calls
-Handles failure scenarios with error messages



Step 5: Custom Hooks

1-useDebounce.js
-300ms delay for search input
-Optimizes filtering performance

2-useTask.js
-Centralized task management logic

Handles:
-Fetch API
-Add Task
-Edit Task
-Delete Task
-Update Status
-Includes proper error handling (try-catch)


Data Flow
Props used for passing:
Task data
Filters
Table updates
Ensures reusable and maintainable components


Tech Stack
React.js
Vite
JavaScript (ES6+)
CSS