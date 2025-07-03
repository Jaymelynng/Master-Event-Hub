-- ============================================================================
-- COMPLETE DATABASE RESTRUCTURE MIGRATION SCRIPT
-- ============================================================================
-- This script safely migrates from the broken current structure to proper
-- normalized structure with foreign keys and calculated fields.
--
-- IMPORTANT: Run this during a maintenance window
-- Estimated execution time: ~15 minutes  
-- Estimated downtime: ~35 minutes total (including testing)
--
-- BACKUP YOUR DATABASE BEFORE RUNNING THIS!
-- ============================================================================

BEGIN;

-- ============================================================================
-- PHASE 1: VALIDATION AND BACKUP
-- ============================================================================

-- Check if we're in the expected broken state
DO $$
DECLARE
    has_gym_name BOOLEAN;
    has_event_type BOOLEAN;
    has_day_of_week BOOLEAN;
BEGIN
    -- Check if events table has the problematic columns
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'gym_name'
    ) INTO has_gym_name;
    
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'event_type'
    ) INTO has_event_type;
    
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'day_of_week'
    ) INTO has_day_of_week;
    
    IF NOT (has_gym_name AND has_event_type AND has_day_of_week) THEN
        RAISE EXCEPTION 'Events table does not have expected columns. Migration may have already been run or table structure is different than expected.';
    END IF;
    
    RAISE NOTICE 'Phase 1: Validation passed - found expected broken structure';
END $$;

-- Create full backup of current events table
DROP TABLE IF EXISTS events_backup_migration;
CREATE TABLE events_backup_migration AS SELECT * FROM events;

-- Count current records for verification
DO $$
DECLARE
    event_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO event_count FROM events_backup_migration;
    RAISE NOTICE 'Phase 1: Backed up % events', event_count;
END $$;

-- ============================================================================
-- PHASE 2: CREATE MAPPING TABLES
-- ============================================================================

-- Create temporary mapping tables to convert strings to UUIDs
DROP TABLE IF EXISTS temp_gym_mapping;
CREATE TEMP TABLE temp_gym_mapping AS
SELECT id, name FROM gyms;

DROP TABLE IF EXISTS temp_event_type_mapping;  
CREATE TEMP TABLE temp_event_type_mapping AS
SELECT id, name FROM event_types;

-- Verify all gym names in events exist in gyms table
DO $$
DECLARE
    unmapped_gyms TEXT;
BEGIN
    SELECT string_agg(DISTINCT e.gym_name, ', ') 
    INTO unmapped_gyms
    FROM events e 
    LEFT JOIN temp_gym_mapping g ON e.gym_name = g.name
    WHERE g.id IS NULL;
    
    IF unmapped_gyms IS NOT NULL THEN
        RAISE EXCEPTION 'Found unmapped gym names: %', unmapped_gyms;
    END IF;
    
    RAISE NOTICE 'Phase 2: All gym names validated';
END $$;

-- Verify all event types in events exist in event_types table
DO $$
DECLARE
    unmapped_types TEXT;
BEGIN
    SELECT string_agg(DISTINCT e.event_type, ', ')
    INTO unmapped_types
    FROM events e 
    LEFT JOIN temp_event_type_mapping et ON e.event_type = et.name  
    WHERE et.id IS NULL;
    
    IF unmapped_types IS NOT NULL THEN
        RAISE EXCEPTION 'Found unmapped event types: %', unmapped_types;
    END IF;
    
    RAISE NOTICE 'Phase 2: All event types validated';
END $$;

-- ============================================================================
-- PHASE 3: RESTRUCTURE EVENTS TABLE
-- ============================================================================

-- Drop existing views that depend on events table
DROP VIEW IF EXISTS events_with_details CASCADE;
DROP VIEW IF EXISTS gym_statistics CASCADE;

-- Drop the problematic events table
DROP TABLE events CASCADE;

-- Recreate events table with proper structure
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL,
    event_type_id UUID NOT NULL,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TEXT,
    price TEXT,
    specific_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE events 
ADD CONSTRAINT fk_events_gym_id 
FOREIGN KEY (gym_id) REFERENCES gyms(id) ON DELETE CASCADE;

ALTER TABLE events 
ADD CONSTRAINT fk_events_event_type_id 
FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE RESTRICT;

