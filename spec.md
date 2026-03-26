# KENORI – Phase 6: AI Chat Tab

## Current State
KENORI is a journaling app with 4 tabs (Home, Journal, Mood, Profile). Backend stores journal entries, notes, mood logs, and user profile. http-outcalls component is now selected for AI API integration.

## Requested Changes (Diff)

### Add
- `ChatMessage` type: { role: text ("user"/"assistant"), content: text, timestamp: Time }
- `ChatMemoryEntry` type: { key: text, value: text, timestamp: Time }
- Backend functions: `saveChatMessage`, `getChatHistory`, `saveChatMemories`, `getChatMemories`, `sendChatMessage` (HTTP outcall to OpenAI API)
- `ChatTab` frontend component — texting-style UI with scrollable message history
- Memory extraction: frontend extracts key facts (feelings, names, concerns) from user messages and stores them; these are passed into the AI system prompt
- 5th tab (💬 Chat) in bottom nav
- ActiveTab type extended with "chat"

### Modify
- `ActiveTab` type: add "chat"
- `TabBar`: add 💬 Chat tab (5th)
- `App.tsx`: render ChatTab when activeTab === "chat"
- Backend `AllUserData`: optionally extend or keep chat data separate

### Remove
- Nothing

## Implementation Plan
1. Add ChatMessage and ChatMemoryEntry types to backend
2. Add backend functions for storing/retrieving chat history and memory
3. Add `sendChatMessage` function using HTTP outcalls to OpenAI (gpt-4o-mini), with system prompt including user's name, memory context, and instructions to be short/calm/supportive
4. Regenerate backend bindings
5. Add ChatTab frontend component with message bubbles, input, send button
6. Memory system: extract keywords (feelings, names) from user messages client-side, store to backend
7. Update TabBar and App.tsx
