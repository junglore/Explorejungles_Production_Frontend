# Pure Scoring Mode Setup Guide

## 🎯 Pure Scoring Mode Feature

The Pure Scoring Mode allows administrators to disable ALL multipliers and bonuses system-wide, providing a clean educational experience based purely on correct/incorrect answers.

## 📍 Location in Admin Panel

1. **Start Backend Server**:
   ```bash
   cd KE_Junglore_Backend
   python railway_start.py
   ```

2. **Access Admin Panel**:
   - Open: `http://localhost:8000/admin`
   - Login with admin credentials

3. **Navigate to Settings**:
   - Click "Settings" in the admin navigation
   - Scroll to "**Rewards System**" section
   - Find "**Pure Scoring Mode**" toggle

## ⚙️ Database Setup Required

If you don't see the Pure Scoring Mode setting:

1. **Initialize Settings Database**:
   ```bash
   cd KE_Junglore_Backend
   python setup_settings.py --init
   ```

2. **Verify Settings**:
   ```bash
   python setup_settings.py --show
   ```

## 🎮 How It Works

### When ENABLED (Pure Scoring):
- ❌ No tier multipliers
- ❌ No performance bonuses
- ❌ No streak rewards
- ✅ Only base points for correct answers
- ✅ Clean educational experience

### When DISABLED (Full Gamification):
- ✅ All tier multipliers active
- ✅ Performance bonuses
- ✅ Streak rewards
- ✅ Full engagement system

## 🔧 Technical Implementation

**Backend**: `enhanced_rewards_service.py` checks the setting and bypasses all multiplier calculations when enabled.

**Frontend**: Quiz results will show "Pure scoring mode enabled" instead of multiplier breakdowns.

**Effect**: Immediate system-wide change affecting all new quiz completions.

---

*If the setting doesn't appear in your admin panel, ensure your backend dependencies are installed and the database is properly initialized.*