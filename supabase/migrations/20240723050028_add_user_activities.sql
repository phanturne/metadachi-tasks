--------------- USER ACTIVITIES ---------------

-- TABLE --
CREATE TABLE IF NOT EXISTS user_activities (
  -- ID and RELATIONSHIPS
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,

  -- METADATA
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,

  -- ACTIVITY DETAILS
  activity_type VARCHAR(50) NOT NULL,
  activity_category VARCHAR(50) NOT NULL,
  activity_description TEXT,
  quantity INT,
  points_change INT,
  exp_change INT,
  related_entity_id UUID,
  before_value JSONB,
  after_value JSONB,
  metadata JSONB
);

-- INDEXES --
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at);
CREATE INDEX idx_user_activities_activity_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_activity_category ON user_activities(activity_category);

-- FUNCTIONS --
CREATE OR REPLACE FUNCTION summarize_daily_activities(p_user_id UUID, p_date DATE)
RETURNS TABLE (
  activity_category VARCHAR(50),
  total_quantity INT,
  total_points_change INT,
  total_exp_change INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    activity_category,
    COALESCE(SUM(quantity), 0) AS total_quantity,
    COALESCE(SUM(points_change), 0) AS total_points_change,
    COALESCE(SUM(exp_change), 0) AS total_exp_change
  FROM user_activities
  WHERE user_id = p_user_id AND DATE(created_at) = p_date
  GROUP BY activity_category;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_activity_type VARCHAR(50),
  p_activity_category VARCHAR(50),
  p_description TEXT,
  p_quantity INT,
  p_points_change INT,
  p_exp_change INT,
  p_related_entity_type VARCHAR(50),
  p_related_entity_id UUID,
  p_before_value JSONB,
  p_after_value JSONB,
  p_metadata JSONB
) RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO user_activities (
    user_id, activity_type, activity_category, description,
    quantity, points_change, exp_change, related_entity_id,
    before_value, after_value, metadata
  ) VALUES (
    p_user_id, p_activity_type, p_activity_category, p_description,
    p_quantity, p_points_change, p_exp_change, p_related_entity_id,
    p_before_value, p_after_value,
    jsonb_build_object('related_entity_type', p_related_entity_type) || COALESCE(p_metadata, '{}'::jsonb)
  ) RETURNING id INTO v_activity_id;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS --
CREATE OR REPLACE FUNCTION update_user_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_activities_updated_at
BEFORE UPDATE ON user_activities
FOR EACH ROW
EXECUTE FUNCTION update_user_activities_updated_at();

-- RLS --
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert and update user activities" ON user_activities
  FOR ALL USING (current_user = 'service_role');