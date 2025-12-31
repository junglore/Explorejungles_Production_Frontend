# 🔄 Quiz Repeatability Configuration Guide

## 📊 **Current Quiz Retry Settings**

### 🎯 **Per Quiz Repeatability**

#### **Development Mode** (Current):
- **Retakes**: ♾️ **UNLIMITED** 
- **Score Policy**: 📝 **ALWAYS CREATES NEW RECORD** (all attempts stored)
- **Best Score Tracking**: 🏆 **SMART UPDATE** - Only updates if:
  - Higher percentage score, OR
  - Same percentage but faster completion time

#### **Production Mode**:
- **Retakes**: 🚫 **BLOCKED** - One attempt only
- **Error Message**: "You have already completed this quiz"
- **Override**: Admin can change via environment settings

### 🏆 **Score Management System**

#### **Dual Tracking System**:
1. **UserQuizResult**: 📊 Stores **ALL attempts** (complete history)
2. **UserQuizBestScore**: 🏅 Stores **ONLY personal best** (smart updates)

#### **Best Score Logic**:
```python
# Updates best score ONLY if:
if (new_percentage > old_percentage) OR 
   (new_percentage == old_percentage AND new_time < old_time):
    # Update the best score record
    # Keep the old record unchanged if new score is worse
```

#### **What Users See**:
- **Leaderboards**: Show personal best scores only
- **Quiz History**: Show all attempts with timestamps
- **Personal Stats**: Based on best scores, not latest attempts

### 🏆 **Daily Quiz Limits**
**Current Settings**:
- **Max Quiz Attempts Per Day**: `10` total quiz attempts
- **Any Different Quizzes**: No specific limit (within the 10 attempts)
- **Min Time Between Attempts**: `300 seconds` (5 minutes)

## ⚙️ **Configuration Locations**

### 1. **Backend Settings** (`site_setting.py`)
```python
# Security Settings
{
    'key': 'max_quiz_attempts_per_day',
    'value': '10',  # Total daily quiz attempts
    'data_type': 'int',
    'category': 'security',
    'label': 'Max Quiz Attempts Per Day',
    'description': 'Maximum number of quiz attempts per user per day',
    'is_public': False
},
{
    'key': 'min_time_between_attempts',
    'value': '300',  # 5 minutes in seconds
    'data_type': 'int',
    'category': 'security',
    'label': 'Min Time Between Attempts (seconds)',
    'description': 'Minimum time between consecutive quiz attempts',
    'is_public': False
}
```

### 2. **Development Mode Override**
```python
# In quizzes.py API endpoint
if settings.ENVIRONMENT != "development":
    # Check if user already completed this quiz
    existing_result = await db.execute(...)
    if existing_result.scalar_one_or_none():
        raise HTTPException(detail="You have already completed this quiz")
```

**Current State**: ⚠️ **Development mode allows infinite retakes**

## 🎮 **How It Currently Works**

### **Single Quiz Retakes**:
1. **Development**: ♾️ Unlimited retakes, all attempts stored
2. **Production**: 🚫 One attempt only (blocked after first completion)
3. **Score System**: 
   - 📊 **All attempts** saved in UserQuizResult table
   - 🏆 **Best score** tracked separately in UserQuizBestScore table
   - 🎯 **Smart updates**: Best score only updates if new score is better (higher %) or same % but faster time

### **Different Quizzes Daily**:
- **Limit**: 10 total quiz attempts per day
- **Cooldown**: 5 minutes between any quiz attempts
- **Scope**: All quizzes combined (not per quiz)

### **Current Frontend Behavior**:
- ✅ Shows "Retake Quiz" button
- ✅ Asks confirmation: "Your previous score will be replaced"
- ⚠️ **Actually**: Creates new record, best score only updates if better
- ✅ Allows navigation to quiz retake

## 🔧 **Admin Panel Configuration**

### **Location**: Backend Admin Panel → Settings → Security Section
- **Max Quiz Attempts Per Day**: Configurable (default: 10)
- **Min Time Between Attempts**: Configurable (default: 5 minutes)

### **Anti-Gaming Settings** (Frontend Component):
```javascript
const antiGamingSettings = {
    max_attempts_per_quiz_per_day: 3,  // Per individual quiz
    min_time_between_attempts: 300,    // 5 minutes
    // ... other settings
};
```

## 📈 **Current Development Configuration**

### ✅ **What's Working**:
1. **Development Mode**: Users can replay any quiz unlimited times
2. **Smart Score Tracking**: Best scores only update when performance improves
3. **Complete History**: All attempts stored, users can track progress
4. **Daily Limits**: 10 attempts per day across all quizzes
5. **5-Minute Cooldown**: Between any quiz attempts
6. **Dual System**: Personal best for rankings + full history for analysis

### ⚠️ **Production vs Development**:
- **Development**: Quiz completion check **DISABLED** = unlimited same-quiz retakes
- **Production**: Quiz completion check **ENABLED** = one attempt per quiz only
- **Score Logic**: Same in both modes - best scores update only when improved

## 🎯 **Recommended Production Settings**

### **Conservative Approach**:
```
max_quiz_attempts_per_day: 5
min_time_between_attempts: 600 (10 minutes)
Allow 1 retake per quiz per day
```

### **Moderate Approach**:
```
max_quiz_attempts_per_day: 10
min_time_between_attempts: 300 (5 minutes)  
Allow 3 retakes per quiz per day
```

### **Liberal Approach** (Current):
```
max_quiz_attempts_per_day: 10
min_time_between_attempts: 300 (5 minutes)
Unlimited retakes per quiz (dev mode)
```

## 🔄 **Summary**

**Current Reality**:
- ♾️ **One Quiz**: Unlimited retakes (development mode)
- 🔢 **Different Quizzes**: Up to 10 per day total
- ⏱️ **Cooldown**: 5 minutes between attempts
- 🏆 **Score Logic**: Best score updates **ONLY if new score is better**
  - Higher percentage = update best score
  - Same percentage + faster time = update best score  
  - Lower percentage = keep old best score (new attempt still recorded)
- 📊 **Tracking**: All attempts stored + separate best score table

**Production Changes**:
- 🚫 **One Quiz**: Only one attempt allowed (completion check enabled)
- 🎯 **Score System**: Same smart best-score-only-if-better logic

**Configuration Power**: Full admin control over limits via backend settings panel.

---

**🎯 Your system intelligently tracks both complete quiz history AND personal best scores, only updating bests when users actually improve!**