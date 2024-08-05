-- Tasks should have a default value of 1 for parts_per_instance
ALTER TABLE tasks
ALTER COLUMN parts_per_instance SET DEFAULT 1;

-- Create a User Stats view to account for days without entries
CREATE OR REPLACE VIEW user_stats_view AS
WITH user_date_range AS (
    SELECT
        user_id,
        generate_series(
            (SELECT MIN(date) FROM user_stats WHERE user_id = us.user_id),
            CURRENT_DATE,
            '1 day'::interval
        ) AS date
    FROM user_stats us
    GROUP BY user_id
),
all_user_dates AS (
    SELECT user_id, date
    FROM user_date_range
),
last_known_values AS (
    SELECT
        aud.user_id,
        aud.date,
        (SELECT us.date
         FROM user_stats us
         WHERE us.user_id = aud.user_id
           AND us.date <= aud.date
         ORDER BY us.date DESC
         LIMIT 1) AS last_entry_date
    FROM all_user_dates aud
),
user_stats_filled AS (
    SELECT
        lkv.user_id,
        lkv.date,
        COALESCE(us.level, last_us.level, 1) AS level,
        COALESCE(us.exp, last_us.exp, 0) AS exp,
        COALESCE(us.total_gold, last_us.total_gold, 0) AS total_gold,
        COALESCE(us.gold_earned, 0) AS gold_earned,
        COALESCE(us.gold_spent, 0) AS gold_spent,
        COALESCE(us.tasks_completed, 0) AS tasks_completed,
        COALESCE(us.tasks_created, 0) AS tasks_created,
        CASE
            WHEN us.current_streak IS NOT NULL THEN us.current_streak
            WHEN lkv.date = lkv.last_entry_date + INTERVAL '1 day' THEN COALESCE(last_us.current_streak, 0)
            ELSE 0
        END AS current_streak,
        COALESCE(us.longest_streak, last_us.longest_streak, 0) AS longest_streak,
        COALESCE(us.total_time_spent, last_us.total_time_spent, '0 seconds'::INTERVAL) AS total_time_spent,
        COALESCE(us.top_category, last_us.top_category) AS top_category,
        COALESCE(us.created_at, lkv.date) AS created_at,
        us.updated_at
    FROM last_known_values lkv
    LEFT JOIN user_stats us ON lkv.user_id = us.user_id AND lkv.date = us.date
    LEFT JOIN LATERAL (
        SELECT *
        FROM user_stats
        WHERE user_id = lkv.user_id AND date = lkv.last_entry_date
    ) last_us ON TRUE
)
SELECT DISTINCT ON (user_id, date) *
FROM user_stats_filled
ORDER BY user_id, date;

