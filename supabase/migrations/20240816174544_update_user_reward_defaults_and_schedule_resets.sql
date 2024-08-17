BEGIN;
-- Set default value of max_quantity to 999 and make user_id NOT NULL
ALTER TABLE user_rewards
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN cost SET DEFAULT 0,
    ALTER COLUMN max_quantity SET DEFAULT 999,
    ALTER COLUMN quantity SET DEFAULT 999,
    DROP COLUMN reset_interval,
    ADD COLUMN reset_interval VARCHAR(20) DEFAULT 'NEVER' CHECK (reset_interval IN (
        'NEVER', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
    ));

-- Update existing rows where max_quantity is NULL
UPDATE user_rewards
SET max_quantity = 999
WHERE max_quantity IS NULL;
COMMIT;

CREATE OR REPLACE FUNCTION reset_user_rewards() RETURNS VOID AS $$
BEGIN
    -- Reset daily rewards
    UPDATE user_rewards
    SET quantity = max_quantity, last_reset_at = CURRENT_TIMESTAMP
    WHERE reset_interval = 'DAILY'
    AND (last_reset_at IS NULL OR last_reset_at::DATE < CURRENT_DATE);

    -- Reset weekly rewards (assumes Monday start)
    UPDATE user_rewards
    SET quantity = max_quantity, last_reset_at = CURRENT_TIMESTAMP
    WHERE reset_interval = 'WEEKLY'
    AND (last_reset_at IS NULL OR last_reset_at < CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)::INT));

    -- Reset monthly rewards
    UPDATE user_rewards
    SET quantity = max_quantity, last_reset_at = CURRENT_TIMESTAMP
    WHERE reset_interval = 'MONTHLY'
    AND (last_reset_at IS NULL OR DATE_TRUNC('month', last_reset_at) < DATE_TRUNC('month', CURRENT_DATE));

    -- Reset yearly rewards
    UPDATE user_rewards
    SET quantity = max_quantity, last_reset_at = CURRENT_TIMESTAMP
    WHERE reset_interval = 'YEARLY'
    AND (last_reset_at IS NULL OR DATE_TRUNC('year', last_reset_at) < DATE_TRUNC('year', CURRENT_DATE));
END;
$$ LANGUAGE plpgsql;

-- Schedule the reset_user_rewards function to run every day at midnight
SELECT cron.schedule('Daily Reward Reset', '0 0 * * *', $$SELECT reset_user_rewards();$$);
