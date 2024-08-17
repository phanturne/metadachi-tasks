DROP FUNCTION log_user_activity;

CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_activity_type VARCHAR(50),
  p_activity_category VARCHAR(50),
  p_description TEXT,
  p_quantity INT,
  p_gold_change INT,
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
    user_id, activity_type, activity_category, activity_description,
    quantity, gold_change, exp_change, related_entity_id,
    before_value, after_value, metadata
  ) VALUES (
    p_user_id, p_activity_type, p_activity_category, p_description,
    p_quantity, p_gold_change, p_exp_change, p_related_entity_id,
    p_before_value, p_after_value,
    jsonb_build_object('related_entity_type', p_related_entity_type) || COALESCE(p_metadata, '{}'::jsonb)
  ) RETURNING id INTO v_activity_id;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql;