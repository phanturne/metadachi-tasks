-- Modify the tasks table
ALTER TABLE tasks
DROP COLUMN time_duration,
DROP COLUMN recurrence_pattern,
DROP COLUMN is_recurring,
ADD COLUMN recurrence_interval VARCHAR(20) DEFAULT 'NEVER' CHECK (recurrence_interval IN (
    'NEVER', 'HOURLY', 'DAILY', 'WEEKLY', 'WEEKDAYS', 'WEEKENDS', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'INFINITE'
)),
ADD COLUMN end_repeat TIMESTAMPTZ,
ADD COLUMN instances_completed INTEGER DEFAULT 0,
ADD COLUMN max_recurrences INTEGER,
ADD COLUMN task_type VARCHAR(20) CHECK (task_type IN ('INSTANCE', 'TIME'));

-- Update existing rows to set the default recurrence_interval value of 'NEVER'
UPDATE tasks
SET recurrence_interval = 'NEVER'
WHERE recurrence_interval IS NULL;

-- Modify the task_instances table
BEGIN;
ALTER TABLE task_instances
ALTER COLUMN start_time TYPE timestamptz
USING
    CASE
        WHEN start_time IS NOT NULL THEN (created_at)::timestamptz
        ELSE NULL
    END;
COMMIT;

-- Function to calculate the next date or end time based on the recurrence pattern
CREATE OR REPLACE FUNCTION calculate_next_date_or_end_time(
    base_time TIMESTAMPTZ,
    pattern VARCHAR(20)
) RETURNS TIMESTAMPTZ AS $$
BEGIN
    RETURN CASE pattern
        WHEN 'HOURLY' THEN base_time + INTERVAL '1 hour'
        WHEN 'DAILY' THEN base_time + INTERVAL '1 day'
        WHEN 'WEEKLY' THEN base_time + INTERVAL '1 week'
        WHEN 'WEEKDAYS' THEN
            base_time + CASE WHEN EXTRACT(DOW FROM base_time) IN (5, 6)
                THEN ((8 - EXTRACT(DOW FROM base_time)) % 7 + 1)::INTEGER
                ELSE 1 END * INTERVAL '1 day'
        WHEN 'WEEKENDS' THEN
            base_time + CASE WHEN EXTRACT(DOW FROM base_time) = 0
                THEN 6
                ELSE (6 - EXTRACT(DOW FROM base_time)) % 7 + 1 END * INTERVAL '1 day'
        WHEN 'BIWEEKLY' THEN base_time + INTERVAL '2 weeks'
        WHEN 'MONTHLY' THEN base_time + INTERVAL '1 month'
        WHEN 'YEARLY' THEN base_time + INTERVAL '1 year'
        ELSE base_time + INTERVAL '1 day' -- Default to daily if pattern is not recognized
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to generate recurring task instances
CREATE OR REPLACE FUNCTION generate_recurring_task_instances() RETURNS VOID AS $$
DECLARE
    task RECORD;
    next_instance_date TIMESTAMPTZ;
    generation_end_date TIMESTAMPTZ;
    current_date TIMESTAMPTZ := CURRENT_TIMESTAMP;
    generation_window INTERVAL;
    calculated_end_time TIMESTAMPTZ;
BEGIN
    FOR task IN (
        SELECT * FROM tasks
        WHERE recurrence_interval != 'NEVER'
        AND recurrence_interval != 'INFINITE'
        AND (end_repeat IS NULL OR end_repeat > current_date)
        AND (max_recurrences IS NULL OR instances_completed < max_recurrences)
    )
    LOOP
        -- Set generation window based on recurrence pattern
        generation_window := CASE
            WHEN task.recurrence_interval = 'HOURLY' THEN INTERVAL '1 day'
            ELSE INTERVAL '3 months'
        END;

        next_instance_date := GREATEST(task.start_time, current_date);
        generation_end_date := LEAST(COALESCE(task.end_repeat, current_date + generation_window), current_date + generation_window);

        WHILE next_instance_date <= generation_end_date LOOP
            IF NOT EXISTS (
                SELECT 1 FROM task_instances
                WHERE task_id = task.id AND start_time = next_instance_date
            ) THEN
                calculated_end_time := calculate_next_date_or_end_time(next_instance_date, task.recurrence_interval);
                INSERT INTO task_instances (task_id, start_time, end_time)
                VALUES (task.id, next_instance_date, calculated_end_time);
            END IF;

            next_instance_date := calculate_next_date_or_end_time(next_instance_date, task.recurrence_interval);
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to generate the next instance after completion
CREATE OR REPLACE FUNCTION generate_next_instance_after_completion() RETURNS TRIGGER AS $$
DECLARE
    task_record RECORD;
    next_instance_date TIMESTAMPTZ;
    calculated_end_time TIMESTAMPTZ;
BEGIN
    SELECT * INTO task_record FROM tasks WHERE id = NEW.task_id;

    IF (task_record.recurrence_interval != 'NEVER' AND task_record.recurrence_interval != 'INFINITE') AND
       (task_record.max_recurrences IS NOT NULL AND task_record.instances_completed < task_record.max_recurrences OR
        task_record.end_repeat IS NULL OR NEW.start_time < task_record.end_repeat) THEN

        next_instance_date := calculate_next_date_or_end_time(NEW.start_time, task_record.recurrence_interval);
        calculated_end_time := calculate_next_date_or_end_time(next_instance_date, task_record.recurrence_interval);

        IF NOT EXISTS (
            SELECT 1 FROM task_instances
            WHERE task_id = NEW.task_id AND start_time = next_instance_date
        ) THEN
            INSERT INTO task_instances (task_id, start_time, end_time)
            VALUES (NEW.task_id, next_instance_date, calculated_end_time);
        END IF;

        -- Update instances_completed
        UPDATE tasks
        SET instances_completed = instances_completed + 1
        WHERE id = NEW.task_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate next instance after completion
CREATE OR REPLACE TRIGGER generate_next_instance_after_completion_trigger
AFTER UPDATE OF is_completed ON task_instances
FOR EACH ROW
WHEN (NEW.is_completed = TRUE)
EXECUTE FUNCTION generate_next_instance_after_completion();

-- Schedule for hourly tasks
SELECT cron.schedule('hourly_generate_recurring_task_instances', '0 * * * *',
    $$SELECT generate_recurring_task_instances() WHERE EXISTS (
        SELECT 1 FROM tasks
        WHERE recurrence_interval = 'HOURLY'
        AND (end_repeat IS NULL OR end_repeat > CURRENT_TIMESTAMP)
        AND (max_recurrences IS NULL OR instances_completed < max_recurrences)
    );$$
);

-- Schedule for daily and less frequent tasks
SELECT cron.schedule('daily_generate_recurring_task_instances', '0 0 * * *',
    $$SELECT generate_recurring_task_instances() WHERE EXISTS (
        SELECT 1 FROM tasks
        WHERE recurrence_interval != 'NEVER'
        AND recurrence_interval != 'HOURLY'
        AND recurrence_interval != 'INFINITE'
        AND (end_repeat IS NULL OR end_repeat > CURRENT_TIMESTAMP)
        AND (max_recurrences IS NULL OR instances_completed < max_recurrences)
    );$$
);
