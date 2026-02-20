-- Drop check constraints that are blocking new enum values from being saved.
-- This is necessary because Hibernate's ddl-auto=update doesn't automatically 
-- update existing CHECK constraints when enum values are added in code.

ALTER TABLE chapters DROP CONSTRAINT IF EXISTS chapters_chapter_type_check;
ALTER TABLE internal_messages DROP CONSTRAINT IF EXISTS internal_messages_priority_check;
ALTER TABLE internal_messages DROP CONSTRAINT IF EXISTS internal_messages_visibility_check;
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_membership_status_check;
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_educational_level_check;
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_working_sector_check;
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_gender_check;
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_educational_level_check;
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;
