# Frontend Category Migration Plan

## Current State vs Target State

### Current Implementation (Frontend)
- **Dual Mode Selection**: "Regular Mode" vs "Collection Mode"
- **Regular Mode**: Random myths/facts from general API
- **Collection Mode**: Shows collection selection with themed groups
- **Game State**: Uses `gameMode` state with values: `'selection'`, `'regular'`, `'collection'`

### Target Implementation (Align with Admin)
- **Category-Based Selection**: Wildlife, Marine, Forest, Climate categories
- **Difficulty Levels**: Beginner, Intermediate, Advanced within each category
- **Featured Categories**: Auto-select featured categories as default
- **Custom Credits**: Different credit rewards per category

### Admin Panel Current System (Reference)
```
Categories Available:
- Wildlife (Wildlife Safety, Animals, etc.)
- Marine (Ocean Life, Marine Conservation, etc.)
- Forest (Forest Ecosystems, Tree Species, etc.)
- Climate (Climate Change, Weather Patterns, etc.)

Features:
- Each category can have custom credits
- Featured category selection (only one at a time)
- MVF enable/disable toggle per category
- Difficulty levels within categories
```

## Migration Steps

### 1. API Integration Updates
- Create `categoryService.js` to handle category API calls
- Update `mythsFactsService.js` to support category-based filtering
- Implement category-specific myth/fact fetching

### 2. State Management Changes
```javascript
// Old state structure
const [gameMode, setGameMode] = useState('selection'); // 'selection', 'regular', 'collection'

// New state structure
const [gameState, setGameState] = useState('categorySelection'); // 'categorySelection', 'difficultySelection', 'playing'
const [selectedCategory, setSelectedCategory] = useState(null);
const [selectedDifficulty, setSelectedDifficulty] = useState(null);
const [availableCategories, setAvailableCategories] = useState([]);
```

### 3. UI Component Updates
- Replace mode selection buttons with category cards
- Add difficulty selection screen
- Update progress indicators
- Modify completion screens to show category-specific achievements

### 4. Component Architecture
```
MythsVsFacts.jsx
├── CategorySelection (new)
│   ├── CategoryCard components
│   └── Featured category highlighting
├── DifficultySelection (new)
│   ├── Difficulty level buttons
│   └── Credit preview
├── GamePlay (existing, modified)
│   ├── Category-specific content
│   └── Updated progress tracking
└── GameCompletion (existing, modified)
    ├── Category-specific rewards
    └── Next category suggestions
```

### 5. API Endpoints to Use
```javascript
// Get MVF-enabled categories
GET /api/v1/categories?mvf_enabled=true&is_active=true

// Get category-specific myths/facts
GET /api/v1/myths-facts?category_id={categoryId}&page=1&limit=50

// Category details
GET /api/v1/categories/{categoryId}
```

## Implementation Priority

### Phase 1: Core Category System
1. Create category service
2. Update state management
3. Implement category selection UI
4. Basic category-based game play

### Phase 2: Enhanced Features
1. Add difficulty levels
2. Implement custom credits
3. Featured category handling
4. Progress tracking per category

### Phase 3: Polish & Optimization
1. Smooth animations between screens
2. Category-specific theming
3. Achievement system updates
4. Performance optimizations

## Backward Compatibility

The migration will maintain game functionality by:
- Keeping existing API fallbacks
- Preserving reward system integration
- Maintaining save/progress functionality
- Ensuring mobile responsiveness

## Files to Update

### New Files
- `src/services/categoryService.js`
- `src/components/CategorySelection.jsx`
- `src/components/DifficultySelection.jsx`
- `src/components/CategoryCard.jsx`

### Modified Files
- `src/pages/resources/MythsVsFacts.jsx` (main component)
- `src/services/mythsFactsService.js` (add category support)
- `src/hooks/useGameState.js` (update state structure)
- `src/tests/MythsVsFacts.test.jsx` (update tests)

## Benefits of Migration

1. **Consistency**: Frontend aligns with admin panel organization
2. **Better UX**: Users can choose content types that interest them
3. **Scalability**: Easy to add new categories and difficulty levels
4. **Engagement**: Category-specific achievements and progress
5. **Admin Control**: Leverage admin panel's category management features

## Next Steps

1. Implement `categoryService.js`
2. Create category selection UI
3. Update main component state management
4. Test with existing backend APIs
5. Gradual rollout with feature flags