CREATE POLICY "Users can delete their own rewards" ON user_rewards
  FOR DELETE USING (auth.uid() = user_id);