# Deprecated Collection System

## Date Deprecated: December 22, 2025

## Reason for Deprecation

These files were part of an older "Collection Mode" system for the Myths vs Facts game that was never fully integrated or used in production. The system was replaced by a simpler, more efficient **Category-Based** approach.

## Files Moved Here

1. **CollectionSelection.jsx** - UI component for collection selection
2. **CollectionSelection.css** - Styling for collection selection
3. **collectionService.js** - Service layer for collection API
4. **CollectionTest.jsx** - Test file for collection functionality
5. **CollectionManagement.jsx** - Admin panel for managing collections (never linked)

## What Replaced It

The Myths vs Facts game now uses **Category Selection Mode ONLY**:
- Users select from categories (Wildlife, Marine Life, Birds, etc.)
- Backend fetches random cards from the selected category
- Simpler, cleaner codebase
- Better user experience

## Backend Status

The backend also has unused collection-related code:
- `myth_fact_collections` table
- `collection_myths_facts` junction table
- Collection API endpoints

These may be removed in a future backend cleanup.

## Can These Files Be Deleted?

**Yes**, these files can be safely deleted. They are kept here temporarily for reference in case:
- Historical context is needed
- We want to review the old implementation
- We decide to reintroduce a collection system in the future

## Related Documentation

- See `CATEGORY_BASED_MVF_PLAN.md` in project root
- See `MVF_SYSTEM_COMPLETE_EXPLANATION.md` in project root

## Cleanup Checklist

- ✅ Removed from MythsVsFacts.jsx
- ✅ Removed unused state variables (`gameMode`, `selectedCollection`, etc.)
- ✅ Removed unused functions (`loadMythsVsFacts`, `loadCollectionContent`, etc.)
- ✅ Moved files to `_deprecated_collection_system` folder
- ⏳ Backend cleanup pending (optional)
