# KENORI – Phase 4: Core App System

## Current State
- Full journaling, mood tracking, notes, Overthink Dump, cycle tracking all functional
- Backend stores all data per-user via Internet Identity principal
- Internet Identity login (no email/password — email is disabled on this plan)
- 6-tab navigation: Home, Journal, Mood, Notes, Dump, Profile
- Journal entries show date but no smart formatting (Today/Yesterday)
- No edit or delete functionality for journal entries or notes
- Avatar system with semi-realistic 2D SVG customization

## Requested Changes (Diff)

### Add
- Smart date labels on journal entries: "Today", "Yesterday", or formatted full date + time
- Edit journal entry (title, body, mood) via inline edit dialog
- Delete journal entry with confirmation
- Delete note/task by swiping or via delete button
- Edit note/task text inline
- Backend methods: `deleteJournalEntry(timestamp)`, `editJournalEntry(originalTimestamp, updatedEntry)`, `deleteNoteAtIndex(index)`, `updateNoteAtIndex(index, note)`

### Modify
- Bottom navigation simplified from 6 tabs to 4: Home, Journal, Mood, Profile
- Overthink Dump moved into Home tab as a quick-access card section
- Notes/Tasks moved into Home tab as a section (or keep as standalone but not in main nav)
- Keep Notes accessible from Home with a quick link

### Remove
- "Notes" and "Dump" as standalone main nav tabs (consolidate into Home or Profile)

## Implementation Plan
1. Add backend methods for delete/edit journal entries and notes
2. Regenerate backend bindings
3. Update TabBar to 4 tabs: Home, Journal, Mood, Profile
4. Add `useDeleteJournalEntry`, `useEditJournalEntry`, `useDeleteNote`, `useUpdateNote` hooks
5. Add smart date formatter utility (Today / Yesterday / full date)
6. Update JournalTab: show smart dates, add edit/delete buttons per entry
7. Update HomeTab: embed Notes section and Dump section as cards
8. Keep NotesTab/DumpTab code but route them through HomeTab quick access
9. Update ActiveTab type to remove notes/dump from main nav
