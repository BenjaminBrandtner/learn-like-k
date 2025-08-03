## Contextual Knowledge

- Whenever applicable, use context7 MCP

## Project Guidelines

### Commit Messages
- Use concise commit messages focusing only on key functionality changes
- Avoid mentioning minor details like file renames unless significant
- Format: Short summary line, then bullet points for key changes
  - but preferably only a short summary line

### Tech Stack
- Vue 3 + Vite for static hosting
- Pinia for state management  
- js-yaml for YAML parsing
- Use import.meta.glob for loading assets in static builds

### Project Structure
- Predefined topics stored in `src/assets/exampleTopics/*.yaml`
- Topics automatically loaded via import.meta.glob (works in static builds)