-- Add difficulty and gold columns to tasks table
ALTER TABLE tasks
ADD COLUMN difficulty VARCHAR(10) NOT NULL DEFAULT 'Medium',
ADD COLUMN gold INTEGER NOT NULL DEFAULT 25;

ALTER TABLE task_instances
ADD COLUMN reward_claimed BOOLEAN DEFAULT FALSE;

-- Function to handle task completion
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

  -- Mark reward as claimed
  NEW.reward_claimed := TRUE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for task completion
CREATE TRIGGER task_completion_trigger
BEFORE UPDATE ON task_instances
FOR EACH ROW
WHEN (NEW.is_completed = TRUE AND OLD.is_completed = FALSE AND NEW.reward_claimed = FALSE)
EXECUTE FUNCTION handle_task_completion();