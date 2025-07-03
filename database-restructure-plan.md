# Complete Database Restructure Plan

## 🎯 Target Structure (The Right Way)

### Current vs. Target Comparison

| **Current (Broken)** | **Target (Proper)** |
|----------------------|---------------------|
| `gym_name: "Capital Gymnastics - Cedar Park"` | `gym_id: "6cc3f673-36df-4020-8ca4-6c97b068faaa"` |
| `event_type: "Summer Camp"` | `event_type_id: "ffbe59f6-087f-46d0-9687-842c500aff32"` |
| `day_of_week: "Monday"` (stored) | Calculated from `event_date` |
| No foreign key constraints | Proper FK constraints |

### 📊 Target Schema

```sql
-- 1. GYMS TABLE (Already correct)
CREATE TABLE gyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  booking_page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EVENT_TYPES TABLE (Already correct)
CREATE TABLE event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  color TEXT NOT NULL,
  is_required BOOLEAN DEFAULT FALSE,
  min_required INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EVENTS TABLE (NEEDS MAJOR RESTRUCTURE)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  event_type_id UUID NOT NULL REFERENCES event_types(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  price TEXT,
  specific_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Remove these problematic columns:
-- gym_name (use foreign key instead)
-- event_type (use foreign key instead) 
-- day_of_week (calculate from event_date)

-- 4. UPDATED VIEWS
CREATE OR REPLACE VIEW events_with_details AS
SELECT 
    e.id,
    e.title,
    e.event_date,
    e.event_time,
    e.price,
    -- Calculate day of week instead of storing it
    CASE EXTRACT(DOW FROM e.event_date)
      WHEN 0 THEN 'Sunday'
      WHEN 1 THEN 'Monday'
      WHEN 2 THEN 'Tuesday'
      WHEN 3 THEN 'Wednesday'
      WHEN 4 THEN 'Thursday'
      WHEN 5 THEN 'Friday'
      WHEN 6 THEN 'Saturday'
    END as day_of_week,
    e.specific_url,
    e.created_at,
    e.updated_at,
    -- Join gym data
    g.name as gym_name,
    g.address as gym_address,
    g.phone as gym_phone,
    g.booking_page_url as gym_booking_page,
    -- Join event type data
    et.name as event_type,
    et.display_name as event_type_display,
    et.color as event_type_color,
    et.is_required,
    et.min_required,
    -- Additional useful fields
    e.gym_id,
    e.event_type_id
FROM events e
JOIN gyms g ON e.gym_id = g.id
JOIN event_types et ON e.event_type_id = et.id;
```

## 🚨 Migration Strategy: Clean Rebuild (Safest)

### Phase 1: Backup Everything
```sql
-- 1. Export current data for safety
SELECT * FROM events; -- Save this output
SELECT * FROM gyms;   -- Save this output  
SELECT * FROM event_types; -- Save this output
```

### Phase 2: Create Mapping Tables
```sql
-- Create temporary mapping tables to convert strings to UUIDs
CREATE TEMP TABLE gym_name_mapping AS
SELECT id, name FROM gyms;

CREATE TEMP TABLE event_type_name_mapping AS
SELECT id, name FROM event_types;

-- Verify mappings work
SELECT DISTINCT e.gym_name, g.id 
FROM events e 
LEFT JOIN gym_name_mapping g ON e.gym_name = g.name
WHERE g.id IS NULL; -- Should return empty (all gyms found)

SELECT DISTINCT e.event_type, et.id 
FROM events e 
LEFT JOIN event_type_name_mapping et ON e.event_type = et.name  
WHERE et.id IS NULL; -- Should return empty (all event types found)
```

### Phase 3: Restructure Events Table
```sql
-- 1. Create backup of current events
CREATE TABLE events_backup AS SELECT * FROM events;

-- 2. Drop the problematic events table
DROP TABLE events CASCADE;

-- 3. Recreate with proper structure
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  event_type_id UUID NOT NULL REFERENCES event_types(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  price TEXT,
  specific_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Add indexes for performance
CREATE INDEX idx_events_gym_id ON events(gym_id);
CREATE INDEX idx_events_event_type_id ON events(event_type_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_created_at ON events(created_at);
```

### Phase 4: Migrate Data with Proper Foreign Keys
```sql
-- Recreate temporary mappings (they were dropped with CASCADE)
CREATE TEMP TABLE gym_name_mapping AS
SELECT id, name FROM gyms;

CREATE TEMP TABLE event_type_name_mapping AS
SELECT id, name FROM event_types;

-- Insert data with proper foreign keys
INSERT INTO events (
    gym_id,
    event_type_id, 
    title,
    event_date,
    event_time,
    price,
    specific_url,
    created_at
)
SELECT 
    g.id as gym_id,
    et.id as event_type_id,
    eb.title,
    eb.event_date::DATE,
    eb.event_time,
    eb.price,
    eb.specific_url,
    eb.created_at
FROM events_backup eb
JOIN gym_name_mapping g ON eb.gym_name = g.name
JOIN event_type_name_mapping et ON eb.event_type = et.name;

-- Verify migration worked
SELECT COUNT(*) as migrated_events FROM events;
SELECT COUNT(*) as original_events FROM events_backup;
-- These should match!
```