DROP FUNCTION IF EXISTS get_user_stats(uuid,date,date);
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID, p_start_date DATE, p_end_date DATE)
RETURNS SETOF user_stats_view AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM user_stats_view
  WHERE user_id = p_user_id
    AND date BETWEEN p_start_date AND p_end_date
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

 -- Modify the update_user_stats function to use previous values for calculations
 CREATE OR REPLACE FUNCTION update_user_stats(
   p_user_id UUID,
   p_exp INT,
   p_gold INT,
   p_tasks_completed INT,
   p_tasks_created INT,
   p_time_spent INTERVAL
 ) RETURNS VOID AS $$
 DECLARE
   v_streak INT;
   v_top_category VARCHAR(50);
   v_last_entry user_stats%ROWTYPE;
   v_new_exp INT;
   v_new_total_gold INT;
   v_new_longest_streak INT;
   v_new_total_time_spent INTERVAL;
 BEGIN
   -- Get the last entry for the user
   SELECT * INTO v_last_entry
   FROM user_stats
   WHERE user_id = p_user_id
   ORDER BY date DESC
   LIMIT 1;

   -- Calculate new values based on the last entry
   v_new_exp := COALESCE(v_last_entry.exp, 0) + p_exp;
   v_new_total_gold := COALESCE(v_last_entry.total_gold, 0) + p_gold;
   v_new_total_time_spent := COALESCE(v_last_entry.total_time_spent, '0 seconds'::INTERVAL) + p_time_spent;

   -- Calculate streak
   IF v_last_entry.date IS NULL OR v_last_entry.date < CURRENT_DATE - INTERVAL '1 day' THEN
     v_streak := 1;
   ELSIF v_last_entry.date = CURRENT_DATE - INTERVAL '1 day' THEN
     v_streak := COALESCE(v_last_entry.current_streak, 0) + 1;
   ELSE
     v_streak := COALESCE(v_last_entry.current_streak, 1);
   END IF;

   v_new_longest_streak := GREATEST(COALESCE(v_last_entry.longest_streak, 0), v_streak);

   -- Find top category
   SELECT category INTO v_top_category
   FROM tasks
   WHERE user_id = p_user_id
   GROUP BY category
   ORDER BY COUNT(*) DESC
   LIMIT 1;

   -- Update or insert stats
   INSERT INTO user_stats (
     user_id, date, exp, total_gold, gold_earned, tasks_completed, tasks_created,
     current_streak, longest_streak, total_time_spent, top_category
   ) VALUES (
     p_user_id, CURRENT_DATE,
     v_new_exp,
     v_new_total_gold,
     p_gold,
     p_tasks_completed,
     p_tasks_created,
     v_streak,
     v_new_longest_streak,
     v_new_total_time_spent,
     v_top_category
   )
   ON CONFLICT (user_id, date) DO UPDATE SET
     exp = user_stats.exp + p_exp,
     total_gold = user_stats.total_gold + p_gold,
     gold_earned = user_stats.gold_earned + p_gold,
     tasks_completed = user_stats.tasks_completed + p_tasks_completed,
     tasks_created = user_stats.tasks_created + p_tasks_created,
     current_streak = v_streak,
     longest_streak = GREATEST(user_stats.longest_streak, v_new_longest_streak),
     total_time_spent = user_stats.total_time_spent + p_time_spent,
     top_category = v_top_category,
     updated_at = CURRENT_TIMESTAMP;

   -- Update level
   UPDATE user_stats
   SET level = FLOOR(POWER(exp / 100.0, 0.5)) + 1
   WHERE user_id = p_user_id AND date = CURRENT_DATE;
 END;
 $$ LANGUAGE plpgsql;

 -- Rename points_change to gold_earned in user_activities
ALTER TABLE user_activities RENAME COLUMN points_change TO gold_change;

-- Update handle_task_completion() to log exp and gold earned too
CREATE OR REPLACE FUNCTION handle_task_completion()
RETURNS TRIGGER AS $$
DECLARE
  task_user_id UUID;
  task_difficulty VARCHAR(10);
  task_gold INTEGER;
  exp_earned INT;
BEGIN
  -- Get task details
  SELECT user_id, difficulty, gold
  INTO task_user_id, task_difficulty, task_gold
  FROM tasks
  WHERE id = NEW.task_id;

  -- Calculate experience based on difficulty
  CASE task_difficulty
    WHEN 'Very Easy' THEN exp_earned := 10;
    WHEN 'Easy' THEN exp_earned := 25;
    WHEN 'Medium' THEN exp_earned := 50;
    WHEN 'Hard' THEN exp_earned := 100;
    WHEN 'Very Hard' THEN exp_earned := 200;
    ELSE exp_earned := 50; -- Default to Medium if difficulty is not recognized
  END CASE;

  -- Update user stats
  PERFORM update_user_stats(
    task_user_id,
    exp_earned,
    task_gold,
    p_tasks_completed := 1,
    p_tasks_created := 0,
    p_time_spent := '0 seconds'::INTERVAL
  );

  -- Log the activity
  INSERT INTO user_activities (user_id, activity_category, activity_type, activity_description, gold_change, exp_change)
  VALUES (task_user_id, 'Task', 'Task Instance Completed', 'Task with ID ' || NEW.task_id || ' was completed.', task_gold, exp_earned);

  -- Mark reward as claimed
  NEW.reward_claimed := TRUE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

