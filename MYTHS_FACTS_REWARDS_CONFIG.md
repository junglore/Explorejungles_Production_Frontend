# Myths vs Facts Rewards Configuration & Admin Guide

## 📋 Overview

The Myths vs Facts game uses a sophisticated dual-currency rewards system with tier-based calculations. **All configuration is now DATABASE-FIRST** - the database `rewards_configuration` table is the authoritative source of truth for all reward values.

## 🎯 Current Reward System (DATABASE SOURCE OF TRUTH)

### Tier Calculation Logic
**Backend Logic** (`rewards_service.py`):
```python
# Accuracy-based tier determination
if accuracy >= 95:    tier = PLATINUM
elif accuracy >= 85:  tier = GOLD
elif accuracy >= 70:  tier = SILVER
else:                 tier = BRONZE
```

### Base Rewards by Tier
**AUTHORITATIVE Database Configuration** (rewards_configuration table):
```python
MYTHS_FACTS_GAME_REWARDS = {
    "BRONZE":   {"points":  5, "credits":  2, "min_accuracy": None},
    "SILVER":   {"points":  8, "credits":  4, "min_accuracy": 60},
    "GOLD":     {"points": 12, "credits":  6, "min_accuracy": 80},
    "PLATINUM": {"points": 20, "credits": 10, "min_accuracy": 95}
}
```

⚠️ **IMPORTANT**: Static config files have been deprecated. The database is the single source of truth.

### Pure Scoring Mode
**NEW**: The system now supports pure scoring mode via `site_settings.pure_scoring_mode`:
- When `TRUE`: Only base tier rewards are given (no bonuses)
- When `FALSE`: Full bonus system applies (time + perfect bonuses)
- Status is shown in game completion displays

### Bonus Calculations (Only Applied When Pure Scoring Mode = FALSE)
**Time Bonus** (if completed within threshold):
- Points: +40% of base points
- Credits: +30% of base credits
- Applied when performance ≥ 70% accuracy

**Perfect Accuracy Bonus** (100% correct):
- Points: +25% of current total (including time bonus)
- Credits: +25% of current total (including time bonus)

### Example Calculation
**100% Accuracy Game (PLATINUM) - Actual Results:**
```
Base Rewards:    20 points + 10 credits  (database config)
Perfect Bonus:   +5 points + 2 credits   (25% of base)
Time Bonus:      +8 points + 3 credits   (if under 20s)
TOTAL POSSIBLE:  33 points + 15 credits
ACTUAL RESULT:   25 points + 12 credits  (no time bonus)
```

## 🏗️ Current Architecture

### Content Management
**Individual Card Creation:**
- Admin creates individual myth/fact entries via `/api/v1/myths-facts/`
- Each entry has: title, myth_content, fact_content, category_id, image_url, is_featured
- No collection/set grouping - cards are selected randomly for gameplay

**Game Session Flow:**
1. Frontend requests 12 random cards (`fetchRandomMythsFacts(12)`)
2. User plays through all cards in random order
3. Completion triggers single reward calculation for entire session
4. Rewards based on overall accuracy across all cards

### Data Storage
**Individual Myths/Facts:**
```sql
myths_facts:
- id (UUID)
- title (string, 500 chars)
- myth_content (text)
- fact_content (text)
- category_id (UUID, nullable)
- image_url (string, 500 chars)
- is_featured (boolean)
- created_at (timestamp)
```

**Rewards Tracking:**
```sql
user_currency_transactions:
- user_id, transaction_type, currency_type
- amount, balance_after
- activity_type: "myths_facts_game"
- activity_reference_id: game_session_id
- transaction_metadata: {"score": 100, "tier": "PLATINUM"}
```

## 🚀 Proposed Admin Enhancements

### 1. Collection-Based Management

**New Model: MythFactCollection**
```sql
myth_fact_collections:
- id (UUID)
- name (string) - "Wildlife Conservation Basics"
- description (text)
- category_id (UUID)
- custom_points_reward (integer, nullable)
- custom_credits_reward (integer, nullable)
- difficulty_level (enum: BEGINNER, INTERMEDIATE, ADVANCED)
- estimated_duration_minutes (integer)
- is_active (boolean)
- created_by_admin_id (UUID)
- created_at (timestamp)
```

**Junction Table: CollectionMythFacts**
```sql
collection_myth_facts:
- collection_id (UUID)
- myth_fact_id (UUID)
- display_order (integer)
- individual_points_override (integer, nullable)
- individual_credits_override (integer, nullable)
```

### 2. Admin Panel Features

**Collection Management Interface:**
- Create collections with custom names and descriptions
- Drag-and-drop cards to build collections
- Set collection-wide custom rewards
- Override individual card rewards within collections
- Preview total reward potential per collection

