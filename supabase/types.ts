export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      group_members: {
        Row: {
          group_id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          city: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_path: string | null
          location: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_path?: string | null
          location?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_path?: string | null
          location?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          anthropic_api_key: string | null
          azure_openai_35_turbo_id: string | null
          azure_openai_45_turbo_id: string | null
          azure_openai_45_vision_id: string | null
          azure_openai_api_key: string | null
          azure_openai_endpoint: string | null
          bio: string
          created_at: string
          display_name: string
          goals: string[] | null
          google_gemini_api_key: string | null
          has_onboarded: boolean
          id: string
          image_path: string
          mistral_api_key: string | null
          openai_api_key: string | null
          openai_organization_id: string | null
          perplexity_api_key: string | null
          profile_context: string
          updated_at: string | null
          use_azure_openai: boolean
          user_id: string
          username: string
        }
        Insert: {
          anthropic_api_key?: string | null
          azure_openai_35_turbo_id?: string | null
          azure_openai_45_turbo_id?: string | null
          azure_openai_45_vision_id?: string | null
          azure_openai_api_key?: string | null
          azure_openai_endpoint?: string | null
          bio: string
          created_at?: string
          display_name: string
          goals?: string[] | null
          google_gemini_api_key?: string | null
          has_onboarded?: boolean
          id?: string
          image_path: string
          mistral_api_key?: string | null
          openai_api_key?: string | null
          openai_organization_id?: string | null
          perplexity_api_key?: string | null
          profile_context: string
          updated_at?: string | null
          use_azure_openai: boolean
          user_id: string
          username: string
        }
        Update: {
          anthropic_api_key?: string | null
          azure_openai_35_turbo_id?: string | null
          azure_openai_45_turbo_id?: string | null
          azure_openai_45_vision_id?: string | null
          azure_openai_api_key?: string | null
          azure_openai_endpoint?: string | null
          bio?: string
          created_at?: string
          display_name?: string
          goals?: string[] | null
          google_gemini_api_key?: string | null
          has_onboarded?: boolean
          id?: string
          image_path?: string
          mistral_api_key?: string | null
          openai_api_key?: string | null
          openai_organization_id?: string | null
          perplexity_api_key?: string | null
          profile_context?: string
          updated_at?: string | null
          use_azure_openai?: boolean
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          bonus_reward: Json | null
          category: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          duration: unknown | null
          end_date: string | null
          goal: number
          gold_reward: number
          id: string
          is_repeatable: boolean | null
          last_repeat_date: string | null
          level_requirement: number | null
          metadata: Json | null
          parent_quest_id: string | null
          prerequisites: Json | null
          progress: number | null
          repeat_interval: unknown | null
          start_date: string | null
          status: string | null
          tags: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bonus_reward?: Json | null
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration?: unknown | null
          end_date?: string | null
          goal: number
          gold_reward: number
          id?: string
          is_repeatable?: boolean | null
          last_repeat_date?: string | null
          level_requirement?: number | null
          metadata?: Json | null
          parent_quest_id?: string | null
          prerequisites?: Json | null
          progress?: number | null
          repeat_interval?: unknown | null
          start_date?: string | null
          status?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bonus_reward?: Json | null
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration?: unknown | null
          end_date?: string | null
          goal?: number
          gold_reward?: number
          id?: string
          is_repeatable?: boolean | null
          last_repeat_date?: string | null
          level_requirement?: number | null
          metadata?: Json | null
          parent_quest_id?: string | null
          prerequisites?: Json | null
          progress?: number | null
          repeat_interval?: unknown | null
          start_date?: string | null
          status?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quests_parent_quest_id_fkey"
            columns: ["parent_quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      task_instances: {
        Row: {
          completed_parts: number | null
          created_at: string
          end_time: string | null
          id: string
          increment_value: number | null
          is_completed: boolean | null
          is_skipped: boolean | null
          notes: string | null
          reward_claimed: boolean | null
          start_time: string | null
          task_id: string | null
          total_parts: number | null
          updated_at: string | null
        }
        Insert: {
          completed_parts?: number | null
          created_at?: string
          end_time?: string | null
          id?: string
          increment_value?: number | null
          is_completed?: boolean | null
          is_skipped?: boolean | null
          notes?: string | null
          reward_claimed?: boolean | null
          start_time?: string | null
          task_id?: string | null
          total_parts?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_parts?: number | null
          created_at?: string
          end_time?: string | null
          id?: string
          increment_value?: number | null
          is_completed?: boolean | null
          is_skipped?: boolean | null
          notes?: string | null
          reward_claimed?: boolean | null
          start_time?: string | null
          task_id?: string | null
          total_parts?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_instances_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty: string
          end_repeat: string | null
          end_time: string | null
          gold: number
          group_id: string | null
          icon: string | null
          id: string
          image: string | null
          increment_value: number | null
          instances: number | null
          instances_completed: number | null
          max_recurrences: number | null
          name: string
          parts_per_instance: number | null
          recurrence_interval: string | null
          start_time: string | null
          task_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          end_repeat?: string | null
          end_time?: string | null
          gold?: number
          group_id?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          increment_value?: number | null
          instances?: number | null
          instances_completed?: number | null
          max_recurrences?: number | null
          name: string
          parts_per_instance?: number | null
          recurrence_interval?: string | null
          start_time?: string | null
          task_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          end_repeat?: string | null
          end_time?: string | null
          gold?: number
          group_id?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          increment_value?: number | null
          instances?: number | null
          instances_completed?: number | null
          max_recurrences?: number | null
          name?: string
          parts_per_instance?: number | null
          recurrence_interval?: string | null
          start_time?: string | null
          task_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_category: string
          activity_description: string | null
          activity_type: string
          after_value: Json | null
          before_value: Json | null
          created_at: string
          exp_change: number | null
          gold_change: number | null
          id: string
          metadata: Json | null
          quantity: number | null
          related_entity_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activity_category: string
          activity_description?: string | null
          activity_type: string
          after_value?: Json | null
          before_value?: Json | null
          created_at?: string
          exp_change?: number | null
          gold_change?: number | null
          id?: string
          metadata?: Json | null
          quantity?: number | null
          related_entity_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activity_category?: string
          activity_description?: string | null
          activity_type?: string
          after_value?: Json | null
          before_value?: Json | null
          created_at?: string
          exp_change?: number | null
          gold_change?: number | null
          id?: string
          metadata?: Json | null
          quantity?: number | null
          related_entity_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          category: string | null
          cost: number
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image: string | null
          is_active: boolean
          is_group_reward: boolean
          last_reset_at: string | null
          max_quantity: number | null
          name: string
          quantity: number
          reset_interval: unknown | null
          tags: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          cost: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          is_active?: boolean
          is_group_reward?: boolean
          last_reset_at?: string | null
          max_quantity?: number | null
          name: string
          quantity?: number
          reset_interval?: unknown | null
          tags?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          cost?: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          is_active?: boolean
          is_group_reward?: boolean
          last_reset_at?: string | null
          max_quantity?: number | null
          name?: string
          quantity?: number
          reset_interval?: unknown | null
          tags?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_stats: {
        Row: {
          created_at: string
          current_streak: number | null
          date: string
          exp: number | null
          gold_earned: number | null
          gold_spent: number | null
          level: number | null
          longest_streak: number | null
          tasks_completed: number | null
          tasks_created: number | null
          top_category: string | null
          total_gold: number | null
          total_time_spent: unknown | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          date?: string
          exp?: number | null
          gold_earned?: number | null
          gold_spent?: number | null
          level?: number | null
          longest_streak?: number | null
          tasks_completed?: number | null
          tasks_created?: number | null
          top_category?: string | null
          total_gold?: number | null
          total_time_spent?: unknown | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          date?: string
          exp?: number | null
          gold_earned?: number | null
          gold_spent?: number | null
          level?: number | null
          longest_streak?: number | null
          tasks_completed?: number | null
          tasks_created?: number | null
          top_category?: string | null
          total_gold?: number | null
          total_time_spent?: unknown | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      user_stats_view: {
        Row: {
          created_at: string | null
          current_streak: number | null
          date: string | null
          exp: number | null
          gold_earned: number | null
          gold_spent: number | null
          level: number | null
          longest_streak: number | null
          tasks_completed: number | null
          tasks_created: number | null
          top_category: string | null
          total_gold: number | null
          total_time_spent: unknown | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      calculate_next_date_or_end_time: {
        Args: {
          base_time: string
          pattern: string
        }
        Returns: string
      }
      check_expired_quests: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      claim_user_reward: {
        Args: {
          p_user_id: string
          p_reward_id: string
        }
        Returns: boolean
      }
      create_quest: {
        Args: {
          p_user_id: string
          p_title: string
          p_description: string
          p_category: string
          p_difficulty: string
          p_goal: number
          p_end_date: string
          p_gold_reward: number
          p_bonus_reward?: Json
          p_parent_quest_id?: string
          p_is_repeatable?: boolean
          p_repeat_interval?: unknown
          p_level_requirement?: number
          p_prerequisites?: Json
          p_tags?: Json
          p_metadata?: Json
        }
        Returns: string
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object_from_bucket: {
        Args: {
          bucket_name: string
          object_path: string
        }
        Returns: Record<string, unknown>
      }
      generate_recurring_task_instances: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_active_quests: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          title: string
          description: string
          category: string
          difficulty: string
          progress: number
          goal: number
          end_date: string
          gold_reward: number
        }[]
      }
      get_tasks_with_instances: {
        Args: {
          p_user_id: string
        }
        Returns: {
          task_id: string
          task_name: string
          is_recurring: boolean
          instance_id: string
          start_time: string
          is_completed: boolean
        }[]
      }
      get_user_stats: {
        Args: {
          p_user_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          created_at: string | null
          current_streak: number | null
          date: string | null
          exp: number | null
          gold_earned: number | null
          gold_spent: number | null
          level: number | null
          longest_streak: number | null
          tasks_completed: number | null
          tasks_created: number | null
          top_category: string | null
          total_gold: number | null
          total_time_spent: unknown | null
          updated_at: string | null
          user_id: string | null
        }[]
      }
      log_user_activity: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_activity_category: string
          p_description: string
          p_quantity: number
          p_points_change: number
          p_exp_change: number
          p_related_entity_type: string
          p_related_entity_id: string
          p_before_value: Json
          p_after_value: Json
          p_metadata: Json
        }
        Returns: string
      }
      reset_user_rewards: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      summarize_daily_activities: {
        Args: {
          p_user_id: string
          p_date: string
        }
        Returns: {
          activity_category: string
          total_quantity: number
          total_points_change: number
          total_exp_change: number
        }[]
      }
      update_quest_progress: {
        Args: {
          p_quest_id: string
          p_progress_increment: number
        }
        Returns: boolean
      }
      update_user_stats: {
        Args: {
          p_user_id: string
          p_exp: number
          p_gold: number
          p_tasks_completed: number
          p_tasks_created: number
          p_time_spent: unknown
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
