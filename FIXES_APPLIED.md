🎯 **FIXES APPLIED - Ready to Test!**

## ✅ **Issue 1: Custom Points Missing from Myths & Facts Forms**

### **Fixed:**
- ✅ **Create Form**: `custom_points` field already existed, form submission now includes it
- ✅ **Edit Form**: Added `custom_points` field to the HTML form
- ✅ **Edit JavaScript**: Added `custom_points` to form submission
- ✅ **Backend Processing**: Both create and edit functions now handle `custom_points`

### **What Works Now:**
- ✅ Create myth/fact cards with custom points (1-100) or leave empty for default (5)
- ✅ Edit existing cards to add/change/remove custom points
- ✅ Custom points override default 5 points per card in rewards calculation

---

## ✅ **Issue 2: Default Credits Not Working When Empty**

### **Fixed:**
- ✅ **Category Creation**: Now properly handles empty `custom_credits` → defaults to base credits
- ✅ **Category Update**: Now properly handles empty `custom_credits` → defaults to base credits
- ✅ **Logic Change**: `custom_credits if custom_credits and custom_credits > 0 else None`

### **What Works Now:**
- ✅ Create category with empty custom credits → uses default (3 credits)
- ✅ Edit category and clear custom credits → reverts to default (3 credits)  
- ✅ Set custom credits (e.g., 15) → category uses 15 instead of default
- ✅ Display shows "3 credits (base)" vs "15 credits (custom)"

---

## 🧪 **Testing Instructions:**

### **Test Custom Points:**
1. Visit `/admin/myths-facts/create`
2. Fill form and **leave Custom Points empty** → should use default 5 points
3. Create another card with **Custom Points: 8** → should use 8 points
4. Edit existing card → **Custom Points field should appear** with current value
5. Change custom points to 12 → should update to 12 points

### **Test Default Credits:**
1. Visit `/admin/manage/categories`
2. Create new category with **empty Custom Credits** → should show "3 credits (base)"
3. Edit category and set **Custom Credits: 15** → should show "15 credits (custom)"
4. Edit again and **clear Custom Credits** → should revert to "3 credits (base)"

---

## 🎯 **Expected Results:**

### **Myths & Facts:**
- ✅ **Create**: Custom points field visible and functional
- ✅ **Edit**: Custom points field visible with current value, editable
- ✅ **Empty**: Uses default 5 points when field is empty
- ✅ **Custom**: Uses specified points (1-100) when field has value

### **Categories:**
- ✅ **Create**: Empty custom credits uses default base credits (3)
- ✅ **Edit**: Can set/change/clear custom credits properly
- ✅ **Display**: Shows "(base)" vs "(custom)" indicators correctly
- ✅ **Fallback**: Always has working credits value (never null/undefined)

---

## 🚀 **Ready to Test!**

Both issues are now fixed:
1. **Custom points** fully functional in myths/facts create & edit
2. **Default credits** properly working when custom credits is empty

**Test the admin panel now - both features should work perfectly!** 🎯