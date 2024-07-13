--------------- TASKS ---------------

-- TABLE --
CREATE TABLE IF NOT EXISTS tasks (
  -- ID
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- RELATIONSHIPS
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,

  -- METADATA
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,

  -- REQUIRED
  name VARCHAR(255) NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  instances INTEGER DEFAULT 1,

  -- OPTIONAL
  description TEXT,
  icon TEXT,
  image TEXT,
  recurrence_pattern VARCHAR(25) CHECK (recurrence_pattern IN ('DAILY', 'WEEKLY', 'MONTHLY')),
  time_duration INTERVAL,
  start_date DATE,
  end_date DATE,
  category VARCHAR(50),
  parts_per_instance INT,
  increment_value INT
);

-- INDEXES --
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_group_id ON tasks(group_id);

-- RLS --
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks" ON tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view group tasks" ON tasks
  FOR SELECT
  USING (
    group_id IN (
      SELECT group_id
      FROM group_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Group creators can manage group tasks" ON tasks
  USING (
    group_id IN (
      SELECT id
      FROM groups
      WHERE created_by = auth.uid()
    )
  );