-- TABLE --
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,

  -- Quest Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  difficulty VARCHAR(20) CHECK (difficulty IN ('Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard')),

  -- Quest Progress
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Failed', 'Expired')),
  progress INT DEFAULT 0,
  goal INT NOT NULL,

  -- Time Management
  start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMPTZ,
  duration INTERVAL,

  -- Rewards
  gold_reward INT NOT NULL,
  bonus_reward JSONB,

  -- Quest Structure
  parent_quest_id UUID REFERENCES quests(id),
  is_repeatable BOOLEAN DEFAULT FALSE,
  repeat_interval INTERVAL,
  last_repeat_date TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,

  -- Quest Requirements
  level_requirement INT DEFAULT 1,
  prerequisites JSONB,

  -- Additional Data
  tags JSONB,
  metadata JSONB
);

-- INDEXES --
CREATE INDEX idx_quests_user_id ON quests(user_id);
CREATE INDEX idx_quests_status ON quests(status);
CREATE INDEX idx_quests_category ON quests(category);
CREATE INDEX idx_quests_parent_quest_id ON quests(parent_quest_id);

-- FUNCTIONS --

-- Function to create a new quest
CREATE OR REPLACE FUNCTION create_quest(
  p_user_id UUID,
  p_title VARCHAR(255),
  p_description TEXT,
  p_category VARCHAR(50),
  p_difficulty VARCHAR(20),
  p_goal INT,
  p_end_date TIMESTAMPTZ,
  p_gold_reward INT,
  p_bonus_reward JSONB DEFAULT NULL,
  p_parent_quest_id UUID DEFAULT NULL,
  p_is_repeatable BOOLEAN DEFAULT FALSE,
  p_repeat_interval INTERVAL DEFAULT NULL,
  p_level_requirement INT DEFAULT 1,
  p_prerequisites JSONB DEFAULT NULL,
  p_tags JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_quest_id UUID;
  v_exp_reward INT;
BEGIN
  -- Determine experience reward based on difficulty
  CASE p_difficulty
    WHEN 'Very Easy' THEN v_exp_reward := 10;
    WHEN 'Easy' THEN v_exp_reward := 25;
    WHEN 'Medium' THEN v_exp_reward := 50;
    WHEN 'Hard' THEN v_exp_reward := 100;
    WHEN 'Very Hard' THEN v_exp_reward := 200;
    ELSE v_exp_reward := 50; -- Default to Medium if difficulty is not recognized
  END CASE;

  INSERT INTO quests (
    user_id, title, description, category, difficulty, goal, end_date,
    gold_reward, bonus_reward, parent_quest_id, is_repeatable,
    repeat_interval, level_requirement, prerequisites, tags, metadata
  ) VALUES (
    p_user_id, p_title, p_description, p_category, p_difficulty, p_goal, p_end_date,
    p_gold_reward, p_bonus_reward, p_parent_quest_id, p_is_repeatable,
    p_repeat_interval, p_level_requirement, p_prerequisites, p_tags, p_metadata
  ) RETURNING id INTO v_quest_id;

  RETURN v_quest_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update quest progress
CREATE OR REPLACE FUNCTION update_quest_progress(
  p_quest_id UUID,
  p_progress_increment INT
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_progress INT;
  v_goal INT;
  v_status VARCHAR(20);
  v_user_id UUID;
  v_exp_reward INT;
  v_gold_reward INT;
  v_difficulty VARCHAR(20);
BEGIN
  -- Get current quest data
  SELECT q.progress, q.goal, q.status, q.user_id, q.gold_reward, q.difficulty
  INTO v_current_progress, v_goal, v_status, v_user_id, v_gold_reward, v_difficulty
  FROM quests q
  WHERE q.id = p_quest_id;

  -- Determine experience reward based on difficulty
  CASE v_difficulty
    WHEN 'Very Easy' THEN v_exp_reward := 10;
    WHEN 'Easy' THEN v_exp_reward := 25;
    WHEN 'Medium' THEN v_exp_reward := 50;
    WHEN 'Hard' THEN v_exp_reward := 100;
    WHEN 'Very Hard' THEN v_exp_reward := 200;
    ELSE v_exp_reward := 50; -- Default to Medium if difficulty is not recognized
  END CASE;

  -- Check if quest is already completed or failed
  IF v_status IN ('Completed', 'Failed', 'Expired') THEN
    RETURN FALSE;
  END IF;

  -- Update progress
  UPDATE quests
  SET progress = LEAST(progress + p_progress_increment, goal),
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_quest_id;

  -- Check if quest is now completed
  IF v_current_progress + p_progress_increment >= v_goal THEN
    UPDATE quests
    SET status = 'Completed',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_quest_id;

    -- Award experience and gold
    PERFORM update_user_stats(v_user_id, v_exp_reward, v_gold_reward, 0, 0, '0 seconds'::interval);

    -- Log activity
    PERFORM log_user_activity(
      v_user_id,
      'Quest Completed',
      'Quests',
      'Completed quest: ' || (SELECT title FROM quests WHERE id = p_quest_id),
      1,
      v_gold_reward,
      v_exp_reward,
      'quest',
      p_quest_id,
      NULL,
      NULL,
      jsonb_build_object('exp_reward', v_exp_reward, 'gold_reward', v_gold_reward)
    );
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get active quests for a user
CREATE OR REPLACE FUNCTION get_active_quests(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  description TEXT,
  category VARCHAR(50),
  difficulty VARCHAR(20),
  progress INT,
  goal INT,
  end_date TIMESTAMPTZ,
  gold_reward INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT q.id, q.title, q.description, q.category, q.difficulty, q.progress, q.goal, q.end_date, q.gold_reward
  FROM quests q
  WHERE q.user_id = p_user_id
    AND q.status = 'Active'
    AND (q.end_date IS NULL OR q.end_date > CURRENT_TIMESTAMP)
  ORDER BY q.end_date ASC NULLS LAST, q.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to check and update expired quests
CREATE OR REPLACE FUNCTION check_expired_quests()
RETURNS VOID AS $$
BEGIN
  UPDATE quests
  SET status = 'Expired',
      updated_at = CURRENT_TIMESTAMP
  WHERE status = 'Active'
    AND end_date < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS --
CREATE OR REPLACE FUNCTION update_quests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quests_updated_at
BEFORE UPDATE ON quests
FOR EACH ROW
EXECUTE FUNCTION update_quests_updated_at();

-- RLS --
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quests" ON quests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quests" ON quests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests" ON quests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can perform all operations on quests" ON quests
  FOR ALL USING (current_user = 'service_role');
