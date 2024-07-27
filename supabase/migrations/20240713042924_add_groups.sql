--------------- GROUPS ---------------

-- TABLE --
CREATE TABLE groups (
  -- ID
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- METADATA
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,

  -- RELATIONSHIPS
  created_by UUID REFERENCES auth.users(id),

  -- REQUIRED
  name VARCHAR(100),

  -- OPTIONAL
  description TEXT CHECK (char_length(description) <= 1500),
  image_path TEXT CHECK (char_length(image_path) <= 1000),
  location VARCHAR(100),
  city VARCHAR(100)
);

-- INDEXES --
CREATE INDEX idx_groups_name ON groups(name);
CREATE INDEX idx_groups_location_city ON groups(location, city);
CREATE INDEX idx_groups_created_by ON groups(created_by);

-- RLS --
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any group" ON groups
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create groups" ON groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" ON groups
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Group creators can delete their groups" ON groups
  FOR DELETE USING (auth.uid() = created_by);

--------------- GROUP MEMBERS ---------------

-- TABLE --
CREATE TABLE group_members (
  PRIMARY KEY (user_id, group_id),

  -- RELATIONSHIPS
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,

  -- REQUIRED
  role VARCHAR(50),
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES --
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);

-- RLS --
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view group memberships" ON group_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join groups" ON group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" ON group_members
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Group creators can manage all memberships in their groups" ON group_members
  USING (EXISTS (
    SELECT 1 FROM groups
    WHERE groups.id = group_members.group_id
    AND groups.created_by = auth.uid()
  ));