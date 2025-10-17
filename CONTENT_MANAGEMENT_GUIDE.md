# 📝 Content Management Guide

Semua text di dashboard sekarang sudah dipindahkan ke JSON untuk memudahkan maintenance dan localization.

## 📁 **File Structure**

```
src/content/agent/
├── dashboard.json          # Dashboard content
└── index.ts               # Export file
```

## 🎯 **Usage Examples**

### **Header Component:**
```typescript
import dashboardContent from "@/content/agent/dashboard.json"

// Usage
placeholder={dashboardContent.header.searchPlaceholder}
count={dashboardContent.header.notifications.count}
role={dashboardContent.header.user.role}
```

### **Sidebar Component:**
```typescript
import dashboardContent from "@/content/agent/dashboard.json"

// Usage
label={dashboardContent.sidebar.navigation.dashboard}
logout={dashboardContent.sidebar.logout}
```

### **Dashboard Content:**
```typescript
import dashboardContent from "@/content/agent/dashboard.json"

// Usage
title={dashboardContent.dashboard.welcome}
subtitle={dashboardContent.dashboard.title}
alertTitle={dashboardContent.dashboard.highPriorityAlert.title}
```

## 📋 **Content Structure**

### **Header Section:**
- `searchPlaceholder`: Search input placeholder
- `notifications.count`: Notification badge count
- `user.role`: User role display text
- `user.profile`: Profile menu item
- `user.logout`: Logout menu item

### **Sidebar Section:**
- `navigation.*`: All navigation menu items
- `logout`: Logout button text

### **Dashboard Section:**
- `title`: Main dashboard title
- `welcome`: Welcome message
- `topPerformers`: Top performers section title
- `headOffice`: Head office section title
- `highPriorityAlert.*`: Alert messages
- `stats.*`: Statistics labels
- `actions.*`: Action button labels
- `recentActivity.*`: Activity-related text
- `performance.*`: Performance metrics
- `alerts.*`: Alert messages
- `quickStats.*`: Quick stats labels

### **Common Section:**
- Reusable UI text (buttons, labels, etc.)
- Loading states
- Error messages
- Action buttons

## 🔧 **Adding New Content**

### **1. Add to JSON:**
```json
{
  "newSection": {
    "title": "New Section Title",
    "description": "Description text",
    "button": "Button Text"
  }
}
```

### **2. Use in Component:**
```typescript
import dashboardContent from "@/content/agent/dashboard.json"

// Usage
<h1>{dashboardContent.newSection.title}</h1>
<p>{dashboardContent.newSection.description}</p>
<button>{dashboardContent.newSection.button}</button>
```

## 🌍 **Localization Ready**

Structure ini sudah siap untuk localization:

```typescript
// Future: Multiple language support
import dashboardContent from "@/content/agent/dashboard-id.json"  // Indonesian
import dashboardContent from "@/content/agent/dashboard-en.json"  // English
```

## ✅ **Benefits**

1. **Easy Maintenance:** Update text tanpa touch code
2. **Consistency:** Centralized text management
3. **Localization Ready:** Easy to add multiple languages
4. **Type Safety:** TypeScript support
5. **Developer Experience:** Clear structure dan naming

## 🚀 **Next Steps**

1. **Add more sections** as needed
2. **Create language variants** (ID/EN)
3. **Add validation** for required fields
4. **Create content management UI** (optional)

---

**Content management system siap digunakan!** 🎉
