# 🚀 Database Restructure Execution Guide

## 📋 Pre-Migration Checklist

### ⚠️ CRITICAL: Backup First!
```bash
# 1. Export full database backup
# Replace with your actual Supabase connection string
pg_dump "postgresql://user:pass@host:port/database" > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Export events data as CSV (backup of current broken structure)
# Run this in Supabase SQL Editor:
```

```sql
-- Export current data for emergency rollback
COPY (SELECT * FROM events) TO 'events_backup.csv' WITH CSV HEADER;
COPY (SELECT * FROM gyms) TO 'gyms_backup.csv' WITH CSV HEADER;
COPY (SELECT * FROM event_types) TO 'event_types_backup.csv' WITH CSV HEADER;
```

### ✅ Prerequisites Check
- [ ] **Database backup completed**
- [ ] **Maintenance window scheduled** (~35 minutes total)
- [ ] **Application temporarily offline** (to prevent new writes during migration)
- [ ] **Supabase SQL Editor access** ready

## 🎯 Migration Methods

### Method 1: Automated SQL Script (Recommended)

**Execute the complete migration script:**

1. **Open Supabase Dashboard** → Your Project → SQL Editor
2. **Copy entire contents** of `scripts/migrate-database.sql`
3. **Paste and run** the migration script
4. **Watch the progress** messages in the output
5. **Verify success** with post-migration queries

**Expected Output:**
```
NOTICE: Phase 1: Validation passed - found expected broken structure
NOTICE: Phase 1: Backed up 71 events
NOTICE: Phase 2: All gym names validated
NOTICE: Phase 2: All event types validated
NOTICE: Phase 3: Events table restructured with proper foreign keys
NOTICE: Phase 4: Successfully migrated 71 events with proper foreign keys
NOTICE: Phase 5: Views recreated successfully
NOTICE: Phase 6: Validation - events_with_details has 71 rows
NOTICE: Phase 6: Foreign key constraints working correctly
NOTICE: === MIGRATION COMPLETED SUCCESSFULLY ===
```

### Method 2: Manual Step-by-Step

If you prefer to run each phase separately for more control:

1. **Phase 1: Backup & Validation**
```sql
-- Run Phase 1 section from migrate-database.sql
```

2. **Phase 2: Create Mappings**
```sql
-- Run Phase 2 section from migrate-database.sql
```

3. **Continue with remaining phases...**

## 🧪 Post-Migration Validation

### 1. Quick Verification Queries
Run these in Supabase SQL Editor after migration:

```sql
-- 1. Check total event counts match
SELECT COUNT(*) as current_events FROM events_with_details;
SELECT COUNT(*) as backup_events FROM events_pre_migration_backup;

-- 2. Verify month distribution
SELECT 
    EXTRACT(YEAR FROM event_date) as year,
    EXTRACT(MONTH FROM event_date) as month,
    COUNT(*) as event_count
FROM events_with_details 
GROUP BY 1, 2 ORDER BY 1, 2;

-- 3. Test calculated day_of_week
SELECT event_date, day_of_week FROM events_with_details LIMIT 5;

-- 4. Check foreign key constraints
SELECT 
    COUNT(*) as total_events,
    COUNT(DISTINCT gym_id) as unique_gyms,
    COUNT(DISTINCT event_type_id) as unique_event_types
FROM events;
```

### 2. Application Testing Checklist
- [ ] **Dashboard loads** without errors
- [ ] **Calendar view** displays events correctly  
- [ ] **Month navigation** works (June ↔ July ↔ August)
- [ ] **Event filtering** by gym/type functions
- [ ] **Statistics panel** shows accurate counts
- [ ] **Event details** load properly

## 🔄 What Changed After Migration

### ✅ **Fixed Structure**
| **Before (Broken)** | **After (Proper)** |
|-------------------|------------------|
| `gym_name: "Capital Gymnastics"` | `gym_id: "6cc3f673-36df-4020-8ca4-6c97b068faaa"` |
| `event_type: "Summer Camp"` | `event_type_id: "ffbe59f6-087f-46d0-9687-842c500aff32"` |
| `day_of_week: "Monday"` (stored) | Calculated from `event_date` |

### ✅ **New Capabilities**
- **Foreign Key Constraints**: Prevents invalid gym/event type references
- **Performance Indexes**: Faster queries on gym_id, event_type_id, date
- **Calculated Fields**: `day_of_week` computed dynamically
- **Data Integrity**: Single source of truth for gym/event type names

### ✅ **Views Enhanced**
- `events_with_details` now includes `gym_id` and `event_type_id` 
- `gym_statistics` uses proper joins instead of string matching
- Both views work with proper foreign key relationships

## ⚡ Next Steps After Migration

### 1. Add August Events (Optional)
```bash
# Now that structure is fixed, add test events for month navigation
npm run add-august-events
```

### 2. Update Your Application Code (If Needed)
The views (`events_with_details`, `gym_statistics`) maintain the same interface, so your existing code should work without changes. However, you now have access to proper foreign keys if you want to use them:

```typescript
// Before: Only had strings
event.gym_name // "Capital Gymnastics - Cedar Park" 

// After: Now have both string names AND foreign keys
event.gym_name    // "Capital Gymnastics - Cedar Park" (same as before)
event.gym_id      // "6cc3f673-36df-4020-8ca4-6c97b068faaa" (NEW!)
```

### 3. Clean Up Backup (After Testing)
```sql
-- After 24-48 hours of successful operation, remove the backup
DROP TABLE events_pre_migration_backup;
```

## 🆘 Emergency Rollback

If something goes critically wrong:

### Quick Rollback
```sql
BEGIN;
DROP TABLE events CASCADE;
CREATE TABLE events AS SELECT * FROM events_pre_migration_backup;
-- Note: You'll need to manually recreate the old views
COMMIT;
```

### Full Database Restore
```bash
# Restore from the full backup you made
psql "your_database_url" < backup_YYYYMMDD_HHMMSS.sql
```

## 📊 Migration Impact Summary

### **Data**: Zero Loss ✅
- All 71 events preserved
- All gym and event type data intact
- IDs maintained (no new UUIDs generated)

### **Performance**: Improved ✅
- Foreign key indexes added
- Optimized join queries
- Better query planning

### **Reliability**: Much Better ✅
- Foreign key constraints prevent bad data
- Normalized structure reduces redundancy
- Calculated fields eliminate inconsistencies

### **Maintainability**: Greatly Improved ✅
- Change gym name once, updates everywhere
- Add new event types without touching events
- Clear relationships between tables

## 🎉 Success Criteria

Migration is successful when:
- [ ] All original events are present in `events_with_details`
- [ ] Calendar displays events correctly for June, July, August
- [ ] Foreign key constraints are working (test queries fail appropriately)
- [ ] Application functionality is fully restored
- [ ] No data loss or corruption detected

**Total Expected Downtime: ~35 minutes**

## 🤝 Support

If you encounter issues during migration:
1. **Don't panic** - you have backups
2. **Check the error messages** in SQL Editor output
3. **Use the rollback procedures** if needed
4. **Test step-by-step** if the automated script fails

The migration script is designed to be **safe and reversible**. Your data is protected throughout the process.