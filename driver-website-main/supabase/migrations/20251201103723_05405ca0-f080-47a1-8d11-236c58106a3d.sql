-- Add 'state' to scheme_level enum if it doesn't exist
ALTER TYPE scheme_level ADD VALUE IF NOT EXISTS 'state';