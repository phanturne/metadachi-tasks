--------------- USER REWARDS ---------------

-- TABLE --
CREATE TABLE IF NOT EXISTS user_rewards (
  -- ID and RELATIONSHIPS
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,

  -- METADATA
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,

  -- REWARD DETAILS
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cost INT NOT NULL,
  icon VARCHAR(255),
  image VARCHAR(255),
  max_quantity INT,
  quantity INT NOT NULL DEFAULT 0,
  reset_interval INTERVAL,
  last_reset_at TIMESTAMPTZ,
  is_group_reward BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  category VARCHAR(50),
  tags JSONB
);

-- INDEXES --
CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX idx_user_rewards_name ON user_rewards(name);
CREATE INDEX idx_user_rewards_category ON user_rewards(category);

-- FUNCTIONS --
CREATE OR REPLACE FUNCTION reset_user_rewards()
RETURNS VOID AS $$
BEGIN
  UPDATE user_rewards
  SET quantity = max_quantity,
      last_reset_at = CURRENT_TIMESTAMP
  WHERE reset_interval IS NOT NULL
    AND is_active = TRUE
    AND (last_reset_at IS NULL OR last_reset_at + reset_interval <= CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION claim_user_reward(p_user_id UUID, p_reward_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_cost INT;
  v_user_gold INT;
  v_reward_name VARCHAR(255);
BEGIN
  -- Get the cost of the reward, the reward name, and the user's current gold
  SELECT cost, name INTO v_cost, v_reward_name FROM user_rewards WHERE id = p_reward_id AND user_id = p_user_id;
  SELECT total_gold INTO v_user_gold FROM user_stats WHERE user_id = p_user_id ORDER BY date DESC LIMIT 1;

  -- Check if the user has enough gold and the reward is available
  IF v_user_gold >= v_cost AND EXISTS (
    SELECT 1 FROM user_rewards
    WHERE id = p_reward_id AND user_id = p_user_id AND quantity > 0 AND is_active = TRUE
  ) THEN
    -- Deduct the cost and decrease the quantity
    UPDATE user_stats
    SET total_gold = total_gold - v_cost,
        gold_spent = gold_spent + v_cost
    WHERE user_id = p_user_id AND date = CURRENT_DATE;

    UPDATE user_rewards
    SET quantity = quantity - 1
    WHERE id = p_reward_id AND user_id = p_user_id;

    -- Log the activity
    PERFORM log_user_activity(
      p_user_id,
      'Reward Claimed',
      'Rewards',
      'Claimed reward: ' || v_reward_name,
      1,
      -v_cost,
      0,
      'reward',
      p_reward_id,
      NULL,
      NULL,
      jsonb_build_object('cost', v_cost)
    );

    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS --
CREATE OR REPLACE FUNCTION update_user_rewards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_rewards_updated_at
BEFORE UPDATE ON user_rewards
FOR EACH ROW
EXECUTE FUNCTION update_user_rewards_updated_at();

-- RLS --
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rewards" ON user_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rewards" ON user_rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards" ON user_rewards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can perform all operations on user rewards" ON user_rewards
  FOR ALL USING (current_user = 'service_role');