## Project Overview
Learn Like K - A rote memorization web application inspired by Japanese kana learning tools (specifically https://kenrick95.github.io/itazuraneko/learn/kana.html).

### Key Features
- YAML topic loading with question sets
- Real-time answer checking with keystroke monitoring
- Auto-advance on correct answers when typed correctly
- Toggle-able question sets with persistence
- localStorage state persistence across sessions
- Navigation between quiz and settings pages

## Tech Stack
- Vue 3 + TypeScript (Composition API)
- Vite build tool for static hosting
- Pinia for state management
- Vue Router for navigation
- Tailwind CSS v4 with Vite plugin
- js-yaml for YAML parsing
- localStorage for persistence

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production

## Project Structure
- `/src/stores/topics.ts` - Topic management, YAML parsing, question set toggles
- `/src/stores/quiz.ts` - Quiz state, real-time answer checking, question flow
- `/src/views/QuizView.vue` - Main quiz interface
- `/src/views/SettingsView.vue` - Topic loading and question set management
- `/src/components/BottomNav.vue` - Navigation component
- `/src/assets/exampleTopics/` - Sample YAML topic files
- `/src/styling/main.css` - Tailwind CSS imports

## Quiz Mechanics
- Questions display with original casing from YAML
- Real-time checking: shows correct answer in red when user types incorrectly
- Auto-advance: moves to next question when answer is typed correctly
- Enter key: first press shows answer, second press advances to next question
- Input field stays focused and enabled throughout

## Known Issues
- Questions appear lowercase in display despite correct case in YAML data (needs investigation)

## Commit Guidelines
- Use concise commit messages focusing only on key functionality changes
- Avoid mentioning minor details like file renames unless significant
- Format: Short summary line preferred

## Technical Notes
- Use import.meta.glob for loading assets in static builds
- YAML format: questions as arrays of "question: answer" strings
- All state persisted to localStorage with 'learn-like-k-' prefix

## Instructions for Claude
Use context7 MCP whenever applicable