### Phase 5: Recreate Views and Functions
```sql
-- Recreate the events_with_details view
CREATE OR REPLACE VIEW events_with_details AS
SELECT 
    e.id,
    e.title,
    e.event_date,
    e.event_time,
    e.price,
    CASE EXTRACT(DOW FROM e.event_date)
      WHEN 0 THEN 'Sunday'
      WHEN 1 THEN 'Monday'
      WHEN 2 THEN 'Tuesday'
      WHEN 3 THEN 'Wednesday'
      WHEN 4 THEN 'Thursday'
      WHEN 5 THEN 'Friday'
      WHEN 6 THEN 'Saturday'
    END as day_of_week,
    e.specific_url,
    e.created_at,
    e.updated_at,
    g.name as gym_name,
    g.address as gym_address,
    g.phone as gym_phone,
    g.booking_page_url as gym_booking_page,
    et.name as event_type,
    et.display_name as event_type_display,
    et.color as event_type_color,
    et.is_required,
    et.min_required,
    e.gym_id,
    e.event_type_id
FROM events e
JOIN gyms g ON e.gym_id = g.id
JOIN event_types et ON e.event_type_id = et.id;

-- Recreate gym_statistics view
CREATE OR REPLACE VIEW gym_statistics AS
SELECT 
    g.id as gym_id,
    g.name as gym_name,
    g.address,
    g.phone,
    g.booking_page_url,
    COUNT(e.id) as total_events,
    COUNT(CASE WHEN et.name = 'KIDS NIGHT OUT' THEN 1 END) as kno_count,
    COUNT(CASE WHEN et.name = 'CLINIC' THEN 1 END) as clinic_count,
    COUNT(CASE WHEN et.name = 'OPEN GYM' THEN 1 END) as open_gym_count,
    COUNT(CASE WHEN et.name = 'Summer Camp' THEN 1 END) as summer_camp_count,
    -- Calculate required events (sum of min_required for required types)
    (SELECT SUM(min_required) FROM event_types WHERE is_required = true) as monthly_required_events,
    -- Check if meets requirements
    (COUNT(CASE WHEN et.name = 'KIDS NIGHT OUT' THEN 1 END) >= 
     COALESCE((SELECT min_required FROM event_types WHERE name = 'KIDS NIGHT OUT'), 0)
     AND
     COUNT(CASE WHEN et.name = 'CLINIC' THEN 1 END) >= 
     COALESCE((SELECT min_required FROM event_types WHERE name = 'CLINIC'), 0)
     AND
     COUNT(CASE WHEN et.name = 'OPEN GYM' THEN 1 END) >= 
     COALESCE((SELECT min_required FROM event_types WHERE name = 'OPEN GYM'), 0)
    ) as meets_requirements
FROM gyms g
LEFT JOIN events e ON g.id = e.gym_id
LEFT JOIN event_types et ON e.event_type_id = et.id
GROUP BY g.id, g.name, g.address, g.phone, g.booking_page_url;
```

## 🛡️ Safety Measures

### Before Migration
1. **Full Database Backup**
```bash
# Export entire database
pg_dump your_db_url > full_backup_$(date +%Y%m%d).sql
```

2. **Data Export Scripts**
```sql
-- Export current events to CSV
COPY (SELECT * FROM events) TO '/tmp/events_backup.csv' WITH CSV HEADER;
COPY (SELECT * FROM gyms) TO '/tmp/gyms_backup.csv' WITH CSV HEADER;
COPY (SELECT * FROM event_types) TO '/tmp/event_types_backup.csv' WITH CSV HEADER;
```

### Rollback Plan
```sql
-- If something goes wrong, restore from backup
DROP TABLE events;
CREATE TABLE events AS SELECT * FROM events_backup;
-- Then recreate views manually
```

## 🧪 Testing Strategy

### 1. Test Queries After Migration
```sql
-- Test basic queries work
SELECT COUNT(*) FROM events_with_details;
SELECT * FROM gym_statistics;

-- Test foreign key constraints
INSERT INTO events (gym_id, event_type_id, title, event_date) 
VALUES ('invalid-uuid', 'invalid-uuid', 'Test', '2025-01-01'); 
-- Should fail with FK constraint error

-- Test calculated day_of_week
SELECT event_date, day_of_week FROM events_with_details LIMIT 10;
```

### 2. Application Testing
- Calendar view loads properly
- Month navigation works
- Event filtering by gym/type works
- Statistics are accurate

## 📈 Benefits After Restructure

### ✅ **Fixed Issues**
1. **Data Integrity**: Foreign key constraints prevent invalid references
2. **Performance**: Proper indexes on foreign keys
3. **Storage Efficiency**: No repeated gym/event type names
4. **Maintainability**: Single source of truth for gym/event type data
5. **Type Safety**: Consistent UUID types throughout

### ✅ **New Capabilities**
1. **Easy Gym Management**: Change gym name once, updates everywhere
2. **Event Type Evolution**: Modify event types without touching events
3. **Better Queries**: Join-based queries are more flexible
4. **Scalability**: Proper normalization supports growth
5. **Data Validation**: Constraints prevent bad data

## 🚀 Execution Steps

### Step 1: Prepare (5 minutes)
```bash
# 1. Backup everything
# 2. Test migration script on copy of data
# 3. Schedule maintenance window
```

### Step 2: Execute Migration (15 minutes)
```sql
-- Run the Phase 1-5 SQL scripts above
```

### Step 3: Validate (10 minutes)
```sql
-- Run testing queries
-- Check application functionality
```

### Step 4: Clean Up (5 minutes)
```sql
-- Drop backup tables if everything works
DROP TABLE events_backup;
```

**Total Downtime**: ~35 minutes

## ⚡ Quick Start

I can create an automated migration script that does all of this safely. Would you like me to:

1. **Create the migration script**
2. **Test it on your current data**
3. **Provide rollback procedures**
4. **Update your application code** to work with the new structure

The restructure is **100% doable** and will solve all your current confusion!