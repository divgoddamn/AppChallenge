# Agent Instructions

This document outlines the key commands, coding conventions, and architectural patterns for this repository.

## Commands

- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Test:** No test suite is set up.

## Code Style

### General
- Follow the existing code style.
- Use functional components with hooks.
- Props are destructured in the function signature.
- State is managed in parent components and passed down via props.

### Imports
- Group imports: libraries first, then local files.
- Example:
  ```jsx
  import { Search } from 'lucide-react';
  import { topics } from '../data/newsData';
  ```

### Formatting
- **Indentation:** 2 spaces.
- **Styling:** Use Tailwind CSS classes for styling.

### Naming Conventions
- **Components:** `PascalCase` (e.g., `FilterPanel`).
- **Files:** `PascalCase` for components (e.g., `FilterPanel.jsx`).
- **Functions/Variables:** `camelCase` (e.g., `handleTopicToggle`).

### Types
- This is not a TypeScript project. Do not add types.

### Error Handling
- No specific error handling patterns are in place. Add error handling where appropriate.