-- Add performance indexes
CREATE INDEX idx_events_gym_id ON events(gym_id);
CREATE INDEX idx_events_event_type_id ON events(event_type_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_created_at ON events(created_at);

RAISE NOTICE 'Phase 3: Events table restructured with proper foreign keys';

-- ============================================================================
-- PHASE 4: MIGRATE DATA WITH PROPER FOREIGN KEYS
-- ============================================================================

-- Recreate mapping tables (they were dropped with CASCADE)
DROP TABLE IF EXISTS temp_gym_mapping;
CREATE TEMP TABLE temp_gym_mapping AS
SELECT id, name FROM gyms;

DROP TABLE IF EXISTS temp_event_type_mapping;
CREATE TEMP TABLE temp_event_type_mapping AS
SELECT id, name FROM event_types;

-- Insert data with proper foreign keys
INSERT INTO events (
    id,
    gym_id,
    event_type_id, 
    title,
    event_date,
    event_time,
    price,
    specific_url,
    created_at,
    updated_at
)
SELECT 
    eb.id,
    g.id as gym_id,
    et.id as event_type_id,
    eb.title,
    eb.event_date::DATE,
    eb.event_time,
    eb.price,
    eb.specific_url,
    eb.created_at,
    COALESCE(eb.updated_at, eb.created_at)
FROM events_backup_migration eb
JOIN temp_gym_mapping g ON eb.gym_name = g.name
JOIN temp_event_type_mapping et ON eb.event_type = et.name;

-- Verify migration worked
DO $$
DECLARE
    migrated_count INTEGER;
    original_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO migrated_count FROM events;
    SELECT COUNT(*) INTO original_count FROM events_backup_migration;
    
    IF migrated_count != original_count THEN
        RAISE EXCEPTION 'Migration failed: expected % events but got %', original_count, migrated_count;
    END IF;
    
    RAISE NOTICE 'Phase 4: Successfully migrated % events with proper foreign keys', migrated_count;
END $$;

-- ============================================================================
-- PHASE 5: RECREATE VIEWS AND FUNCTIONS
-- ============================================================================

-- Recreate events_with_details view with calculated day_of_week
CREATE VIEW events_with_details AS
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
    -- Include foreign keys for application use
    e.gym_id,
    e.event_type_id
FROM events e
JOIN gyms g ON e.gym_id = g.id
JOIN event_types et ON e.event_type_id = et.id;

-- Recreate gym_statistics view  
CREATE VIEW gym_statistics AS
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

RAISE NOTICE 'Phase 5: Views recreated successfully';

-- ============================================================================
-- PHASE 6: VALIDATION AND TESTING
-- ============================================================================

-- Test basic queries
DO $$
DECLARE
    view_count INTEGER;
    stats_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count FROM events_with_details;
    SELECT COUNT(*) INTO stats_count FROM gym_statistics;
    
    RAISE NOTICE 'Phase 6: Validation - events_with_details has % rows', view_count;
    RAISE NOTICE 'Phase 6: Validation - gym_statistics has % rows', stats_count;
END $$;

-- Test foreign key constraints work
DO $$
BEGIN
    BEGIN
        INSERT INTO events (gym_id, event_type_id, title, event_date) 
        VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Test', '2025-01-01');
        RAISE EXCEPTION 'Foreign key constraint test failed - invalid insert succeeded';
    EXCEPTION 
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'Phase 6: Foreign key constraints working correctly';
    END;
END $$;

-- Test calculated day_of_week
DO $$
DECLARE
    test_record RECORD;
BEGIN
    SELECT event_date, day_of_week 
    INTO test_record
    FROM events_with_details 
    LIMIT 1;
    
    RAISE NOTICE 'Phase 6: Sample calculated day_of_week: % = %', test_record.event_date, test_record.day_of_week;
END $$;

-- ============================================================================
-- PHASE 7: CLEANUP AND FINALIZATION
-- ============================================================================

-- Create a permanent backup table for safety (can be dropped later)
DROP TABLE IF EXISTS events_pre_migration_backup;
CREATE TABLE events_pre_migration_backup AS 
SELECT * FROM events_backup_migration;

-- Clean up temporary backup
DROP TABLE events_backup_migration;

-- Update table statistics for query planner
ANALYZE events;
ANALYZE gyms;
ANALYZE event_types;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
DECLARE
    final_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO final_count FROM events_with_details;
    
    RAISE NOTICE '=== MIGRATION COMPLETED SUCCESSFULLY ===';
    RAISE NOTICE 'Total events migrated: %', final_count;
    RAISE NOTICE 'Structure: Proper foreign keys implemented';
    RAISE NOTICE 'Performance: Indexes created on foreign keys';
    RAISE NOTICE 'Views: Recreated with calculated fields';
    RAISE NOTICE 'Backup: Available in events_pre_migration_backup table';
    RAISE NOTICE '========================================';
END $$;

COMMIT;

-- ============================================================================
-- POST-MIGRATION VERIFICATION QUERIES
-- ============================================================================

-- Run these queries after migration to verify everything works:

-- 1. Check event counts by month
SELECT 
    EXTRACT(YEAR FROM event_date) as year,
    EXTRACT(MONTH FROM event_date) as month,
    COUNT(*) as event_count
FROM events_with_details 
GROUP BY EXTRACT(YEAR FROM event_date), EXTRACT(MONTH FROM event_date)
ORDER BY year, month;

-- 2. Check gym statistics
SELECT gym_name, total_events, kno_count, clinic_count, open_gym_count, summer_camp_count
FROM gym_statistics
ORDER BY total_events DESC;

-- 3. Test calculated day_of_week accuracy
SELECT event_date, day_of_week, 
       EXTRACT(DOW FROM event_date) as dow_number
FROM events_with_details 
LIMIT 10;

-- 4. Verify foreign key relationships
SELECT 
    COUNT(*) as total_events,
    COUNT(DISTINCT gym_id) as unique_gyms,
    COUNT(DISTINCT event_type_id) as unique_event_types
FROM events;

-- ============================================================================
-- ROLLBACK PROCEDURE (if needed)
-- ============================================================================

-- If something goes wrong, run this to rollback:
/*
BEGIN;
DROP TABLE events CASCADE;
CREATE TABLE events AS SELECT * FROM events_pre_migration_backup;
-- Manually recreate old views if needed
COMMIT;
*/