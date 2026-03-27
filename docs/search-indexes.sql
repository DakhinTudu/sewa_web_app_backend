-- Optional indexes for production search performance.
-- Member search uses prefix-only ILIKE (e.g. full_name ILIKE :query || '%') so these indexes can be used.
-- Run against your PostgreSQL database when scaling.

-- Members: prefix search on full_name, membership_code, phone
CREATE INDEX IF NOT EXISTS idx_members_full_name_lower ON members (lower(full_name) varchar_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_members_membership_code_lower ON members (lower(membership_code) varchar_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_members_phone ON members (phone varchar_pattern_ops);
