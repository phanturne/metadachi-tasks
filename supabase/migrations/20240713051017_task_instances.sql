--------------- TASK INSTANCES ---------------

-- TABLE --
CREATE TABLE IF NOT EXISTS task_instances (
  -- ID
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- RELATIONSHIPS
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,

  -- METADATA
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,

  -- REQUIRED
  start_time TIME,
  is_completed BOOLEAN DEFAULT FALSE,
  is_skipped BOOLEAN DEFAULT FALSE,
  total_parts INT DEFAULT 1,
  completed_parts INT DEFAULT 0,

  -- OPTIONAL
  end_time TIME,
  increment_value INT,
  notes TEXT CHECK (char_length(notes) <= 1500)
);

-- FUNCTIONS --
CREATE OR REPLACE FUNCTION insert_task_instance() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO task_instances (task_id, start_time, end_time)
    VALUES (NEW.id, NEW.start_time, NEW.end_time);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS --
CREATE TRIGGER insert_task_instance_on_insert
AFTER INSERT ON tasks
FOR EACH ROW
EXECUTE FUNCTION insert_task_instance();

-- RLS --
ALTER TABLE task_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own task instances" ON task_instances
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id
      FROM tasks
      WHERE tasks.id = task_instances.task_id
    )
  );

CREATE POLICY "Users can update their own task instances" ON task_instances
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id
      FROM tasks
      WHERE tasks.id = task_instances.task_id
    )
  );

CREATE POLICY "Users can delete their own task instances" ON task_instances
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id
      FROM tasks
      WHERE tasks.id = task_instances.task_id
    )
  );