**Granular Reward Control:**
```javascript
// Collection-level custom rewards
collection: {
  name: "Ocean Conservation",
  basePointsReward: 30,     // Override default tier calculation
  baseCreditsReward: 8,     // Custom credits for this collection
  
  // Individual card overrides
  cards: [
    {id: "card1", pointsOverride: 5, creditsOverride: 2},
    {id: "card2", pointsOverride: null, creditsOverride: null}, // Use defaults
  ]
}
```

### 3. Enhanced Reward Calculation

**New Calculation Logic:**
```python
def calculate_collection_rewards(collection, user_performance):
    total_points = 0
    total_credits = 0
    
    for card_result in user_performance:
        card = card_result.myth_fact
        
        # Check for individual card overrides
        if card_result.has_individual_override:
            if card_result.correct:
                total_points += card_result.points_override
                total_credits += card_result.credits_override
        else:
            # Use collection base rewards or default tier calculation
            if collection.custom_points_reward:
                base_points = collection.custom_points_reward / len(collection.cards)
            else:
                base_points = get_default_tier_points(user_accuracy)
            
            if card_result.correct:
                total_points += base_points
                total_credits += (collection.custom_credits_reward or 
                                default_tier_credits) / len(collection.cards)
    
    # Apply bonuses (time, perfect accuracy)
    apply_performance_bonuses(total_points, total_credits, user_performance)
    
    return total_points, total_credits
```

### 4. Database Schema Updates

**Migration Requirements:**
1. Create `myth_fact_collections` table
2. Create `collection_myth_facts` junction table
3. Add `collection_id` to game sessions for tracking
4. Update rewards calculation service to handle collections

**Backward Compatibility:**
- Existing individual cards continue to work
- Non-collection games use current random selection
- Admin can gradually migrate content to collections

## 🎮 Updated Gameplay Flow

**Collection-Based Games:**
1. Admin creates themed collections (e.g., "Ocean Conservation", "Forest Wildlife")
2. User selects collection or gets random collection assigned
3. Game loads specific cards in collection order
4. Rewards calculated using collection-specific rules
5. Progress tracking per collection for achievements

**Flexible Selection:**
```javascript
// Game initialization options
gameOptions = {
  mode: "collection",           // or "random"
  collectionId: "uuid-here",   // specific collection
  difficulty: "intermediate",   // filter collections
  cardCount: 8                 // limit cards per session
}
```

## 📊 Admin Analytics Dashboard

**Collection Performance Metrics:**
- Average completion rates per collection
- Most/least difficult collections
- Reward distribution analysis
- User engagement by collection theme

**Reward Economy Health:**
- Total points/credits distributed
- Collection reward effectiveness
- User progression patterns
- Gaming detection metrics

## 🔧 Implementation Roadmap

### Phase 1: Collection Infrastructure
- [ ] Create new database models
- [ ] Build collection CRUD APIs
- [ ] Admin panel collection builder
- [ ] Basic collection-to-game mapping

### Phase 2: Enhanced Rewards
- [ ] Custom reward calculation logic
- [ ] Individual card override system
- [ ] Bonus multiplier configurations
- [ ] Reward preview tools

### Phase 3: Advanced Features
- [ ] Collection difficulty levels
- [ ] Themed reward multipliers
- [ ] Progressive collection unlocks
- [ ] Achievement integration

### Phase 4: Analytics & Optimization
- [ ] Collection performance dashboard
- [ ] A/B testing framework for rewards
- [ ] Automated balance suggestions
- [ ] Advanced gaming prevention

## 🎯 Benefits of Collection System

**For Admins:**
- Thematic content organization
- Granular reward control
- Better content curation
- Performance analytics

**For Users:**
- Structured learning paths
- Themed gameplay experiences
- Progressive difficulty
- Achievement tracking

**For System:**
- Improved content discoverability
- Better engagement metrics
- Flexible reward economy
- Scalable content management

## 📋 Configuration Examples

**Conservation Basics Collection:**
```json
{
  "name": "Conservation Basics",
  "description": "Fundamental wildlife conservation concepts",
  "difficulty": "BEGINNER",
  "customPointsReward": 20,
  "customCreditsReward": 6,
  "cards": [
    {"mythFactId": "uuid1", "order": 1},
    {"mythFactId": "uuid2", "order": 2, "pointsOverride": 8},
    {"mythFactId": "uuid3", "order": 3}
  ]
}
```

**Advanced Marine Biology Collection:**
```json
{
  "name": "Advanced Marine Biology",
  "description": "Complex marine ecosystem interactions",
  "difficulty": "ADVANCED",
  "customPointsReward": 40,
  "customCreditsReward": 12,
  "bonusMultiplier": 1.5,
  "cards": [
    {"mythFactId": "uuid4", "order": 1, "pointsOverride": 15},
    {"mythFactId": "uuid5", "order": 2, "pointsOverride": 12}
  ]
}
```

This enhanced system provides administrators with fine-grained control over content organization and reward distribution while maintaining the engaging gameplay experience for users.