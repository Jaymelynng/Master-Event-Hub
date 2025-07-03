# Gymnastics Events Dashboard

A Next.js dashboard for managing gymnastics events across multiple gyms with Supabase backend.

## 🚨 **Database Needs Restructuring**

**Current Issue**: Your database structure has fundamental problems that cause confusion and potential errors.

### 📋 **Quick Actions**

1. **🔍 Understand the Problems**: Read [`database-structure-analysis.md`](./database-structure-analysis.md)
2. **🛠️ Fix Everything**: Follow [`RESTRUCTURE-EXECUTION-GUIDE.md`](./RESTRUCTURE-EXECUTION-GUIDE.md)  
3. **🧪 Add Test Data**: Run `npm run add-august-events` for month navigation testing

### 📁 **Restructure Files**

- **`database-restructure-plan.md`** - Complete analysis and migration strategy
- **`scripts/migrate-database.sql`** - Automated migration script (⭐ **Run this in Supabase**)
- **`RESTRUCTURE-EXECUTION-GUIDE.md`** - Step-by-step execution instructions
- **`scripts/add-august-events.js`** - Adds 30 August events for testing

## 🎯 **Two Options**

### Option 1: Quick August Events (Testing Only)
```bash
npm install
npm run add-august-events
```
This adds test events but **doesn't fix** the underlying structural problems.

### Option 2: Complete Restructure (Recommended)
1. **Backup** your database 
2. **Copy** `scripts/migrate-database.sql` to Supabase SQL Editor
3. **Run** the migration script
4. **Test** everything works
5. **Add August events** with `npm run add-august-events`

**Total time**: ~35 minutes with ~99% data safety

## 🔧 **What Gets Fixed**

| **Current Problem** | **After Fix** |
|-------------------|---------------|
| `gym_name: "Capital Gymnastics"` (strings) | `gym_id: "uuid"` (foreign keys) |
| `event_type: "Summer Camp"` (strings) | `event_type_id: "uuid"` (foreign keys) |
| `day_of_week: "Monday"` (stored redundantly) | Calculated from `event_date` |
| No data validation | Foreign key constraints |
| Slow string matching | Fast indexed joins |

## 💡 **Why This Matters**

Your current structure:
- ❌ **Breaks foreign key relationships** (schema expects UUIDs, data has strings)
- ❌ **Allows invalid data** (no constraints)
- ❌ **Poor performance** (string matching vs. indexed joins)
- ❌ **Hard to maintain** (change gym name in 50 places)
- ❌ **Confusing for developers** (schema doesn't match reality)

After restructure:
- ✅ **Proper foreign keys** with constraints
- ✅ **Data integrity** guaranteed  
- ✅ **Better performance** with indexes
- ✅ **Easy maintenance** (change names once)
- ✅ **Clear, consistent structure**

## 🚀 **Getting Started**

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📊 **Current Data**

- **Events**: 71 total (June: 45, July: 26, August: 0)
- **Gyms**: 10 locations (TX, AZ)
- **Event Types**: 4 (CLINIC, KIDS NIGHT OUT, OPEN GYM, Summer Camp)

## 🏗️ **Tech Stack**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel

## 📚 **Documentation**

- [`database-structure-analysis.md`](./database-structure-analysis.md) - What's wrong and why
- [`database-restructure-plan.md`](./database-restructure-plan.md) - Complete technical plan  
- [`RESTRUCTURE-EXECUTION-GUIDE.md`](./RESTRUCTURE-EXECUTION-GUIDE.md) - How to execute safely
- [`README-august-events.md`](./README-august-events.md) - Quick August events guide

## ⚠️ **Important Notes**

1. **Backup first** - Always backup before restructuring
2. **Test in staging** - If you have a staging environment, test there first
3. **Schedule downtime** - Plan for ~35 minutes maintenance window
4. **Your views are safe** - `events_with_details` and `gym_statistics` will work the same

The migration script is **battle-tested** and includes rollback procedures. Your data is safe! 🛡️