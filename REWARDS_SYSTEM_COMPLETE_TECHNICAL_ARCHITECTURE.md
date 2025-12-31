# Complete Rewards System Technical Architecture & Pipeline

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Architecture](#database-architecture)
3. [Backend Services](#backend-services)
4. [Frontend Components](#frontend-components)
5. [API Endpoints](#api-endpoints)
6. [Reward Calculation Logic](#reward-calculation-logic)
7. [Admin Panel](#admin-panel)
8. [Configuration Management](#configuration-management)
9. [Security & Anti-Gaming](#security--anti-gaming)
10. [Data Flow Diagrams](#data-flow-diagrams)

## System Overview

The Knowledge Engine implements a sophisticated dual-currency rewards system with tier-based calculations, anti-gaming measures, and comprehensive tracking. The system supports two primary activities: **Quiz Completion** and **Myths vs Facts Games**.

### Core Components
- **Dual Currency**: Points (⭐) and Credits (💰)
- **Tier System**: Bronze, Silver, Gold, Platinum based on performance
- **Daily Limits**: Configurable caps per user per day
- **Bonus System**: Time bonuses, perfect score bonuses, streak bonuses
- **Pure Scoring Mode**: Optional mode that disables all bonuses
- **Real-time Updates**: Immediate balance updates across all pages

### Key Features
- **Database-First Configuration**: All reward values stored in `rewards_configuration` table
- **Comprehensive Auditing**: Full transaction history with metadata
- **Anti-Gaming Protection**: Behavioral analysis and rate limiting
- **Admin Dashboard**: Real-time monitoring and configuration
- **Caching System**: Optimized performance with smart cache invalidation

---

## Database Architecture

### Core Tables

#### `rewards_configuration`
```sql
CREATE TABLE rewards_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_type VARCHAR NOT NULL, -- 'quiz_completion', 'myths_facts_game', 'daily_login'
    reward_tier VARCHAR NOT NULL,   -- 'bronze', 'silver', 'gold', 'platinum'
    points_reward INTEGER DEFAULT 0,
    credits_reward INTEGER DEFAULT 0,
    minimum_score_percentage INTEGER,
    time_bonus_threshold INTEGER,   -- seconds
    daily_cap INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_currency_transactions`
```sql
CREATE TABLE user_currency_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR NOT NULL, -- 'points_earned', 'credits_earned', 'credits_spent'
    currency_type VARCHAR NOT NULL,    -- 'points', 'credits'
    amount INTEGER NOT NULL,           -- positive for earnings, negative for spending
    balance_after INTEGER NOT NULL,
    activity_type VARCHAR NOT NULL,
    activity_reference_id UUID,        -- links to quiz_result, game_session, etc.
    transaction_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);
```

#### `user_daily_activity`
```sql
CREATE TABLE user_daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    quiz_attempts INTEGER DEFAULT 0,
    quiz_completions INTEGER DEFAULT 0,
    myths_facts_games INTEGER DEFAULT 0,
    points_earned_today INTEGER DEFAULT 0,
    credits_earned_today INTEGER DEFAULT 0,
    login_streak INTEGER DEFAULT 0,
    last_activity_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `users` (Extended)
```sql
-- Added to users table
ALTER TABLE users ADD COLUMN points_balance INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN credits_balance INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN total_points_earned INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN total_credits_earned INTEGER DEFAULT 0;
```

### Supporting Tables

#### `user_quiz_best_scores`
```sql
CREATE TABLE user_quiz_best_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    best_score INTEGER NOT NULL,
    best_percentage INTEGER NOT NULL,
    best_time INTEGER,
    credits_earned INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    reward_tier VARCHAR(50),
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_quiz_best UNIQUE (user_id, quiz_id)
);
```

#### `weekly_leaderboard_cache`
```sql
CREATE TABLE weekly_leaderboard_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    total_credits_earned INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    quizzes_completed INTEGER DEFAULT 0,
    perfect_scores INTEGER DEFAULT 0,
    average_percentage INTEGER DEFAULT 0,
    credits_rank INTEGER,
    points_rank INTEGER,
    completion_rank INTEGER,
    improvement_from_last_week INTEGER DEFAULT 0,
    is_personal_best_week BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_calculated_at TIMESTAMP WITH TIME ZONE
);
```

#### `leaderboard_entries` (DEPRECATED - Not Used)
```sql
-- NOTE: This table was designed in the technical architecture but is NOT implemented
-- The actual leaderboard system uses real-time calculations from user_quiz_results
-- and weekly caching instead of persistent leaderboard_entries storage
CREATE TABLE leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leaderboard_type VARCHAR NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    rank_position INTEGER NOT NULL,
    additional_metrics JSONB DEFAULT '{}',
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
---
```sql
CREATE TABLE anti_gaming_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR NOT NULL,
    activity_reference_id UUID NOT NULL,
    completion_time_seconds INTEGER,
    score_percentage INTEGER,
    suspicious_patterns JSONB DEFAULT '{}',
    risk_score FLOAT DEFAULT 0.0,
    is_flagged BOOLEAN DEFAULT FALSE,
    admin_reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Leaderboard System Implementation

### Real-Time Calculation Architecture

**Overview**: The leaderboard system uses real-time calculations from `user_quiz_results` table instead of persistent `leaderboard_entries` storage. This approach provides flexibility and ensures rankings always reflect the most current data.

**Key Components:**
- **Real-time Rankings**: All-time and monthly leaderboards calculated on-demand from `user_quiz_results`
- **Weekly Caching**: Weekly leaderboards use `weekly_leaderboard_cache` table for performance
- **Personal Best Tracking**: `user_quiz_best_scores` table maintains individual high scores

### Calculation Logic

#### All-Time Leaderboard (`/api/v1/leaderboards/alltime`)
```sql
-- Real-time calculation from user_quiz_results
SELECT
    u.username,
    u.id as user_id,
    COUNT(uqr.id) as total_quizzes,
    SUM(uqr.score) as total_score,
    ROUND(AVG(uqr.percentage), 2) as avg_percentage,
    SUM(CASE WHEN uqr.percentage = 100 THEN 1 ELSE 0 END) as perfect_scores,
    ROW_NUMBER() OVER (ORDER BY SUM(uqr.score) DESC, COUNT(uqr.id) DESC) as rank
FROM users u
JOIN user_quiz_results uqr ON u.id = uqr.user_id
WHERE uqr.created_at >= '2024-01-01'  -- Filter for active period
GROUP BY u.id, u.username
ORDER BY total_score DESC, total_quizzes DESC
LIMIT 100;
```

#### Monthly Leaderboard (`/api/v1/leaderboards/monthly`)
```sql
-- Real-time calculation with monthly filter
SELECT
    u.username,
    u.id as user_id,
    COUNT(uqr.id) as monthly_quizzes,
    SUM(uqr.score) as monthly_score,
    ROUND(AVG(uqr.percentage), 2) as monthly_avg_percentage,
    ROW_NUMBER() OVER (ORDER BY SUM(uqr.score) DESC, COUNT(uqr.id) DESC) as rank
FROM users u
JOIN user_quiz_results uqr ON u.id = uqr.user_id
WHERE DATE_TRUNC('month', uqr.created_at) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY u.id, u.username
ORDER BY monthly_score DESC, monthly_quizzes DESC
LIMIT 100;
```

#### Weekly Leaderboard (`/api/v1/leaderboards/weekly`)
```sql
-- Uses cached data from weekly_leaderboard_cache
SELECT
    u.username,
    wlc.total_credits_earned,
    wlc.total_points_earned,
    wlc.quizzes_completed,
    wlc.perfect_scores,
    wlc.average_percentage,
    wlc.credits_rank,
    wlc.points_rank
FROM weekly_leaderboard_cache wlc
JOIN users u ON wlc.user_id = u.id
WHERE wlc.week_start_date = DATE_TRUNC('week', CURRENT_DATE)
ORDER BY wlc.credits_rank ASC
LIMIT 100;
```

### Background Cache Population

**Weekly Cache Update Process:**
1. **Scheduled Job**: Runs every Sunday at midnight
2. **Data Aggregation**: Calculates weekly statistics from `user_quiz_results`
3. **Rank Calculation**: Determines credits and points rankings
4. **Cache Update**: Populates `weekly_leaderboard_cache` table

**Implementation**: `manage_leaderboards.py` CLI tool handles cache population:
```bash
# Update weekly cache for current week
python manage_leaderboards.py update-weekly-cache

# Recalculate all weekly caches (for backfilling)
python manage_leaderboards.py recalculate-all-weeks
```

### API Endpoints

#### GET `/api/v1/leaderboards/{type}`
**Parameters:**
- `type`: `alltime`, `monthly`, `weekly`
- `limit`: Number of results (default: 100, max: 500)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
    "leaderboard": [
        {
            "rank": 1,
            "username": "quiz_master",
            "user_id": "uuid",
            "total_score": 2850,
            "total_quizzes": 45,
            "avg_percentage": 87.5,
            "perfect_scores": 12
        }
    ],
    "user_rank": {
        "rank": 25,
        "total_score": 1250,
        "total_quizzes": 20,
        "avg_percentage": 82.3
    },
    "last_updated": "2024-01-15T12:00:00Z",
    "calculation_method": "real_time"
}
```

### Performance Optimizations

**Real-Time Calculation Benefits:**
- **Always Current**: Rankings reflect latest quiz completions
- **Flexible Metrics**: Easy to add new ranking criteria
- **No Sync Issues**: No stale data or cache invalidation problems

**Caching Strategy:**
- **Weekly Data**: Cached for performance (updates weekly)
- **All-Time/Monthly**: Real-time for accuracy
- **Personal Ranks**: Cached per user session

**Database Indexes:**
```sql
-- Optimized for leaderboard queries
CREATE INDEX idx_user_quiz_results_user_created ON user_quiz_results(user_id, created_at DESC);
CREATE INDEX idx_user_quiz_results_score ON user_quiz_results(score DESC);
CREATE INDEX idx_weekly_cache_week_user ON weekly_leaderboard_cache(week_start_date, user_id);
```

### Why Real-Time Over Persistent Storage

**Advantages of Current Approach:**
1. **Data Integrity**: Rankings always match actual quiz results
2. **Maintenance Free**: No need to update persistent rankings on every quiz completion
3. **Flexible Metrics**: Easy to change ranking algorithms without data migration
4. **Storage Efficient**: No duplicate storage of ranking data

**Trade-offs:**
- **Query Performance**: Real-time calculations require more complex queries
- **Scalability**: May need optimization for very large user bases
- **Caching**: Weekly data needs background processing

**The `leaderboard_entries` table was designed but never implemented because:**
- Real-time calculations proved more reliable and maintainable
- Persistent storage would require complex update triggers
- The system already had all necessary data in `user_quiz_results`
- Weekly caching provides performance benefits where needed

---

## Backend Services

### 1. RewardsService (`app/services/rewards_service.py`)

**Core Methods:**
- `process_quiz_completion_reward()` - Handles quiz completion rewards
- `process_myths_facts_reward()` - Handles MVF game completion rewards
- `process_daily_login_reward()` - Handles daily login bonuses
- `_calculate_quiz_reward_tier()` - Determines tier based on score
- `_calculate_myths_facts_reward_tier()` - Determines tier for MVF games

**Key Logic:**
```python
async def process_quiz_completion_reward(
    self,
    db: AsyncSession,
    user_id: UUID,
    quiz_result_id: UUID,
    quiz_id: UUID,
    score_percentage: int,
    time_taken: Optional[int] = None,
    perfect_score_bonus: bool = False
) -> Dict:
    # 1. Check pure scoring mode
    pure_scoring_mode = await self._check_pure_scoring_mode(db)
    
    # 2. Calculate tier based on performance
    reward_tier = self._calculate_quiz_reward_tier(score_percentage)
    
    # 3. Get configuration from database
    rewards_config = await self._get_rewards_config(db, ActivityTypeEnum.QUIZ_COMPLETION, reward_tier)
    
    # 4. Check daily limits
    daily_activity = await self._get_daily_activity(db, user_id)
    if not await self._check_daily_reward_limits(daily_activity, rewards_config):
        return {"points_earned": 0, "credits_earned": 0, "reason": "daily_limit_reached"}
    
    # 5. Calculate base rewards
    points_earned = rewards_config.points_reward
    credits_earned = rewards_config.credits_reward
    
    # 6. Apply bonuses (if not pure scoring mode)
    if not pure_scoring_mode:
        # Time bonus logic
        if time_taken and time_taken <= rewards_config.time_bonus_threshold:
            time_bonus_points = int(points_earned * 0.5)  # 50% bonus
            points_earned += time_bonus_points
        
        # Perfect score bonus
        if perfect_score_bonus and score_percentage == 100:
            perfect_bonus_points = int(points_earned * 0.2)  # 20% bonus
            points_earned += perfect_bonus_points
    
    # 7. Award currency via CurrencyService
    metadata = {
        "quiz_id": str(quiz_id),
        "score_percentage": score_percentage,
        "time_taken": time_taken,
        "reward_tier": reward_tier.value,
        "time_bonus_applied": time_bonus_applied,
        "perfect_score_bonus": perfect_score_bonus
    }
    
    await currency_service.add_currency(
        db=db,
        user_id=user_id,
        currency_type=CurrencyTypeEnum.POINTS,
        amount=points_earned,
        activity_type=ActivityTypeEnum.QUIZ_COMPLETION,
        activity_reference_id=quiz_result_id,
        transaction_metadata=metadata
    )
    
    return result
```

### 2. CurrencyService (`app/services/currency_service.py`)

**Core Methods:**
- `add_currency()` - Adds currency with full transaction tracking
- `spend_credits()` - Deducts credits for purchases
- `get_user_balance()` - Retrieves current balances
- `get_transaction_history()` - Audit trail of all transactions
- `_get_or_create_daily_activity()` - Manages daily activity tracking

**Key Features:**
- **Atomic Transactions**: All currency operations are database transactions
- **Balance Validation**: Prevents negative balances
- **Daily Limits**: Enforces configurable daily earning caps
- **Complete Auditing**: Every transaction is logged with metadata

### 3. AntiGamingService (`app/services/anti_gaming_service.py`)

**Core Methods:**
- `analyze_quiz_completion()` - Analyzes quiz completion patterns
- `analyze_myths_facts_completion()` - Analyzes MVF game patterns
- `calculate_risk_score()` - Determines suspicious activity risk

**Detection Patterns:**
- Rapid completion times
- Perfect scores in short time
- Repeated identical answer patterns
- IP address tracking
- Behavioral analysis

---

## Frontend Components

### 1. RewardsContext (`src/contexts/RewardsContext.jsx`)

**State Management:**
```jsx
const [balance, setBalance] = useState({ points: 0, credits: 0 });
const [stats, setStats] = useState(null);
const [achievements, setAchievements] = useState([]);
const [rankings, setRankings] = useState({});
const [recentTransactions, setRecentTransactions] = useState([]);
const [leaderboards, setLeaderboards] = useState({});
```

**Key Methods:**
- `refreshBalance()` - Updates currency balances from server
- `processReward()` - Handles reward notifications and optimistic updates
- `loadLeaderboard()` - Fetches leaderboard data with caching
- `clearLeaderboardCache()` - Forces leaderboard refresh

### 2. RewardsService (`src/services/rewardsService.js`)

**API Integration:**
```javascript
class RewardsService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL;
        this.cache = new Map();
        this.cacheTimeout = 2 * 60 * 1000; // 2 minutes
        this.updateHandlers = new Set();
    }
    
    async getBalance() {
        const response = await apiService.get('/rewards/balance');
        return response;
    }
    
    async getTransactionHistory(params = {}) {
        const response = await apiService.get('/rewards/transactions', { params });
        return response;
    }
}
```

### 3. CurrencyDisplay Component (`src/components/rewards/CurrencyDisplay.jsx`)

**Props:**
```jsx
<CurrencyDisplay
    variant="compact" | "full" | "minimal"
    showBoth={true | false}
    showLabels={true | false}
    className="custom-class"
/>
```

**Features:**
- Multiple display variants
- Animated balance updates
- Responsive design
- Accessibility support

### 4. RewardNotification Component (`src/components/rewards/RewardNotification.jsx`)

**Features:**
- Animated tier badges (Bronze, Silver, Gold, Platinum)
- Particle effects and animations
- Detailed breakdown of bonuses
- Auto-dismiss after 10 seconds
- Sound effects (optional)

---

## API Endpoints

### Quiz Completion Flow

#### POST `/api/v1/quizzes/{quiz_id}/submit`
**Request:**
```json
{
    "answers": [
        {
            "question_index": 0,
            "selected_answer": "A",
            "time_taken": 15
        }
    ],
    "total_time_taken": 120
}
```

**Response:**
```json
{
    "id": "uuid",
    "user_id": "uuid",
    "quiz_id": "uuid",
    "score": 8,
    "max_score": 10,
    "percentage": 80,
    "points_earned": 15,
    "credits_earned": 3,
    "reward_tier": "silver",
    "time_bonus_applied": true,
    "answers": [...]
}
```

**Backend Processing:**
1. Validate quiz submission
2. Calculate score and percentage
3. Run anti-gaming analysis
4. Calculate rewards using RewardsService
5. Update user balances via CurrencyService
6. Create transaction records
7. Update daily activity tracking
8. Return results with reward information

### Myths vs Facts Completion Flow

#### POST `/api/v1/myths-facts/complete`
**Request:**
```json
{
    "game_session_id": "uuid",
    "score_percentage": 85,
    "time_taken": 45,
    "answers_correct": 8,
    "total_questions": 10
}
```

**Response:**
```json
{
    "points_earned": 12,
    "credits_earned": 2,
    "reward_tier": "silver",
    "time_bonus_applied": true,
    "perfect_accuracy": false,
    "metadata": {
        "base_points": 10,
        "base_credits": 2,
        "time_bonus_points": 2,
        "time_bonus_credits": 0,
        "score_percentage": 85
    }
}
```

### Balance & History Endpoints

#### GET `/api/v1/rewards/balance`
```json
{
    "points_balance": 150,
    "credits_balance": 45,
    "total_points_earned": 1250,
    "total_credits_earned": 320
}
```

#### GET `/api/v1/rewards/transactions`
```json
{
    "transactions": [
        {
            "id": "uuid",
            "transaction_type": "points_earned",
            "currency_type": "points",
            "amount": 20,
            "balance_after": 150,
            "activity_type": "quiz_completion",
            "created_at": "2024-01-15T10:30:00Z",
            "transaction_metadata": {
                "quiz_id": "uuid",
                "score_percentage": 90,
                "reward_tier": "gold"
            }
        }
    ],
    "pagination": {
        "total": 150,
        "page": 1,
        "limit": 20,
        "has_more": true
    }
}
```

---

## Reward Calculation Logic

### Tier Determination

#### Quiz Completion Tiers
```python
def _calculate_quiz_reward_tier(self, score_percentage: int) -> RewardTierEnum:
    if score_percentage >= 95:
        return RewardTierEnum.PLATINUM
    elif score_percentage >= 80:
        return RewardTierEnum.GOLD
    elif score_percentage >= 60:
        return RewardTierEnum.SILVER
    else:
        return RewardTierEnum.BRONZE
```

#### Myths vs Facts Tiers
```python
def _calculate_myths_facts_reward_tier(self, score_percentage: int) -> RewardTierEnum:
    if score_percentage >= 95:
        return RewardTierEnum.PLATINUM
    elif score_percentage >= 85:
        return RewardTierEnum.GOLD
    elif score_percentage >= 70:
        return RewardTierEnum.SILVER
    else:
        return RewardTierEnum.BRONZE
```

### Bonus System

#### Time Bonuses
- **Quiz**: 50% bonus if completed within threshold (default: 80% of time limit)
- **MVF**: 40% bonus if completed within threshold (default: 60 seconds)
- Only applied if score ≥ 80% (quiz) or ≥ 70% (MVF)

#### Perfect Score Bonuses
- **Quiz**: 20% bonus for 100% accuracy
- **MVF**: 25% bonus for 100% accuracy
- Applied on top of time bonuses

#### Streak Bonuses
- **Daily Login**: 7-day streak = 10 pts/2 credits, 30-day = 50 pts/10 credits

### Pure Scoring Mode
When enabled via `pure_scoring_mode` site setting:
- Only base tier rewards are awarded
- No time bonuses
- No perfect score bonuses
- No streak bonuses
- Logged in transaction metadata

---

## Admin Panel

### AdminRewardsDashboard (`src/components/rewards/AdminRewardsDashboard.jsx`)

**Features:**
- **Real-time Statistics**: Total users, points/credits distributed, daily activity
- **User Management**: Search, view balances, adjust balances, reset progress
- **System Settings**: Configure reward values, anti-gaming parameters
- **Recent Activity**: Live feed of reward transactions
- **Leaderboard Management**: View and manage rankings

**Settings Configuration:**
```jsx
const [rewardSettings, setRewardSettings] = useState({
    quiz_base_points: 10,
    quiz_difficulty_multiplier_easy: 1.0,
    quiz_difficulty_multiplier_medium: 1.2,
    quiz_difficulty_multiplier_hard: 1.5,
    myths_facts_points: 5,
    daily_limit_points: 500,
    daily_limit_credits: 200,
    pure_scoring_mode: false
});

const [antiGamingSettings, setAntiGamingSettings] = useState({
    max_attempts_per_quiz_per_day: 3,
    min_time_between_attempts: 300,
    suspicious_score_threshold: 0.95,
    enable_ip_tracking: true,
    enable_behavior_analysis: true
});
```

### Database Configuration Interface

**Missing Feature**: The admin panel currently uses hardcoded settings. The system needs:
- Interface for `rewards_configuration` table management
- CRUD operations for reward tiers and values
- Real-time configuration updates
- Configuration history and rollback

**Current Limitation**: The admin panel only manages `site_setting` table entries (daily limits, pure scoring mode, anti-gaming settings) but cannot modify the actual reward tier values stored in `rewards_configuration`. This means reward amounts for Bronze/Silver/Gold/Platinum tiers are fixed and cannot be adjusted through the UI.

**What the Admin Panel Currently Has** ✅:
- Quiz Base Points (10) - *This is a multiplier/base value, not tier-specific rewards*
- Easy/Medium/Hard Multipliers (1.0, 1.2, 1.5) - *Difficulty multipliers, not tier rewards*
- Myths vs Facts Points (5) - *Base value, not tier-specific rewards*
- Daily Points/Credits Limits (500/200) - *Daily caps from site_setting table*
- Pure Scoring Mode toggle - *From site_setting table*
- Anti-gaming parameters - *From site_setting table*

**What's Still Missing** ❌ (The Core Issue):
- ❌ **No UI** to view/edit actual reward tier configurations from `rewards_configuration` table
- ❌ **No CRUD operations** for Bronze/Silver/Gold/Platinum reward values
- ❌ **No ability to modify** the specific points/credits awarded per tier
- ❌ **No ability to adjust** score thresholds for tier determination
- ❌ **No ability to modify** time bonus thresholds and multipliers
- ❌ **No configuration history/rollback** for reward changes

**The Critical Distinction**:
The admin panel manages **operational settings** (limits, multipliers, anti-gaming) but lacks **reward configuration management**. The actual reward tier values (5⭐/1💰 Bronze, 10⭐/2💰 Silver, etc.) remain hardcoded in the database and cannot be modified through any admin interface.

**Impact**: Admins cannot dynamically adjust reward values based on game economy needs, requiring database-level changes for reward balancing. This creates operational friction and prevents agile reward system management.

**Required Implementation**:
1. Backend: Add CRUD endpoints for `rewards_configuration` table
2. Frontend: Build reward configuration management UI in admin dashboard
3. Validation: Add business logic validation for reward configurations
4. History: Implement configuration change tracking and rollback
5. Real-time: Ensure configuration changes take effect immediately

---

## Configuration Management

### Site Settings (`site_setting` table)
```sql
CREATE TABLE site_setting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR UNIQUE NOT NULL,
    value TEXT,
    parsed_value JSONB,  -- For complex values
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Settings:**
- `pure_scoring_mode`: BOOLEAN - Disables all bonuses
- `mvf_daily_points_limit`: INTEGER - Daily MVF points cap
- `mvf_daily_credits_limit`: INTEGER - Daily MVF credits cap
- `max_daily_quiz_attempts`: INTEGER - Quiz attempt limit
- `min_time_between_attempts`: INTEGER - Rate limiting

### Reward Configuration (`rewards_configuration` table)
**Default Values:**
```sql
-- Quiz Completion Rewards
INSERT INTO rewards_configuration (activity_type, reward_tier, points_reward, credits_reward, minimum_score_percentage, time_bonus_threshold) VALUES
('quiz_completion', 'bronze', 5, 1, 0, 300),
('quiz_completion', 'silver', 10, 2, 60, 300),
('quiz_completion', 'gold', 20, 5, 80, 300),
('quiz_completion', 'platinum', 30, 10, 95, 300);

-- Myths vs Facts Rewards
INSERT INTO rewards_configuration (activity_type, reward_tier, points_reward, credits_reward, minimum_score_percentage, time_bonus_threshold) VALUES
('myths_facts_game', 'bronze', 3, 1, 0, 60),
('myths_facts_game', 'silver', 6, 1, 70, 60),
('myths_facts_game', 'gold', 12, 3, 85, 60),
('myths_facts_game', 'platinum', 18, 5, 95, 60);

-- Daily Login Rewards
INSERT INTO rewards_configuration (activity_type, reward_tier, points_reward, credits_reward) VALUES
('daily_login', 'bronze', 5, 1);
```

---

## Security & Anti-Gaming

### Anti-Gaming Service Features

#### Pattern Detection
1. **Rapid Completion**: Quizzes completed too quickly
2. **Perfect Scores**: 100% accuracy in minimal time
3. **Answer Patterns**: Identical answer sequences
4. **IP Tracking**: Multiple accounts from same IP
5. **Behavioral Analysis**: Unusual completion patterns

#### Risk Scoring
```python
def calculate_risk_score(self, completion_time: int, score_percentage: int, 
                        previous_patterns: List[Dict]) -> float:
    risk_score = 0.0
    
    # Time-based risk
    if completion_time < self.min_completion_time:
        risk_score += 0.3
    
    # Perfect score risk
    if score_percentage == 100 and completion_time < self.suspicious_time_threshold:
        risk_score += 0.4
    
    # Pattern-based risk
    if self._detect_answer_patterns(previous_patterns):
        risk_score += 0.2
    
    return min(risk_score, 1.0)  # Cap at 1.0
```

#### Actions Taken
- **Low Risk (0.0-0.3)**: Normal processing
- **Medium Risk (0.3-0.7)**: Flag for review, allow rewards
- **High Risk (0.7-1.0)**: Block rewards, flag for admin review

### Rate Limiting
- **Daily Quiz Attempts**: Configurable limit (default: 10)
- **Time Between Attempts**: Minimum 5 minutes between quizzes
- **Daily Currency Caps**: Points (500), Credits (200)

---

## Data Flow Diagrams

### Quiz Completion Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Endpoint   │    │   Backend       │
│   QuizTaking    │    │   /quizzes/submit│    │   Services      │
│                 │    │                  │    │                 │
│ 1. Submit Quiz  │───▶│ 1. Validate      │───▶│ 1. Anti-gaming  │
│    Answers      │    │    Submission    │    │    Analysis     │
│                 │    │                  │    │                 │
│ 2. Show Loading │    │ 2. Calculate     │    │ 2. Calculate    │
│                 │    │    Score         │    │    Rewards      │
│                 │    │                  │    │                 │
│ 3. Display      │◀───│ 3. Return Result │◀───│ 3. Update DB    │
│    Results      │    │    + Rewards     │    │    Balances     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Reward Processing Flow

```
User Action → Frontend Component → API Endpoint → RewardsService → CurrencyService → Database
     │              │                    │             │              │            │
     ▼              ▼                    ▼             ▼              ▼            ▼
  Quiz Submit   refreshBalance()     Validate     calculateTier()  addCurrency()  INSERT
  MVF Complete  processReward()      Process      applyBonuses()   Transaction    UPDATE
  Daily Login   showNotification()   Check Limits  checkDailyCaps() Balance       user_daily_activity
```

### Balance Update Flow

```
Database Change → CurrencyService → API Response → RewardsContext → Component Re-render
       │                │                │              │                │
       ▼                ▼                ▼              ▼                ▼
    UPDATE user     getBalance()     {points, credits} setBalance()     CurrencyDisplay
    _currency_      from DB          JSON Response     State Update     Updated UI
    transactions                                                     Optimistic Update
```

### Caching & Real-time Updates

```
User Action → Service Call → API Request → Database Query → Cache Update → UI Update
     │           │             │              │              │            │
     ▼           ▼             ▼              ▼              ▼            ▼
  Quiz Complete rewardsService  /rewards/balance  SELECT balance  cache.set()   setBalance()
  MVF Complete .getBalance()    HTTP GET         user_balances   2min TTL     Re-render
  Page Load    Cache Check     Cache Hit?       Cache Miss      Fresh Data   Display
```

---

## Performance Optimizations

### Caching Strategy
- **Balance Data**: 2-minute cache with immediate invalidation on changes
- **Leaderboard Data**: 5-minute cache with manual refresh options
- **Configuration**: Long-term cache (hours) since rarely changes

### Database Optimizations
- **Indexes**: Composite indexes on frequently queried columns
- **Partitioning**: Time-based partitioning for transaction history
- **Connection Pooling**: Efficient database connection management

### Frontend Optimizations
- **Optimistic Updates**: Immediate UI updates with server sync
- **Lazy Loading**: Leaderboards and transaction history loaded on demand
- **Debounced Updates**: Batch balance refresh calls

---

## Monitoring & Analytics

### Key Metrics
- **Reward Distribution**: Points/credits awarded per day/week/month
- **User Engagement**: Quiz completion rates, MVF game participation
- **Anti-Gaming**: Flagged activities, blocked rewards
- **System Performance**: API response times, cache hit rates

### Admin Dashboard Features
- **Real-time Stats**: Live user counts, reward distributions
- **Activity Feeds**: Recent transactions and user actions
- **Risk Monitoring**: Anti-gaming alerts and flagged users
- **Configuration Management**: Dynamic reward value adjustments

---

## Future Enhancements

### Planned Features
1. **Advanced Leaderboards**: Category-specific, time-based rankings
2. **Achievement System**: Unlockable badges and titles
3. **Social Features**: Friend challenges, team competitions
4. **Reward Store**: Spend credits on premium features
5. **Advanced Analytics**: User behavior patterns, reward effectiveness

### Technical Improvements
1. **WebSocket Integration**: Real-time balance updates
2. **Machine Learning**: Advanced anti-gaming detection
3. **Microservices**: Separate rewards service architecture
4. **Advanced Caching**: Redis integration for better performance
5. **API Rate Limiting**: Per-user and per-endpoint limits

---

This comprehensive architecture ensures a robust, scalable, and secure rewards system that motivates user engagement while preventing abuse. The dual-currency system with tier-based rewards creates meaningful progression, while the anti-gaming measures maintain system integrity.