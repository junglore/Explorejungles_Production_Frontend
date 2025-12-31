# 🎯 Pure Scoring Mode - Admin Panel Guide

## 📍 **EXACT LOCATION IN ADMIN PANEL**

### Step 1: Access Admin Panel
1. **Backend must be running**: `python railway_start.py`
2. **Open**: http://localhost:8000/admin
3. **Login** with your admin credentials

### Step 2: Navigate to Settings
1. Click **"Settings"** in the admin navigation menu
2. Look for the **"Rewards System"** section (scroll down if needed)
3. Find the setting labeled: **"Pure Scoring Mode"**

### Step 3: Toggle the Setting
- **Description**: "Disable all multipliers and bonuses, award points only based on correct answers"
- **Toggle ON**: Pure scoring mode (no multipliers)
- **Toggle OFF**: Full gamification system

---

## 🔧 **If You Don't See the Setting**

The setting might not be in your database yet. Run this command:

```bash
cd KE_Junglore_Backend
python setup_settings.py --init
```

This will add the Pure Scoring Mode setting to your database.

---

## 🎮 **What Pure Scoring Mode Does**

### ✅ **ENABLED** (Pure Educational Mode):
- Base points only: Answer 2 questions correctly = 20 points (10 each)
- No tier multipliers (Bronze/Silver/Gold)
- No performance bonuses
- No streak rewards
- Clean, educational experience

### ❌ **DISABLED** (Full Gamification):
- Base + multipliers: Answer 2 questions correctly = 62 points (20 × 3.1x)
- All tier bonuses active
- Performance multipliers
- Streak rewards
- Full engagement system

---

## 🔍 **Troubleshooting**

### Problem: "I don't see Pure Scoring Mode in Settings"
**Solution**: Run the database initialization:
```bash
python setup_settings.py --init
```

### Problem: "Settings page is empty"
**Solution**: Check if your backend database is connected and initialized.

### Problem: "Admin panel won't load"
**Solution**: Ensure backend is running on port 8000.

---

## 💡 **Pro Tip**

The setting takes effect **immediately** for all new quiz completions. Users will see either:
- **Pure mode**: "Base: 20 points earned"
- **Gamified mode**: "Base: 20 × 3.1x = 62 points"

---

**🎯 The Pure Scoring Mode setting is in: Admin Panel → Settings → Rewards System section**