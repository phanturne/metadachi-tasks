-- Change the column type from time to timestamptz, accounting for NULL values
BEGIN;
ALTER TABLE task_instances
ALTER COLUMN end_time TYPE timestamptz
USING
    CASE
        WHEN end_time IS NOT NULL THEN (CURRENT_DATE + end_time)::timestamptz
        ELSE NULL
    END;

COMMIT;