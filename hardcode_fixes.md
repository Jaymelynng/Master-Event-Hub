# Fixing Hardcoded Issues - Action Plan

## 🚨 Critical Hardcoded Problems & Solutions

### 1. **Make Event Types Dynamic**

**Current Problem:** Event types are hardcoded in multiple places
**Solution:** Make them database-driven

#### A. Update Types to be Dynamic
```typescript
// types/index.ts - REPLACE with:
export interface EventTypeData {
  id: string
  name: string
  display_name: string
  color: string
  is_required: boolean
  min_required: number
}

export type EventType = string // Make this dynamic instead of hardcoded union
```

#### B. Create Dynamic Color System
```typescript
// utils/eventTypeUtils.ts - NEW FILE
import { EventTypeData } from '@/types'

export const getEventTypeColor = (eventTypes: EventTypeData[], typeName: string): string => {
  const eventType = eventTypes.find(et => et.name === typeName)
  return eventType?.color || '#f3f4f6' // fallback color
}

export const getEventTypeColors = (eventTypes: EventTypeData[]): Record<string, string> => {
  return eventTypes.reduce((acc, et) => {
    acc[et.name] = et.color
    return acc
  }, {} as Record<string, string>)
}
```

#### C. Update Components to Use Dynamic Types
```typescript
// In any component using EVENT_TYPE_COLORS
const { eventTypes } = useEventTypes() // Custom hook
const eventTypeColors = getEventTypeColors(eventTypes)
```

### 2. **Fix Hardcoded Dates**

**Current Problem:** Default to 2025/June hardcoded
**Solution:** Use current date

```typescript
// app/page.tsx - REPLACE:
const now = new Date()
const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
const [selectedYear, setSelectedYear] = useState(now.getFullYear())
```

### 3. **Fix Default Fallbacks**

**Current Problem:** "July 2025" hardcoded in helpers
**Solution:** Dynamic fallbacks

```typescript
// utils/helpers.ts - REPLACE:
export const getMonthYearFromEvents = (events: Event[]): string => {
  if (events.length === 0) {
    const now = new Date()
    return `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`
  }
  // ... rest of logic
}
```

### 4. **Create Configuration System**

**New Approach:** Create a config system for easy changes

```typescript
// config/categories.ts - NEW FILE
export interface CategoryConfig {
  name: string
  displayName: string
  color: string
  isRequired: boolean
  minRequired: number
}

// This could come from environment variables or database
export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    name: 'WORKSHOP',
    displayName: 'Workshop',
    color: '#e0f2fe',
    isRequired: true,
    minRequired: 1
  },
  {
    name: 'TRAINING',
    displayName: 'Training Session', 
    color: '#f3e8ff',
    isRequired: true,
    minRequired: 2
  },
  // Add your categories here
]
```

## 🎯 **For Your Content Categories:**

### Step-by-Step Category Change:

1. **Plan Your Categories First:**
   ```
   What categories do you need?
   - Category 1: [name, color, required?]
   - Category 2: [name, color, required?]  
   - Category 3: [name, color, required?]
   ```

2. **Database Migration Script:**
   ```sql
   -- Clear old data
   DELETE FROM public.events;
   DELETE FROM public.event_types;
   
   -- Insert your new categories
   INSERT INTO public.event_types (name, display_name, color, is_required, min_required) VALUES
   ('YOUR_CATEGORY_1', 'Your Display Name 1', '#your-color-1', true, 1),
   ('YOUR_CATEGORY_2', 'Your Display Name 2', '#your-color-2', true, 2);
   ```

3. **Update Code:**
   - Remove hardcoded `EventType` union
   - Replace `EVENT_TYPE_COLORS` with dynamic system
   - Update any hardcoded category references

4. **Test Everything:**
   - Calendar view colors
   - Filtering works
   - Admin panel shows new categories
   - Statistics calculations work

## ⚠️ **Breaking Changes Warning:**

Changing categories will:
- ❌ Break existing data (all events will need new category assignments)
- ❌ Require code updates in multiple files
- ❌ Need database migration
- ❌ Invalidate any bookmarks/saved filters

## ✅ **Recommended Approach:**

1. **First:** Fix the hardcoded date issue (easy, non-breaking)
2. **Second:** Create the dynamic category system (preserving current categories)
3. **Third:** Migrate to your new categories (breaking change)

This way you can test the dynamic system with current categories before making breaking changes.

## 📞 **Need Help?**

If you want me to:
1. Create the migration scripts for your specific categories
2. Update the code to be fully dynamic
3. Help plan the transition strategy

Just tell me what categories you want and I'll create the complete migration plan!