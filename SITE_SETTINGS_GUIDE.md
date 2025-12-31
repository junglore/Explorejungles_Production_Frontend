# 🎯 **Site Settings & Tier Systems Explained**

## 📋 **Complete Site Settings Guide**

### 🔍 **Two Different Tier Systems - EXPLAINED**

You have **TWO SEPARATE** tier systems that work for different purposes:

---

## **1. 🏆 Performance Tiers** (Game Performance Based)
**Purpose**: Rewards based on how well users perform in quizzes/games

### **How It Works:**
- Based on **quiz/game score percentage**
- Applies **temporarily** during game completion
- Affects **both points and credits** for that specific game

### **Current Configuration:**
- **Bronze Tier**: 60-74% score → **1.0x multiplier** (base rewards)
- **Silver Tier**: 75-84% score → **1.2x multiplier** (20% bonus)
- **Gold Tier**: 85-94% score → **1.5x multiplier** (50% bonus)  
- **Platinum Tier**: 95-100% score → **2.0x multiplier** (100% bonus)

### **Example:**
- User scores 90% on quiz → **Gold tier** → Gets 1.5x points and credits for that quiz

---

## **2. 👤 User Account Tiers** (Account Status Based)
**Purpose**: Long-term credit earning multipliers based on user account level

### **How It Works:**
- Based on **user account status/level**
- Applies **permanently** to all credit earnings
- Affects **only credits**, not points
- Conservative approach to credit distribution

### **Current Configuration:**
- **Bronze Tier**: New users → **1.0x credits** (standard rate)
- **Silver Tier**: Regular users → **1.1x credits** (10% bonus)
- **Gold Tier**: Active users → **1.2x credits** (20% bonus)
- **Platinum Tier**: VIP users → **1.3x credits** (30% bonus)

### **Example:**
- Gold tier user earns 10 credits from quiz → Gets 12 credits total (10 × 1.2)

---

## 🔄 **How Both Systems Work Together**

### **Complete Calculation Example:**
**Scenario**: Gold tier user (1.2x credits) scores 90% on quiz (Gold performance = 1.5x)

1. **Base Rewards**: 50 points, 5 credits
2. **Performance Tier Applied**: 50 × 1.5 = 75 points, 5 × 1.5 = 7.5 credits  
3. **User Tier Applied**: Points unchanged, 7.5 × 1.2 = 9 credits
4. **Final Result**: 75 points, 9 credits

---

## ⚙️ **All Site Settings Explained**

### **🎮 Quiz System Settings**

#### **Scoring Configuration:**
- **Base Points per Question**: Default points earned for each correct answer
- **Base Credits per Quiz**: Default credits earned for completing a quiz
- **Time Limit**: How long users have to answer each question

#### **Attempt Limits:**
- **Max Tries per Quiz**: How many times a user can attempt the same quiz
- **Max Quizzes per Day**: Total number of different quizzes per day
- **Daily Points Limit**: Maximum points a user can earn from quizzes per day
- **Daily Credits Limit**: Maximum credits a user can earn from quizzes per day

#### **Bonus System:**
- **Speed Bonus**: Extra rewards for completing quizzes quickly (40% faster = 30% bonus)
- **Perfect Score Bonus**: Extra rewards for 100% accuracy (25% bonus)
- **Streak Bonus**: Extra rewards for consecutive daily play (15% bonus)

### **🎯 Myths vs Facts Settings**

#### **Game Configuration:**
- **Base Points per Card**: Points earned for each correct myth/fact identification
- **Base Credits per Game**: Credits earned for completing a full game
- **Cards per Game**: How many myth/fact cards in each game session
- **Time Limit**: Total time allowed to complete the game

#### **Daily Limits:**
- **Max Games per Day**: How many M&F games a user can play daily
- **Daily Points Limit**: Maximum points from M&F games per day
- **Daily Credits Limit**: Maximum credits from M&F games per day

#### **Collection System:**
- **Collection Repeatability**: How often users can replay collections (daily/weekly/unlimited)
- **Custom Collection Rewards**: Special rewards for themed collections
- **Progress Tracking**: Individual progress tracking across collections

### **💰 Rewards System Settings**

#### **Performance Multipliers:**
- **Bronze/Silver/Gold/Platinum Multipliers**: Reward multipliers based on game performance
- **Bonus Thresholds**: Performance requirements for extra bonuses
- **Tier Calculation**: How performance percentages map to tiers

#### **User Tier Multipliers:**
- **Account Level Multipliers**: Credit bonuses based on user account status
- **Tier Progression**: How users advance through account tiers
- **Credit Economics**: Overall credit earning and spending rates

#### **Special Features:**
- **Pure Scoring Mode**: Disable bonuses for fair competition
- **Event Multipliers**: Temporary bonus events
- **Seasonal Adjustments**: Holiday or special occasion bonuses

---

## 🎯 **Why Two Separate Tier Systems?**

### **Performance Tiers** solve:
- ✅ Rewarding skill and improvement
- ✅ Encouraging better performance  
- ✅ Fair competition based on ability
- ✅ Temporary, game-specific bonuses

### **User Tiers** solve:
- ✅ Long-term user retention
- ✅ Loyalty rewards for active users
- ✅ Economic balance in credit distribution
- ✅ VIP treatment for premium users

---

## 📍 **Where to Find Your New Admin Pages**

### **Now Available:**

1. **Quiz/MVF Configuration Panel**: 
   - URL: `/admin/quiz-mvf-config`
   - **Shows**: All scoring rules, limits, tiers, and calculation examples
   - **Purpose**: Read-only information for admins to understand the system

2. **Collection Management Panel**:
   - URL: `/admin/collections`  
   - **Features**: Create, edit, delete collections, analytics, bulk operations
   - **Purpose**: Full collection content management

### **How to Access:**
1. Navigate to: `http://localhost:5173/admin/quiz-mvf-config`
2. Navigate to: `http://localhost:5173/admin/collections`

---

## ✅ **What You Now Have:**

### **Frontend Admin Pages:**
- ✅ **Quiz/MVF Config**: Complete information panel showing all system settings
- ✅ **Collection Management**: Full CRUD operations for collections
- ✅ **Analytics Dashboard**: Collection performance metrics
- ✅ **Bulk Operations**: Import/export collections
- ✅ **Real-time Data**: Live collection statistics

### **Backend APIs:**
- ✅ **Collection CRUD**: Create, read, update, delete collections
- ✅ **Analytics Endpoints**: Performance data and user engagement
- ✅ **Bulk Operations**: Mass collection management
- ✅ **Progress Tracking**: User progress across collections

### **Documentation:**
- ✅ **Site Settings Guide**: This comprehensive explanation
- ✅ **API Documentation**: Complete endpoint references  
- ✅ **Admin Guides**: Step-by-step operation instructions

**Everything is now properly integrated and accessible through the admin panel!** 🎉