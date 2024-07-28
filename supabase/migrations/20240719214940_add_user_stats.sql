--------------- USER STATS ---------------

-- TABLE --
CREATE TABLE IF NOT EXISTS user_stats (
  -- ID and RELATIONSHIPS
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,

  -- METADATA
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,

  -- STATS
  level INT DEFAULT 1,
  exp INT DEFAULT 0,
  total_gold INT DEFAULT 0,
  gold_earned INT DEFAULT 0,
  gold_spent INT DEFAULT 0,
  tasks_completed INT DEFAULT 0,
  tasks_created INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_time_spent INTERVAL DEFAULT '0 seconds'::INTERVAL,
  top_category VARCHAR(50),

  PRIMARY KEY (user_id, date)
);

-- INDEXES --
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_user_stats_date ON user_stats(date);

-- FUNCTIONS --
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
BEGIN
  -- Calculate streak
  SELECT
    CASE
      WHEN MAX(date) = CURRENT_DATE - INTERVAL '1 day' THEN COALESCE(MAX(current_streak), 0) + 1
      WHEN MAX(date) = CURRENT_DATE THEN COALESCE(MAX(current_streak), 0)
      ELSE 1
    END INTO v_streak
  FROM user_stats
  WHERE user_id = p_user_id AND date >= CURRENT_DATE - INTERVAL '2 days';

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
    p_user_id, CURRENT_DATE, p_exp, p_gold, p_gold, p_tasks_completed, p_tasks_created,
    v_streak, v_streak, p_time_spent, v_top_category
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    exp = user_stats.exp + p_exp,
    total_gold = user_stats.total_gold + p_gold,
    gold_earned = user_stats.gold_earned + p_gold,
    tasks_completed = user_stats.tasks_completed + p_tasks_completed,
    tasks_created = user_stats.tasks_created + p_tasks_created,
    current_streak = v_streak,
    longest_streak = GREATEST(user_stats.longest_streak, v_streak),
    total_time_spent = user_stats.total_time_spent + p_time_spent,
    top_category = v_top_category,
    updated_at = CURRENT_TIMESTAMP;

  -- Update level
  UPDATE user_stats
  SET level = FLOOR(POWER(exp / 100.0, 0.5)) + 1
  WHERE user_id = p_user_id AND date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- FUNCTION TO GET USER STATS --
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID, p_start_date DATE, p_end_date DATE)
RETURNS SETOF user_stats AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM user_stats us
  WHERE us.user_id = p_user_id
    AND us.date BETWEEN p_start_date AND p_end_date
  ORDER BY us.date DESC;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS --
CREATE OR REPLACE FUNCTION update_user_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_stats_updated_at
BEFORE UPDATE ON user_stats
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_updated_at();

-- RLS --
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert and update user stats" ON user_stats
  FOR ALL USING (current_user = 'service_role');